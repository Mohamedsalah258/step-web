import { Bell, Plus } from 'lucide-react'
import { Page } from '@/components/layout/Page'
import { Card, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { DataTable, Truncate, type Column } from '@/components/ui/Table'
import { TextField, SelectField, TextArea } from '@/components/ui/Field'
import { cn } from '@/lib/cn'
import {
  ADMIN_ALERTS,
  ALERTS_CARD_TITLE,
  NOTIFY_FORM,
  NOTIFY_HISTORY_TITLE,
  SENT_NOTIFICATIONS,
  type AlertTone,
  type SentNotification,
} from '@/data/content'
import { PanelCard, PanelHeader } from './content-parts'

const DOT: Record<AlertTone, string> = {
  danger: 'bg-danger',
  warning: 'bg-warning',
  success: 'bg-success',
}

/** ⚠️ أول عمود = أول عمود من اليمين (فيجما node 7:2096) */
const HISTORY_COLUMNS: Column<SentNotification>[] = [
  {
    key: 'title',
    header: 'عنوان الإشعار',
    flex: true,
    render: (r) => (
      <Truncate>
        <span className="text-base font-bold text-ink">{r.title}</span>
      </Truncate>
    ),
  },
  {
    key: 'type',
    header: 'النوع',
    width: 100,
    render: (r) => r.type,
  },
  {
    key: 'audience',
    header: 'المستهدفين',
    width: 220,
    render: (r) => <span className="mono">{r.audience}</span>,
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
    width: 120,
    render: (r) => <Badge tone="success">{r.status}</Badge>,
  },
]

/** فيجما frame: v3-notifications (node 7:2017) */
export default function Notifications() {
  return (
    <Page title="الإشعارات">
      {/* RTL: فورم الإرسال يمين (فيجما x=474) وتنبيهات السيستم يسار (x=0) */}
      <div className="flex w-full shrink-0 items-start gap-6">
        <PanelCard className="min-w-0 flex-1">
          <PanelHeader icon={Plus} title={NOTIFY_FORM.cardTitle} />

          <TextField
            label={NOTIFY_FORM.titleLabel}
            placeholder={NOTIFY_FORM.titlePlaceholder}
          />

          <div className="flex items-start gap-4">
            <SelectField
              className="min-w-0 flex-1"
              label={NOTIFY_FORM.audienceLabel}
              options={NOTIFY_FORM.audienceOptions}
            />
            <SelectField
              className="min-w-0 flex-1"
              label={NOTIFY_FORM.typeLabel}
              options={NOTIFY_FORM.typeOptions}
            />
          </div>

          {/* targeting-fields — node 29:1480 */}
          <div className="flex flex-col gap-3">
            <span className="text-right text-sm font-bold text-ink">
              {NOTIFY_FORM.targetingLabel}
            </span>
            <div className="flex items-start gap-4">
              <SelectField
                className="min-w-0 flex-1"
                label={NOTIFY_FORM.courseLabel}
                options={NOTIFY_FORM.targetingOptions}
              />
              <SelectField
                className="min-w-0 flex-1"
                label={NOTIFY_FORM.stageLabel}
                options={NOTIFY_FORM.targetingOptions}
              />
            </div>
            <div className="flex items-start gap-4">
              <SelectField
                className="min-w-0 flex-1"
                label={NOTIFY_FORM.termLabel}
                options={NOTIFY_FORM.targetingOptions}
              />
              <div className="min-w-0 flex-1" />
            </div>
          </div>

          <TextArea
            label={NOTIFY_FORM.bodyLabel}
            placeholder={NOTIFY_FORM.bodyPlaceholder}
            rows={3}
          />

          <Button full>{NOTIFY_FORM.submit}</Button>
        </PanelCard>

        {/* تنبيهات الإدارة والسيستم — node 7:2033 */}
        <PanelCard className="w-[450px] shrink-0">
          <PanelHeader icon={Bell} title={ALERTS_CARD_TITLE} />
          <div className="flex flex-col gap-3">
            {ADMIN_ALERTS.map((a) => (
              <div
                key={a.id}
                className="flex items-center gap-3 rounded-logo border border-line bg-surface p-4"
              >
                {/* RTL: النقطة يمين (x=376) والوقت يسار (x=16) */}
                <span
                  className={cn('size-2.5 shrink-0 rounded-full', DOT[a.tone])}
                />
                <div className="flex min-w-0 flex-1 flex-col gap-1 text-right">
                  <span className="text-base font-bold text-ink">{a.title}</span>
                  <span className="text-xs text-muted">{a.desc}</span>
                </div>
                <span className="shrink-0 text-xs text-muted">{a.time}</span>
              </div>
            ))}
          </div>
        </PanelCard>
      </div>

      {/* history-card — node 7:2092 */}
      <Card className="w-full shrink-0 overflow-hidden">
        <CardHeader title={NOTIFY_HISTORY_TITLE} />
        <DataTable
          columns={HISTORY_COLUMNS}
          rows={SENT_NOTIFICATIONS}
          rowKey={(r) => r.id}
        />
      </Card>
    </Page>
  )
}
