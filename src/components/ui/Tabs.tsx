import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/cn'

export type TabItem = {
  label: string
  /** عدّاد اختياري بيظهر جوه شيب صغير */
  count?: number
}

/**
 * تابس مع عدّاد — فيجما node 13:32 / 29:1524:
 * كل تاب h42، px16، radius8. النشط bg #2347e8 + نص أبيض،
 * الباقي نص muted على خلفية شفافة.
 * ملاحظة RTL: أول تاب في الـ DOM يظهر على اليمين.
 */
export function Tabs({
  items,
  value,
  onChange,
  className,
}: {
  items: TabItem[]
  value?: number
  onChange?: (index: number) => void
  className?: string
}) {
  const [internal, setInternal] = useState(0)
  const active = value ?? internal
  const setActive = onChange ?? setInternal

  return (
    <div className={cn('flex max-w-full shrink-0 items-center gap-2 overflow-x-auto scrollbar-hide', className)}>
      {items.map((t, i) => {
        const on = i === active
        return (
          <button
            key={t.label}
            type="button"
            onClick={() => setActive(i)}
            className={cn(
              'flex h-[42px] shrink-0 items-center gap-2 rounded-ctl px-4 text-base font-bold transition-colors',
              on
                ? 'bg-brand text-white'
                : 'bg-white text-muted hover:bg-surface hover:text-ink',
            )}
          >
            {typeof t.count === 'number' ? (
              <span
                className={cn(
                  'num inline-flex h-[22px] min-w-[22px] items-center justify-center rounded-badge px-1.5 text-xs font-bold',
                  on ? 'bg-white/20 text-white' : 'bg-surface text-muted',
                )}
              >
                {t.count}
              </span>
            ) : null}
            <span>{t.label}</span>
          </button>
        )
      })}
    </div>
  )
}

/** تابس مربوطة بمسارات (للشاشات اللي كل تاب فيها فريم منفصل في فيجما) */
export function RouteTabs({
  items,
  className,
}: {
  items: Array<{ label: string; to: string; count?: number; end?: boolean }>
  className?: string
}) {
  return (
    <div className={cn('flex max-w-full shrink-0 items-center gap-2 overflow-x-auto scrollbar-hide', className)}>
      {items.map((t) => (
        <NavLink
          key={t.to}
          to={t.to}
          end={t.end}
          className={({ isActive }) =>
            cn(
              'flex h-[42px] shrink-0 items-center gap-2 rounded-ctl px-4 text-base font-bold transition-colors',
              isActive
                ? 'bg-brand text-white'
                : 'bg-white text-muted hover:bg-surface hover:text-ink',
            )
          }
        >
          {({ isActive }) => (
            <>
              {typeof t.count === 'number' ? (
                <span
                  className={cn(
                    'num inline-flex h-[22px] min-w-[22px] items-center justify-center rounded-badge px-1.5 text-xs font-bold',
                    isActive ? 'bg-white/20 text-white' : 'bg-surface text-muted',
                  )}
                >
                  {t.count}
                </span>
              ) : null}
              <span>{t.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </div>
  )
}
