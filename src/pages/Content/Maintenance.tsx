import { useEffect, useState } from 'react'
import { Wrench, Signal, Wifi, BatteryFull } from 'lucide-react'
import { Page } from '@/components/layout/Page'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ConfirmDeleteModal } from '@/components/ui/Modal'
import { ToggleRow, TextArea } from '@/components/ui/Field'
import { DataTable, Truncate, type Column } from '@/components/ui/Table'
import { CardSkeleton, EmptyState, ErrorState } from '@/components/ui/States'
import { useAsync } from '@/lib/useAsync'
import {
  getMaintenanceLog,
  getMaintenanceState,
  toggleMaintenance,
  updateMaintenanceMessage,
  type ApiMaintenanceLogRow,
} from '@/api/maintenance'
import { MAINTENANCE_PAGE_TITLE, MAINTENANCE_PREVIEW } from '@/data/content'
import { PanelCard } from './content-parts'

/** ⚠️ أول عمود = أول عمود من اليمين (فيجما node 7:2570) */
const LOG_COLUMNS: Column<ApiMaintenanceLogRow>[] = [
  {
    key: 'date',
    header: 'التاريخ',
    width: 120,
    render: (r) => <span className="num text-muted">{r.date}</span>,
  },
  {
    key: 'duration',
    header: 'المدة المستغرقة',
    width: 100,
    render: (r) => <span className="mono text-ink">{r.duration}</span>,
  },
  {
    key: 'reason',
    header: 'السبب/التفاصيل',
    flex: true,
    render: (r) => <Truncate>{r.reason}</Truncate>,
  },
]

/** معاينة شاشة الصيانة على هاتف الطالب — فيجما node 7:2528 */
function PhonePreview() {
  return (
    <div className="flex h-[500px] w-[280px] shrink-0 flex-col items-center justify-between rounded-[24px] bg-navy px-4 pb-6 pt-3 shadow-panel">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-1">
          <BatteryFull className="size-3.5 text-white" strokeWidth={2} />
          <Wifi className="size-3 text-white" strokeWidth={2} />
          <Signal className="size-3 text-white" strokeWidth={2} />
        </div>
        <span className="num text-xs font-bold text-white">{MAINTENANCE_PREVIEW.clock}</span>
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
        <span className="text-xs font-bold text-white">{MAINTENANCE_PREVIEW.cta}</span>
      </div>
    </div>
  )
}

/** فيجما frame: v3-maintenance (node 7:2510) */
export default function Maintenance() {
  const { data: state, loading, error, reload } = useAsync(() => getMaintenanceState(), [])
  const { data: log } = useAsync(() => getMaintenanceLog(), [])

  const [message, setMessage] = useState('')
  const [savingMessage, setSavingMessage] = useState(false)
  const [toggling, setToggling] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)
  const [confirmingActivate, setConfirmingActivate] = useState(false)

  useEffect(() => {
    if (state) setMessage(state.message)
  }, [state])

  const handleSaveMessage = async () => {
    if (!message.trim()) return
    setSavingMessage(true)
    setActionError(null)
    try {
      await updateMaintenanceMessage(message)
      reload()
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'حدث خطأ، حاول مرة أخرى')
    } finally {
      setSavingMessage(false)
    }
  }

  const performToggle = async () => {
    setToggling(true)
    setActionError(null)
    try {
      await toggleMaintenance()
      reload()
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'حدث خطأ، حاول مرة أخرى')
    } finally {
      setToggling(false)
      setConfirmingActivate(false)
    }
  }

  const handleToggle = () => {
    const turningOn = !state?.isActive
    if (turningOn) {
      setConfirmingActivate(true)
      return
    }
    performToggle()
  }

  return (
    <Page title={MAINTENANCE_PAGE_TITLE}>
      <div className="flex w-full shrink-0 flex-col gap-6 lg:flex-row lg:items-start">
        <Card className="flex min-w-0 flex-1 flex-col gap-6 p-8">
          <div className="flex flex-col gap-2 text-right">
            <h2 className="text-xl font-extrabold text-ink">إعدادات وضع الصيانة الطارئة</h2>
            <p className="text-base text-muted">
              التحكم في تشغيل وإيقاف البوابة التعليمية للصيانة البرمجية
            </p>
          </div>

          {loading && !state ? (
            <CardSkeleton />
          ) : error || !state ? (
            <ErrorState description={error ?? 'تعذر تحميل حالة الصيانة'} onRetry={reload} />
          ) : (
            <>
              <div className="flex items-center justify-between gap-4 rounded-ctl border border-line bg-surface p-4">
                <span className="text-base text-muted">حالة التطبيق الحالية</span>
                <div className="flex items-center gap-2">
                  <span
                    className={`size-2 shrink-0 rounded-full ${state.isActive ? 'bg-danger' : 'bg-success'}`}
                  />
                  <span className="text-base font-bold text-ink">
                    {state.isActive ? 'تحت الصيانة' : 'يعمل بشكل طبيعي'}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <TextArea label="رسالة الصيانة" value={message} onChange={setMessage} rows={4} />
                <Button
                  full
                  onClick={handleSaveMessage}
                  disabled={savingMessage || !message.trim()}
                >
                  {savingMessage ? '...جاري الحفظ' : 'حفظ الرسالة'}
                </Button>
              </div>

              <ToggleRow
                label={state.isActive ? 'وضع الصيانة مفعّل حاليًا' : 'وضع الصيانة معطل حاليًا'}
                hint={
                  state.isActive
                    ? 'الطلاب ممنوعون من الوصول للكورسات والمحتوى'
                    : 'الطلاب قادرون على تصفح الكورسات والمحتوى بلا قيود'
                }
                on={state.isActive}
                onChange={handleToggle}
                disabled={toggling}
              />

              <p className="text-right text-base leading-relaxed text-warning">
                ⚠ تنبيه هام: عند تفعيل وضع الصيانة، سيتم إغلاق التطبيق فوراً على جميع الطلاب
                ومنعهم من الوصول للكورسات أو المدفوعات، وسوف تظهر لهم شاشة صيانة توضيحية.
              </p>
              {actionError ? (
                <p className="text-sm font-bold text-danger">{actionError}</p>
              ) : null}
            </>
          )}

          <div className="h-px w-full shrink-0 bg-line" />

          <div className="flex flex-col gap-4">
            <h3 className="text-right text-lg font-bold text-ink">سجل فترات الصيانة السابقة</h3>
            <div className="overflow-hidden rounded-card border border-line">
              <DataTable
                columns={LOG_COLUMNS}
                rows={log ?? []}
                rowKey={(r) => r.id}
                className="min-w-[500px]"
                empty={
                  <EmptyState
                    title="مفيش فترات صيانة سابقة"
                    description="لسه ما اتفعّلش وضع الصيانة قبل كده."
                  />
                }
              />
            </div>
          </div>
        </Card>

        <PanelCard className="w-full shrink-0 items-center lg:w-[450px]">
          <p className="w-full text-right text-md font-bold text-ink">
            {MAINTENANCE_PREVIEW.cardTitle}
          </p>
          <PhonePreview />
        </PanelCard>
      </div>
      {confirmingActivate ? (
        <ConfirmDeleteModal
          title="تأكيد تفعيل وضع الصيانة"
          message="تفعيل وضع الصيانة هيقفل التطبيق فورًا على كل الطلاب. متأكد؟"
          confirmLabel="تفعيل الصيانة"
          submittingLabel="...جاري التفعيل"
          submitting={toggling}
          onClose={() => setConfirmingActivate(false)}
          onConfirm={performToggle}
        />
      ) : null}
    </Page>
  )
}
