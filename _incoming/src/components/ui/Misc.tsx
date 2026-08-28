import { Link } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { cn } from '@/lib/cn'

/** بريدكرمب — فيجما node 2003:3912 (RTL: الجذر يمين) */
export function Breadcrumb({
  items,
}: {
  items: Array<{ label: string; to?: string }>
}) {
  return (
    <nav className="flex items-center gap-2 text-sm">
      {items.map((it, i) => (
        <span key={it.label} className="flex items-center gap-2">
          {i > 0 ? (
            <ChevronLeft className="size-3.5 shrink-0 text-muted" strokeWidth={2.5} />
          ) : null}
          {it.to ? (
            <Link
              to={it.to}
              className="font-semibold text-muted transition-colors hover:text-brand"
            >
              {it.label}
            </Link>
          ) : (
            <span className="font-bold text-ink">{it.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}

/** صف فلاتر — الزرار على الشمال والفلاتر على اليمين (فيجما node 13:18) */
export function FilterRow({
  action,
  children,
  className,
}: {
  action?: React.ReactNode
  children?: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex w-full flex-col-reverse items-start gap-4 md:flex-row md:items-center', className)}>
      <div className="w-full shrink-0 md:w-auto">{action}</div>
      <div className="hidden h-px min-w-0 flex-1 bg-line md:block" />
      <div className="flex w-full shrink-0 flex-wrap items-center gap-3 md:w-auto sm:gap-4">{children}</div>
    </div>
  )
}

/** ترقيم صفحات */
export function Pagination({
  page = 1,
  pages = 1,
  total,
  onPageChange,
}: {
  page?: number
  pages?: number
  total?: number
  /** لو اتمرر، الأزرار بتبقى شغالة فعليًا (شوف StudentsList لمثال حقيقي) */
  onPageChange?: (page: number) => void
}) {
  const list = Array.from({ length: Math.min(pages, 5) }, (_, i) => i + 1)
  return (
    <div className="flex flex-col items-center justify-between gap-4 border-t border-line p-4 sm:flex-row sm:px-5">
      <div className="flex flex-wrap items-center justify-center gap-1.5">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange?.(page - 1)}
          className="h-9 rounded-ctl border border-line bg-white px-3 text-sm font-bold text-muted transition-colors hover:bg-surface disabled:opacity-40"
        >
          السابق
        </button>
        {list.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange?.(p)}
            className={cn(
              'num size-9 rounded-ctl text-sm font-bold transition-colors',
              p === page
                ? 'bg-brand text-white'
                : 'border border-line bg-white text-muted hover:bg-surface',
            )}
          >
            {p}
          </button>
        ))}
        <button
          type="button"
          disabled={page >= pages}
          onClick={() => onPageChange?.(page + 1)}
          className="h-9 rounded-ctl border border-line bg-white px-3 text-sm font-bold text-muted transition-colors hover:bg-surface disabled:opacity-40"
        >
          التالي
        </button>
      </div>
      {typeof total === 'number' ? (
        <p className="text-sm text-muted">
          إجمالي <span className="mono font-bold text-ink">{total}</span> عنصر
        </p>
      ) : null}
    </div>
  )
}

/** صف بيانات مفتاح/قيمة — لصفحات التفاصيل */
export function InfoRow({
  label,
  children,
  className,
}: {
  label: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-4 border-b border-line py-3 last:border-b-0',
        className,
      )}
    >
      <div className="min-w-0 text-right text-base font-semibold text-ink">
        {children}
      </div>
      <span className="shrink-0 text-sm text-muted">{label}</span>
    </div>
  )
}

/** شبكة بيانات لصفحات التفاصيل */
export function InfoGrid({
  items,
  cols = 2,
}: {
  items: Array<{ label: string; value: React.ReactNode }>
  cols?: 2 | 3
}) {
  return (
    <div
      className={cn(
        'grid gap-y-4 gap-x-8',
        cols === 3 ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2',
      )}
    >
      {items.map((it) => (
        <InfoRow key={it.label} label={it.label}>
          {it.value}
        </InfoRow>
      ))}
    </div>
  )
}

/** أيقونة داخل دايرة ملوّنة — للاستخدام في الكروت والقوايم */
export function IconBubble({
  children,
  tone = 'brand',
  size = 40,
}: {
  children: React.ReactNode
  tone?: 'brand' | 'success' | 'warning' | 'danger' | 'neutral'
  size?: number
}) {
  const map = {
    brand: 'bg-brand-wash text-brand',
    success: 'bg-success-bg text-success',
    warning: 'bg-warning-bg text-warning',
    danger: 'bg-danger-bg text-danger',
    neutral: 'bg-surface text-muted',
  } as const
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full',
        map[tone],
      )}
      style={{ width: size, height: size }}
    >
      {children}
    </span>
  )
}

/** شريط تقدّم أفقي */
export function ProgressBar({
  value,
  tone = 'brand',
}: {
  value: number
  tone?: 'brand' | 'success' | 'warning' | 'danger'
}) {
  const map = {
    brand: 'bg-brand',
    success: 'bg-success',
    warning: 'bg-warning',
    danger: 'bg-danger',
  } as const
  return (
    <div className="h-2 w-full overflow-hidden rounded bg-surface">
      <div
        className={cn('h-full rounded', map[tone])}
        style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
      />
    </div>
  )
}
