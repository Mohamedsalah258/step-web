import { ArrowDown, ArrowUp } from 'lucide-react'
import { Page } from '@/components/layout/Page'
import { Card } from '@/components/ui/Card'
import { StatRow } from '@/components/ui/StatCard'
import { DataTable, Truncate, type Column } from '@/components/ui/Table'
import { ProgressBar } from '@/components/ui/Misc'
import {
  REVENUE_BY_FACULTY,
  REVENUE_CHART_TITLE,
  REVENUE_PREVIEWS,
  REVENUE_ROWS,
  REVENUE_STATS,
  type RevenueRow,
} from '@/data/reports'
import {
  ReportChartCard,
  ReportFilters,
  ReportPreviews,
  ReportTabs,
} from './reports-parts'

/** ⚠️ أول عمود في المصفوفة = أول عمود من اليمين (فيجما node 37:1141) */
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
    width: 150,
    render: (r) => <span className="mono text-muted">{r.orders}</span>,
  },
  {
    key: 'revenue',
    header: 'الإيراد (ج.م)',
    width: 180,
    render: (r) => <span className="mono font-bold text-ink">{r.revenue}</span>,
  },
  {
    key: 'share',
    header: 'النسبة',
    width: 240,
    // فيجما: الشريط 180px على الشمال من النص — RTL: الشريط أول عنصر في الـ DOM
    render: (r) => (
      <div className="flex w-full items-center gap-3">
        <div className="w-[180px] shrink-0">
          <ProgressBar value={r.share} />
        </div>
        <span className="num text-sm text-muted">{r.shareLabel}</span>
      </div>
    ),
  },
  {
    key: 'delta',
    header: 'مقارنة',
    width: 120,
    render: (r) => (
      <div className="flex items-center gap-1">
        {r.up ? (
          <ArrowUp className="size-3 shrink-0 text-success" strokeWidth={2.5} />
        ) : (
          <ArrowDown className="size-3 shrink-0 text-danger" strokeWidth={2.5} />
        )}
        <span
          className={`num text-sm font-bold ${r.up ? 'text-success' : 'text-danger'}`}
        >
          {r.delta}
        </span>
      </div>
    ),
  },
]

/** فيجما frame: v3-reports-full (node 37:1035) */
export default function ReportsOverview() {
  return (
    <Page title="التقارير والإحصائيات">
      <ReportTabs />
      <ReportFilters />
      <StatRow stats={REVENUE_STATS} />
      <ReportChartCard title={REVENUE_CHART_TITLE} items={REVENUE_BY_FACULTY} />

      <Card className="w-full shrink-0 overflow-hidden">
        <DataTable
          columns={COLUMNS}
          rows={REVENUE_ROWS}
          rowKey={(r) => r.faculty}
          className="min-w-[950px]"
        />
      </Card>

      <ReportPreviews rows={REVENUE_PREVIEWS} />
    </Page>
  )
}
