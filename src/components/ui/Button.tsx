import { Link } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/cn'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success'
type Size = 'md' | 'sm'

type BaseProps = {
  children?: React.ReactNode
  variant?: Variant
  size?: Size
  icon?: LucideIcon
  className?: string
  full?: boolean
}

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-brand text-white hover:bg-brand/90 active:bg-brand/95',
  secondary:
    'bg-white text-ink border border-line hover:bg-surface active:bg-surface',
  ghost: 'bg-transparent text-muted hover:bg-surface hover:text-ink',
  danger: 'bg-danger text-white hover:bg-danger/90',
  success: 'bg-success text-white hover:bg-success/90',
}

const SIZES: Record<Size, string> = {
  md: 'h-[46px] px-5 text-base gap-2.5',
  sm: 'h-[38px] px-4 text-sm gap-2',
}

function classesFor({ variant = 'primary', size = 'md', full, className }: BaseProps) {
  return cn(
    'inline-flex shrink-0 items-center justify-center rounded-ctl font-bold leading-none transition-colors disabled:cursor-not-allowed disabled:opacity-50',
    VARIANTS[variant],
    SIZES[size],
    full && 'w-full',
    className,
  )
}

export function Button({
  children,
  icon: Icon,
  onClick,
  type = 'button',
  disabled,
  ...rest
}: BaseProps & {
  onClick?: () => void
  type?: 'button' | 'submit'
  disabled?: boolean
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classesFor({ children, ...rest })}
    >
      {Icon ? <Icon className="size-[14px] shrink-0" strokeWidth={2.5} /> : null}
      {children ? <span>{children}</span> : null}
    </button>
  )
}

export function ButtonLink({
  children,
  icon: Icon,
  to,
  ...rest
}: BaseProps & { to: string }) {
  return (
    <Link to={to} className={classesFor({ children, ...rest })}>
      {Icon ? <Icon className="size-[14px] shrink-0" strokeWidth={2.5} /> : null}
      {children ? <span>{children}</span> : null}
    </Link>
  )
}

/** زرار أيقونة مربّع للجداول */
export function IconButton({
  icon: Icon,
  label,
  onClick,
  tone = 'default',
  to,
}: {
  icon: LucideIcon
  label: string
  onClick?: () => void
  tone?: 'default' | 'danger' | 'brand'
  to?: string
}) {
  const cls = cn(
    'inline-flex size-8 items-center justify-center rounded-badge border border-line bg-white transition-colors',
    tone === 'danger' && 'text-danger hover:bg-danger-bg hover:border-danger/30',
    tone === 'brand' && 'text-brand hover:bg-brand-tint hover:border-brand/30',
    tone === 'default' && 'text-muted hover:bg-surface hover:text-ink',
  )
  const inner = <Icon className="size-4" strokeWidth={2} />
  if (to)
    return (
      <Link to={to} aria-label={label} title={label} className={cls}>
        {inner}
      </Link>
    )
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={cls}
    >
      {inner}
    </button>
  )
}
