import { useState } from 'react'
import { Play, Pencil, Trash2 } from 'lucide-react'
import { Link, Outlet, useOutletContext, useParams } from 'react-router-dom'
import { TextField } from '@/components/ui/Field'
import { ConfirmDeleteModal } from '@/components/ui/Modal'
import { EmptyState, ErrorState, CardSkeleton } from '@/components/ui/States'
import { useAsync } from '@/lib/useAsync'
import { formatDate } from '@/lib/format'
import { videosApi, deleteContentItem, type ApiContentItem } from '@/api/courses'
import { uploadFile } from '@/api/uploads'
import {
  ADD_VIDEO_FORM as F,
  VIDEOS_EMPTY,
  VIDEOS_LIST_HEADER,
} from '@/data/courses'
import {
  AddForm,
  ListCard,
  OrDivider,
  UploadDrop,
  type CourseDetailOutletContext,
} from './courses-parts'

function VideoRow({
  v,
  courseId,
  onDelete,
}: {
  v: ApiContentItem
  courseId: string
  onDelete: () => void
}) {
  return (
    <div className="flex items-center gap-3 border-b border-line px-5 py-3.5 last:border-b-0 hover:bg-surface/60">
      <Play className="size-4 shrink-0 text-brand" strokeWidth={2} />
      <span className="min-w-0 flex-1 truncate text-right text-sm font-semibold text-ink">
        {v.title}
      </span>
      <span className="num shrink-0 text-sm text-muted">{formatDate(v.createdAt)}</span>
      <div className="flex shrink-0 items-center gap-1.5">
        <Link
          to={`/courses/${courseId}/content/${v.id}/edit`}
          aria-label="تعديل"
          className="inline-flex size-8 items-center justify-center rounded-badge border border-line bg-white text-brand transition-colors hover:bg-brand-tint"
        >
          <Pencil className="size-4" strokeWidth={2} />
        </Link>
        <button
          type="button"
          aria-label="حذف"
          onClick={onDelete}
          className="inline-flex size-8 items-center justify-center rounded-badge border border-line bg-white text-danger transition-colors hover:bg-danger-bg"
        >
          <Trash2 className="size-4" strokeWidth={2} />
        </button>
      </div>
    </div>
  )
}

/** فيجما frame: v3-courses-content (node 2007:4062) */
export default function CourseContent() {
  const { id: courseId = '' } = useParams()
  const { onDataChanged: refreshCourse } = useOutletContext<CourseDetailOutletContext>()
  const [refreshKey, setRefreshKey] = useState(0)
  const { data: videos, loading, error, reload } = useAsync(
    () => videosApi.list(courseId),
    [courseId, refreshKey],
  )

  const [file, setFile] = useState<File | null>(null)
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [order, setOrder] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  /** بيحدّث قائمة الفيديوهات المحلية وعدّاد التاب في الهيدر مع بعض */
  const refreshAll = () => {
    setRefreshKey((k) => k + 1)
    refreshCourse()
  }

  const handleAdd = async () => {
    if (!title.trim() || (!file && !url.trim())) return
    setSubmitting(true)
    setSubmitError(null)
    try {
      let fileId: string | undefined
      if (file) fileId = (await uploadFile(file)).fileId
      await videosApi.create(courseId, {
        title,
        description: description || undefined,
        fileId,
        externalUrl: fileId ? undefined : url,
        order: Number(order) || 0,
      })
      setFile(null)
      setUrl('')
      setTitle('')
      setDescription('')
      setOrder('')
      refreshAll()
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'حدث خطأ، حاول مرة أخرى')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingId) return
    setDeleting(true)
    await deleteContentItem(deletingId)
    setDeleting(false)
    setDeletingId(null)
    refreshAll()
  }

  return (
    <>
      <div className="flex w-full shrink-0 flex-col gap-4 lg:flex-row lg:items-start">
        <ListCard title={VIDEOS_LIST_HEADER.title} reorder={VIDEOS_LIST_HEADER.reorder}>
          {error ? (
            <ErrorState description={error} onRetry={reload} />
          ) : loading && !videos ? (
            <CardSkeleton />
          ) : !videos || videos.length === 0 ? (
            <EmptyState title={VIDEOS_EMPTY.title} description={VIDEOS_EMPTY.description} />
          ) : (
            <div className="flex flex-col">
              {videos.map((v) => (
                <VideoRow
                  key={v.id}
                  v={v}
                  courseId={courseId}
                  onDelete={() => setDeletingId(v.id)}
                />
              ))}
            </div>
          )}
        </ListCard>

        <AddForm
          title={F.title}
          submit={submitting ? '...جاري الرفع' : F.submit}
          notice={F.notice}
          onSubmit={handleAdd}
          disabled={submitting || !title.trim() || (!file && !url.trim())}
        >
          <label className="w-full cursor-pointer">
            <input
              type="file"
              accept="video/*"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
            <UploadDrop title={file ? file.name : F.uploadTitle} hint={F.uploadHint} />
          </label>
          <OrDivider label={F.divider} />
          <TextField
            label={F.urlLabel}
            placeholder={F.urlPlaceholder}
            mono
            value={url}
            onChange={(v) => {
              setUrl(v)
              if (v) setFile(null)
            }}
          />
          <TextField
            label={F.titleLabel}
            placeholder={F.titlePlaceholder}
            value={title}
            onChange={setTitle}
          />
          <TextField
            label={F.descLabel}
            placeholder={F.descPlaceholder}
            value={description}
            onChange={setDescription}
          />
          <TextField
            label={F.orderLabel}
            placeholder={F.orderPlaceholder}
            type="number"
            mono
            value={order}
            onChange={setOrder}
          />
        </AddForm>
      </div>
      {submitError ? <p className="text-sm font-bold text-danger">{submitError}</p> : null}
      {deletingId ? (
        <ConfirmDeleteModal
          message="حذف الفيديو ده؟"
          submitting={deleting}
          onClose={() => setDeletingId(null)}
          onConfirm={handleDelete}
        />
      ) : null}
      <Outlet context={{ onDataChanged: refreshAll }} />
    </>
  )
}
