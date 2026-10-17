import { useEffect, useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { TextArea, TextField, ToggleRow } from '@/components/ui/Field'
import { ConfirmDeleteModal } from '@/components/ui/Modal'
import { CardSkeleton, ErrorState } from '@/components/ui/States'
import { useAsync } from '@/lib/useAsync'
import { formatDateTime } from '@/lib/format'
import { cn } from '@/lib/cn'
import type { ApiPolicy } from '@/api/policies'
import {
  getPaymentVisibility,
  setPaymentVisibility,
  type AppPlatform,
} from '@/api/payment-visibility'
import { PAYMENT_VISIBILITY_PANEL, POLICY_TABS, POLICY_TOOLBAR } from '@/data/content'

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
 * شريط أدوات فوق (تنسيق زخرفي بس — التخزين نص عادي)، عنوان + محتوى قابلين
 * للتعديل فعليًا، وفوتر فيه تاريخ آخر تعديل والزر على اليمين.
 */
export function PolicyEditor({
  doc,
  onSave,
}: {
  doc: ApiPolicy
  onSave: (heading: string, content: string) => Promise<void>
}) {
  const [heading, setHeading] = useState(doc.heading)
  const [content, setContent] = useState(doc.content)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setHeading(doc.heading)
    setContent(doc.content)
  }, [doc])

  const handleSave = async () => {
    if (!heading.trim() || !content.trim()) return
    setSaving(true)
    setError(null)
    try {
      await onSave(heading, content)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ، حاول مرة أخرى')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card className="flex w-full shrink-0 flex-col gap-5 p-6">
      {/* toolbar — node 7:2403، زخرفي (النص بيتخزن عادي، مفيش رندر HTML حقيقي) */}
      <div className="flex shrink-0 items-center gap-3 rounded-ctl bg-surface p-2">
        {POLICY_TOOLBAR.map((group, gi) => (
          <div key={group.join('')} className="flex items-center gap-3">
            {gi > 0 ? <div className="h-[18px] w-px shrink-0 bg-line" /> : null}
            <div className="flex items-center gap-2">
              {group.map((key) => (
                <button
                  key={key}
                  type="button"
                  disabled
                  className="num flex size-7 items-center justify-center rounded border border-line bg-white text-xs font-bold text-muted opacity-50"
                >
                  {key}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <TextField label="عنوان الصفحة" value={heading} onChange={setHeading} />

      {/* textarea — node 7:2427 */}
      <TextArea label="محتوى الصفحة" value={content} onChange={setContent} rows={14} />

      {/* editor-footer — node 7:2433 */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted">
            آخر تعديل: {formatDateTime(doc.updatedAt)}
            {doc.updatedByAdminName ? ` بواسطة ${doc.updatedByAdminName}` : ''}
          </span>
          <Button onClick={handleSave} disabled={saving || !heading.trim() || !content.trim()}>
            {saving ? '...جاري الحفظ' : 'حفظ التغييرات ونشرها'}
          </Button>
        </div>
        <span className="text-sm text-muted">
          * هذا المحتوى يظهر تلقائياً للطالب في شاشة المتجر والسياسات بقسم المزيد بالتطبيق.
        </span>
      </div>
      {error ? <p className="text-sm font-bold text-danger">{error}</p> : null}
    </Card>
  )
}

const APP_PLATFORMS: AppPlatform[] = ['ios', 'android']

/**
 * كارت إخفاء الدفع من تطبيق الطالب (صفحة الإعدادات) — سويتش لكل منصة
 * لوحدها. إظهار الدفع على iOS هو الخطوة الخطرة الوحيدة (مراجعة Apple)،
 * فهي بس اللي محتاجة تأكيد.
 */
export function PaymentVisibilityCard() {
  const { data: state, loading, error, reload } = useAsync(() => getPaymentVisibility(), [])
  const [toggling, setToggling] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)
  const [confirmingShowIos, setConfirmingShowIos] = useState(false)
  const p = PAYMENT_VISIBILITY_PANEL

  const performSet = async (platform: AppPlatform, hidden: boolean) => {
    setToggling(true)
    setActionError(null)
    try {
      await setPaymentVisibility(platform, hidden)
      reload()
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'حدث خطأ، حاول مرة أخرى')
    } finally {
      setToggling(false)
      setConfirmingShowIos(false)
    }
  }

  /** [hidden] هي القيمة اللي السويتش اتحرك لها — بتتبعت كده بالظبط للباك اند */
  const handleChange = (platform: AppPlatform, hidden: boolean) => {
    if (platform === 'ios' && !hidden) {
      setConfirmingShowIos(true)
      return
    }
    performSet(platform, hidden)
  }

  return (
    <>
      <Card className="flex w-full shrink-0 flex-col gap-6 p-8">
        <div className="flex flex-col gap-2 text-right">
          <h2 className="text-xl font-extrabold text-ink">{p.title}</h2>
          <p className="text-base text-muted">{p.subtitle}</p>
        </div>

        {loading && !state ? (
          <CardSkeleton />
        ) : error || !state ? (
          <ErrorState description={error ?? p.loadError} onRetry={reload} />
        ) : (
          <>
            {APP_PLATFORMS.map((platform) => {
              const hidden = platform === 'ios' ? state.hiddenOnIos : state.hiddenOnAndroid
              const labels = p.platforms[platform]
              return (
                <ToggleRow
                  key={platform}
                  label={hidden ? labels.hiddenLabel : labels.shownLabel}
                  hint={hidden ? p.hiddenHint : p.shownHint}
                  on={hidden}
                  onChange={(nextHidden) => handleChange(platform, nextHidden)}
                  disabled={toggling}
                />
              )
            })}

            <p className="text-right text-sm text-muted">{p.appliesNote}</p>
            <p className="text-right text-base leading-relaxed text-warning">{p.warning}</p>

            {state.updatedByAdminName ? (
              <p className="text-right text-sm text-muted">
                {p.updatedByPrefix} {state.updatedByAdminName} —{' '}
                {formatDateTime(state.updatedAt)}
              </p>
            ) : null}

            {actionError ? <p className="text-sm font-bold text-danger">{actionError}</p> : null}
          </>
        )}
      </Card>

      {confirmingShowIos ? (
        <ConfirmDeleteModal
          title={p.confirmShowIos.title}
          message={p.confirmShowIos.message}
          confirmLabel={p.confirmShowIos.confirmLabel}
          submittingLabel={p.confirmShowIos.submittingLabel}
          submitting={toggling}
          onClose={() => setConfirmingShowIos(false)}
          onConfirm={() => performSet('ios', false)}
        />
      ) : null}
    </>
  )
}
