import { useState } from 'react'
import { useNavigate, useOutletContext, useParams } from 'react-router-dom'
import { Modal, ModalButton, ModalNotice } from '@/components/ui/Modal'
import { CardSkeleton, ErrorState } from '@/components/ui/States'
import { useAsync } from '@/lib/useAsync'
import { deletePaymentMethod, listPaymentMethods } from '@/api/payments'

type PaymentsOutletContext = { onDataChanged: () => void }

/** تأكيد حذف طريقة دفع — نفس بنية DeleteCollegeModal (قاعدة 3: مودالز تأكيد الحذف). */
export default function DeletePaymentMethodModal() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const { onDataChanged } = useOutletContext<PaymentsOutletContext>()
  const { data: methods, loading, error } = useAsync(() => listPaymentMethods(), [])
  const method = methods?.find((m) => m.id === id)

  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  if (!id) return null

  const handleConfirm = async () => {
    setSubmitting(true)
    setSubmitError(null)
    try {
      await deletePaymentMethod(id)
      onDataChanged()
      navigate('/payments')
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'حدث خطأ أثناء الحذف')
      setSubmitting(false)
    }
  }

  return (
    <Modal
      title="تأكيد حذف طريقة الدفع"
      actions={
        <>
          <ModalButton variant="cancel">إلغاء</ModalButton>
          <ModalButton tone="danger" onClick={handleConfirm} disabled={submitting || !method}>
            {submitting ? '...جاري الحذف' : 'تأكيد الحذف'}
          </ModalButton>
        </>
      }
    >
      {loading ? (
        <CardSkeleton />
      ) : error || !method ? (
        <ErrorState description={error ?? 'تعذر العثور على طريقة الدفع'} />
      ) : (
        <>
          <p className="text-right text-base leading-relaxed text-muted">
            هل أنت متأكد من حذف <span className="font-bold text-ink">{method.name}</span>؟
          </p>
          <ModalNotice tone="danger">
            هيتوقف قبول المدفوعات بيها فورًا، وأي طالب بيستخدمها هيحتاج يختار طريقة دفع تانية.
          </ModalNotice>
          {submitError ? <p className="text-sm font-bold text-danger">{submitError}</p> : null}
        </>
      )}
    </Modal>
  )
}
