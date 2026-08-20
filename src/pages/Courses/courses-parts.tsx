import { Link } from 'react-router-dom'
import {
  Download,
  FileText,
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
import { cn } from '@/lib/cn'
import {
  COURSE_DETAIL,
  type CourseFile,
  type CourseTabCounts,
} from '@/data/courses'

/*
 * أجزاء مشتركة بين شاشات الكورسات (مش صفحات — مفيش default export).
 */

/* ─────────────────── هيدر الكورس — فيجما node 2007:4077 ─────────────────── */

export function CourseHeader({ courseId = '1' }: { courseId?: string }) {
  return (
    <Card className="w-full shrink-0 p-5">
      <div className="flex items-start justify-between gap-6">
        <div className="flex shrink-0 flex-col items-end gap-3">
          <Link
            to={`/courses/${courseId}/edit`}
            className="inline-flex h-[38px] items-center gap-2 rounded-ctl border border-line bg-white px-4 text-sm font-bold text-ink transition-colors hover:bg-surface"
          >
            <Pencil className="size-3.5" strokeWidth={2.5} />
            {COURSE_DETAIL.editLabel}
          </Link>
          <span className="mono text-sm font-bold text-brand">
            {COURSE_DETAIL.price}
          </span>
        </div>

        <div className="flex min-w-0 flex-1 flex-col items-end gap-2">
          <p className="text-right text-2xs text-muted">{COURSE_DETAIL.path}</p>
          <div className="flex items-center gap-2">
            <h2 className="text-right text-xl font-extrabold text-ink">
              {COURSE_DETAIL.name}
            </h2>
            <Badge tone="brand">{COURSE_DETAIL.badge}</Badge>
          </div>
          <p className="text-right text-base leading-relaxed text-muted">
            {COURSE_DETAIL.description}
          </p>
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

/** غلاف موحّد لشاشات تفاصيل الكورس: هيدر + تابس + محتوى */
export function CourseDetailPage({
  title,
  counts,
  courseId = '1',
  children,
}: {
  title: string
  counts: CourseTabCounts
  courseId?: string
  children: React.ReactNode
}) {
  return (
    <Page title={title}>
      <CourseHeader courseId={courseId} />
      <CourseTabs courseId={courseId} counts={counts} />
      {children}
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
}: {
  title: string
  children: React.ReactNode
  submit: string
  notice?: string
}) {
  return (
    <Card className="flex w-[380px] shrink-0 flex-col self-start">
      <CardHeader title={title} />
      <div className="flex flex-col gap-4 p-5">
        {children}
        {notice ? <ProtectionNotice>{notice}</ProtectionNotice> : null}
        <Button full>{submit}</Button>
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
}: {
  titleLabel: string
  titlePlaceholder: string
  descLabel: string
  descPlaceholder: string
}) {
  return (
    <>
      <TextField label={titleLabel} placeholder={titlePlaceholder} />
      <TextArea label={descLabel} placeholder={descPlaceholder} rows={3} />
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
    <Card className="flex min-w-0 flex-1 flex-col self-start overflow-hidden">
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
  editPath: (row: CourseFile) => string,
): Column<CourseFile>[] {
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
      key: 'type',
      header: 'النوع',
      width: 70,
      render: (r) => <Badge tone="danger">{r.type}</Badge>,
    },
    {
      key: 'size',
      header: 'الحجم',
      width: 90,
      render: (r) => <span className="num text-muted">{r.size}</span>,
    },
    {
      key: 'date',
      header: 'تاريخ الرفع',
      width: 120,
      render: (r) => <span className="num text-muted">{r.date}</span>,
    },
    {
      key: 'downloads',
      header: 'التحميلات',
      width: 110,
      render: (r) => <span className="mono text-muted">{r.downloads}</span>,
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
          <IconButton icon={Download} label="تحميل" />
          <IconButton icon={Trash2} label="حذف" tone="danger" />
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
      <div className="flex min-w-0 flex-1 flex-col items-end gap-0.5">
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
