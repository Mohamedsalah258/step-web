import { Search } from 'lucide-react'
import { ADMIN } from '@/data/admin'

type Props = {
  title: string
  /** إجراءات إضافية (زرار رجوع، بريدكرمب...) — بتظهر جنب العنوان */
  actions?: React.ReactNode
}

/**
 * فيجما node 7:8 — top-bar h64، bg أبيض، border-b #e5e9f2، px24.
 * RTL: العنوان يمين، ومجموعة المستخدم شمال (أول عنصر في DOM = يمين).
 */
export function TopBar({ title, actions }: Props) {
  return (
    <header className="flex h-topbar shrink-0 items-center justify-between gap-4 border-b border-line bg-white px-6">
      <div className="flex shrink-0 items-center gap-4">
        <h1 className="whitespace-nowrap text-xl font-extrabold leading-none text-ink">
          {title}
        </h1>
        {actions}
      </div>

      {/* user-profile — node 7:9: أفاتار يمين ثم البيانات ثم فاصل ثم بحث */}
      <div className="flex shrink-0 items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-[20px] bg-brand-tint">
          <p className="text-base font-bold text-brand">{ADMIN.shortName}</p>
        </div>
        <div className="flex flex-col items-end gap-0.5 whitespace-nowrap">
          <p className="text-base font-bold leading-none text-ink">
            {ADMIN.name}
          </p>
          <p className="text-2xs font-normal leading-none text-muted">
            {ADMIN.role}
          </p>
        </div>
        <div className="h-5 w-px shrink-0 bg-line" />
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
