import { useState } from 'react'
import { GraduationCap, Eye, EyeOff } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { BRAND } from '@/data/admin'
import { LOGIN, LOGIN_HERO, LOGIN_POLICIES } from '@/data/auth'
import { login } from '@/api/auth'
import { ApiError } from '@/api/client'
import { loginSuccess } from '@/lib/auth-store'

/**
 * فيجما frame: v3-admin-login (node 26:6) — 1440x900.
 * شاشة مستقلة بدون سايدبار ولا توب بار: لوح فورم على اليمين + هيرو كحلي على الشمال.
 */
export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const res = await login(email, password)
      loginSuccess(res.accessToken, res.admin)
      navigate('/', { replace: true })
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'تعذّر تسجيل الدخول. حاول مرة أخرى.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full bg-white">
      {/* form-pane — RTL: أول عنصر في الـ DOM = يمين */}
      <div className="flex min-w-0 flex-1 items-center justify-center px-6 py-8 sm:px-16 sm:py-12">
        <div className="flex w-full max-w-[420px] flex-col gap-8">
          {/* brand — اللوجو يمين والنص شماله */}
          <div className="flex items-center gap-3">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-logo bg-brand">
              <GraduationCap className="size-7 text-white" strokeWidth={2} />
            </div>
            <div className="flex flex-col items-start gap-0.5">
              <p className="text-2xl font-extrabold leading-none text-ink">
                {BRAND.name}
              </p>
              <p className="text-2xs font-medium leading-none text-muted">
                {BRAND.tagline}
              </p>
            </div>
          </div>

          {/* title-group — node 26:10 / 26:11 */}
          <div className="flex flex-col gap-2">
            <h1 className="text-right text-[26px] font-extrabold leading-tight text-ink">
              {LOGIN.title}
            </h1>
            <p className="text-right text-base leading-relaxed text-muted">
              {LOGIN.subtitle}
            </p>
          </div>

          {/* form-fields — node 26:13 */}
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            {error ? (
              <p className="rounded-ctl bg-danger-bg px-4 py-2.5 text-right text-sm font-semibold text-danger">
                {error}
              </p>
            ) : null}

            <label className="flex flex-col gap-1.5">
              <span className="text-right text-sm font-bold text-ink">
                {LOGIN.emailLabel}
              </span>
              <input
                type="email"
                dir="ltr"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={LOGIN.emailPlaceholder}
                className="h-12 w-full rounded-ctl border border-line bg-white px-4 text-left text-base text-ink outline-none transition-colors placeholder:text-muted focus:border-brand"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-right text-sm font-bold text-ink">
                {LOGIN.passwordLabel}
              </span>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  dir="ltr"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={LOGIN.passwordPlaceholder}
                  className="h-12 w-full rounded-ctl border border-line bg-white pe-4 ps-[76px] text-left text-base text-ink outline-none transition-colors placeholder:text-muted focus:border-brand"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute left-4 top-1/2 flex -translate-y-1/2 items-center gap-1.5 text-sm font-bold text-brand transition-opacity hover:opacity-70"
                >
                  {showPassword ? (
                    <EyeOff className="size-4" strokeWidth={2} />
                  ) : (
                    <Eye className="size-4" strokeWidth={2} />
                  )}
                  {LOGIN.passwordToggle}
                </button>
              </div>
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="h-12 w-full rounded-ctl bg-brand text-base font-bold text-white transition-colors hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? '...جارِ الدخول' : LOGIN.submit}
            </button>
          </form>

          {/* note — node 26:25 */}
          <p className="text-center text-sm text-muted">{LOGIN.note}</p>

          {/* policy-links — node 47:2 */}
          <div className="flex items-center justify-center gap-4 text-2xs">
            {LOGIN_POLICIES.map((p, i) => (
              <span key={p.to} className="flex items-center gap-4">
                {i > 0 ? <span className="text-line">•</span> : null}
                <Link
                  to={p.to}
                  className="text-muted transition-colors hover:text-brand"
                >
                  {p.label}
                </Link>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* hero-branding — node 26:26 */}
      <div className="hidden min-w-0 flex-1 flex-col items-center justify-center gap-6 bg-navy px-16 py-12 lg:flex">
        <div className="flex size-20 items-center justify-center rounded-[20px] bg-brand">
          <GraduationCap className="size-11 text-white" strokeWidth={1.75} />
        </div>
        <h2 className="max-w-[420px] text-center text-[28px] font-extrabold leading-snug text-white">
          {LOGIN_HERO.title}
        </h2>
        <p className="max-w-[420px] text-center text-lg leading-relaxed text-brand-tint opacity-70">
          {LOGIN_HERO.subtitle}
        </p>
        <p className="num mt-4 text-xs text-brand-tint opacity-50">
          {LOGIN_HERO.version}
        </p>
      </div>
    </div>
  )
}
