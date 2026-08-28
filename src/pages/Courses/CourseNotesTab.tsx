import { useState } from 'react'
import { Download, FileText } from 'lucide-react'
import { Link, Outlet, useOutletContext, useParams } from 'react-router-dom'
import { Card, CardHeader } from '@/components/ui/Card'
import { ConfirmDeleteModal } from '@/components/ui/Modal'
import { EmptyState, ErrorState, CardSkeleton } from '@/components/ui/States'
import { useAsync } from '@/lib/useAsync'
import { formatDate } from '@/lib/format'
import { summariesApi, deleteContentItem, type ApiContentItem } from '@/api/courses'
import { uploadUrl, uploadFile } from '@/api/uploads'
import {
  ADD_SUMMARY_FORM as F,
  SUMMARIES_EMPTY,
  SUMMARIES_LIST_TITLE,
  SUMMARY_CARD_ACTIONS as A,
} from '@/data/courses'
import {
  AddForm,
  TitleAndDescription,
  UploadDrop,
  type CourseDetailOutletContext,
} from './courses-parts'

/** كارت ملخص — فيجما node 13:576 */
function SummaryCard({
  s,
  courseId,
  onDelete,
}: {
  s: ApiContentItem
  courseId: string
  onDelete: () => void
}) {
  return (
    <div className="flex items-center gap-4 border-b border-line px-5 py-4 last:border-b-0 hover:bg-surface/60">
      <div className="flex shrink-0 items-center gap-1.5">
        <Link
          to={`/courses/${courseId}/notes-tab/${s.id}/edit`}
          className="rounded-badge bg-brand-tint px-3 py-1.5 text-2xs font-bold text-brand transition-opacity hover:opacity-80"
        >
          {A.edit}
        </Link>
        <button
          type="button"
          onClick={onDelete}
          className="rounded-badge bg-danger-bg px-3 py-1.5 text-2xs font-bold text-danger transition-opacity hover:opacity-80"
        >
          {A.delete}
        </button>
        {s.fileId ? (
          <button
            type="button"
            aria-label={A.download}
            onClick={() => window.open(uploadUrl(s.fileId!), '_blank')}
            className="inline-flex size-8 items-center justify-center rounded-badge border border-line bg-white text-muted transition-colors hover:bg-surface"
          >
            <Download className="size-4" strokeWidth={2} />
          </button>
        ) : null}
      </div>

      <div className="flex min-w-0 flex-1 flex-col items-start gap-1">
        <p className="w-full truncate text-right text-base font-bold text-ink">{s.title}</p>
        <div className="flex items-center gap-3 text-2xs text-muted">
          <span className="num">{formatDate(s.createdAt)}</span>
        </div>
      </div>

      <FileText className="size-5 shrink-0 text-brand" strokeWidth={2} />
    </div>
  )
}

/** فيجما frame: v3-course-notes-tab (node 13:506) */
export default function CourseNotesTab() {
  const { id: courseId = '' } = useParams()
  const { onDataChanged: refreshCourse } = useOutletContext<CourseDetailOutletContext>()
  const [refreshKey, setRefreshKey] = useState(0)
  const { data: summaries, loading, error, reload } = useAsync(
    () => summariesApi.list(courseId),
    [courseId, refreshKey],
  )

  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const refreshAll = () => {
    setRefreshKey((k) => k + 1)
    refreshCourse()
  }

  const handleAdd = async () => {
    if (!title.trim() || !file) return
    setSubmitting(true)
    setSubmitError(null)
    try {
      const { fileId } = await uploadFile(file)
      await summariesApi.create(courseId, {
        title,
        description: description || undefined,
        fileId,
      })
      setFile(null)
      setTitle('')
      setDescription('')
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
        <Card className="flex min-w-0 flex-1 flex-col overflow-hidden lg:self-start">
          <CardHeader title={SUMMARIES_LIST_TITLE} />
          {error ? (
            <ErrorState description={error} onRetry={reload} />
          ) : loading && !summaries ? (
            <CardSkeleton />
          ) : !summaries || summaries.length === 0 ? (
            <EmptyState title={SUMMARIES_EMPTY.title} description={SUMMARIES_EMPTY.description} />
          ) : (
            <div className="flex flex-col">
              {summaries.map((s) => (
                <SummaryCard
                  key={s.id}
                  s={s}
                  courseId={courseId}
                  onDelete={() => setDeletingId(s.id)}
                />
              ))}
            </div>
          )}
        </Card>

        <AddForm
          title={F.title}
          submit={submitting ? '...جاري الرفع' : F.submit}
          onSubmit={handleAdd}
          disabled={submitting || !title.trim() || !file}
        >
          <TitleAndDescription
            titleLabel={F.titleLabel}
            titlePlaceholder={F.titlePlaceholder}
            descLabel={F.descLabel}
            descPlaceholder={F.descPlaceholder}
            title={title}
            onTitleChange={setTitle}
            description={description}
            onDescriptionChange={setDescription}
          />
          <label className="w-full cursor-pointer">
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
            <UploadDrop title={file ? file.name : F.uploadTitle} hint={F.uploadHint} />
          </label>
        </AddForm>
        {submitError ? <p className="text-sm font-bold text-danger">{submitError}</p> : null}
      </div>
      {deletingId ? (
        <ConfirmDeleteModal
          message="حذف الملخص ده؟"
          submitting={deleting}
          onClose={() => setDeletingId(null)}
          onConfirm={handleDelete}
        />
      ) : null}
      <Outlet context={{ onDataChanged: refreshAll }} />
    </>
  )
}
