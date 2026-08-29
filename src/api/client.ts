/**
 * طبقة اتصال خفيفة بالباك اند الحقيقي (STEP API — NestJS).
 * كل الدومينات (dashboard, students, ...) بتستخدم الدالة دي بس، عشان أي
 * تعديل مستقبلي (auth token, base URL, error handling) يتم في مكان واحد.
 *
 * الـ base URL بييجي من متغير بيئة Vite: VITE_API_URL (شوف .env.example).
 *
 * كل الـ endpoints في الباك اند محمية بـ JWT (ما عدا /auth/login و /auth/register)،
 * فكل طلب هنا بيبعت Authorization: Bearer <token> تلقائي لو فيه توكن متخزن.
 */
import { clearToken, getToken } from '@/lib/token'

export const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export class ApiError extends Error {
  status: number
  code?: string
  fields?: Record<string, string>
  constructor(status: number, message: string, code?: string, fields?: Record<string, string>) {
    super(message)
    this.status = status
    this.code = code
    this.fields = fields
  }
}

/**
 * شكل الرد الموحّد من الباك اند (شوف STEP_Admin_Backend spec §5.أ +
 * step-backend/src/common/response.interceptor.ts + all-exceptions.filter.ts).
 * الدالة دي هي النقطة الوحيدة اللي بتعرف بالعقد ده — كل ملفات api/*.ts
 * التانية بتفضل زي ما هي (بترجع T مباشرة).
 */
type ApiEnvelope<T> =
  | { success: true; data: T; message: string | null }
  | {
      success: false
      error: { code: string; message: string; fields?: Record<string, string> }
    }

/**
 * كاش خفيف في الذاكرة لطلبات GET — عشان الرجوع لصفحة اتزارت قبل كده
 * بثواني يرجّع البيانات فورًا من غير استنى السيرفر تاني.
 * بيتخزن الـ Promise نفسه (مش بس النتيجة النهائية) عشان لو كذا مكوّن
 * طلبوا نفس الـ endpoint في نفس اللحظة، يشتركوا في نفس الطلب بدل تكراره.
 * أي POST/PATCH/DELETE بيمسح الكاش كله (شوف clearApiCache تحت).
 */
const GET_CACHE_TTL_MS = 60_000
const getCache = new Map<string, { promise: Promise<unknown>; expiresAt: number }>()

export function clearApiCache(): void {
  getCache.clear()
}

async function doFetch<T>(
  url: URL,
  init: (RequestInit & { isFormData?: boolean }) | undefined,
): Promise<T> {
  const token = getToken()
  const res = await fetch(url.toString(), {
    ...init,
    headers: {
      ...(init?.isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
  })

  if (res.status === 401) {
    // التوكن غير صالح/منتهي — نمسحه ونبلّغ باقي التطبيق (auth-store) عشان
    // يرجّع المستخدم لشاشة تسجيل الدخول.
    clearToken()
    clearApiCache()
    window.dispatchEvent(new Event('step:unauthorized'))
  }

  if (res.status === 204) return undefined as T

  const body = (await res.json().catch(() => null)) as ApiEnvelope<T> | null

  if (!res.ok || !body || body.success === false) {
    const message =
      body && body.success === false
        ? body.error.message
        : `خطأ في الاتصال بالسيرفر (${res.status})`
    const code = body && body.success === false ? body.error.code : undefined
    const fields = body && body.success === false ? body.error.fields : undefined
    throw new ApiError(res.status, message, code, fields)
  }

  return body.data
}

async function request<T>(
  path: string,
  init?: RequestInit & {
    query?: Record<string, string | number | undefined>
    /** يمنع الـ Content-Type الافتراضي application/json — لازم لـ FormData (رفع ملفات) */
    isFormData?: boolean
  },
): Promise<T> {
  const url = new URL(path, BASE_URL)
  if (init?.query) {
    for (const [key, value] of Object.entries(init.query)) {
      if (value !== undefined && value !== '') url.searchParams.set(key, String(value))
    }
  }

  const method = init?.method ?? 'GET'
  if (method !== 'GET') {
    // أي تعديل ناجح أو فاشل بيخلي أي بيانات متخزنة قابلة للشك — أبسط وأضمن
    // إجراء إننا نمسح الكاش كله بدل ما نحاول نحدد بدقة مين اتأثر.
    try {
      return await doFetch<T>(url, init)
    } finally {
      clearApiCache()
    }
  }

  const key = url.toString()
  const cached = getCache.get(key)
  if (cached && cached.expiresAt > Date.now()) {
    return cached.promise as Promise<T>
  }

  const promise = doFetch<T>(url, init)
  getCache.set(key, { promise, expiresAt: Date.now() + GET_CACHE_TTL_MS })
  // لو الطلب فشل، منسيبوش الفشل متخزن — نشيله فورًا عشان أي محاولة تانية
  // تبعت طلب حقيقي بدل ما تستنى انتهاء مدة الكاش وهي عارفة إنه فاشل.
  promise.catch(() => getCache.delete(key))

  return promise as Promise<T>
}

export const api = {
  get: <T>(path: string, query?: Record<string, string | number | undefined>) =>
    request<T>(path, { method: 'GET', query }),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'PATCH', body: body ? JSON.stringify(body) : undefined }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
  postForm: <T>(path: string, formData: FormData) =>
    request<T>(path, { method: 'POST', body: formData, isFormData: true }),
}
