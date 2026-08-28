import { useState } from 'react'
import { useNavigate, useOutletContext, useParams } from 'react-router-dom'
import { Modal, ModalButton, ModalNotice } from '@/components/ui/Modal'
import { CardSkeleton, ErrorState } from '@/components/ui/States'
import { useAsync } from '@/lib/useAsync'
import { deleteTerm, listTerms } from '@/api/academic'

type AcademicOutletContext = { onDataChanged: () => void }

export default function DeleteTermModal() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { onDataChanged } = useOutletContext<AcademicOutletContext>()
  const { data, loading, error } = useAsync(() => listTerms({ limit: 200 }), [])
  const term = data?.data.find((t) => t.id === id)

  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  if (!id) return null

  const handleConfirm = async () => {
    setSubmitting(true)
    setSubmitError(null)
    try {
      await deleteTerm(id)
      onDataChanged()
      navigate('/academic/terms')
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'حدث خطأ، حاول مرة أخرى')
      setSubmitting(false)
    }
  }

  return (
    <Modal
      title="تأكيد حذف الترم"
      actions={
        <>
          <ModalButton variant="cancel">إلغاء</ModalButton>
          <ModalButton tone="danger" onClick={handleConfirm} disabled={submitting || !term}>
            {submitting ? '...جاري الحذف' : 'تأكيد الحذف'}
          </ModalButton>
        </>
      }
    >
      {loading ? (
        <CardSkeleton />
      ) : error || !term ? (
        <ErrorState description={error ?? 'تعذر العثور على الترم'} />
      ) : (
        <>
          <p className="text-right text-base leading-relaxed text-muted">
            هل أنت متأكد من حذف <span className="font-bold text-ink">{term.name}</span>؟
          </p>
          <ModalNotice tone="danger">العملية لا يمكن التراجع عنها.</ModalNotice>
          {submitError ? <p className="text-sm font-bold text-danger">{submitError}</p> : null}
        </>
      )}
    </Modal>
  )
}
