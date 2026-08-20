import { Page } from '@/components/layout/Page'
import { Card } from '@/components/ui/Card'
import { StatRow } from '@/components/ui/StatCard'
import { DataTable, Truncate, type Column } from '@/components/ui/Table'
import {
  ORDERS_BY_STATUS,
  ORDERS_CHART_TITLE,
  ORDERS_PREVIEWS,
  ORDERS_SUMMARY,
  ORDER_ROWS,
  ORDER_STATS,
  type OrderReportRow,
} from '@/data/reports'
import {
  ReportChartCard,
  ReportFilters,
  ReportPreviews,
  ReportSummaryBar,
  ReportTabs,
} from './reports-parts'

/** ⚠️ أول عمود في المصفوفة = أول عمود من اليمين (فيجما node 43:384) */
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
  return (
    <Page title="التقارير والإحصائيات">
      <ReportTabs />
      <ReportFilters />
      <StatRow stats={ORDER_STATS} />
      <ReportChartCard title={ORDERS_CHART_TITLE} items={ORDERS_BY_STATUS} />

      <Card className="w-full shrink-0 overflow-hidden">
        <DataTable
          columns={COLUMNS}
          rows={ORDER_ROWS}
          rowKey={(r) => r.index}
          className="min-w-[800px]"
        />
      </Card>

      <ReportSummaryBar
        right={ORDERS_SUMMARY.right}
        left={ORDERS_SUMMARY.left}
      />
      <ReportPreviews rows={ORDERS_PREVIEWS} />
    </Page>
  )
}
