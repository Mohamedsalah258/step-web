import { GraduationCap, UserCheck, Users2 } from 'lucide-react'
import { Page } from '@/components/layout/Page'
import { Card } from '@/components/ui/Card'
import { StatRow, type Stat } from '@/components/ui/StatCard'
import { DataTable, Truncate, type Column } from '@/components/ui/Table'
import { CardSkeleton, ErrorState, TableSkeleton } from '@/components/ui/States'
import { useAsync } from '@/lib/useAsync'
import { formatArabicCount } from '@/lib/format'
import { getStudentsReport } from '@/api/reports'
import { STUDENTS_CHART_TITLE } from '@/data/reports'
import {
  DeltaBadge,
  ReportChartCard,
  ReportFilters,
  ReportSummaryBar,
  ReportTabs,
  useReportFilters,
} from './reports-parts'

type StudentRow = { faculty: string; students: number; subscriptions: number; delta: number | null }

const COLUMNS: Column<StudentRow>[] = [
  {
    key: 'faculty',
    header: 'الكلية',
    flex: true,
    render: (r) => (
      <Truncate>
        <span className="font-bold">{r.faculty}</span>
      </Truncate>
    ),
  },
  {
    key: 'students',
    header: 'طلاب اشتركوا في الفترة',
    width: 180,
    render: (r) => <span className="mono font-bold text-ink">{formatArabicCount(r.students, 'طالب', 'طالب')}</span>,
  },
  {
    key: 'subscriptions',
    header: 'اشتراكات جديدة',
    width: 160,
    render: (r) => (
      <span className="mono text-muted">{formatArabicCount(r.subscriptions, 'اشتراك', 'اشتراك')}</span>
    ),
  },
  {
    key: 'delta',
    header: 'مقارنة',
    width: 120,
    render: (r) => <DeltaBadge delta={r.delta} />,
  },
]

/** فيجما frame: v3-report-students (node 43:5) */
export default function ReportStudents() {
  const [filters, setFilters] = useReportFilters()
  const { data, loading, error, reload } = useAsync(
    () => getStudentsReport(filters),
    [filters.from, filters.to, filters.compare],
  )

  const stats: Stat[] = data
    ? [
        {
          label: 'إجمالي الطلاب المسجلين',
          value: formatArabicCount(data.totalStudents, 'طالب', 'طالب'),
          note: 'شامل كافة الكليات',
          icon: Users2,
          mono: true,
        },
        {
          label: 'طلاب اشتركوا في الفترة',
          value: formatArabicCount(data.activeStudents, 'طالب', 'طالب'),
          icon: UserCheck,
          mono: true,
          note:
            data.activeStudentsDelta !== null
              ? `${data.activeStudentsDelta >= 0 ? '+' : ''}${data.activeStudentsDelta}% عن الفترة السابقة`
              : undefined,
          noteTone: data.activeStudentsDelta !== null ? (data.activeStudentsDelta >= 0 ? 'success' : 'danger') : undefined,
          trend: data.activeStudentsDelta !== null ? (data.activeStudentsDelta >= 0 ? 'up' : 'down') : undefined,
        },
        {
          label: 'الاشتراكات الفعالة الآن',
          value: formatArabicCount(data.activeSubscriptionsCount, 'اشتراك', 'اشتراك'),
          icon: GraduationCap,
          mono: true,
        },
      ]
    : []

  return (
    <Page title="التقارير والإحصائيات">
      <ReportTabs />
      <ReportFilters value={filters} onChange={setFilters} report="students" />

      {error ? (
        <ErrorState description={error} onRetry={reload} />
      ) : !data && loading ? (
        <CardSkeleton />
      ) : (
        <>
          <StatRow stats={stats} />
          <ReportChartCard title={STUDENTS_CHART_TITLE} items={data?.chart ?? []} />

          <Card className="w-full shrink-0 overflow-hidden">
            {!data ? (
              <TableSkeleton rows={4} cols={4} />
            ) : (
              <DataTable
                columns={COLUMNS}
                rows={data.rows}
                rowKey={(r) => r.faculty}
                className="min-w-[850px]"
              />
            )}
          </Card>

          {data ? (
            <ReportSummaryBar
              right={`إجمالي طلاب المنصة: ${formatArabicCount(data.totalStudents, 'طالب', 'طالب')} مسجل`}
              left={`الاشتراكات الفعالة الآن: ${formatArabicCount(data.activeSubscriptionsCount, 'اشتراك', 'اشتراك')}`}
            />
          ) : null}
        </>
      )}
    </Page>
  )
}
