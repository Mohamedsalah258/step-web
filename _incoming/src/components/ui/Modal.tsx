import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { X } from 'lucide-react'
import { Switch } from './Switch'
import { cn } from '@/lib/cn'

type Props = {
  title: string
  children: React.ReactNode
  /** أزرار الأسفل — عادة إلغاء + تأكيد */
  actions?: React.ReactNode
  /** عرض الكارت — 520 هو الافتراضي في الديزاين */
  width?: number
  /** لو مش مبعوت، الإغلاق بيرجع للصفحة السابقة */
  onClose?: () => void
  className?: string
}

/**
 * فيجما node 2003:4036 — modal-card:
 * bg أبيض، radius 16، p32، gap24، shadow 0 12px 16px rgba(0,0,0,.15)
 * الأوفرلاي بيغطي الشاشة كلها (1440x900) بما فيها السايدبار.
 */
export function Modal({
  title,
  children,
  actions,
  width = 520,
  onClose,
  className,
}: Props) {
  const navigate = useNavigate()
  const close = onClose ?? (() => navigate(-1))

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  return (
    <div
      className="fixed inset-0 z-50 flex animate-fade-in items-center justify-center bg-navy/40 p-4"
      onClick={close}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: width }}
        className={cn(
          'flex max-h-[calc(100vh-32px)] w-[calc(100%-32px)] animate-scale-in flex-col gap-4 overflow-y-auto rounded-panel bg-white p-5 shadow-modal md:max-h-[calc(100vh-48px)] md:gap-6 md:p-8',
          className,
        )}
      >
        {/* modal-header — RTL: العنوان يمين وزرار الإغلاق شمال */}
        <div className="flex shrink-0 items-center justify-between gap-4">
          <h2 className="whitespace-nowrap text-[18px] font-extrabold text-ink">
            {title}
          </h2>
          <button
            type="button"
            onClick={close}
            aria-label="إغلاق"
            className="flex size-8 shrink-0 items-center justify-center rounded-full bg-surface text-ink transition-colors hover:bg-line"
          >
            <X className="size-3" strokeWidth={3} />
          </button>
        </div>

        <div className="h-px w-full shrink-0 bg-line" />

        {/* form-fields */}
        <div className="flex flex-col gap-5">{children}</div>

        {actions ? (
          <>
            <div className="h-px w-full shrink-0 bg-line" />
            {/* فيجما node 2003:4056: «إلغاء» على الشمال و«تأكيد» على اليمين.
                flex-row-reverse بيرجّع الترتيب لـ LTR جوّه صفحة RTL،
                فبنمرّر (إلغاء ثم تأكيد) وتطلع في مكانها الصح.
                على الموبايل (< sm) الأزرار بتتكوّم عمودي، وflex-col-reverse
                بيخلّي زرار التأكيد فوق (أول حاجة الإصبع يوصلها) والإلغاء تحته. */}
            <div className="flex shrink-0 flex-col-reverse gap-3 sm:flex-row-reverse">
              {actions}
            </div>
          </>
        ) : null}
      </div>
    </div>
  )
}

/** زرار مودال — flex-1، h44، radius8 (فيجما 2003:4057 / 2003:4059) */
export function ModalButton({
  children,
  variant = 'submit',
  onClick,
  tone,
  disabled,
}: {
  children: React.ReactNode
  variant?: 'submit' | 'cancel'
  onClick?: () => void
  tone?: 'danger' | 'success'
  disabled?: boolean
}) {
  const navigate = useNavigate()
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick ?? (() => navigate(-1))}
      className={cn(
        'flex h-11 min-w-0 flex-1 items-center justify-center rounded-ctl px-6 text-base font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-50',
        variant === 'cancel' &&
          'border border-line bg-white text-muted hover:bg-surface',
        variant === 'submit' &&
          !tone &&
          'bg-brand text-white hover:bg-brand/90',
        variant === 'submit' && tone === 'danger' && 'bg-danger text-white hover:bg-danger/90',
        variant === 'submit' && tone === 'success' && 'bg-success text-white hover:bg-success/90',
      )}
    >
      {children}
    </button>
  )
}

/** صف حالة داخل مودال (فيجما 2003:4049) */
export function ModalToggleRow({
  label,
  value,
  tone = 'success',
  defaultOn = true,
}: {
  label: string
  value: string
  tone?: 'success' | 'danger'
  defaultOn?: boolean
}) {
  return (
    <div className="flex w-full items-center justify-between py-2">
      {/* RTL: التسمية يمين والسويتش شمال (فيجما: toggle x=0، النص يمين) */}
      <div className="flex shrink-0 items-center gap-2 text-sm font-bold">
        <span className="text-ink">{label}</span>
        <span className={tone === 'success' ? 'text-success' : 'text-danger'}>
          {value}
        </span>
      </div>
      <Switch defaultOn={defaultOn} />
    </div>
  )
}

/** حقل مودال — h44 p12 radius8، label 13px bold، gap6 (فيجما 2003:4045) */
export function ModalField({
  label,
  placeholder,
  value,
  type = 'text',
  hint,
  mono,
}: {
  label: string
  placeholder?: string
  value?: string
  type?: string
  hint?: string
  mono?: boolean
}) {
  return (
    <label className="flex w-full flex-col items-start gap-1.5">
      <span className="text-sm font-bold text-ink">{label}</span>
      <input
        type={type}
        defaultValue={value}
        placeholder={placeholder}
        className={cn(
          'h-11 w-full rounded-ctl border border-line bg-white p-3 text-right text-base text-ink outline-none transition-colors placeholder:text-muted focus:border-brand',
          mono && 'num text-left',
        )}
      />
      {hint ? <span className="text-2xs text-muted">{hint}</span> : null}
    </label>
  )
}

export function ModalSelect({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: string[]
  value?: string
  /** لو اتمرر، الحقل بيبقى controlled */
  onChange?: (value: string) => void
}) {
  return (
    <label className="flex w-full flex-col items-start gap-1.5">
      <span className="text-sm font-bold text-ink">{label}</span>
      <select
        value={onChange ? value : undefined}
        defaultValue={onChange ? undefined : value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        className="h-11 w-full rounded-ctl border border-line bg-white p-3 text-right text-base text-ink outline-none transition-colors focus:border-brand"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  )
}

export function ModalTextArea({
  label,
  placeholder,
  value,
  rows = 4,
}: {
  label: string
  placeholder?: string
  value?: string
  rows?: number
}) {
  return (
    <label className="flex w-full flex-col items-start gap-1.5">
      <span className="text-sm font-bold text-ink">{label}</span>
      <textarea
        rows={rows}
        defaultValue={value}
        placeholder={placeholder}
        className="w-full resize-y rounded-ctl border border-line bg-white p-3 text-right text-base leading-relaxed text-ink outline-none transition-colors placeholder:text-muted focus:border-brand"
      />
    </label>
  )
}

/** بلوك تحذير/تنبيه داخل مودالز التأكيد */
export function ModalNotice({
  tone = 'warning',
  children,
}: {
  tone?: 'warning' | 'danger' | 'success' | 'brand'
  children: React.ReactNode
}) {
  const map = {
    warning: 'bg-warning-bg text-warning',
    danger: 'bg-danger-bg text-danger',
    success: 'bg-success-bg text-success',
    brand: 'bg-brand-wash text-brand',
  } as const
  return (
    <div
      className={cn(
        'rounded-ctl px-4 py-3 text-right text-sm font-semibold leading-relaxed',
        map[tone],
      )}
    >
      {children}
    </div>
  )
}
