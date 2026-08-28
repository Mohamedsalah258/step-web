import { api } from './client'
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
  items: ApiActivityRow[]
  total: number
  page: number
  pageSize: number
  pages: number
}

export type ApiActivityStats = { thisWeek: number; today: number; total: number }

type ActivityQuery = {
  q?: string
  actionType?: string
  date?: string
  page?: number
  pageSize?: number
}

export function listActivityLog(query: ActivityQuery) {
  return api.get<ApiActivityListResponse>('/activity-log', query)
}

export function getActivityLogStats() {
  return api.get<ApiActivityStats>('/activity-log/stats')
}

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

/** رابط تصدير CSV مباشر بنفس الفلاتر الحالية — بيتفتح في تاب جديد */
export function exportActivityLogUrl(query: ActivityQuery): string {
  const url = new URL('/activity-log/export.csv', BASE_URL)
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== '') url.searchParams.set(key, String(value))
  }
  return url.toString()
}
