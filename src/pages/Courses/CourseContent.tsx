import { Play, Pencil, Trash2 } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { TextField } from '@/components/ui/Field'
import { EmptyState } from '@/components/ui/States'
import { ButtonLink } from '@/components/ui/Button'
import {
  ADD_VIDEO_FORM as F,
  COURSE_TAB_COUNTS,
  COURSE_TAB_COUNTS_EMPTY,
  COURSE_VIDEOS,
  VIDEOS_EMPTY,
  VIDEOS_LIST_HEADER,
  type CourseTabCounts,
  type CourseVideo,
} from '@/data/courses'
import {
  AddForm,
  CourseDetailPage,
  ListCard,
  OrDivider,
  TitleAndDescription,
  UploadDrop,
} from './courses-parts'

/**
 * صف فيديو — فيجما node 2007:4152.
 * RTL: أيقونة التشغيل + العنوان يمين، المدة والتاريخ في النص، وأزرار
 * التعديل/الحذف شمال (أول عنصر في الـ DOM = يمين).
 */
function VideoRow({ v, courseId }: { v: CourseVideo; courseId: string }) {
  return (
    <div className="flex items-center gap-3 border-b border-line px-5 py-3.5 last:border-b-0 hover:bg-surface/60">
      <Play className="size-4 shrink-0 text-brand" strokeWidth={2} />
      <span className="min-w-0 flex-1 truncate text-right text-sm font-semibold text-ink">
        {v.title}
      </span>
      <span className="num shrink-0 text-sm font-bold text-ink">
        {v.duration}
      </span>
      <span className="num shrink-0 text-sm text-muted">{v.date}</span>
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
          className="inline-flex size-8 items-center justify-center rounded-badge border border-line bg-white text-danger transition-colors hover:bg-danger-bg"
        >
          <Trash2 className="size-4" strokeWidth={2} />
        </button>
      </div>
    </div>
  )
}

export function CourseContentShell({
  videos,
  counts,
  courseId = '1',
}: {
  videos: CourseVideo[]
  counts: CourseTabCounts
  courseId?: string
}) {
  return (
    <CourseDetailPage
      title="محتوى الكورس"
      counts={counts}
      courseId={courseId}
    >
      {/* RTL: كارت القائمة يمين ونموذج الإضافة شمال */}
      <div className="flex w-full shrink-0 flex-col gap-4 lg:flex-row lg:items-start">
        <ListCard
          title={VIDEOS_LIST_HEADER.title}
          reorder={VIDEOS_LIST_HEADER.reorder}
        >
          {videos.length === 0 ? (
            <EmptyState
              title={VIDEOS_EMPTY.title}
              description={VIDEOS_EMPTY.description}
            />
          ) : (
            <div className="flex flex-col">
              {videos.map((v) => (
                <VideoRow key={v.id} v={v} courseId={courseId} />
              ))}
            </div>
          )}
        </ListCard>

        <AddForm title={F.title} submit={F.submit} notice={F.notice}>
          <UploadDrop title={F.uploadTitle} hint={F.uploadHint} />
          <OrDivider label={F.divider} />
          <TextField label={F.urlLabel} placeholder={F.urlPlaceholder} mono />
          <TitleAndDescription
            titleLabel={F.titleLabel}
            titlePlaceholder={F.titlePlaceholder}
            descLabel={F.descLabel}
            descPlaceholder={F.descPlaceholder}
          />
        </AddForm>
      </div>

      {videos.length === 0 ? (
        <div className="flex justify-end">
          <ButtonLink to={`/courses/${courseId}/content`} variant="secondary">
            {VIDEOS_EMPTY.cta}
          </ButtonLink>
        </div>
      ) : null}
    </CourseDetailPage>
  )
}

/** فيجما frame: v3-courses-content (node 2007:4062) */
export default function CourseContent() {
  const { id = '1' } = useParams()
  return (
    <CourseContentShell
      videos={COURSE_VIDEOS}
      counts={COURSE_TAB_COUNTS}
      courseId={id}
    />
  )
}

export { COURSE_TAB_COUNTS_EMPTY }
