import { CheckCircle2, Clock, ShoppingBag } from 'lucide-react'
import { Page } from '@/components/layout/Page'
import { Card } from '@/components/ui/Card'
import { StatRow, type Stat } from '@/components/ui/StatCard'
import { DataTable, Truncate, type Column } from '@/components/ui/Table'
import { CardSkeleton, ErrorState, TableSkeleton } from '@/components/ui/States'
import { useAsync } from '@/lib/useAsync'
import { formatArabicCount } from '@/lib/format'
import { getOrdersReport } from '@/api/reports'
import { ORDERS_CHART_TITLE } from '@/data/reports'
import {
  ReportChartCard,
  ReportFilters,
  ReportSummaryBar,
  ReportTabs,
  useReportFilters,
} from './reports-parts'

type OrderReportRow = {
  index: string
  course: string
  accepted: number
  rejected: number
  pending: number
  total: number
}

const COLUMNS: Column<OrderReportRow>[] = [
  {
    key: 'course',
    header: 'الكورس',
    flex: true,
    render: (r) => (
      <Truncate>
        <span className="font-bold">{r.course}</span>
      </Truncate>
    ),
  },
  {
    key: 'index',
    header: '#',
    width: 40,
    render: (r) => <span className="num text-muted">{r.index}</span>,
  },
  {
    key: 'accepted',
    header: 'طلبات مقبولة',
    width: 150,
    render: (r) => <span className="num font-bold text-success">{r.accepted}</span>,
  },
  {
    key: 'rejected',
    header: 'مرفوضة',
    width: 120,
    render: (r) => <span className="num font-bold text-danger">{r.rejected}</span>,
  },
  {
    key: 'pending',
    header: 'معلقة',
    width: 120,
    render: (r) => <span className="num font-bold text-warning">{r.pending}</span>,
  },
  {
    key: 'total',
    header: 'إجمالي الطلبات',
    width: 120,
    render: (r) => <span className="num font-bold text-ink">{r.total}</span>,
  },
]

/** فيجما frame: v3-report-orders (node 43:287) */
export default function ReportOrders() {
  const [filters, setFilters] = useReportFilters()
  const { data, loading, error, reload } = useAsync(
    () => getOrdersReport(filters),
    [filters.from, filters.to, filters.compare],
  )

  const stats: Stat[] = data
    ? [
        {
          label: 'إجمالي الطلبات المستلمة',
          value: formatArabicCount(data.totalOrders, 'طلب', 'طلب'),
          icon: ShoppingBag,
          mono: true,
          note:
            data.totalOrdersDelta !== null
              ? `${data.totalOrdersDelta >= 0 ? '+' : ''}${data.totalOrdersDelta}% عن الفترة السابقة`
              : undefined,
          noteTone: data.totalOrdersDelta !== null ? (data.totalOrdersDelta >= 0 ? 'success' : 'danger') : undefined,
          trend: data.totalOrdersDelta !== null ? (data.totalOrdersDelta >= 0 ? 'up' : 'down') : undefined,
        },
        {
          label: 'طلبات معلقة',
          value: formatArabicCount(data.pendingOrders, 'طلب', 'طلب'),
          note: 'بحاجة إلى مراجعة',
          icon: Clock,
          mono: true,
        },
        {
          label: 'معدل القبول (من الطلبات المتخذ فيها قرار)',
          value: `${data.approvalRate}%`,
          icon: CheckCircle2,
          mono: true,
        },
      ]
    : []

  return (
    <Page title="التقارير والإحصائيات">
      <ReportTabs />
      <ReportFilters value={filters} onChange={setFilters} report="orders" />

      {error ? (
        <ErrorState description={error} onRetry={reload} />
      ) : !data && loading ? (
        <CardSkeleton />
      ) : (
        <>
          <StatRow stats={stats} />
          <ReportChartCard title={ORDERS_CHART_TITLE} items={data?.chart ?? []} />

          <Card className="w-full shrink-0 overflow-hidden">
            {!data ? (
              <TableSkeleton rows={4} cols={5} />
            ) : (
              <DataTable
                columns={COLUMNS}
                rows={data.rows}
                rowKey={(r) => r.index}
                className="min-w-[800px]"
              />
            )}
          </Card>

          {data ? (
            <ReportSummaryBar
              right={`إجمالي المعالجات الكلية للطلبات: ${formatArabicCount(data.totalOrders, 'طلب', 'طلب')} مستلم`}
              left={`معدل القبول العام: ${data.approvalRate}%`}
            />
          ) : null}
        </>
      )}
    </Page>
  )
}
