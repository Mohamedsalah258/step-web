import { Inbox, AlertTriangle, RotateCcw, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/cn'

/**
 * الحالة الفارغة — فيجما node 29:1552:
 * دايرة 96px bg #f0f4ff radius48، أيقونة 44px، gap24،
 * عنوان 18px extrabold، وصف 14px muted، عرض 520.
 */
export function EmptyState({
  title,
  description,
  icon: Icon = Inbox,
  action,
  className,
}: {
  title: string
  description?: string
  icon?: LucideIcon
  action?: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-16 text-center',
        className,
      )}
    >
      <div className="flex w-[520px] max-w-full flex-col items-center gap-6">
        <div className="flex size-24 shrink-0 items-center justify-center rounded-full bg-brand-wash">
          <Icon className="size-11 text-brand" strokeWidth={1.75} />
        </div>
        <div className="flex flex-col items-center gap-2">
          <p className="text-[18px] font-extrabold text-ink">{title}</p>
          {description ? (
            <p className="text-base font-normal leading-relaxed text-muted">
              {description}
            </p>
          ) : null}
        </div>
        {action}
      </div>
    </div>
  )
}

/** حالة الخطأ — فيجما v3-state-error */
export function ErrorState({
  title = 'حدث خطأ غير متوقع',
  description = 'تعذّر تحميل البيانات. تأكد من الاتصال وحاول مرة أخرى.',
  onRetry,
  className,
}: {
  title?: string
  description?: string
  onRetry?: () => void
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-16 text-center',
        className,
      )}
    >
      <div className="flex w-[520px] max-w-full flex-col items-center gap-6">
        <div className="flex size-24 shrink-0 items-center justify-center rounded-full bg-danger-bg">
          <AlertTriangle className="size-11 text-danger" strokeWidth={1.75} />
        </div>
        <div className="flex flex-col items-center gap-2">
          <p className="text-[18px] font-extrabold text-ink">{title}</p>
          <p className="text-base font-normal leading-relaxed text-muted">
            {description}
          </p>
        </div>
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex h-11 items-center gap-2 rounded-ctl bg-brand px-6 text-base font-bold text-white transition-colors hover:bg-brand/90"
        >
          <RotateCcw className="size-4" strokeWidth={2.5} />
          إعادة المحاولة
        </button>
      </div>
    </div>
  )
}

/** سكيلتون صف جدول — فيجما v3-state-skeleton */
export function TableSkeleton({
  rows = 8,
  cols = 5,
}: {
  rows?: number
  cols?: number
}) {
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-4 bg-surface px-5 py-3">
        {Array.from({ length: cols }).map((_, i) => (
          <div
            key={i}
            className={cn('skeleton h-3.5', i === 2 ? 'flex-1' : 'w-[120px]')}
          />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div
          key={r}
          className="flex items-center gap-4 border-b border-line px-5 py-4 last:border-b-0"
        >
          {Array.from({ length: cols }).map((_, c) => (
            <div
              key={c}
              className={cn(
                'skeleton h-3.5',
                c === 2 ? 'flex-1' : 'w-[120px]',
                c === 0 && 'h-6 w-[80px] rounded-badge',
              )}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex h-[140px] flex-col gap-3 rounded-card border border-line bg-white p-4 shadow-card',
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <div className="skeleton size-4 rounded" />
        <div className="skeleton h-3.5 w-[100px]" />
      </div>
      <div className="skeleton h-7 w-[80px] self-end" />
      <div className="skeleton h-3 w-[70px] self-end" />
    </div>
  )
}
