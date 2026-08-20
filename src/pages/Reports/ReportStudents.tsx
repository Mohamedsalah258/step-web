import { ArrowUp } from 'lucide-react'
import { Page } from '@/components/layout/Page'
import { Card } from '@/components/ui/Card'
import { StatRow } from '@/components/ui/StatCard'
import { DataTable, Truncate, type Column } from '@/components/ui/Table'
import { ProgressBar } from '@/components/ui/Misc'
import {
  STUDENTS_BY_FACULTY,
  STUDENTS_CHART_TITLE,
  STUDENTS_PREVIEWS,
  STUDENTS_SUMMARY,
  STUDENT_ROWS,
  STUDENT_STATS,
  type StudentRow,
} from '@/data/reports'
import {
  ReportChartCard,
  ReportFilters,
  ReportPreviews,
  ReportSummaryBar,
  ReportTabs,
} from './reports-parts'

/** ⚠️ أول عمود في المصفوفة = أول عمود من اليمين (فيجما node 43:112) */
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
    key: 'total',
    header: 'إجمالي الطلاب',
    width: 120,
    render: (r) => <span className="mono font-bold text-ink">{r.total}</span>,
  },
  {
    key: 'active',
    header: 'الطلاب النشطين',
    width: 150,
    render: (r) => <span className="mono text-muted">{r.active}</span>,
  },
  {
    key: 'subs',
    header: 'اشتراكات فعالة',
    width: 180,
    render: (r) => <span className="mono text-muted">{r.subs}</span>,
  },
  {
    key: 'activity',
    header: 'نشاط الطلاب الفعلي',
    width: 240,
    // فيجما: الشريط 180px على شمال النسبة — RTL: الشريط أول عنصر في الـ DOM
    render: (r) => (
      <div className="flex w-full items-center gap-3">
        <div className="w-[180px] shrink-0">
          <ProgressBar value={r.activity} />
        </div>
        <span className="num text-sm text-muted">{r.activityLabel}</span>
      </div>
    ),
  },
  {
    key: 'rate',
    header: 'نسبة النشاط',
    width: 120,
    render: (r) => (
      <div className="flex items-center gap-1">
        <ArrowUp className="size-3 shrink-0 text-success" strokeWidth={2.5} />
        <span className="num text-sm font-bold text-success">{r.rate}</span>
      </div>
    ),
  },
]

/** فيجما frame: v3-report-students (node 43:5) */
export default function ReportStudents() {
  return (
    <Page title="التقارير والإحصائيات">
      <ReportTabs />
      <ReportFilters />
      <StatRow stats={STUDENT_STATS} />
      <ReportChartCard
        title={STUDENTS_CHART_TITLE}
        items={STUDENTS_BY_FACULTY}
      />

      <Card className="w-full shrink-0 overflow-hidden">
        <DataTable
          columns={COLUMNS}
          rows={STUDENT_ROWS}
          rowKey={(r) => r.faculty}
        />
      </Card>

      <ReportSummaryBar
        right={STUDENTS_SUMMARY.right}
        left={STUDENTS_SUMMARY.left}
      />
      <ReportPreviews rows={STUDENTS_PREVIEWS} />
    </Page>
  )
}
