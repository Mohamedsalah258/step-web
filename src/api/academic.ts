import { api } from './client'

/* ==========================================================================
 * أنواع الاستجابة الخام من STEP API لدومين الهيكل الأكاديمي.
 * الأعداد (colleges/departments/stages/terms/courses) خام (integer) —
 * التنسيق بالعربي (المفرد/الجمع) بيتم في الفرونت (lib/format.ts).
 * ========================================================================== */

type Meta = { page: number; limit: number; total: number; totalPages: number }

export type ApiUniversityRow = {
  id: string
  index: string
  name: string
  colleges: number
  courses: number
  status: string
  date: string
}

export type ApiCollegeRow = {
  id: string
  index: string
  name: string
  universityId: string
  departments: number
  courses: number
  status: string
}

export type ApiSpecializationRow = {
  id: string
  index: string
  name: string
  collegeId: string
  stages: number
  courses: number
  status: string
}

export type ApiStageRow = {
  id: string
  index: string
  name: string
  specializationId: string
  terms: number
  courses: number
  status: string
}

export type ApiTermRow = {
  id: string
  index: string
  name: string
  stageId: string
  courses: number
  status: string
}

type ListParams = { parentId?: string; page?: number; limit?: number }

export const listUniversities = (params: ListParams = {}) =>
  api.get<{ data: ApiUniversityRow[]; meta: Meta }>('/universities', params)

export const createUniversity = (dto: { name: string; status?: 'ACTIVE' | 'DISABLED' }) =>
  api.post<{ ok: true; id: string }>('/universities', dto)

export const updateUniversity = (
  id: string,
  dto: { name?: string; status?: 'ACTIVE' | 'DISABLED' },
) => api.patch<{ ok: true }>(`/universities/${id}`, dto)

export const deleteUniversity = (id: string) =>
  api.delete<{ ok: true }>(`/universities/${id}`)

export const listColleges = (params: ListParams = {}) =>
  api.get<{ data: ApiCollegeRow[]; meta: Meta }>('/colleges', params)

export const createCollege = (dto: {
  universityId: string
  name: string
  status?: 'ACTIVE' | 'DISABLED'
}) => api.post<{ ok: true; id: string }>('/colleges', dto)

export const updateCollege = (
  id: string,
  dto: { name?: string; status?: 'ACTIVE' | 'DISABLED' },
) => api.patch<{ ok: true }>(`/colleges/${id}`, dto)

export const deleteCollege = (id: string) => api.delete<{ ok: true }>(`/colleges/${id}`)

export const listSpecializations = (params: ListParams = {}) =>
  api.get<{ data: ApiSpecializationRow[]; meta: Meta }>('/specializations', params)

export const createSpecialization = (dto: {
  collegeId: string
  name: string
  status?: 'ACTIVE' | 'DISABLED'
}) => api.post<{ ok: true; id: string }>('/specializations', dto)

export const updateSpecialization = (
  id: string,
  dto: { name?: string; status?: 'ACTIVE' | 'DISABLED' },
) => api.patch<{ ok: true }>(`/specializations/${id}`, dto)

export const deleteSpecialization = (id: string) =>
  api.delete<{ ok: true }>(`/specializations/${id}`)

export const listStages = (params: ListParams = {}) =>
  api.get<{ data: ApiStageRow[]; meta: Meta }>('/stages', params)

export const createStage = (dto: {
  specializationId: string
  name: string
  status?: 'ACTIVE' | 'DISABLED'
}) => api.post<{ ok: true; id: string }>('/stages', dto)

export const updateStage = (
  id: string,
  dto: { name?: string; status?: 'ACTIVE' | 'DISABLED' },
) => api.patch<{ ok: true }>(`/stages/${id}`, dto)

export const deleteStage = (id: string) => api.delete<{ ok: true }>(`/stages/${id}`)

export const listTerms = (params: ListParams = {}) =>
  api.get<{ data: ApiTermRow[]; meta: Meta }>('/terms', params)

export const createTerm = (dto: {
  stageId: string
  name: string
  status?: 'ACTIVE' | 'DISABLED'
}) => api.post<{ ok: true; id: string }>('/terms', dto)

export const updateTerm = (id: string, dto: { name?: string; status?: 'ACTIVE' | 'DISABLED' }) =>
  api.patch<{ ok: true }>(`/terms/${id}`, dto)

export const deleteTerm = (id: string) => api.delete<{ ok: true }>(`/terms/${id}`)

export type ApiTermResetImpact = {
  termName: string
  coursesCount: number
  studentsCount: number
  subscriptionsCount: number
}

export const getTermResetImpact = (termId: string) =>
  api.get<ApiTermResetImpact>(`/terms/${termId}/reset-impact`)

export const resetTerm = (termId: string) =>
  api.post<{
    ok: true
    coursesAffected: number
    studentsAffected: number
    subscriptionsAffected: number
  }>(`/terms/${termId}/reset`)
