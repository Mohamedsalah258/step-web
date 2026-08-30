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
import { videosApi, updateContentItem, deleteContentItem } from '@/api/courses'
import { EDIT_VIDEO_MODAL as M } from '@/data/courses'
import { FilePlate, StatusLine } from './courses-parts'

type ContentOutletContext = { onDataChanged: () => void }

/** فيجما frame: v3-edit-video-modal (node 2007:4455) — modal node 2007:4572 */
export default function EditVideoModal() {
  const { id: courseId, videoId } = useParams<{ id: string; videoId: string }>()
  const navigate = useNavigate()
  const { onDataChanged } = useOutletContext<ContentOutletContext>()
  const { data: videos, loading, error } = useAsync(() => videosApi.list(courseId!), [courseId])
  const video = videos?.find((v) => v.id === videoId)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [order, setOrder] = useState('')
  const [externalUrl, setExternalUrl] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (video) {
      setTitle(video.title)
      setDescription(video.description ?? '')
      setOrder(String(video.order))
      setExternalUrl(video.externalUrl ?? '')
    }
  }, [video])

  if (!courseId || !videoId) return null

  const handleConfirm = async () => {
    setSubmitting(true)
    setSubmitError(null)
    try {
      await updateContentItem(videoId, {
        title,
        description,
        order: Number(order) || 0,
        ...(video?.externalUrl ? { externalUrl } : {}),
      })
      onDataChanged()
      navigate(-1)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'حدث خطأ، حاول مرة أخرى')
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    await deleteContentItem(videoId)
    onDataChanged()
    navigate(-1)
  }

  return (
    <>
      <Modal
        title={M.title}
        actions={
          <>
            <ModalButton variant="cancel">{M.cancel}</ModalButton>
            <ModalButton
              onClick={handleConfirm}
              disabled={
                submitting ||
                !title.trim() ||
                !video ||
                (!!video?.externalUrl && !externalUrl.trim())
              }
            >
              {submitting ? '...جاري الحفظ' : M.submit}
            </ModalButton>
          </>
        }
      >
        {loading ? (
          <CardSkeleton />
        ) : error || !video ? (
          <ErrorState description={error ?? 'تعذر العثور على الفيديو'} />
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
            {video.externalUrl ? (
              <ModalField
                label={M.urlLabel}
                placeholder={M.urlPlaceholder}
                value={externalUrl}
                onChange={setExternalUrl}
              />
            ) : (
              <FilePlate name={M.fileName} meta={M.fileMeta} action={M.replaceBtn} />
            )}
            <StatusLine label={M.statusLabel} value={M.statusValue} />
            <ModalDangerZone label={M.deleteBtn} onClick={() => setConfirmingDelete(true)} />
            {submitError ? <p className="text-sm font-bold text-danger">{submitError}</p> : null}
          </>
        )}
      </Modal>
      {confirmingDelete ? (
        <ConfirmDeleteModal
          message="حذف الفيديو ده؟"
          submitting={deleting}
          onClose={() => setConfirmingDelete(false)}
          onConfirm={handleDelete}
        />
      ) : null}
    </>
  )
}
