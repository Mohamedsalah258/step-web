import { useState } from 'react'
import { useNavigate, useOutletContext, useParams } from 'react-router-dom'
import { Modal, ModalButton } from '@/components/ui/Modal'
import { CardSkeleton, ErrorState } from '@/components/ui/States'
import { useAsync } from '@/lib/useAsync'
import { formatEGP } from '@/lib/format'
import { approveOrder, getOrderDetail } from '@/api/orders'
import { APPROVE_MODAL as M } from '@/data/orders'
import { InfoLine } from './orders-parts'

type OrdersOutletContext = { onDataChanged: () => void }

/** فيجما frame: v3-order-approve-modal (node 2002:2596) — modal-box node 2002:3147 */
export default function OrderApproveModal() {
  const navigate = useNavigate()
  const { id = '' } = useParams()
  const { onDataChanged } = useOutletContext<OrdersOutletContext>()
  const { data: order, loading, error } = useAsync(() => getOrderDetail(id), [id])

  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  if (!id) return null

  const handleConfirm = async () => {
    setSubmitting(true)
    setSubmitError(null)
    try {
      await approveOrder(id)
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
      actions={
        <>
          <ModalButton variant="cancel">{M.cancel}</ModalButton>
          <ModalButton tone="success" onClick={handleConfirm} disabled={submitting || !order}>
            {submitting ? '...جاري التفعيل' : M.submit}
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
          {/* order-plate — node 2002:3155 */}
          <div className="flex w-full flex-col gap-2 rounded-ctl bg-surface p-4">
            <InfoLine row={{ label: 'الطالب:', value: order.student.name, bold: true }} />
            <InfoLine row={{ label: 'الكورس:', value: order.course.name, bold: true }} />
            <InfoLine
              row={{
                label: 'السعر:',
                value: formatEGP(order.amount),
                bold: true,
                tone: 'success',
              }}
            />
            <InfoLine
              row={{ label: 'طريقة الدفع:', value: order.paymentMethodName, bold: true, tone: 'brand' }}
            />
            <InfoLine
              row={{ label: 'الرقم المرجعي:', value: order.referenceNumber, bold: true, mono: true }}
            />
          </div>

          <p className="text-right text-base leading-relaxed text-muted">{M.description}</p>
          {submitError ? <p className="text-sm font-bold text-danger">{submitError}</p> : null}
        </>
      )}
    </Modal>
  )
}
