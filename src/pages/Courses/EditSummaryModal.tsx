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
import { summariesApi, updateContentItem, deleteContentItem } from '@/api/courses'
import { FilePlate, StatusLine } from './courses-parts'

type ContentOutletContext = { onDataChanged: () => void }

/** مودال تعديل ملخص — نفس بنية EditNoteModal (فيجما مايفرّقش بينهم في هذا المستوى) */
export default function EditSummaryModal() {
  const { id: courseId, noteId: summaryId } = useParams<{ id: string; noteId: string }>()
  const navigate = useNavigate()
  const { onDataChanged } = useOutletContext<ContentOutletContext>()
  const { data: summaries, loading, error } = useAsync(
    () => summariesApi.list(courseId!),
    [courseId],
  )
  const summary = summaries?.find((s) => s.id === summaryId)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [order, setOrder] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (summary) {
      setTitle(summary.title)
      setDescription(summary.description ?? '')
      setOrder(String(summary.order))
    }
  }, [summary])

  if (!courseId || !summaryId) return null

  const handleConfirm = async () => {
    setSubmitting(true)
    setSubmitError(null)
    try {
      await updateContentItem(summaryId, { title, description, order: Number(order) || 0 })
      onDataChanged()
      navigate(-1)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'حدث خطأ، حاول مرة أخرى')
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    await deleteContentItem(summaryId)
    onDataChanged()
    navigate(-1)
  }

  return (
    <>
      <Modal
        title="تعديل بيانات الملخص"
        actions={
          <>
            <ModalButton variant="cancel">إلغاء</ModalButton>
            <ModalButton onClick={handleConfirm} disabled={submitting || !title.trim() || !summary}>
              {submitting ? '...جاري الحفظ' : 'حفظ التعديلات'}
            </ModalButton>
          </>
        }
      >
        {loading ? (
          <CardSkeleton />
        ) : error || !summary ? (
          <ErrorState description={error ?? 'تعذر العثور على الملخص'} />
        ) : (
          <>
            <ModalField label="عنوان الملخص" value={title} onChange={setTitle} />
            <ModalTextArea label="الوصف" value={description} onChange={setDescription} rows={3} />
            <ModalField label="الترتيب" value={order} onChange={setOrder} type="number" mono />
            <FilePlate name="الملف الحالي" meta="مستند" action="تغيير الملف" />
            <StatusLine label="الحالة:" value="منشور للطلاب" />
            <ModalDangerZone label="حذف الملخص" onClick={() => setConfirmingDelete(true)} />
            {submitError ? <p className="text-sm font-bold text-danger">{submitError}</p> : null}
          </>
        )}
      </Modal>
      {confirmingDelete ? (
        <ConfirmDeleteModal
          message="حذف الملخص ده؟"
          submitting={deleting}
          onClose={() => setConfirmingDelete(false)}
          onConfirm={handleDelete}
        />
      ) : null}
    </>
  )
}
