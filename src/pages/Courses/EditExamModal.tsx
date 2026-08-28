import { useEffect, useState } from 'react'
import { useNavigate, useOutletContext, useParams } from 'react-router-dom'
import {
  ConfirmDeleteModal,
  Modal,
  ModalButton,
  ModalDangerZone,
  ModalField,
  ModalTextArea,
} from '@/components/ui/Modal'
import { CardSkeleton, ErrorState } from '@/components/ui/States'
import { useAsync } from '@/lib/useAsync'
import { examsApi, updateContentItem, deleteContentItem } from '@/api/courses'
import { EDIT_EXAM_MODAL as M } from '@/data/courses'
import { FilePlate, StatusLine } from './courses-parts'

type ContentOutletContext = { onDataChanged: () => void }

/** فيجما frame: v3-edit-exam-modal (node 2007:4763) — modal node 2007:4876 */
export default function EditExamModal() {
  const { id: courseId, examId } = useParams<{ id: string; examId: string }>()
  const navigate = useNavigate()
  const { onDataChanged } = useOutletContext<ContentOutletContext>()
  const { data: exams, loading, error } = useAsync(() => examsApi.list(courseId!), [courseId])
  const exam = exams?.find((e) => e.id === examId)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [order, setOrder] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (exam) {
      setTitle(exam.title)
      setDescription(exam.description ?? '')
      setOrder(String(exam.order))
    }
  }, [exam])

  if (!courseId || !examId) return null

  const handleConfirm = async () => {
    setSubmitting(true)
    setSubmitError(null)
    try {
      await updateContentItem(examId, { title, description, order: Number(order) || 0 })
      onDataChanged()
      navigate(-1)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'حدث خطأ، حاول مرة أخرى')
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    await deleteContentItem(examId)
    onDataChanged()
    navigate(`/courses/${courseId}/exams`)
  }

  return (
    <>
      <Modal
        title={M.title}
        actions={
          <>
            <ModalButton variant="cancel">{M.cancel}</ModalButton>
            <ModalButton onClick={handleConfirm} disabled={submitting || !title.trim() || !exam}>
              {submitting ? '...جاري الحفظ' : M.submit}
            </ModalButton>
          </>
        }
      >
        {loading ? (
          <CardSkeleton />
        ) : error || !exam ? (
          <ErrorState description={error ?? 'تعذر العثور على الامتحان'} />
        ) : (
          <>
            <ModalField label={M.titleLabel} value={title} onChange={setTitle} />
            <ModalTextArea
              label={M.descLabel}
              value={description}
              onChange={setDescription}
              rows={3}
            />
            <ModalField label="الترتيب" value={order} onChange={setOrder} type="number" mono />
            <FilePlate name={M.fileName} meta={M.fileMeta} action={M.replaceBtn} />
            <StatusLine label={M.statusLabel} value={M.statusValue} />
            <ModalDangerZone label={M.deleteBtn} onClick={() => setConfirmingDelete(true)} />
            {submitError ? <p className="text-sm font-bold text-danger">{submitError}</p> : null}
          </>
        )}
      </Modal>
      {confirmingDelete ? (
        <ConfirmDeleteModal
          message="حذف الامتحان ده؟"
          submitting={deleting}
          onClose={() => setConfirmingDelete(false)}
          onConfirm={handleDelete}
        />
      ) : null}
    </>
  )
}
