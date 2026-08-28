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
