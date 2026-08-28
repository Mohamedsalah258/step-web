import { useState } from 'react'
import { useNavigate, useOutletContext, useParams } from 'react-router-dom'
import { Modal, ModalButton, ModalNotice, ModalTextArea } from '@/components/ui/Modal'
import { CardSkeleton, ErrorState } from '@/components/ui/States'
import { useAsync } from '@/lib/useAsync'
import { getOrderDetail, rejectOrder } from '@/api/orders'
import { REJECT_MODAL as M } from '@/data/orders'

type OrdersOutletContext = { onDataChanged: () => void }

/** فيجما frame: v3-order-reject-modal (node 2002:2871) — modal node 2002:3178 */
export default function OrderRejectModal() {
  const navigate = useNavigate()
  const { id = '' } = useParams()
  const { onDataChanged } = useOutletContext<OrdersOutletContext>()
  const { data: order, loading, error } = useAsync(() => getOrderDetail(id), [id])

  const [reason, setReason] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  if (!id) return null

  const handleConfirm = async () => {
    if (!reason.trim()) return
    setSubmitting(true)
    setSubmitError(null)
    try {
      await rejectOrder(id, reason)
      onDataChanged()
      navigate(-1)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'حدث خطأ، حاول مرة أخرى')
      setSubmitting(false)
    }
  }

  return (
    <Modal
      title={M.title}
      width={560}
      actions={
        <>
          <ModalButton variant="cancel">{M.cancel}</ModalButton>
          <ModalButton
            tone="danger"
            onClick={handleConfirm}
            disabled={submitting || !reason.trim() || !order}
          >
            {submitting ? '...جاري الرفض' : M.submit}
          </ModalButton>
        </>
      }
    >
      {loading ? (
        <CardSkeleton />
      ) : error || !order ? (
        <ErrorState description={error ?? 'تعذر العثور على الطلب'} />
      ) : (
        <>
          <p className="text-right text-base leading-relaxed text-muted">
            أنت على وشك رفض طلب الطالب <span className="font-bold text-ink">{order.student.name}</span>{' '}
            لكورس <span className="font-bold text-ink">{order.course.name}</span>. يرجى تحديد سبب
            الرفض بوضوح للطالب.
          </p>

          <ModalTextArea
            label={M.reasonLabel}
            placeholder={M.reasonPlaceholder}
            rows={4}
            value={reason}
            onChange={setReason}
          />

          <ModalNotice tone="brand">{M.note}</ModalNotice>
          {submitError ? <p className="text-sm font-bold text-danger">{submitError}</p> : null}
        </>
      )}
    </Modal>
  )
}
