import { Search, Menu } from 'lucide-react'
import { useOutletContext } from 'react-router-dom'
import { ADMIN } from '@/data/admin'

type Props = {
  title: string
  /** إجراءات إضافية (زرار رجوع، بريدكرمب...) — بتظهر جنب العنوان */
  actions?: React.ReactNode
}

type LayoutContext = {
  onToggleSidebar: () => void
}

/**
 * فيجما node 7:8 — top-bar h64، bg أبيض، border-b #e5e9f2، px24.
 * RTL: العنوان يمين، ومجموعة المستخدم شمال (أول عنصر في DOM = يمين).
 *
 * Responsive:
 *   < lg: hamburger menu يظهر + اسم المستخدم مخفي (الأفاتار فقط)
 *   ≥ lg: السلوك الأصلي
 */
export function TopBar({ title, actions }: Props) {
  const context = useOutletContext<LayoutContext | undefined>()

  return (
    <header className="flex h-topbar shrink-0 items-center justify-between gap-3 border-b border-line bg-white px-4 md:px-6">
      <div className="flex shrink-0 items-center gap-3">
        {/* hamburger — يظهر فقط على < lg */}
        <button
          type="button"
          aria-label="فتح القائمة"
          onClick={context?.onToggleSidebar}
          className="flex size-9 shrink-0 items-center justify-center rounded-ctl text-ink transition-colors hover:bg-surface lg:hidden"
        >
          <Menu className="size-5" strokeWidth={2} />
        </button>
        <h1 className="whitespace-nowrap text-lg font-extrabold leading-none text-ink lg:text-xl">
          {title}
        </h1>
        {actions}
      </div>

      {/* user-profile — node 7:9: أفاتار يمين ثم البيانات ثم فاصل ثم بحث */}
      <div className="flex shrink-0 items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-[20px] bg-brand-tint">
          <p className="text-base font-bold text-brand">{ADMIN.shortName}</p>
        </div>
        {/* الاسم والدور — مخفيين على الموبايل */}
        <div className="hidden flex-col items-end gap-0.5 whitespace-nowrap md:flex">
          <p className="text-base font-bold leading-none text-ink">
            {ADMIN.name}
          </p>
          <p className="text-2xs font-normal leading-none text-muted">
            {ADMIN.role}
          </p>
        </div>
        <div className="hidden h-5 w-px shrink-0 bg-line md:block" />
        <button
          type="button"
          aria-label="بحث"
          className="flex size-5 shrink-0 items-center justify-center text-ink transition-opacity hover:opacity-60"
        >
          <Search className="size-5" strokeWidth={2} />
        </button>
      </div>
    </header>
  )
}
