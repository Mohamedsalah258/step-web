/**
 * طبقة اتصال خفيفة بالباك اند الحقيقي (STEP API — NestJS).
 * كل الدومينات (dashboard, students, ...) بتستخدم الدالة دي بس، عشان أي
 * تعديل مستقبلي (auth token, base URL, error handling) يتم في مكان واحد.
 *
 * الـ base URL بييجي من متغير بيئة Vite: VITE_API_URL (شوف .env.example).
 */

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

async function request<T>(
  path: string,
  init?: RequestInit & { query?: Record<string, string | number | undefined> },
): Promise<T> {
  const url = new URL(path, BASE_URL)
  if (init?.query) {
    for (const [key, value] of Object.entries(init.query)) {
      if (value !== undefined && value !== '') url.searchParams.set(key, String(value))
    }
  }

  const res = await fetch(url.toString(), {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  })

  if (!res.ok) {
    const body = await res.json().catch(() => null)
    const message = Array.isArray(body?.message)
      ? body.message.join(', ')
      : (body?.message ?? `خطأ في الاتصال بالسيرفر (${res.status})`)
    throw new ApiError(res.status, message)
  }

  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

export const api = {
  get: <T>(path: string, query?: Record<string, string | number | undefined>) =>
    request<T>(path, { method: 'GET', query }),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined }),
}
