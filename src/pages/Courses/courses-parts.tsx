import { useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import {
  Download,
  FileText,
  ImageIcon,
  Pencil,
  Trash2,
  UploadCloud,
  ShieldCheck,
  ArrowUpDown,
  type LucideIcon,
} from 'lucide-react'
import { Page } from '@/components/layout/Page'
import { Card, CardHeader } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button, IconButton } from '@/components/ui/Button'
import { RowActions, Truncate, type Column } from '@/components/ui/Table'
import { RouteTabs } from '@/components/ui/Tabs'
import { TextField, TextArea } from '@/components/ui/Field'
import { CardSkeleton, ErrorState } from '@/components/ui/States'
import { cn } from '@/lib/cn'
import { formatDate } from '@/lib/format'
import { useAsync } from '@/lib/useAsync'
import { uploadUrl } from '@/api/uploads'
import { getCourseDetail, type ApiCourseDetail, type ApiContentItem } from '@/api/courses'
import type { CourseTabCounts } from '@/data/courses'

/*
 * أجزاء مشتركة بين شاشات الكورسات (مش صفحات — مفيش default export).
 */

/* ─────────────────── هيدر الكورس — فيجما node 2007:4077 ─────────────────── */

export function CourseHeader({ course }: { course: ApiCourseDetail }) {
  /*
   * لينك «تعديل الكورس» لازم يبقى نسبي للصفحة الحالية (محتوى/مذكرات/امتحانات)
   * مش مسار ثابت لصفحة الكورسات، وإلا المودال هيترسم فوق `CoursesList` وهيطلع
   * المستخدم بره الصفحة اللي هو فيها (شوف router.tsx: كل تاب من التابس دي
   * عنده child route اسمه `edit` بيرندر نفس `EditCourseModal`).
   */
  const { pathname } = useLocation()
  return (
    <Card className="w-full shrink-0 p-5">
      <div className="flex flex-col-reverse gap-4 md:flex-row md:items-start">
        {/* غلاف الكورس — بلوك بديل لحد ما يتوفر صورة، أو الصورة الحقيقية لو موجودة */}
        <div className="hidden h-[104px] w-[140px] shrink-0 items-center justify-center overflow-hidden rounded-panel border border-line bg-surface sm:flex">
          {course.coverFileId ? (
            <img
              src={uploadUrl(course.coverFileId)}
              alt={course.name}
              className="size-full object-cover"
            />
          ) : (
            <ImageIcon className="size-8 text-line" strokeWidth={1.5} />
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col items-start gap-2">
          <p className="text-right text-2xs text-muted">{course.path}</p>
          <h2 className="text-right text-xl font-extrabold text-ink">
            {course.name}
          </h2>
          {course.description ? (
            <p className="text-right text-base leading-relaxed text-muted">
              {course.description}
            </p>
          ) : null}

          {/* action-row — تعديل الكورس + شارة مدفوع + السعر في صف واحد تحت الوصف */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <span className="mono text-sm font-bold text-brand">
              {course.isFree ? 'مجاني' : `ج.م ${course.price} · سعر الاشتراك`}
            </span>
            <Badge tone={course.isFree ? 'success' : 'brand'}>
              {course.isFree ? 'مجاني' : 'مدفوع'}
            </Badge>
            <Link
              to={`${pathname}/edit`}
              className="inline-flex h-[38px] items-center gap-2 rounded-ctl border border-line bg-white px-4 text-sm font-bold text-ink transition-colors hover:bg-surface"
            >
              <Pencil className="size-3.5" strokeWidth={2.5} />
              تعديل الكورس
            </Link>
          </div>
        </div>
      </div>
    </Card>
  )
}

/* ────────────── تابس تفاصيل الكورس — فيجما node 13:343 ────────────── */

export function CourseTabs({
  courseId = '1',
  counts,
}: {
  courseId?: string
  counts: CourseTabCounts
}) {
  return (
    <RouteTabs
      items={[
        {
          label: 'الفيديوهات',
          to: `/courses/${courseId}/content`,
          count: counts.videos,
        },
        {
          label: 'المذكرات',
          to: `/courses/${courseId}/notes`,
          count: counts.notes,
        },
        {
          label: 'الملاحظات',
          to: `/courses/${courseId}/notes-tab`,
          count: counts.summaries,
        },
        {
          label: 'الامتحانات',
          to: `/courses/${courseId}/exams`,
          count: counts.exams,
        },
      ]}
    />
  )
}

/** عناوين التابس — بتتحدد من آخر جزء في المسار الحالي (شوف CourseDetailLayout) */
const TAB_TITLES: Record<string, string> = {
  content: 'محتوى الكورس',
  notes: 'مذكرات الكورس',
  'notes-tab': 'ملاحظات الكورس',
  exams: 'امتحانات الكورس',
}

export type CourseDetailOutletContext = {
  course: ApiCourseDetail
  /** بينده أي تغيير في التاب الحالي يأثّر على بيانات الكورس (زي tabCounts) */
  onDataChanged: () => void
}

/**
 * غلاف مشترك للتابس الأربعة — parent route واحد بيفضل mounted وانت بتنقّل
 * بين محتوى/مذكرات/ملاحظات/امتحانات (شوف router.tsx: التابس دي كلها children
 * تحت `courses/:id`). بيانات الكورس (الهيدر) بتتجاب هنا مرة واحدة بس، فمفيش
 * فلاش تحميل صفحة كاملة مع كل تبديل تاب زي ما كان لما كل تاب كان بيجيب
 * الكورس بنفسه من الصفر.
 */
export function CourseDetailLayout() {
  const { id: courseId = '' } = useParams()
  const { pathname } = useLocation()
  const [refreshKey, setRefreshKey] = useState(0)
  const { data: course, loading, error, reload } = useAsync(
    () => getCourseDetail(courseId),
    [courseId, refreshKey],
  )

  if (loading && !course) return <CardSkeleton />
  if (error || !course) {
    return <ErrorState description={error ?? 'تعذر العثور على الكورس'} onRetry={reload} />
  }

  const tabKey = Object.keys(TAB_TITLES).find((k) => pathname.includes(`/${k}`))
  const title = tabKey ? TAB_TITLES[tabKey] : course.name

  return (
    <Page
      title={title}
      outletContext={{
        course,
        onDataChanged: () => setRefreshKey((k) => k + 1),
      }}
    >
      <CourseHeader course={course} />
      <CourseTabs courseId={courseId} counts={course.tabCounts} />
    </Page>
  )
}

/* ─────────────── منطقة السحب والإفلات — فيجما node 2007:4108 ─────────────── */

export function UploadDrop({
  title,
  hint,
  icon: Icon = UploadCloud,
  height = 132,
}: {
  title: string
  hint: string
  icon?: LucideIcon
  height?: number
}) {
  return (
    <div
      className="flex w-full flex-col items-center justify-center gap-2 rounded-ctl border-2 border-dashed border-line bg-surface/60 px-4 text-center transition-colors hover:border-brand/40 hover:bg-brand-wash/50"
      style={{ minHeight: height }}
    >
      <Icon className="size-8 text-brand" strokeWidth={1.75} />
      <p className="text-base font-bold text-ink">{title}</p>
      <p className="text-2xs text-muted">{hint}</p>
    </div>
  )
}

/** شريط تنبيه الحماية — فيجما node 2007:4132 */
export function ProtectionNotice({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full items-center gap-2 rounded-ctl bg-brand-wash px-4 py-3">
      <ShieldCheck className="size-4 shrink-0 text-brand" strokeWidth={2} />
      <p className="min-w-0 flex-1 text-right text-2xs font-semibold leading-relaxed text-brand">
        {children}
      </p>
    </div>
  )
}

/** فاصل «أو» — فيجما node 2007:4114 */
export function OrDivider({ label = 'أو' }: { label?: string }) {
  return (
    <div className="flex w-full items-center gap-3">
      <div className="h-px flex-1 bg-line" />
      <span className="shrink-0 text-2xs font-bold text-muted">{label}</span>
      <div className="h-px flex-1 bg-line" />
    </div>
  )
}

/**
 * كارت نموذج الإضافة (فيديو / مذكرة / ملخص / امتحان).
 * فيجما: عمود يسار بعرض 380 جنب كارت القائمة.
 */
export function AddForm({
  title,
  children,
  submit,
  notice,
  onSubmit,
  disabled,
}: {
  title: string
  children: React.ReactNode
  submit: string
  notice?: string
  onSubmit?: () => void
  disabled?: boolean
}) {
  return (
    <Card className="flex w-full shrink-0 flex-col self-start lg:w-[380px]">
      <CardHeader title={title} />
      <div className="flex flex-col gap-4 p-5">
        {children}
        {notice ? <ProtectionNotice>{notice}</ProtectionNotice> : null}
        <Button full onClick={onSubmit} disabled={disabled}>
          {submit}
        </Button>
      </div>
    </Card>
  )
}

/** حقول العنوان + الوصف المتكررة في كل نماذج الإضافة */
export function TitleAndDescription({
  titleLabel,
  titlePlaceholder,
  descLabel,
  descPlaceholder,
  title,
  onTitleChange,
  description,
  onDescriptionChange,
}: {
  titleLabel: string
  titlePlaceholder: string
  descLabel: string
  descPlaceholder: string
  title: string
  onTitleChange: (value: string) => void
  description: string
  onDescriptionChange: (value: string) => void
}) {
  return (
    <>
      <TextField
        label={titleLabel}
        placeholder={titlePlaceholder}
        value={title}
        onChange={onTitleChange}
      />
      <TextArea
        label={descLabel}
        placeholder={descPlaceholder}
        rows={3}
        value={description}
        onChange={onDescriptionChange}
      />
    </>
  )
}

/* ──────────── كارت قائمة الملفات (مذكرات / امتحانات) ──────────── */

/** هيدر كارت القائمة مع زرار إعادة الترتيب — فيجما node 13:380 */
export function ListCard({
  title,
  reorder,
  children,
}: {
  title: string
  reorder?: string
  children: React.ReactNode
}) {
  return (
    <Card className="flex min-w-0 flex-1 flex-col overflow-hidden lg:self-start">
      <CardHeader
        title={title}
        actions={
          reorder ? (
            <button
              type="button"
              className="inline-flex h-[34px] items-center gap-1.5 rounded-ctl border border-line bg-white px-3 text-2xs font-bold text-muted transition-colors hover:bg-surface"
            >
              <ArrowUpDown className="size-3.5" strokeWidth={2.5} />
              {reorder}
            </button>
          ) : undefined
        }
      />
      {children}
    </Card>
  )
}

/**
 * أعمدة جدول ملفات الكورس (مذكرات / امتحانات) — فيجما node 13:388.
 * ⚠️ أول عمود = أول عمود من اليمين.
 */
export function fileColumns(
  titleHeader: string,
  editPath: (row: ApiContentItem) => string,
  onDelete: (row: ApiContentItem) => void,
): Column<ApiContentItem>[] {
  return [
    {
      key: 'index',
      header: '#',
      width: 40,
      render: (r) => <span className="num text-muted">{r.index}</span>,
    },
    {
      key: 'title',
      header: titleHeader,
      flex: true,
      render: (r) => (
        <div className="flex min-w-0 items-center gap-2">
          <FileText className="size-4 shrink-0 text-danger" strokeWidth={2} />
          <Truncate>
            <span className="font-semibold text-ink">{r.title}</span>
          </Truncate>
        </div>
      ),
    },
    {
      key: 'date',
      header: 'تاريخ الرفع',
      width: 120,
      render: (r) => <span className="num text-muted">{formatDate(r.createdAt)}</span>,
    },
    {
      key: 'actions',
      header: 'إجراءات',
      width: 120,
      align: 'center',
      render: (r) => (
        <RowActions>
          <IconButton
            icon={Pencil}
            label="تعديل"
            tone="brand"
            to={editPath(r)}
          />
          {r.fileId ? (
            <IconButton
              icon={Download}
              label="تحميل"
              onClick={() => window.open(uploadUrl(r.fileId!), '_blank')}
            />
          ) : null}
          <IconButton icon={Trash2} label="حذف" tone="danger" onClick={() => onDelete(r)} />
        </RowActions>
      ),
    },
  ]
}

/** صف معلومات ملف داخل مودالز التعديل — فيجما node 2007:4600 */
export function FilePlate({
  name,
  meta,
  action,
}: {
  name: string
  meta: string
  action: string
}) {
  return (
    <div className="flex w-full items-center gap-3 rounded-ctl bg-surface p-3">
      <button
        type="button"
        className="shrink-0 rounded-badge bg-white px-3 py-1.5 text-2xs font-bold text-brand transition-colors hover:bg-brand-tint"
      >
        {action}
      </button>
      <div className="flex min-w-0 flex-1 flex-col items-start gap-0.5">
        <span className="num truncate text-sm font-bold text-ink">{name}</span>
        <span className="text-2xs text-muted">{meta}</span>
      </div>
      <FileText className="size-5 shrink-0 text-brand" strokeWidth={2} />
    </div>
  )
}

/** صف الحالة داخل مودالز التعديل */
export function StatusLine({
  label,
  value,
  tone = 'success',
}: {
  label: string
  value: string
  tone?: 'success' | 'warning'
}) {
  return (
    <div className="flex w-full items-center justify-between gap-3">
      <span className="text-sm text-muted">{label}</span>
      <span
        className={cn(
          'text-sm font-bold',
          tone === 'success' ? 'text-success' : 'text-warning',
        )}
      >
        {value}
      </span>
    </div>
  )
}
