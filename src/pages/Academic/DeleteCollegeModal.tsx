import { useState } from 'react'
import { useNavigate, useOutletContext, useParams } from 'react-router-dom'
import { Modal, ModalButton, ModalNotice } from '@/components/ui/Modal'
import { CardSkeleton, ErrorState } from '@/components/ui/States'
import { useAsync } from '@/lib/useAsync'
import { deleteCollege, listColleges } from '@/api/academic'

type AcademicOutletContext = { onDataChanged: () => void }

export default function DeleteCollegeModal() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { onDataChanged } = useOutletContext<AcademicOutletContext>()
  const { data, loading, error } = useAsync(() => listColleges({ limit: 200 }), [])
  const college = data?.data.find((c) => c.id === id)

  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  if (!id) return null

  const handleConfirm = async () => {
    setSubmitting(true)
    setSubmitError(null)
    try {
      await deleteCollege(id)
      onDataChanged()
      navigate('/academic/colleges')
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'حدث خطأ، حاول مرة أخرى')
      setSubmitting(false)
    }
  }

  return (
    <Modal
      title="تأكيد حذف الكلية"
      actions={
        <>
          <ModalButton variant="cancel">إلغاء</ModalButton>
          <ModalButton tone="danger" onClick={handleConfirm} disabled={submitting || !college}>
            {submitting ? '...جاري الحذف' : 'تأكيد الحذف'}
          </ModalButton>
        </>
      }
    >
      {loading ? (
        <CardSkeleton />
      ) : error || !college ? (
        <ErrorState description={error ?? 'تعذر العثور على الكلية'} />
      ) : (
        <>
          <p className="text-right text-base leading-relaxed text-muted">
            هل أنت متأكد من حذف <span className="font-bold text-ink">{college.name}</span>؟
          </p>
          <ModalNotice tone="danger">
            هيتحذف معاها كل التخصصات والمراحل والترمات التابعة لها. العملية لا يمكن التراجع
            عنها.
          </ModalNotice>
          {submitError ? <p className="text-sm font-bold text-danger">{submitError}</p> : null}
        </>
      )}
    </Modal>
  )
}
