import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Modal, ModalButton } from '@/components/ui/Modal'
import { CardSkeleton, ErrorState } from '@/components/ui/States'
import { useAsync } from '@/lib/useAsync'
import { formatDate, formatEGP } from '@/lib/format'
import { cancelSubscription, getStudentDetail } from '@/api/students'
import { CANCEL_SUB_MODAL_TEXT } from '@/data/students'
import { PriceBadge, SpecPlate, SpecRow } from './students-parts'

/** فيجما frame: v3-student-cancel-sub-modal (node 35:7595 → overlay 35:7816) */
export default function CancelSubModal() {
  const { id, subId } = useParams<{ id: string; subId: string }>()
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const m = CANCEL_SUB_MODAL_TEXT

  const { data: student, loading, error } = useAsync(
    () => getStudentDetail(id!),
    [id],
  )
  const subscription = student?.subscriptions.find((s) => s.id === subId)

  if (!id || !subId) return null

  const handleConfirm = async () => {
    setSubmitting(true)
    setSubmitError(null)
    try {
      await cancelSubscription(id, subId)
      navigate(-1)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'حدث خطأ، حاول مرة أخرى')
      setSubmitting(false)
    }
  }

  return (
    <Modal
      title={m.title}
      width={480}
      actions={
        <>
          <ModalButton variant="cancel">{m.cancel}</ModalButton>
          <ModalButton tone="danger" onClick={handleConfirm} disabled={submitting || !subscription}>
            {submitting ? '...جاري التنفيذ' : m.confirm}
          </ModalButton>
        </>
      }
    >
      {loading ? (
        <CardSkeleton />
      ) : error || !student || !subscription ? (
        <ErrorState description={error ?? 'تعذر العثور على الاشتراك'} />
      ) : (
        <>
          <p className="text-right text-base leading-relaxed text-muted">{m.body}</p>
          <SpecPlate>
            <SpecRow row={{ label: 'اسم الطالب:', value: student.name }} />
            <SpecRow row={{ label: 'الكورس:', value: subscription.course }} />
            <div className="flex w-full items-center justify-between gap-3">
              <span className="shrink-0 text-sm font-normal text-muted">{m.priceLabel}</span>
              <PriceBadge>{formatEGP(subscription.price)}</PriceBadge>
            </div>
            <SpecRow
              row={{ label: 'تاريخ الاشتراك:', value: formatDate(subscription.date), num: true }}
            />
          </SpecPlate>
          {submitError ? <p className="text-sm font-bold text-danger">{submitError}</p> : null}
        </>
      )}
    </Modal>
  )
}
