import { RotateCcw, Smartphone } from 'lucide-react'
import { Page } from '@/components/layout/Page'
import { Card } from '@/components/ui/Card'
import { StatRow, type Stat } from '@/components/ui/StatCard'
import { StatusBadge } from '@/components/ui/Badge'
import { DataTable, Truncate, type Column } from '@/components/ui/Table'
import { CardSkeleton, ErrorState, TableSkeleton } from '@/components/ui/States'
import { useAsync } from '@/lib/useAsync'
import { formatArabicCount, formatDate } from '@/lib/format'
import { getDevicesReport } from '@/api/reports'
import { DEVICES_CHART_TITLE } from '@/data/reports'
import {
  ReportChartCard,
  ReportFilters,
  ReportSummaryBar,
  ReportTabs,
  useReportFilters,
} from './reports-parts'

type DeviceReportRow = {
  index: string
  student: string
  device: string
  os: string
  registeredAt: string
  status: string
}

const COLUMNS: Column<DeviceReportRow>[] = [
  {
    key: 'index',
    header: '#',
    width: 60,
    render: (r) => <span className="num text-muted">{r.index}</span>,
  },
  {
    key: 'student',
    header: 'الطالب',
    flex: true,
    render: (r) => (
      <Truncate>
        <span className="font-bold">{r.student}</span>
      </Truncate>
    ),
  },
  {
    key: 'device',
    header: 'الجهاز',
    width: 160,
    render: (r) => <span className="mono font-bold text-ink">{r.device}</span>,
  },
  {
    key: 'os',
    header: 'نظام التشغيل',
    width: 130,
    render: (r) => <span className="text-muted">{r.os}</span>,
  },
  {
    key: 'registeredAt',
    header: 'تاريخ التسجيل',
    width: 140,
    render: (r) => <span className="mono text-muted">{formatDate(r.registeredAt)}</span>,
  },
  {
    key: 'status',
    header: 'الحالة',
    width: 120,
    render: (r) => <StatusBadge status={r.status} />,
  },
]

/** فيجما frame: v3-report-devices (node 43:777) */
export default function ReportDevices() {
  const [filters, setFilters] = useReportFilters()
  const { data, loading, error, reload } = useAsync(
    () => getDevicesReport(filters),
    [filters.from, filters.to, filters.compare],
  )

  const stats: Stat[] = data
    ? [
        {
          label: 'طلبات إعادة تعيين في الفترة',
          value: formatArabicCount(data.resetsThisPeriod, 'طلب ريست', 'طلب ريست'),
          icon: RotateCcw,
          mono: true,
          note:
            data.resetsDelta !== null
              ? `${data.resetsDelta >= 0 ? '+' : ''}${data.resetsDelta}% عن الفترة السابقة`
              : undefined,
          noteTone: data.resetsDelta !== null ? (data.resetsDelta >= 0 ? 'danger' : 'success') : undefined,
          trend: data.resetsDelta !== null ? (data.resetsDelta >= 0 ? 'up' : 'down') : undefined,
        },
        {
          label: 'أجهزة مسجّلة في الفترة',
          value: formatArabicCount(data.totalDevices, 'جهاز', 'جهاز'),
          note: 'جهاز واحد لكل طالب (سياسة المنصة)',
          icon: Smartphone,
          mono: true,
        },
      ]
    : []

  return (
    <Page title="التقارير والإحصائيات">
      <ReportTabs />
      <ReportFilters value={filters} onChange={setFilters} report="devices" />

      {error ? (
        <ErrorState description={error} onRetry={reload} />
      ) : !data && loading ? (
        <CardSkeleton />
      ) : (
        <>
          <StatRow stats={stats} />
          <ReportChartCard title={DEVICES_CHART_TITLE} items={data?.chart ?? []} />

          <Card className="w-full shrink-0 overflow-hidden">
            {!data ? (
              <TableSkeleton rows={4} cols={5} />
            ) : (
              <DataTable
                columns={COLUMNS}
                rows={data.rows}
                rowKey={(r) => r.index}
                className="min-w-[850px]"
              />
            )}
          </Card>

          {data ? (
            <ReportSummaryBar
              right={`أجهزة مسجّلة في الفترة المختارة: ${formatArabicCount(data.totalDevices, 'جهاز', 'جهاز')}`}
              left={`طلبات ريست في نفس الفترة: ${data.resetsThisPeriod}`}
            />
          ) : null}
        </>
      )}
    </Page>
  )
}
