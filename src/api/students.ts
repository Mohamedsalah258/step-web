import { api } from './client'
import type { StudentsTab } from '@/data/students'

/* ==========================================================================
 * أنواع الاستجابة الخام من STEP API (شوف step-backend/README.md).
 * القيم هنا خام (تواريخ ISO، أرقام) — التنسيق والنصوص الثابتة تفضل في الفرونت.
 * ========================================================================== */

export type ApiStudentListItem = {
  id: string
  index: string
  name: string
  email: string
  phone: string
  subscriptions: string
  device: string
  status: string
}

export type ApiStudentsListResponse = {
  data: ApiStudentListItem[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
    tabs: { all: number; active: number; banned: number }
  }
}

export type ApiStudentDetail = {
  id: string
  name: string
  email: string
  phone: string
  status: string
  registeredAt: string
  device: { model: string; identifier: string | null } | null
  resetsUsed: number
  maxResets: number
  resetsPercent: number
  lastResetAt: string | null
  nextResetAt: string | null
  resetLog: Array<{ id: string; model: string; by: string; date: string }>
  /** استثناء يدوي مفتوح للطالب ده — بيتجاهل القفل العام (شوف academicEditLocked) */
  profileEditUnlocked: boolean
  /** الحالة الفعلية دلوقتي (القفل العام + الاستثناء) — ده اللي يحدد شكل الزرار */
  academicEditLocked: boolean
  subscriptions: Array<{
    id: string
    index: string
    course: string
    college: string
    date: string
    status: string
    price: number
  }>
}

export function listStudents(params: {
  q?: string
  tab?: StudentsTab
  course?: string
  page?: number
  limit?: number
}) {
  return api.get<ApiStudentsListResponse>('/students', {
    q: params.q,
    tab: params.tab,
    course: params.course,
    page: params.page,
    limit: params.limit,
  })
}

export function getStudentDetail(id: string) {
  return api.get<ApiStudentDetail>(`/students/${id}`)
}

export function banStudent(id: string) {
  return api.post<{ ok: true }>(`/students/${id}/ban`)
}

export function unbanStudent(id: string) {
  return api.post<{ ok: true }>(`/students/${id}/unban`)
}

/** فتح تعديل المستوى/الترم للطالب ده بس، حتى لو القفل العام مفعّل */
export function unlockStudentProfile(id: string) {
  return api.post<{ ok: true }>(`/students/${id}/profile-unlock`)
}

export function lockStudentProfile(id: string) {
  return api.post<{ ok: true }>(`/students/${id}/profile-lock`)
}

export function deviceResetStudent(id: string) {
  return api.post<{ ok: true; resetsUsed: number }>(`/students/${id}/device-reset`)
}

export function cancelSubscription(studentId: string, subscriptionId: string) {
  return api.post<{ ok: true }>(
    `/students/${studentId}/subscriptions/${subscriptionId}/cancel`,
  )
}

export function reactivateSubscription(studentId: string, subscriptionId: string) {
  return api.post<{ ok: true }>(
    `/students/${studentId}/subscriptions/${subscriptionId}/reactivate`,
  )
}

export function openCourse(
  studentId: string,
  body: { courseName: string; collegeName?: string; price?: number },
) {
  return api.post<{ ok: true; subscriptionId: string }>(
    `/students/${studentId}/subscriptions/open`,
    body,
  )
}
