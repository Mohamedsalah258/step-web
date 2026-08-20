import { Page } from '@/components/layout/Page'
import { Card } from '@/components/ui/Card'
import { StatRow } from '@/components/ui/StatCard'
import { StatusBadge } from '@/components/ui/Badge'
import { DataTable, Truncate, type Column } from '@/components/ui/Table'
import {
  DEVICES_BY_OS,
  DEVICES_CHART_TITLE,
  DEVICES_PREVIEWS,
  DEVICES_SUMMARY,
  DEVICE_ROWS,
  DEVICE_STATS,
  type DeviceReportRow,
} from '@/data/reports'
import {
  ReportChartCard,
  ReportFilters,
  ReportPreviews,
  ReportSummaryBar,
  ReportTabs,
} from './reports-parts'

/** ⚠️ أول عمود في المصفوفة = أول عمود من اليمين (فيجما node 43:883) */
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
    key: 'devices',
    header: 'عدد الأجهزة',
    width: 120,
    render: (r) => <span className="mono font-bold text-ink">{r.devices}</span>,
  },
  {
    key: 'os',
    header: 'نظام التشغيل',
    width: 150,
    render: (r) => <span className="num text-muted">{r.os}</span>,
  },
  {
    key: 'lastSeen',
    header: 'آخر نشاط',
    width: 150,
    render: (r) => <span className="mono text-muted">{r.lastSeen}</span>,
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
  return (
    <Page title="التقارير والإحصائيات">
      <ReportTabs />
      <ReportFilters />
      <StatRow stats={DEVICE_STATS} />
      <ReportChartCard title={DEVICES_CHART_TITLE} items={DEVICES_BY_OS} />

      <Card className="w-full shrink-0 overflow-hidden">
        <DataTable
          columns={COLUMNS}
          rows={DEVICE_ROWS}
          rowKey={(r) => r.index}
        />
      </Card>

      <ReportSummaryBar
        right={DEVICES_SUMMARY.right}
        left={DEVICES_SUMMARY.left}
      />
      <ReportPreviews rows={DEVICES_PREVIEWS} />
    </Page>
  )
}
