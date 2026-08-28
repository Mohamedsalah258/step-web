import { api, ApiError, BASE_URL } from './client'
import { getToken } from '@/lib/token'
import type { BadgeTone } from '@/components/ui/Badge'

export type ApiActivityRow = {
  id: string
  index: string
  action: string
  tone: BadgeTone
  details: string | null
  target: string
  datetime: string
  admin: string
}

export type ApiActivityListResponse = {
  data: ApiActivityRow[]
  meta: { page: number; limit: number; total: number; totalPages: number }
}

export type ApiActivityStats = { thisWeek: number; today: number; total: number }

type ActivityQuery = {
  q?: string
  actionType?: string
  date?: string
  page?: number
  limit?: number
}

export function listActivityLog(query: ActivityQuery) {
  return api.get<ApiActivityListResponse>('/activity-log', query)
}

export function getActivityLogStats() {
  return api.get<ApiActivityStats>('/activity-log/stats')
}

/**
 * تصدير CSV — الـ endpoint محمي بـ auth زي كل حاجة تانية، فمينفعش نفتحه
 * بـ window.open() (النافيجيشن العادي مبيبعتش Authorization header).
 * بدل كده: بنجيب الملف بـ fetch مع التوكن، ونعمل تنزيل محلي من الـ blob.
 */
export async function downloadActivityLogCsv(query: ActivityQuery): Promise<void> {
  const url = new URL('/activity-log/export.csv', BASE_URL)
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== '') url.searchParams.set(key, String(value))
  }

  const token = getToken()
  const res = await fetch(url.toString(), {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })

  if (!res.ok) {
    throw new ApiError(res.status, `تعذّر تصدير الملف (${res.status})`)
  }

  const blob = await res.blob()
  const objectUrl = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = objectUrl
  link.download = 'activity-log.csv'
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(objectUrl)
}
