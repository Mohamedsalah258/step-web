import { useState } from 'react'
import { Outlet, useOutletContext, useParams } from 'react-router-dom'
import { DataTable } from '@/components/ui/Table'
import { ConfirmDeleteModal } from '@/components/ui/Modal'
import { EmptyState, ErrorState, CardSkeleton } from '@/components/ui/States'
import { useAsync } from '@/lib/useAsync'
import { notesApi, deleteContentItem } from '@/api/courses'
import { uploadFile } from '@/api/uploads'
import { ADD_NOTE_FORM as F, NOTES_EMPTY, NOTES_LIST_HEADER as H } from '@/data/courses'
import {
  AddForm,
  ListCard,
  TitleAndDescription,
  UploadDrop,
  fileColumns,
  type CourseDetailOutletContext,
} from './courses-parts'

/** فيجما frame: v3-course-notes (node 13:316) */
export default function CourseNotes() {
  const { id: courseId = '' } = useParams()
  const { onDataChanged: refreshCourse } = useOutletContext<CourseDetailOutletContext>()
  const [refreshKey, setRefreshKey] = useState(0)
  const { data: notes, loading, error, reload } = useAsync(
    () => notesApi.list(courseId),
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
      await notesApi.create(courseId, { title, description: description || undefined, fileId })
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
        <ListCard title={H.title} reorder={H.reorder}>
          {error ? (
            <ErrorState description={error} onRetry={reload} />
          ) : loading && !notes ? (
            <CardSkeleton />
          ) : (
            <DataTable
              columns={fileColumns(
                H.titleColumn,
                (r) => `/courses/${courseId}/notes/${r.id}/edit`,
                (r) => setDeletingId(r.id),
              )}
              rows={notes ?? []}
              rowKey={(r) => r.id}
              className="min-w-[800px]"
              empty={<EmptyState title={NOTES_EMPTY.title} description={NOTES_EMPTY.description} />}
            />
          )}
        </ListCard>

        <AddForm
          title={F.title}
          submit={submitting ? '...جاري الرفع' : F.submit}
          notice={F.notice}
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
          message="حذف المذكرة دي؟"
          submitting={deleting}
          onClose={() => setDeletingId(null)}
          onConfirm={handleDelete}
        />
      ) : null}
      <Outlet context={{ onDataChanged: refreshAll }} />
    </>
  )
}
