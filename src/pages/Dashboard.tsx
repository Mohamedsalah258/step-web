import { Page } from '@/components/layout/Page'
import { Card } from '@/components/ui/Card'
import { StatRow } from '@/components/ui/StatCard'
import { DataTable, Truncate, type Column } from '@/components/ui/Table'
import { StatusBadge } from '@/components/ui/Badge'
import { LineChart, HBarChart, VBarChart } from '@/components/charts/Charts'
import {
  DASHBOARD_STATS,
  MONTHLY_REVENUE,
  ORDERS_TREND,
  RECENT_ACTIVITY,
  SUBS_PER_COURSE,
  type Activity,
} from '@/data/dashboard'

/** ترتيب الأعمدة في الـ DOM = من اليمين لليسار (فيجما node 7:153) */
const COLUMNS: Column<Activity>[] = [
  {
    key: 'activity',
    header: 'النشاط',
    width: 180,
    render: (r) => <span className="font-normal">{r.activity}</span>,
  },
  {
    key: 'student',
    header: 'الطالب',
    width: 180,
    render: (r) => <span className="font-semibold">{r.student}</span>,
  },
  {
    key: 'content',
    header: 'الكورس/المحتوى',
    flex: true,
    render: (r) => <Truncate>{r.content}</Truncate>,
  },
  {
    key: 'date',
    header: 'التاريخ',
    width: 180,
    render: (r) => <span className="num text-muted">{r.date}</span>,
  },
  {
    key: 'status',
    header: 'الحالة',
    width: 180,
    render: (r) => <StatusBadge status={r.status} />,
  },
]

/** فيجما frame: v3-dashboard (node 7:6) */
export default function Dashboard() {
  return (
    <Page title="لوحة التحكم الرئيسية">
      <StatRow stats={DASHBOARD_STATS} />

      {/* charts-row — node 7:73، h280، gap16.
          RTL: أول كارت في الـ DOM يظهر يمين، فالترتيب معكوس عن الديزاين
          (الديزاين من الشمال: معدل → الاشتراكات → الإيراد) */}
      <div className="flex h-auto w-full shrink-0 flex-col gap-4 lg:h-[280px] lg:flex-row lg:items-start">
        <Card className="flex h-full min-w-0 flex-1 flex-col gap-4 p-5">
          <h2 className="w-full text-right text-md font-bold text-ink">
            الإيراد الشهري (ج.م)
          </h2>
          <VBarChart items={MONTHLY_REVENUE} />
        </Card>

        <Card className="flex h-full min-w-0 flex-1 flex-col gap-3 p-5">
          <h2 className="w-full text-right text-md font-bold text-ink">
            الاشتراكات لكل كورس
          </h2>
          <HBarChart items={SUBS_PER_COURSE} />
        </Card>

        <Card className="flex h-full min-w-0 flex-1 flex-col gap-4 p-5">
          <h2 className="w-full text-right text-md font-bold text-ink">
            معدل طلبات الشراء
          </h2>
          <LineChart points={ORDERS_TREND.points} labels={ORDERS_TREND.labels} />
        </Card>
      </div>

      {/* activity-table-card — node 7:149 */}
      <Card className="flex w-full shrink-0 flex-col overflow-hidden">
        <div className="flex w-full items-start border-b border-line p-5">
          <h2 className="min-w-0 flex-1 text-right text-lg font-extrabold text-ink">
            آخر الأنشطة والطلبات
          </h2>
        </div>
        <DataTable
          columns={COLUMNS}
          rows={RECENT_ACTIVITY}
          rowKey={(r) => r.id}
          className="min-w-[900px]"
        />
      </Card>
    </Page>
  )
}
