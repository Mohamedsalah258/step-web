import { Download, FileText } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card, CardHeader } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/States'
import {
  ADD_SUMMARY_FORM as F,
  COURSE_SUMMARIES,
  COURSE_TAB_COUNTS,
  SUMMARIES_EMPTY,
  SUMMARIES_LIST_TITLE,
  SUMMARY_CARD_ACTIONS as A,
  type CourseSummary,
  type CourseTabCounts,
} from '@/data/courses'
import {
  AddForm,
  CourseDetailPage,
  TitleAndDescription,
  UploadDrop,
} from './courses-parts'

/** كارت ملخص — فيجما node 13:576 */
function SummaryCard({ s, courseId }: { s: CourseSummary; courseId: string }) {
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
          className="rounded-badge bg-danger-bg px-3 py-1.5 text-2xs font-bold text-danger transition-opacity hover:opacity-80"
        >
          {A.delete}
        </button>
        <button
          type="button"
          aria-label={A.download}
          className="inline-flex size-8 items-center justify-center rounded-badge border border-line bg-white text-muted transition-colors hover:bg-surface"
        >
          <Download className="size-4" strokeWidth={2} />
        </button>
      </div>

      <div className="flex min-w-0 flex-1 flex-col items-end gap-1">
        <p className="w-full truncate text-right text-base font-bold text-ink">
          {s.title}
        </p>
        <div className="flex items-center gap-3 text-2xs text-muted">
          <span className="num">{s.date}</span>
          <span className="mono">{s.downloads}</span>
          <span className="mono">{s.meta}</span>
        </div>
      </div>

      <FileText className="size-5 shrink-0 text-brand" strokeWidth={2} />
    </div>
  )
}

export function CourseNotesTabShell({
  summaries,
  counts,
  courseId = '1',
}: {
  summaries: CourseSummary[]
  counts: CourseTabCounts
  courseId?: string
}) {
  return (
    <CourseDetailPage
      title="ملاحظات الكورس"
      counts={counts}
      courseId={courseId}
    >
      <div className="flex w-full shrink-0 items-start gap-4">
        <Card className="flex min-w-0 flex-1 flex-col self-start overflow-hidden">
          <CardHeader title={SUMMARIES_LIST_TITLE} />
          {summaries.length === 0 ? (
            <EmptyState
              title={SUMMARIES_EMPTY.title}
              description={SUMMARIES_EMPTY.description}
            />
          ) : (
            <div className="flex flex-col">
              {summaries.map((s) => (
                <SummaryCard key={s.id} s={s} courseId={courseId} />
              ))}
            </div>
          )}
        </Card>

        <AddForm title={F.title} submit={F.submit}>
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

/** فيجما frame: v3-course-notes-tab (node 13:506) */
export default function CourseNotesTab() {
  return (
    <CourseNotesTabShell
      summaries={COURSE_SUMMARIES}
      counts={COURSE_TAB_COUNTS}
    />
  )
}
