import { api } from './client'

/* ==========================================================================
 * أنواع الاستجابة الخام من STEP API لدومين الكورسات.
 * ========================================================================== */

type Meta = { page: number; limit: number; total: number; totalPages: number }

export type ApiCourseListItem = {
  id: string
  index: string
  name: string
  college: string
  term: string
  price: number
  isFree: boolean
  videos: number
  students: number
  status: string
}

export type ApiCourseDetail = {
  id: string
  name: string
  description: string | null
  path: string
  price: number
  isFree: boolean
  coverFileId: string | null
  order: number
  status: string
  statusRaw: 'DRAFT' | 'PUBLISHED' | 'WITHDRAWN'
  universityId: string
  collegeId: string
  specializationId: string
  stageId: string
  termId: string
  tabCounts: { videos: number; notes: number; summaries: number; exams: number }
}

export type ApiContentItem = {
  id: string
  index: string
  title: string
  description: string | null
  fileId: string | null
  externalUrl: string | null
  order: number
  createdAt: string
}

type ListCoursesParams = {
  q?: string
  collegeId?: string
  termId?: string
  tab?: 'all' | 'active' | 'inactive'
  page?: number
  limit?: number
}

export const listCourses = (params: ListCoursesParams = {}) =>
  api.get<{
    data: ApiCourseListItem[]
    meta: Meta & { tabs: { all: number; active: number; inactive: number } }
  }>('/courses', params)

export const createCourse = (dto: {
  name: string
  description?: string
  universityId: string
  collegeId: string
  specializationId: string
  stageId: string
  termId: string
  price?: number
  isFree?: boolean
  coverFileId?: string
  order?: number
  status?: 'DRAFT' | 'PUBLISHED'
}) => api.post<{ ok: true; id: string }>('/courses', dto)

export const getCourseDetail = (id: string) => api.get<ApiCourseDetail>(`/courses/${id}`)

export type ApiCourseStats = { studentsCount: number; revenue: number }

export const getCourseStats = (id: string) => api.get<ApiCourseStats>(`/courses/${id}/stats`)

export const updateCourse = (
  id: string,
  dto: Partial<{
    name: string
    description: string
    price: number
    isFree: boolean
    coverFileId: string
    order: number
    status: 'DRAFT' | 'PUBLISHED' | 'WITHDRAWN'
    universityId: string
    collegeId: string
    specializationId: string
    stageId: string
    termId: string
  }>,
) => api.patch<{ ok: true }>(`/courses/${id}`, dto)

export const toggleCourse = (id: string) =>
  api.patch<{ ok: true; status: string }>(`/courses/${id}/toggle`)

export const deleteCourse = (id: string) => api.delete<{ ok: true }>(`/courses/${id}`)

/* ---- محتوى الكورس: فيديوهات/مذكرات/ملاحظات/امتحانات ---- */

type CreateContentDto = {
  title: string
  description?: string
  fileId?: string
  externalUrl?: string
  order?: number
}

function contentApi(kind: 'videos' | 'notes' | 'summaries' | 'exams') {
  return {
    list: (courseId: string) => api.get<ApiContentItem[]>(`/courses/${courseId}/${kind}`),
    create: (courseId: string, dto: CreateContentDto) =>
      api.post<{ ok: true; id: string }>(`/courses/${courseId}/${kind}`, dto),
    reorder: (courseId: string, ids: string[]) =>
      api.patch<{ ok: true }>(`/courses/${courseId}/${kind}/reorder`, { ids }),
  }
}

export const videosApi = contentApi('videos')
export const notesApi = contentApi('notes')
export const summariesApi = contentApi('summaries')
export const examsApi = contentApi('exams')

/** تعديل/حذف عنصر محتوى — مشترك لكل الأنواع، الـ id فريد عالميًا */
export const updateContentItem = (
  itemId: string,
  dto: Partial<{
    title: string
    description: string
    fileId: string
    externalUrl: string
    order: number
  }>,
) => api.patch<{ ok: true }>(`/course-content/${itemId}`, dto)

export const deleteContentItem = (itemId: string) =>
  api.delete<{ ok: true }>(`/course-content/${itemId}`)
