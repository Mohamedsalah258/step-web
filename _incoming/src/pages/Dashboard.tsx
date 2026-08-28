import { Page } from '@/components/layout/Page'
import { Card } from '@/components/ui/Card'
import { StatRow, type Stat } from '@/components/ui/StatCard'
import { DataTable, Truncate, type Column } from '@/components/ui/Table'
import { StatusBadge } from '@/components/ui/Badge'
import { LineChart, HBarChart, VBarChart } from '@/components/charts/Charts'
import { CardSkeleton, ErrorState, TableSkeleton } from '@/components/ui/States'
import { useAsync } from '@/lib/useAsync'
import { formatEGP, formatDateTime, formatNumber } from '@/lib/format'
import {
  getDashboardStats,
  getMonthlyRevenue,
  getOrdersTrend,
  getRecentActivity,
  getSubsPerCourse,
  type ApiRecentActivityItem,
} from '@/api/dashboard'
import {
  BarChart3,
  GraduationCap,
  ReceiptText,
  Smartphone,
  Users2,
  Wallet,
} from 'lucide-react'

/** ترتيب الأعمدة في الـ DOM = من اليمين لليسار (فيجما node 7:153) */
const COLUMNS: Column<ApiRecentActivityItem>[] = [
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
    render: (r) => <span className="num text-muted">{formatDateTime(r.date)}</span>,
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
  const stats = useAsync(getDashboardStats, [])
  const ordersTrend = useAsync(getOrdersTrend, [])
  const subsPerCourse = useAsync(getSubsPerCourse, [])
  const monthlyRevenue = useAsync(getMonthlyRevenue, [])
  const recentActivity = useAsync(getRecentActivity, [])

  const anyError =
    stats.error || ordersTrend.error || subsPerCourse.error || monthlyRevenue.error || recentActivity.error

  if (anyError) {
    return (
      <Page title="لوحة التحكم الرئيسية">
        <ErrorState
          description={anyError}
          onRetry={() => {
            stats.reload()
            ordersTrend.reload()
            subsPerCourse.reload()
            monthlyRevenue.reload()
            recentActivity.reload()
          }}
        />
      </Page>
    )
  }

  const kpis: Stat[] | null = stats.data
    ? [
        { label: 'عدد الطلاب', value: formatNumber(stats.data.totalStudents), icon: Users2 },
        {
          label: 'اشتراكات نشطة',
          value: formatNumber(stats.data.activeSubscriptions),
          icon: GraduationCap,
        },
        {
          label: 'إيراد الكورسات',
          value: formatEGP(stats.data.courseRevenue),
          note: 'الإجمالي المعتمد',
          mono: true,
          icon: Wallet,
        },
        {
          label: 'كورسات نشطة',
          value: formatNumber(stats.data.activeCourses),
          note: 'متاحة بالمنصة',
          icon: BarChart3,
        },
        {
          label: 'طلبات قيد المراجعة',
          value: formatNumber(stats.data.pendingOrders),
          note: 'قيد الانتظار',
          icon: ReceiptText,
        },
        {
          label: 'ريست أجهزة',
          value: formatNumber(stats.data.pendingDeviceResets),
          note: 'طلبات معلقة',
          icon: Smartphone,
        },
      ]
    : null

  return (
    <Page title="لوحة التحكم الرئيسية">
      {kpis ? (
        <StatRow stats={kpis} />
      ) : (
        <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* charts-row — node 7:73، h280، gap16.
          RTL: أول كارت في الـ DOM يظهر يمين، فالترتيب معكوس عن الديزاين
          (الديزاين من الشمال: معدل → الاشتراكات → الإيراد) */}
      <div className="flex h-auto w-full shrink-0 flex-col gap-4 lg:h-[280px] lg:flex-row lg:items-start">
        <Card className="flex h-full min-w-0 flex-1 flex-col gap-4 p-5">
          <h2 className="w-full text-right text-md font-bold text-ink">
            الإيراد الشهري (ج.م)
          </h2>
          {monthlyRevenue.data ? (
            <VBarChart items={monthlyRevenue.data} />
          ) : (
            <div className="skeleton h-full w-full" />
          )}
        </Card>

        <Card className="flex h-full min-w-0 flex-1 flex-col gap-3 p-5">
          <h2 className="w-full text-right text-md font-bold text-ink">
            الاشتراكات لكل كورس
          </h2>
          {subsPerCourse.data ? (
            <HBarChart items={subsPerCourse.data} />
          ) : (
            <div className="skeleton h-full w-full" />
          )}
        </Card>

        <Card className="flex h-full min-w-0 flex-1 flex-col gap-4 p-5">
          <h2 className="w-full text-right text-md font-bold text-ink">
            معدل طلبات الشراء
          </h2>
          {ordersTrend.data ? (
            <LineChart points={ordersTrend.data.points} labels={ordersTrend.data.labels} />
          ) : (
            <div className="skeleton h-full w-full" />
          )}
        </Card>
      </div>

      {/* activity-table-card — node 7:149 */}
      <Card className="flex w-full shrink-0 flex-col overflow-hidden">
        <div className="flex w-full items-start border-b border-line p-5">
          <h2 className="min-w-0 flex-1 text-right text-lg font-extrabold text-ink">
            آخر الأنشطة والطلبات
          </h2>
        </div>
        {recentActivity.data ? (
          <DataTable
            columns={COLUMNS}
            rows={recentActivity.data}
            rowKey={(r) => r.id}
            className="min-w-[900px]"
          />
        ) : (
          <TableSkeleton rows={5} cols={5} />
        )}
      </Card>
    </Page>
  )
}
