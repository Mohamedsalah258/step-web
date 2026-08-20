import { ChevronDown, Search, Calendar } from 'lucide-react'
import { Switch } from './Switch'
import { cn } from '@/lib/cn'

/**
 * حقل بحث — فيجما node 13:29: h42، radius 8، أيقونة search 16px على اليسار.
 * RTL: الأيقونة في فيجما x=16 (يسار) → تبقى آخر عنصر في الـ DOM.
 * ملاحظة: فيجما بيحطها يسار، فالنص العربي بيبدأ من اليمين.
 */
export function SearchField({
  placeholder = 'بحث...',
  className,
  width,
}: {
  placeholder?: string
  className?: string
  width?: number
}) {
  return (
    <div
      className={cn(
        'flex h-[42px] items-center gap-2.5 rounded-ctl border border-line bg-white px-4',
        width ? 'w-full shrink-0 sm:w-auto' : 'min-w-0 flex-1',
        className,
      )}
      style={width ? { maxWidth: width } : undefined}
    >
      <input
        type="search"
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent text-right text-base text-ink outline-none placeholder:text-muted"
      />
      <Search className="size-4 shrink-0 text-muted" strokeWidth={2} />
    </div>
  )
}

/** دروب داون تصفية — فيجما node 13:23: السهم يسار والعنوان يمينه */
export function FilterSelect({
  label,
  options = [],
  className,
  width,
}: {
  label: string
  options?: string[]
  className?: string
  width?: number
}) {
  return (
    <div
      className={cn(
        'relative flex h-[42px] w-full shrink-0 items-center rounded-ctl border border-line bg-white sm:w-auto',
        className,
      )}
      style={width ? { maxWidth: width } : undefined}
    >
      <select
        defaultValue=""
        className="h-full w-full cursor-pointer appearance-none bg-transparent ps-4 pe-9 text-right text-base text-ink outline-none"
      >
        <option value="">{label}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute left-4 size-3 text-muted"
        strokeWidth={2.5}
      />
    </div>
  )
}

/** منتقي تاريخ — فيجما node 29:1545: النص يمين وأيقونة التقويم يسار */
export function DateField({
  label = 'التاريخ',
  className,
  width,
}: {
  label?: string
  className?: string
  width?: number
}) {
  return (
    <div
      className={cn(
        'relative flex h-[42px] w-full shrink-0 items-center rounded-ctl border border-line bg-white px-4 sm:w-auto',
        className,
      )}
      style={width ? { maxWidth: width } : undefined}
    >
      <span className="min-w-0 flex-1 text-right text-base text-muted">
        {label}
      </span>
      <Calendar className="size-4 shrink-0 text-muted" strokeWidth={2} />
    </div>
  )
}

/** حقل نص بعنوان — للفورمات */
export function TextField({
  label,
  placeholder,
  value,
  hint,
  type = 'text',
  className,
  mono,
}: {
  label: string
  placeholder?: string
  value?: string
  hint?: string
  type?: string
  className?: string
  mono?: boolean
}) {
  return (
    <label className={cn('flex flex-col gap-1.5', className)}>
      <span className="text-right text-sm font-bold text-ink">{label}</span>
      <input
        type={type}
        defaultValue={value}
        placeholder={placeholder}
        className={cn(
          'h-[42px] w-full rounded-ctl border border-line bg-white px-4 text-right text-base text-ink outline-none transition-colors placeholder:text-muted focus:border-brand',
          mono && 'num text-left',
        )}
      />
      {hint ? (
        <span className="text-right text-2xs text-muted">{hint}</span>
      ) : null}
    </label>
  )
}

export function SelectField({
  label,
  options,
  value,
  className,
}: {
  label: string
  options: string[]
  value?: string
  className?: string
}) {
  return (
    <label className={cn('flex flex-col gap-1.5', className)}>
      <span className="text-right text-sm font-bold text-ink">{label}</span>
      <div className="relative">
        <select
          defaultValue={value}
          className="h-[42px] w-full cursor-pointer appearance-none rounded-ctl border border-line bg-white ps-4 pe-9 text-right text-base text-ink outline-none transition-colors focus:border-brand"
        >
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute left-4 top-1/2 size-3 -translate-y-1/2 text-muted"
          strokeWidth={2.5}
        />
      </div>
    </label>
  )
}

export function TextArea({
  label,
  placeholder,
  value,
  rows = 4,
  className,
}: {
  label: string
  placeholder?: string
  value?: string
  rows?: number
  className?: string
}) {
  return (
    <label className={cn('flex flex-col gap-1.5', className)}>
      <span className="text-right text-sm font-bold text-ink">{label}</span>
      <textarea
        rows={rows}
        defaultValue={value}
        placeholder={placeholder}
        className="w-full resize-y rounded-ctl border border-line bg-white px-4 py-3 text-right text-base leading-relaxed text-ink outline-none transition-colors placeholder:text-muted focus:border-brand"
      />
    </label>
  )
}

/** صف سويتش بعنوان ووصف — RTL: النص يمين والسويتش شمال */
export function ToggleRow({
  label,
  hint,
  defaultOn,
  className,
}: {
  label: string
  hint?: string
  defaultOn?: boolean
  className?: string
}) {
  return (
    <div
      className={cn('flex items-center justify-between gap-4 py-2', className)}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-0.5 text-right">
        <span className="text-base font-bold text-ink">{label}</span>
        {hint ? <span className="text-2xs text-muted">{hint}</span> : null}
      </div>
      <Switch defaultOn={defaultOn} />
    </div>
  )
}

/** شيك بوكس بعنوان */
export function Checkbox({
  label,
  defaultOn,
}: {
  label: string
  defaultOn?: boolean
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5">
      <input
        type="checkbox"
        defaultChecked={defaultOn}
        className="size-[18px] shrink-0 cursor-pointer accent-brand"
      />
      <span className="text-base text-ink">{label}</span>
    </label>
  )
}
