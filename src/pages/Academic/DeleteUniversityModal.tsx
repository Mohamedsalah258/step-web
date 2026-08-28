import { useState } from 'react'
import { useNavigate, useOutletContext, useParams } from 'react-router-dom'
import { Modal, ModalButton, ModalNotice } from '@/components/ui/Modal'
import { CardSkeleton, ErrorState } from '@/components/ui/States'
import { useAsync } from '@/lib/useAsync'
import { deleteUniversity, listUniversities } from '@/api/academic'

type AcademicOutletContext = { onDataChanged: () => void }

export default function DeleteUniversityModal() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { onDataChanged } = useOutletContext<AcademicOutletContext>()
  const { data, loading, error } = useAsync(() => listUniversities({ limit: 200 }), [])
  const university = data?.data.find((u) => u.id === id)

  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  if (!id) return null

  const handleConfirm = async () => {
    setSubmitting(true)
    setSubmitError(null)
    try {
      await deleteUniversity(id)
      onDataChanged()
      navigate('/academic/universities')
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'حدث خطأ، حاول مرة أخرى')
      setSubmitting(false)
    }
  }

  return (
    <Modal
      title="تأكيد حذف الجامعة"
      actions={
        <>
          <ModalButton variant="cancel">إلغاء</ModalButton>
          <ModalButton tone="danger" onClick={handleConfirm} disabled={submitting || !university}>
            {submitting ? '...جاري الحذف' : 'تأكيد الحذف'}
          </ModalButton>
        </>
      }
    >
      {loading ? (
        <CardSkeleton />
      ) : error || !university ? (
        <ErrorState description={error ?? 'تعذر العثور على الجامعة'} />
      ) : (
        <>
          <p className="text-right text-base leading-relaxed text-muted">
            هل أنت متأكد من حذف <span className="font-bold text-ink">{university.name}</span>؟
          </p>
          <ModalNotice tone="danger">
            هيتحذف معاها كل الكليات والتخصصات والمراحل والترمات التابعة لها. العملية لا يمكن
            التراجع عنها.
          </ModalNotice>
          {submitError ? <p className="text-sm font-bold text-danger">{submitError}</p> : null}
        </>
      )}
    </Modal>
  )
}
