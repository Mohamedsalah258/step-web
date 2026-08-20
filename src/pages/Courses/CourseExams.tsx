import { useParams } from 'react-router-dom'
import { DataTable } from '@/components/ui/Table'
import { EmptyState } from '@/components/ui/States'
import {
  ADD_EXAM_FORM as F,
  COURSE_EXAMS,
  COURSE_TAB_COUNTS,
  EXAMS_EMPTY,
  EXAMS_LIST_HEADER as H,
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

export function CourseExamsShell({
  exams,
  counts,
  courseId = '1',
}: {
  exams: CourseFile[]
  counts: CourseTabCounts
  courseId?: string
}) {
  return (
    <CourseDetailPage
      title="امتحانات الكورس"
      counts={counts}
      courseId={courseId}
    >
      <div className="flex w-full shrink-0 flex-col gap-4 lg:flex-row lg:items-start">
        <ListCard title={H.title} reorder={H.reorder}>
          <DataTable
            columns={fileColumns(
              H.titleColumn,
              (r) => `/courses/${courseId}/exams/${r.id}`,
            )}
            rows={exams}
            rowKey={(r) => r.id}
            className="min-w-[800px]"
            empty={
              <EmptyState
                title={EXAMS_EMPTY.title}
                description={EXAMS_EMPTY.description}
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

/** فيجما frame: v3-course-exams (node 13:667) */
export default function CourseExams() {
  const { id = '1' } = useParams()
  return (
    <CourseExamsShell
      exams={COURSE_EXAMS}
      counts={COURSE_TAB_COUNTS}
      courseId={id}
    />
  )
}
