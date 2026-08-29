import { getMe } from '@/api/auth'
import type { ApiAdmin } from '@/api/auth'
import { clearApiCache } from '@/api/client'
import { clearToken, getToken, setToken } from './token'

/**
 * ستور خفيف لحالة تسجيل الدخول — بديل بسيط لـ Context عشان مانحتاجش
 * نلف main.tsx بـ Provider. أي مكوّن بيستخدم useAuth() بيتحدث تلقائي.
 *
 * status:
 *  - 'loading'        لسه بنتحقق من التوكن المخزن (أول تحميل للصفحة)
 *  - 'authenticated'  فيه أدمن مسجل دخول فعلاً
 *  - 'unauthenticated' مفيش توكن، أو التوكن باظ/انتهى
 */
export type AuthState =
  | { status: 'loading'; admin: null }
  | { status: 'authenticated'; admin: ApiAdmin }
  | { status: 'unauthenticated'; admin: null }

let state: AuthState = { status: getToken() ? 'loading' : 'unauthenticated', admin: null }
const listeners = new Set<() => void>()

function setState(next: AuthState) {
  state = next
  listeners.forEach((listener) => listener())
}

export function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function getSnapshot(): AuthState {
  return state
}

export function loginSuccess(token: string, admin: ApiAdmin) {
  setToken(token)
  setState({ status: 'authenticated', admin })
}

/** بيتنده لما بيانات الأدمن (زي الاسم أو الصورة) تتحدّث من صفحة الإعدادات — عشان أي مكوّن بيقرأ useAuth() (زي TopBar) يتحدّث فورًا من غير ما يحتاج تسجيل دخول جديد. */
export function updateAdmin(admin: ApiAdmin) {
  if (state.status !== 'authenticated') return
  setState({ status: 'authenticated', admin })
}

export function logout() {
  clearToken()
  clearApiCache()
  setState({ status: 'unauthenticated', admin: null })
}

// أول ما الملف ده يتحمّل، لو فيه توكن مخزن من زيارة سابقة، نتحقق إنه لسه
// صالح عبر /auth/me قبل ما نعتبر المستخدم مسجل دخول فعلاً.
async function bootstrap() {
  if (!getToken()) return
  try {
    const admin = await getMe()
    setState({ status: 'authenticated', admin })
  } catch {
    clearToken()
    setState({ status: 'unauthenticated', admin: null })
  }
}
void bootstrap()

if (typeof window !== 'undefined') {
  // بيتبعت من api/client.ts لما أي طلب يرجع 401 (توكن باظ/انتهى)
  window.addEventListener('step:unauthorized', () => {
    setState({ status: 'unauthenticated', admin: null })
  })
}
