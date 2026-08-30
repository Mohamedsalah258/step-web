import { api, BASE_URL, ApiError } from './client'
import { getToken } from '@/lib/token'

export type ApiChartPoint = { label: string; value: number }

export type ReportQueryParams = {
  from?: string
  to?: string
  compare?: boolean
  universityId?: string
  collegeId?: string
  specializationId?: string
}

/** ⚠️ /reports/devices بياخد نفس شكل الاستعلام لكنه بيتجاهل فلتر الهيكل الأكاديمي حاليًا (مفيش علاقة كورس) */
function toParams(p: ReportQueryParams) {
  return {
    from: p.from,
    to: p.to,
    compare: p.compare ? 'true' : undefined,
    universityId: p.universityId || undefined,
    collegeId: p.collegeId || undefined,
    specializationId: p.specializationId || undefined,
  }
}

export type ApiRevenueReport = {
  totalRevenue: number
  avgOrderValue: number
  approvedOrdersCount: number
  revenueDelta: number | null
  ordersDelta: number | null
  chart: ApiChartPoint[]
  rows: { faculty: string; orders: number; revenue: number; share: number; delta: number | null }[]
  periodLabel: string
}

export type ApiStudentsReport = {
  totalStudents: number
  activeStudents: number
  activeSubscriptionsCount: number
  activeStudentsDelta: number | null
  chart: ApiChartPoint[]
  rows: { faculty: string; students: number; subscriptions: number; delta: number | null }[]
  periodLabel: string
}

export type ApiOrdersReport = {
  totalOrders: number
  pendingOrders: number
  approvalRate: number
  totalOrdersDelta: number | null
  chart: ApiChartPoint[]
  rows: {
    index: string
    course: string
    accepted: number
    rejected: number
    pending: number
    total: number
  }[]
  periodLabel: string
}

export type ApiDevicesReport = {
  resetsThisPeriod: number
  totalDevices: number
  resetsDelta: number | null
  devicesDelta: number | null
  chart: ApiChartPoint[]
  rows: {
    index: string
    student: string
    device: string
    os: string
    registeredAt: string
    status: string
  }[]
  periodLabel: string
}

export const getRevenueReport = (params: ReportQueryParams = {}) =>
  api.get<ApiRevenueReport>('/reports/revenue', toParams(params))
export const getStudentsReport = (params: ReportQueryParams = {}) =>
  api.get<ApiStudentsReport>('/reports/students', toParams(params))
export const getOrdersReport = (params: ReportQueryParams = {}) =>
  api.get<ApiOrdersReport>('/reports/orders', toParams(params))
export const getDevicesReport = (params: ReportQueryParams = {}) =>
  api.get<ApiDevicesReport>('/reports/devices', toParams(params))

export type ReportKind = 'revenue' | 'students' | 'orders' | 'devices'
export type ExportFormat = 'csv' | 'xlsx' | 'pdf'

const MIME: Record<ExportFormat, string> = {
  csv: 'text/csv',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  pdf: 'application/pdf',
}

/**
 * تصدير حقيقي بالتنسيقات التلاتة — الـ endpoint محمي بـ auth فمينفعش
 * window.open() عادي (النافيجيشن مبيبعتش Authorization header)، فبنجيب
 * الملف بـ fetch مع التوكن ونعمل تنزيل محلي من الـ blob.
 */
export async function downloadReport(
  report: ReportKind,
  format: ExportFormat,
  params: ReportQueryParams = {},
): Promise<void> {
  const url = new URL(`/reports/${report}/export.${format}`, BASE_URL)
  const query = toParams(params)
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== '') url.searchParams.set(key, value)
  }

  const token = getToken()
  const res = await fetch(url.toString(), {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })

  if (!res.ok) {
    throw new ApiError(res.status, `تعذّر تصدير الملف (${res.status})`)
  }

  const blob = await res.blob()
  const objectUrl = URL.createObjectURL(new Blob([blob], { type: MIME[format] }))
  const link = document.createElement('a')
  link.href = objectUrl
  link.download = `${report}-report.${format}`
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(objectUrl)
}
