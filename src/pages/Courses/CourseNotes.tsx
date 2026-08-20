import { DataTable } from '@/components/ui/Table'
import { EmptyState } from '@/components/ui/States'
import {
  ADD_NOTE_FORM as F,
  COURSE_NOTES,
  COURSE_TAB_COUNTS,
  NOTES_EMPTY,
  NOTES_LIST_HEADER as H,
  type CourseFile,
  type CourseTabCounts,
} from '@/data/courses'
import {
  AddForm,
  CourseDetailPage,
  ListCard,
  TitleAndDescription,
  UploadDrop,
  fileColumns,
} from './courses-parts'

export function CourseNotesShell({
  notes,
  counts,
  courseId = '1',
}: {
  notes: CourseFile[]
  counts: CourseTabCounts
  courseId?: string
}) {
  return (
    <CourseDetailPage title="مذكرات الكورس" counts={counts} courseId={courseId}>
      <div className="flex w-full shrink-0 items-start gap-4">
        <ListCard title={H.title} reorder={H.reorder}>
          <DataTable
            columns={fileColumns(
              H.titleColumn,
              (r) => `/courses/${courseId}/notes/${r.id}/edit`,
            )}
            rows={notes}
            rowKey={(r) => r.id}
            empty={
              <EmptyState
                title={NOTES_EMPTY.title}
                description={NOTES_EMPTY.description}
              />
            }
          />
        </ListCard>

        <AddForm title={F.title} submit={F.submit} notice={F.notice}>
          <TitleAndDescription
            titleLabel={F.titleLabel}
            titlePlaceholder={F.titlePlaceholder}
            descLabel={F.descLabel}
            descPlaceholder={F.descPlaceholder}
          />
          <UploadDrop title={F.uploadTitle} hint={F.uploadHint} />
        </AddForm>
      </div>
    </CourseDetailPage>
  )
}

/** فيجما frame: v3-course-notes (node 13:316) */
export default function CourseNotes() {
  return <CourseNotesShell notes={COURSE_NOTES} counts={COURSE_TAB_COUNTS} />
}
