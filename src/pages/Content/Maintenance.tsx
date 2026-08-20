import { Wrench, Signal, Wifi, BatteryFull } from 'lucide-react'
import { Page } from '@/components/layout/Page'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ToggleRow, TextArea } from '@/components/ui/Field'
import { DataTable, Truncate, type Column } from '@/components/ui/Table'
import {
  MAINTENANCE_LOG,
  MAINTENANCE_LOG_HEADERS,
  MAINTENANCE_PAGE_TITLE,
  MAINTENANCE_PANEL,
  MAINTENANCE_PREVIEW,
  type MaintenanceLog,
} from '@/data/content'
import { PanelCard } from './content-parts'

/** ⚠️ أول عمود = أول عمود من اليمين (فيجما node 7:2570) */
const LOG_COLUMNS: Column<MaintenanceLog>[] = [
  {
    key: 'date',
    header: MAINTENANCE_LOG_HEADERS.date,
    width: 120,
    render: (r) => <span className="num text-muted">{r.date}</span>,
  },
  {
    key: 'duration',
    header: MAINTENANCE_LOG_HEADERS.duration,
    width: 100,
    render: (r) => <span className="mono text-ink">{r.duration}</span>,
  },
  {
    key: 'reason',
    header: MAINTENANCE_LOG_HEADERS.reason,
    flex: true,
    render: (r) => <Truncate>{r.reason}</Truncate>,
  },
]

/** معاينة شاشة الصيانة على هاتف الطالب — فيجما node 7:2528 */
function PhonePreview() {
  return (
    <div className="flex h-[500px] w-[280px] shrink-0 flex-col items-center justify-between rounded-[24px] bg-navy px-4 pb-6 pt-3 shadow-panel">
      {/* status-bar — RTL: الساعة يسار والأيقونات يمين (فيجما x=0 / x=202) */}
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-1">
          <BatteryFull className="size-3.5 text-white" strokeWidth={2} />
          <Wifi className="size-3 text-white" strokeWidth={2} />
          <Signal className="size-3 text-white" strokeWidth={2} />
        </div>
        <span className="num text-xs font-bold text-white">
          {MAINTENANCE_PREVIEW.clock}
        </span>
      </div>

      <div className="flex w-full flex-col items-center gap-4">
        <div className="flex size-14 shrink-0 items-center justify-center rounded-card bg-brand">
          <Wrench className="size-8 text-white" strokeWidth={2} />
        </div>
        <p className="text-center text-[18px] font-extrabold text-white">
          {MAINTENANCE_PREVIEW.title}
        </p>
        <p className="text-center text-2xs leading-[18px] text-brand-tint/80">
          {MAINTENANCE_PREVIEW.description}
        </p>
      </div>

      <div className="flex w-full shrink-0 items-center justify-center rounded-ctl bg-brand px-4 py-2.5">
        <span className="text-xs font-bold text-white">
          {MAINTENANCE_PREVIEW.cta}
        </span>
      </div>
    </div>
  )
}

/** فيجما frame: v3-maintenance (node 7:2510) */
export default function Maintenance() {
  return (
    <Page title={MAINTENANCE_PAGE_TITLE}>
      {/* RTL: لوحة التحكم يمين (فيجما x=474) والمعاينة يسار (x=0) */}
      <div className="flex w-full shrink-0 items-start gap-6">
        <Card className="flex min-w-0 flex-1 flex-col gap-6 p-8">
          <div className="flex flex-col gap-2 text-right">
            <h2 className="text-xl font-extrabold text-ink">
              {MAINTENANCE_PANEL.title}
            </h2>
            <p className="text-base text-muted">{MAINTENANCE_PANEL.subtitle}</p>
          </div>

          {/* حالة الاتصال بالخادم — node 7:2554 (العنوان يمين والحالة يسار) */}
          <div className="flex items-center justify-between gap-4 rounded-ctl border border-line bg-surface p-4">
            <span className="text-base text-muted">
              {MAINTENANCE_PANEL.serverStatusLabel}
            </span>
            <div className="flex items-center gap-2">
              <span className="size-2 shrink-0 rounded-full bg-success" />
              <span className="text-base font-bold text-ink">
                {MAINTENANCE_PANEL.serverStatus}
              </span>
            </div>
          </div>

          {/* maintenance-message-editor — node 29:1472 */}
          <div className="flex flex-col gap-3">
            <TextArea
              label={MAINTENANCE_PANEL.messageLabel}
              value={MAINTENANCE_PANEL.message}
              rows={4}
            />
            <Button full>{MAINTENANCE_PANEL.saveMessage}</Button>
          </div>

          {/* toggle — node 7:2559 */}
          <ToggleRow
            label={MAINTENANCE_PANEL.toggleTitle}
            hint={MAINTENANCE_PANEL.toggleHint}
          />

          <p className="text-right text-base leading-relaxed text-warning">
            {MAINTENANCE_PANEL.warning}
          </p>

          <div className="h-px w-full shrink-0 bg-line" />

          {/* سجل فترات الصيانة السابقة — node 7:2567 */}
          <div className="flex flex-col gap-4">
            <h3 className="text-right text-lg font-bold text-ink">
              {MAINTENANCE_PANEL.logTitle}
            </h3>
            <div className="overflow-hidden rounded-card border border-line">
              <DataTable
                columns={LOG_COLUMNS}
                rows={MAINTENANCE_LOG}
                rowKey={(r) => r.id}
              />
            </div>
          </div>
        </Card>

        <PanelCard className="w-[450px] shrink-0 items-center">
          <p className="w-full text-right text-md font-bold text-ink">
            {MAINTENANCE_PREVIEW.cardTitle}
          </p>
          <PhonePreview />
        </PanelCard>
      </div>
    </Page>
  )
}
