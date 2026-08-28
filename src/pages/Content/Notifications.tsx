import { useState } from 'react'
import { Bell, Plus } from 'lucide-react'
import { Page } from '@/components/layout/Page'
import { Card, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { DataTable, Truncate, type Column } from '@/components/ui/Table'
import { TextField, SelectField, TextArea } from '@/components/ui/Field'
import { CardSkeleton, EmptyState, ErrorState } from '@/components/ui/States'
import { cn } from '@/lib/cn'
import { formatDateTime, timeAgo } from '@/lib/format'
import { useAsync } from '@/lib/useAsync'
import { listCourses } from '@/api/courses'
import { listStages, listTerms } from '@/api/academic'
import {
  getAdminAlerts,
  getAudiencePreview,
  getNotificationHistory,
  sendNotification,
  type ApiAlertTone,
  type ApiSentNotification,
} from '@/api/notifications'
import { ALERTS_CARD_TITLE, NOTIFY_FORM, NOTIFY_HISTORY_TITLE } from '@/data/content'
import { PanelCard, PanelHeader } from './content-parts'

const DOT: Record<ApiAlertTone, string> = {
  danger: 'bg-danger',
  warning: 'bg-warning',
  success: 'bg-success',
}

/** ⚠️ أول عمود = أول عمود من اليمين (فيجما node 7:2096) */
const HISTORY_COLUMNS: Column<ApiSentNotification>[] = [
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
    render: (r) => <span className="num text-muted">{formatDateTime(r.date)}</span>,
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
  const ALL = NOTIFY_FORM.allOption

  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [courseName, setCourseName] = useState(ALL)
  const [stageName, setStageName] = useState(ALL)
  const [termName, setTermName] = useState(ALL)
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState<string | null>(null)
  const [sendSuccess, setSendSuccess] = useState(false)

  const { data: coursesData } = useAsync(() => listCourses({ limit: 200 }), [])
  const courses = coursesData?.data ?? []
  const course = courseName === ALL ? undefined : courses.find((c) => c.name === courseName)

  const { data: stagesData } = useAsync(() => listStages({ limit: 200 }), [])
  const stages = stagesData?.data ?? []
  const stage = stageName === ALL ? undefined : stages.find((s) => s.name === stageName)

  const { data: termsData } = useAsync(() => listTerms({ limit: 200 }), [])
  const terms = termsData?.data ?? []
  const term = termName === ALL ? undefined : terms.find((t) => t.name === termName)

  const { data: audience, loading: audienceLoading } = useAsync(
    () => getAudiencePreview({ courseId: course?.id, stageId: stage?.id, termId: term?.id }),
    [course?.id, stage?.id, term?.id],
  )

  const {
    data: history,
    loading: historyLoading,
    error: historyError,
    reload: reloadHistory,
  } = useAsync(() => getNotificationHistory({ limit: 10 }), [])

  const {
    data: alerts,
    loading: alertsLoading,
    error: alertsError,
    reload: reloadAlerts,
  } = useAsync(() => getAdminAlerts(5), [])

  const handleSend = async () => {
    if (!title.trim() || !body.trim()) return
    setSending(true)
    setSendError(null)
    setSendSuccess(false)
    try {
      await sendNotification({
        title,
        body,
        courseId: course?.id,
        stageId: stage?.id,
        termId: term?.id,
      })
      setTitle('')
      setBody('')
      setCourseName(ALL)
      setStageName(ALL)
      setTermName(ALL)
      setSendSuccess(true)
      reloadHistory()
    } catch (err) {
      setSendError(err instanceof Error ? err.message : 'حدث خطأ، حاول مرة أخرى')
    } finally {
      setSending(false)
    }
  }

  return (
    <Page title="الإشعارات">
      {/* RTL: فورم الإرسال يمين (فيجما x=474) وتنبيهات السيستم يسار (x=0) */}
      <div className="flex w-full shrink-0 flex-col gap-6 lg:flex-row lg:items-start">
        <PanelCard className="min-w-0 flex-1">
          <PanelHeader icon={Plus} title={NOTIFY_FORM.cardTitle} />

          <TextField
            label={NOTIFY_FORM.titleLabel}
            placeholder={NOTIFY_FORM.titlePlaceholder}
            value={title}
            onChange={setTitle}
          />

          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            {/* معاينة حية للمستهدفين — مش دروب داون، بتتحدّث مع فلاتر الاستهداف تحت */}
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <span className="text-right text-sm font-bold text-ink">
                {NOTIFY_FORM.audienceLabel}
              </span>
              <div className="flex h-[42px] w-full items-center rounded-ctl border border-line bg-surface px-4">
                <span className="truncate text-right text-base text-ink">
                  {audienceLoading && !audience ? '...جاري الحساب' : (audience?.label ?? '—')}
                </span>
              </div>
            </div>
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
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <SelectField
                className="min-w-0 flex-1"
                label={NOTIFY_FORM.courseLabel}
                options={[ALL, ...courses.map((c) => c.name)]}
                value={courseName}
                onChange={setCourseName}
              />
              <SelectField
                className="min-w-0 flex-1"
                label={NOTIFY_FORM.stageLabel}
                options={[ALL, ...stages.map((s) => s.name)]}
                value={stageName}
                onChange={setStageName}
              />
            </div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <SelectField
                className="min-w-0 flex-1"
                label={NOTIFY_FORM.termLabel}
                options={[ALL, ...terms.map((t) => t.name)]}
                value={termName}
                onChange={setTermName}
              />
              <div className="min-w-0 flex-1" />
            </div>
          </div>

          <TextArea
            label={NOTIFY_FORM.bodyLabel}
            placeholder={NOTIFY_FORM.bodyPlaceholder}
            rows={3}
            value={body}
            onChange={setBody}
          />

          <Button full onClick={handleSend} disabled={sending || !title.trim() || !body.trim()}>
            {sending ? '...جاري الإرسال' : NOTIFY_FORM.submit}
          </Button>
          {sendError ? (
            <p className="text-sm font-bold text-danger">{sendError}</p>
          ) : sendSuccess ? (
            <p className="text-sm font-bold text-success">تم إرسال الإشعار بنجاح</p>
          ) : null}
        </PanelCard>

        {/* تنبيهات الإدارة والسيستم — node 7:2033 */}
        <PanelCard className="w-full shrink-0 lg:w-[450px]">
          <PanelHeader icon={Bell} title={ALERTS_CARD_TITLE} />
          {alertsError ? (
            <ErrorState description={alertsError} onRetry={reloadAlerts} />
          ) : alertsLoading && !alerts ? (
            <CardSkeleton />
          ) : !alerts || alerts.length === 0 ? (
            <EmptyState
              title="لا يوجد تنبيهات حاليًا"
              description="هتظهر هنا أي طلبات شراء محتاجة مراجعتك."
            />
          ) : (
            <div className="flex flex-col gap-3">
              {alerts.map((a) => (
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
                  <span className="shrink-0 text-xs text-muted">{timeAgo(a.time)}</span>
                </div>
              ))}
            </div>
          )}
        </PanelCard>
      </div>

      {/* history-card — node 7:2092 */}
      <Card className="w-full shrink-0 overflow-hidden">
        <CardHeader title={NOTIFY_HISTORY_TITLE} />
        {historyError ? (
          <ErrorState description={historyError} onRetry={reloadHistory} />
        ) : historyLoading && !history ? (
          <CardSkeleton />
        ) : (
          <DataTable
            columns={HISTORY_COLUMNS}
            rows={history?.data ?? []}
            rowKey={(r) => r.id}
            className="min-w-[800px]"
            empty={
              <EmptyState
                title="لسه مفيش إشعارات مرسلة"
                description="أي إشعار تبعته للطلاب هيظهر هنا."
              />
            }
          />
        )}
      </Card>
    </Page>
  )
}
