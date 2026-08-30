import { useState } from 'react'
import { useLocation, useNavigate, useOutletContext, useParams } from 'react-router-dom'
import { Modal, ModalButton, ModalNotice } from '@/components/ui/Modal'
import { CardSkeleton, ErrorState } from '@/components/ui/States'
import { useAsync } from '@/lib/useAsync'
import { deleteStage, listStages } from '@/api/academic'

type AcademicOutletContext = { onDataChanged: () => void }

export default function DeleteStageModal() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { search } = useLocation()
  const { onDataChanged } = useOutletContext<AcademicOutletContext>()
  const { data, loading, error } = useAsync(() => listStages({ limit: 100 }), [])
  const stage = data?.data.find((s) => s.id === id)

  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  if (!id) return null

  const handleConfirm = async () => {
    setSubmitting(true)
    setSubmitError(null)
    try {
      await deleteStage(id)
      onDataChanged()
      navigate(`/academic/stages${search}`)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'حدث خطأ، حاول مرة أخرى')
      setSubmitting(false)
    }
  }

  return (
    <Modal
      title="تأكيد حذف المرحلة"
      actions={
        <>
          <ModalButton variant="cancel">إلغاء</ModalButton>
          <ModalButton tone="danger" onClick={handleConfirm} disabled={submitting || !stage}>
            {submitting ? '...جاري الحذف' : 'تأكيد الحذف'}
          </ModalButton>
        </>
      }
    >
      {loading ? (
        <CardSkeleton />
      ) : error || !stage ? (
        <ErrorState description={error ?? 'تعذر العثور على المرحلة'} />
      ) : (
        <>
          <p className="text-right text-base leading-relaxed text-muted">
            هل أنت متأكد من حذف <span className="font-bold text-ink">{stage.name}</span>؟
          </p>
          <ModalNotice tone="danger">
            هيتحذف معاها كل الترمات التابعة لها. العملية لا يمكن التراجع عنها.
          </ModalNotice>
          {submitError ? <p className="text-sm font-bold text-danger">{submitError}</p> : null}
        </>
      )}
    </Modal>
  )
}
