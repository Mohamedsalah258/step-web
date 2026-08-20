import type { LucideIcon } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'
import { POLICY_TABS, POLICY_TOOLBAR, type PolicyDoc } from '@/data/content'

/**
 * هيدر كارت بأيقونة — فيجما node 7:2034 / 7:2060:
 * RTL: الأيقونة على اليمين والعنوان جانبها (أيقونة 18px، عنوان 16px extrabold)
 * وتحته خط فاصل.
 */
export function PanelHeader({
  icon: Icon,
  title,
  className,
}: {
  icon: LucideIcon
  title: string
  className?: string
}) {
  return (
    <div
      className={cn('flex items-center gap-2 border-b border-line pb-4', className)}
    >
      <Icon className="size-[18px] shrink-0 text-brand" strokeWidth={2} />
      <h2 className="min-w-0 flex-1 text-right text-lg font-extrabold text-ink">
        {title}
      </h2>
    </div>
  )
}

/** كارت لوحة بـ p24 + gap16 — الشكل المتكرر في شاشات المحتوى */
export function PanelCard({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <Card className={cn('flex flex-col gap-4 p-6', className)}>{children}</Card>
  )
}

/** تابس السياسات بخط سفلي — فيجما node 7:2397 (أول تاب = يمين) */
export function PolicyTabs() {
  return (
    <div className="flex w-full shrink-0 items-center gap-4 border-b border-line">
      {POLICY_TABS.map((t) => (
        <NavLink
          key={t.to}
          to={t.to}
          end
          className={({ isActive }) =>
            cn(
              'shrink-0 border-b-2 px-6 py-3 text-md transition-colors',
              isActive
                ? 'border-brand font-bold text-brand'
                : 'border-transparent font-medium text-muted hover:text-ink',
            )
          }
        >
          {t.label}
        </NavLink>
      ))}
    </div>
  )
}

/**
 * محرّر السياسات — فيجما nodes 7:2402 / 45:27 / 45:159:
 * شريط أدوات فوق، منطقة نص bg-surface (min-h 380)، وفوتر فيه تاريخ التعديل
 * والزر على اليمين والملاحظة على اليسار.
 */
export function PolicyEditor({ doc }: { doc: PolicyDoc }) {
  return (
    <Card className="flex w-full shrink-0 flex-col gap-5 p-6">
      {/* toolbar — node 7:2403، أول مجموعة على اليمين */}
      <div className="flex shrink-0 items-center gap-3 rounded-ctl bg-surface p-2">
        {POLICY_TOOLBAR.map((group, gi) => (
          <div key={group.join('')} className="flex items-center gap-3">
            {gi > 0 ? <div className="h-[18px] w-px shrink-0 bg-line" /> : null}
            <div className="flex items-center gap-2">
              {group.map((key) => (
                <button
                  key={key}
                  type="button"
                  className="num flex size-7 items-center justify-center rounded border border-line bg-white text-xs font-bold text-ink transition-colors hover:bg-brand-wash"
                >
                  {key}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* textarea — node 7:2427 */}
      <div className="flex min-h-[380px] w-full flex-col gap-4 rounded-ctl border border-line bg-surface p-6 text-right">
        <p className="text-[18px] font-extrabold text-ink">{doc.heading}</p>
        {doc.paragraphs.map((p) => (
          <p key={p} className="text-base leading-[26px] text-ink">
            {p}
          </p>
        ))}
      </div>

      {/* editor-footer — node 7:2433: التاريخ والزر يمين، الملاحظة يسار */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted">{doc.lastModified}</span>
          <Button>{doc.save}</Button>
        </div>
        <span className="text-sm text-muted">{doc.footnote}</span>
      </div>
    </Card>
  )
}
