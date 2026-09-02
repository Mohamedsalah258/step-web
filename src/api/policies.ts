import { api } from './client'

export type PolicySlug = 'privacy' | 'refund' | 'terms' | 'deletion'

export type ApiPolicy = {
  type: 'PRIVACY' | 'REFUND' | 'TERMS' | 'DELETION'
  heading: string
  paragraphs: string[]
  content: string
  updatedAt: string
  updatedByAdminName: string | null
}

export const getPolicy = (slug: PolicySlug) => api.get<ApiPolicy>(`/policies/${slug}`)

export const updatePolicy = (slug: PolicySlug, dto: { heading: string; content: string }) =>
  api.patch<{ ok: true }>(`/policies/${slug}`, dto)
