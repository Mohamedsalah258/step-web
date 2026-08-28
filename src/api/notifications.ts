import { api } from './client'

/* ==========================================================================
 * أنواع الاستجابة الخام من STEP API لدومين الإشعارات.
 * ========================================================================== */

type Meta = { page: number; limit: number; total: number; totalPages: number }

export type ApiAudiencePreview = { count: number; label: string }

export type ApiSentNotification = {
  id: string
  title: string
  type: string
  audience: string
  date: string
  status: string
}

export type ApiAlertTone = 'danger' | 'warning' | 'success'

/**
 * تنبيهات الإدارة والسيستم — "وارد" (حاجات محتاجة انتباه الأدمن نفسه)،
 * مختلفة تمامًا عن سجل الإشعارات اللي فوق ("صادر" — إشعارات الأدمن للطلاب).
 * حاليًا مصدرها الوحيد طلبات الشراء المعلّقة.
 */
export type ApiAdminAlert = {
  id: string
  /** ISO timestamp خام — استخدم timeAgo() من lib/format للعرض النسبي */
  time: string
  title: string
  desc: string
  tone: ApiAlertTone
}

export const getAdminAlerts = (limit = 5) =>
  api.get<ApiAdminAlert[]>('/notifications/admin-alerts', { limit })

type AudienceFilters = {
  courseId?: string
  stageId?: string
  termId?: string
}

/** معاينة حية لعدد المستهدفين — بتتحدث مع أي تغيير في فلاتر الفورم */
export const getAudiencePreview = (filters: AudienceFilters = {}) =>
  api.get<ApiAudiencePreview>('/notifications/audience-preview', filters)

export const sendNotification = (
  dto: {
    title: string
    body: string
    type?: string
  } & AudienceFilters,
) => api.post<{ ok: true; id: string; recipientCount: number }>('/notifications/send', dto)

export const getNotificationHistory = (params: { page?: number; limit?: number } = {}) =>
  api.get<{ data: ApiSentNotification[]; meta: Meta }>('/notifications/history', params)
