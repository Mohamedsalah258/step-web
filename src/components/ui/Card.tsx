import { cn } from '@/lib/cn'

type CardProps = {
  children: React.ReactNode
  className?: string
  /** panel = radius 16 (كروت الشارتس والجداول)، card = radius 12 (كروت KPI) */
  variant?: 'panel' | 'card'
}

/** فيجما: bg أبيض، border #e5e9f2، shadow 0 4px 6px rgba(31,41,55,.05) */
export function Card({ children, className, variant = 'panel' }: CardProps) {
  return (
    <div
      className={cn(
        'border border-line bg-white shadow-card',
        variant === 'panel' ? 'rounded-panel' : 'rounded-card',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function CardHeader({
  title,
  actions,
  className,
}: {
  title: React.ReactNode
  actions?: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-4 border-b border-line p-5',
        className,
      )}
    >
      <h2 className="min-w-0 flex-1 text-right text-lg font-extrabold text-ink">
        {title}
      </h2>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </div>
  )
}

export function CardBody({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <div className={cn('p-5', className)}>{children}</div>
}
