import { Link, useParams } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { BRAND } from '@/data/admin'
import { Logo } from '@/components/ui/Logo'
import { useAsync } from '@/lib/useAsync'
import { formatDateTime } from '@/lib/format'
import { getPolicy, type PolicySlug } from '@/api/policies'
import { CardSkeleton, ErrorState } from '@/components/ui/States'

const KNOWN_SLUGS: PolicySlug[] = ['privacy', 'refund', 'terms', 'deletion']

/**
 * صفحة عامة (خارج RequireAuth تمامًا — مفيش سايدبار ولا توب بار ولا توكن)
 * لعرض صفحات السياسات (خصوصية/استرجاع/شروط/حذف حساب) لزائر مش مسجّل دخول،
 * زي اللي بيدوس على اللينكات دي من شاشة اللوجين. المحتوى بييجي حي من
 * /policies/:slug — نفس المصدر اللي بيعدّل فيه الأدمن من "الصفحات والسياسات"،
 * فأي تعديل هناك بيظهر هنا فورًا من غير أي نشر إضافي.
 */
export default function PolicyView() {
  const { slug = '' } = useParams()
  const isKnown = KNOWN_SLUGS.includes(slug as PolicySlug)
  const { data: doc, loading, error, reload } = useAsync(
    () => getPolicy(slug as PolicySlug),
    [slug],
  )

  return (
    <div className="flex min-h-screen w-full flex-col bg-surface">
      {/* header — نفس هوية شاشة اللوجين بس مبسّطة */}
      <header className="flex w-full shrink-0 items-center justify-between border-b border-line bg-white px-6 py-4 sm:px-10">
        <div className="flex items-center gap-3">
          <Logo className="size-9 shrink-0" />
          <span className="text-lg font-extrabold text-ink">{BRAND.name}</span>
        </div>
        <Link
          to="/login"
          className="flex items-center gap-1.5 text-sm font-bold text-brand transition-colors hover:opacity-70"
        >
          <ChevronRight className="size-4" strokeWidth={2.5} />
          الرجوع لتسجيل الدخول
        </Link>
      </header>

      {/* content */}
      <main className="flex w-full flex-1 justify-center px-6 py-10 sm:px-10 sm:py-16">
        <div className="w-full max-w-[720px]">
          {!isKnown ? (
            <ErrorState title="صفحة غير معروفة" description="الرابط اللي دخلت بيه مش موجود." />
          ) : loading && !doc ? (
            <CardSkeleton />
          ) : error || !doc ? (
            <ErrorState description={error ?? 'تعذر تحميل الصفحة'} onRetry={reload} />
          ) : (
            <article className="flex flex-col gap-6 rounded-panel border border-line bg-white p-6 shadow-card sm:p-10">
              <h1 className="text-right text-2xl font-extrabold leading-snug text-ink">{doc.heading}</h1>
              <div className="flex flex-col gap-4">
                {doc.paragraphs.map((p, i) => (
                  <p key={i} className="text-right text-base leading-relaxed text-ink">
                    {p}
                  </p>
                ))}
              </div>
              <p className="text-right text-2xs text-muted">
                آخر تحديث: {formatDateTime(doc.updatedAt)}
              </p>
            </article>
          )}
        </div>
      </main>
    </div>
  )
}
