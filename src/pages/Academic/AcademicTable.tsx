import { Link, useNavigate } from 'react-router-dom'
import { Page } from '@/components/layout/Page'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { DataTable, RowActions, type Column } from '@/components/ui/Table'
import { Breadcrumb } from '@/components/ui/Misc'
import { cn } from '@/lib/cn'

/**
 * القطع المشتركة بين شاشات الهيكل الأكاديمي الخمس
 * (فيجما: 29:379 / 29:504 / 29:645 / 29:786 / 29:972).
 *
 * header-bar في الديزاين = صف واحد: مجموعة الأزرار على **الشمال**
 * ومجموعة البريدكرمب + العنوان على **اليمين**.
 * RTL: أول عنصر في الـ DOM يظهر يمين ⇒ البريدكرمب أولًا.
 */

export type Crumb = { label: string; to?: string }

/**
 * يبني رابط لصفحة أكاديمية تانية مع تمرير سياق كل الآباء (universityId,
 * collegeId, ...) عبر query params — عشان روابط "العودة" والبريدكرمب في
 * الصفحة الجاية تقدر ترجع بنفس النطاق (مش كل العناصر بدون فلترة).
 * أي قيمة undefined بيتم تجاهلها من الرابط الناتج.
 */
export function academicPath(base: string, params: Record<string, string | undefined>): string {
  const qs = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value) qs.set(key, value)
  }
  const query = qs.toString()
  return query ? `${base}?${query}` : base
}

export function AcademicHeader({
  heading,
  breadcrumb,
  actions,
}: {
  heading: string
  breadcrumb: Crumb[]
  actions?: React.ReactNode
}) {
  return (
    <div className="flex w-full shrink-0 flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-4">
      {/* breadcrumb-group — gap4، العنوان 20px extrabold */}
      <div className="flex min-w-0 flex-col items-start gap-1">
        <Breadcrumb items={breadcrumb} />
        <h2 className="whitespace-nowrap text-xl font-extrabold text-ink">
          {heading}
        </h2>
      </div>
      {/* action-group — gap12 */}
      {actions ? (
        <div className="flex w-full shrink-0 flex-wrap items-center gap-3 md:w-auto">
          {actions}
        </div>
      ) : null}
    </div>
  )
}

/**
 * شاشة قائمة أكاديمية كاملة: top-bar + header-bar + كارت الجدول.
 * الأعمدة والبيانات تفضل مسؤولية كل شاشة (أمانة للفريم بتاعها).
 */
export function AcademicListScreen<T>({
  pageTitle,
  heading,
  breadcrumb,
  actions,
  columns,
  rows,
  rowKey,
  tableClassName,
  children,
  outletContext,
  empty,
}: {
  pageTitle: string
  heading: string
  breadcrumb: Crumb[]
  actions?: React.ReactNode
  columns: Column<T>[]
  rows: T[]
  rowKey: (row: T, index: number) => string
  /** حد أدنى لعرض الجدول عشان يعمل scroll أفقي بدل ما يتزنق على الموبايل */
  tableClassName?: string
  /** أقسام إضافية بعد كارت الجدول (زي linked-courses في شاشة الترمات) */
  children?: React.ReactNode
  /** بيتمرر لمودالز الإضافة المتفرّعة (زي onDataChanged بعد نجاح الإضافة) */
  outletContext?: unknown
  empty?: React.ReactNode
}) {
  return (
    <Page title={pageTitle} outletContext={outletContext}>
      <AcademicHeader
        heading={heading}
        breadcrumb={breadcrumb}
        actions={actions}
      />
      <Card className="w-full shrink-0 overflow-hidden">
        <DataTable
          columns={columns}
          rows={rows}
          rowKey={rowKey}
          className={tableClassName}
          empty={empty}
        />
      </Card>
      {children}
    </Page>
  )
}

/** خلية رقم مسلسل / عدّاد — Spline Sans Mono 13px */
export function NumCell({
  children,
  tone = 'ink',
}: {
  children: React.ReactNode
  tone?: 'ink' | 'muted'
}) {
  return (
    <span className={cn('mono', tone === 'muted' ? 'text-muted' : 'text-ink')}>
      {children}
    </span>
  )
}

/** اسم العنصر كلينك — Cairo bold 14px brand مع underline (فيجما 29:407) */
export function NameLink({
  to,
  children,
}: {
  to: string
  children: React.ReactNode
}) {
  return (
    <Link
      to={to}
      className="text-base font-bold text-brand underline decoration-solid transition-colors hover:text-brand/80"
    >
      {children}
    </Link>
  )
}

/**
 * زرار بشكل شارة داخل الجدول — px12 py6 radius6، 12px bold
 * (فيجما 29:676 «حذف» danger-bg · 29:678 «تعديل» brand-tint).
 */
export function PillButton({
  children,
  tone,
  onClick,
}: {
  children: React.ReactNode
  tone: 'brand' | 'danger'
  onClick?: () => void
}) {
  return (
    <button type="button" onClick={onClick} className="shrink-0">
      <Badge tone={tone} className="py-1.5 transition-opacity hover:opacity-80">
        {children}
      </Badge>
    </button>
  )
}

/** عمود الإجراءات في شاشات التخصصات/المراحل/الترمات — RTL: تعديل يمين وحذف شمال */
export function EditDeletePills({ editTo, deleteTo }: { editTo: string; deleteTo: string }) {
  const navigate = useNavigate()
  return (
    <RowActions>
      <PillButton tone="brand" onClick={() => navigate(editTo)}>
        تعديل
      </PillButton>
      <PillButton tone="danger" onClick={() => navigate(deleteTo)}>
        حذف
      </PillButton>
    </RowActions>
  )
}
