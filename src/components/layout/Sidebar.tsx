import { useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { GraduationCap, X } from 'lucide-react'
import { NAV_ITEMS } from '@/lib/nav'
import { BRAND } from '@/data/admin'
import { cn } from '@/lib/cn'
import { useBodyScrollLock } from '@/lib/useBodyScrollLock'

type Props = {
  /** هل الأوفرلاي مفتوح (على < lg فقط) */
  open: boolean
  onClose: () => void
}

/**
 * فيجما node 7:199 — sidebar 260px، bg #0b1f66، px16 py28 gap32.
 *
 * Responsive:
 *   ≥ lg: static sidebar ثابت (260px) كجزء من flex-row.
 *   < lg: overlay مع backdrop منفصل + panel يتحرك من اليمين.
 *
 * هيكل الأوفرلاي:
 *   fixed inset-0 z-50
 *   ├── backdrop (bg-navy/40, onClick=close)
 *   └── sidebar-panel (w-[260px], right-0, animate-sidebar-in)
 */
export function Sidebar({ open, onClose }: Props) {
  const { pathname } = useLocation()

  const isActive = (to: string, match?: string[]) => {
    if (to === '/') return pathname === '/'
    if (match?.some((m) => pathname.startsWith(m))) return true
    return pathname.startsWith(to)
  }

  // إغلاق بـ Escape
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  // منع سكرول الصفحة اللي وراها لما الأوفرلاي يكون مفتوح
  useBodyScrollLock(open)

  const sidebarContent = (
    <>
      {/* brand-header — node 7:200: اللوجو يمين والنص شماله */}
      <div className="flex items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-logo bg-brand">
          <GraduationCap className="size-6 text-white" strokeWidth={2} />
        </div>
        <div className="flex flex-col items-start gap-0.5 whitespace-nowrap">
          <p className="text-2xl font-extrabold leading-none text-white">
            {BRAND.name}
          </p>
          <p className="text-2xs font-medium leading-none text-brand-tint opacity-60">
            {BRAND.tagline}
          </p>
        </div>
      </div>

      {/* nav-list — node 7:207: الأيقونة يمين والعنوان شمالها متراصّ لليمين */}
      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.to, item.match)
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 rounded-ctl px-4 py-2.5 transition-colors',
                active ? 'bg-brand' : 'hover:bg-white/[0.07]',
              )}
            >
              <Icon
                className={cn(
                  'size-[18px] shrink-0 text-white',
                  !active && 'opacity-70',
                )}
                strokeWidth={2}
              />
              <span
                className={cn(
                  'min-w-0 flex-1 text-right text-base leading-normal text-white',
                  active ? 'font-bold' : 'font-medium opacity-70',
                )}
              >
                {item.label}
              </span>
            </NavLink>
          )
        })}
      </nav>
    </>
  )

  return (
    <>
      {/* ≥ lg: static sidebar — ثابت كجزء من flex-row */}
      <aside className="hidden w-sidebar shrink-0 flex-col gap-8 bg-navy px-4 py-7 lg:flex">
        {sidebarContent}
      </aside>

      {/* < lg: overlay — backdrop منفصل + sidebar panel */}
      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* backdrop */}
          <div
            className="absolute inset-0 bg-navy/40 animate-fade-in"
            onClick={onClose}
            role="presentation"
          />
          {/* sidebar panel — slides from right in RTL */}
          <aside className="absolute bottom-0 right-0 top-0 flex w-sidebar max-w-[85vw] animate-sidebar-in flex-col gap-8 bg-navy px-4 py-7 shadow-modal">
            {/* زرار إغلاق */}
            <button
              type="button"
              onClick={onClose}
              aria-label="إغلاق القائمة"
              className="absolute left-3 top-3 flex size-8 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X className="size-4" strokeWidth={2.5} />
            </button>
            {sidebarContent}
          </aside>
        </div>
      ) : null}
    </>
  )
}
