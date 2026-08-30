import { useState } from 'react'
import { useNavigate, useOutletContext, useParams } from 'react-router-dom'
import { Modal, ModalButton, ModalNotice } from '@/components/ui/Modal'
import { CardSkeleton, ErrorState } from '@/components/ui/States'
import { useAsync } from '@/lib/useAsync'
import { deleteSpecialization, listSpecializations } from '@/api/academic'

type AcademicOutletContext = { onDataChanged: () => void }

export default function DeleteSpecializationModal() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { onDataChanged } = useOutletContext<AcademicOutletContext>()
  const { data, loading, error } = useAsync(() => listSpecializations({ limit: 100 }), [])
  const specialization = data?.data.find((s) => s.id === id)

  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  if (!id) return null

  const handleConfirm = async () => {
    setSubmitting(true)
    setSubmitError(null)
    try {
      await deleteSpecialization(id)
      onDataChanged()
      navigate('/academic/specializations')
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'حدث خطأ، حاول مرة أخرى')
      setSubmitting(false)
    }
  }

  return (
    <Modal
      title="تأكيد حذف التخصص"
      actions={
        <>
          <ModalButton variant="cancel">إلغاء</ModalButton>
          <ModalButton
            tone="danger"
            onClick={handleConfirm}
            disabled={submitting || !specialization}
          >
            {submitting ? '...جاري الحذف' : 'تأكيد الحذف'}
          </ModalButton>
        </>
      }
    >
      {loading ? (
        <CardSkeleton />
      ) : error || !specialization ? (
        <ErrorState description={error ?? 'تعذر العثور على التخصص'} />
      ) : (
        <>
          <p className="text-right text-base leading-relaxed text-muted">
            هل أنت متأكد من حذف{' '}
            <span className="font-bold text-ink">{specialization.name}</span>؟
          </p>
          <ModalNotice tone="danger">
            هيتحذف معاه كل المراحل والترمات التابعة له. العملية لا يمكن التراجع عنها.
          </ModalNotice>
          {submitError ? <p className="text-sm font-bold text-danger">{submitError}</p> : null}
        </>
      )}
    </Modal>
  )
}
