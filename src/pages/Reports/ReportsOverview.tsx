import { Activity, CheckCircle2, CreditCard } from 'lucide-react'
import { Page } from '@/components/layout/Page'
import { Card } from '@/components/ui/Card'
import { StatRow, type Stat } from '@/components/ui/StatCard'
import { DataTable, Truncate, type Column } from '@/components/ui/Table'
import { ProgressBar } from '@/components/ui/Misc'
import { CardSkeleton, ErrorState, TableSkeleton } from '@/components/ui/States'
import { useAsync } from '@/lib/useAsync'
import { formatArabicCount, formatEGP, formatNumber } from '@/lib/format'
import { getRevenueReport } from '@/api/reports'
import { REVENUE_CHART_TITLE } from '@/data/reports'
import {
  DeltaBadge,
  ReportChartCard,
  ReportFilters,
  ReportTabs,
  useReportFilters,
} from './reports-parts'

type RevenueRow = { faculty: string; orders: number; revenue: number; share: number; delta: number | null }

const COLUMNS: Column<RevenueRow>[] = [
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
    key: 'orders',
    header: 'عدد الطلبات',
    width: 140,
    render: (r) => <span className="mono text-muted">{formatArabicCount(r.orders, 'طلب', 'طلبات')}</span>,
  },
  {
    key: 'revenue',
    header: 'الإيراد (ج.م)',
    width: 160,
    render: (r) => <span className="mono font-bold text-ink">{formatNumber(r.revenue)}</span>,
  },
  {
    key: 'share',
    header: 'النسبة',
    width: 220,
    render: (r) => (
      <div className="flex w-full items-center gap-3">
        <div className="w-[150px] shrink-0">
          <ProgressBar value={r.share} />
        </div>
        <span className="num text-sm text-muted">{r.share}%</span>
      </div>
    ),
  },
  {
    key: 'delta',
    header: 'مقارنة',
    width: 120,
    render: (r) => <DeltaBadge delta={r.delta} />,
  },
]

/** فيجما frame: v3-reports-full (node 37:1035) */
export default function ReportsOverview() {
  const [filters, setFilters] = useReportFilters()
  const { data, loading, error, reload } = useAsync(
    () => getRevenueReport(filters),
    [filters.from, filters.to, filters.compare],
  )

  const stats: Stat[] = data
    ? [
        {
          label: 'إجمالي الإيراد',
          value: formatEGP(data.totalRevenue),
          icon: Activity,
          mono: true,
          note: data.revenueDelta !== null ? `${data.revenueDelta >= 0 ? '+' : ''}${data.revenueDelta}% مقارنة بالفترة السابقة` : undefined,
          noteTone: data.revenueDelta !== null ? (data.revenueDelta >= 0 ? 'success' : 'danger') : undefined,
          trend: data.revenueDelta !== null ? (data.revenueDelta >= 0 ? 'up' : 'down') : undefined,
        },
        {
          label: 'متوسط قيمة الطلب',
          value: formatEGP(data.avgOrderValue),
          note: 'لجميع الكورسات والكليات',
          icon: CreditCard,
          mono: true,
        },
        {
          label: 'طلبات تمت الموافقة عليها',
          value: formatArabicCount(data.approvedOrdersCount, 'طلب', 'طلب'),
          icon: CheckCircle2,
          mono: true,
          note: data.ordersDelta !== null ? `${data.ordersDelta >= 0 ? '+' : ''}${data.ordersDelta}% عن الفترة السابقة` : undefined,
          noteTone: data.ordersDelta !== null ? (data.ordersDelta >= 0 ? 'success' : 'danger') : undefined,
          trend: data.ordersDelta !== null ? (data.ordersDelta >= 0 ? 'up' : 'down') : undefined,
        },
      ]
    : []

  return (
    <Page title="التقارير والإحصائيات">
      <ReportTabs />
      <ReportFilters value={filters} onChange={setFilters} report="revenue" />

      {error ? (
        <ErrorState description={error} onRetry={reload} />
      ) : !data && loading ? (
        <CardSkeleton />
      ) : (
        <>
          <StatRow stats={stats} />
          <ReportChartCard title={REVENUE_CHART_TITLE} items={data?.chart ?? []} />

          <Card className="w-full shrink-0 overflow-hidden">
            {!data ? (
              <TableSkeleton rows={4} cols={5} />
            ) : (
              <DataTable
                columns={COLUMNS}
                rows={data.rows}
                rowKey={(r) => r.faculty}
                className="min-w-[950px]"
              />
            )}
          </Card>
        </>
      )}
    </Page>
  )
}
