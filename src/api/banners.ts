import { api } from './client'

export type ApiBannerType = 'PROMOTIONAL' | 'INFORMATIONAL'

export type ApiBanner = {
  id: string
  title: string
  type: ApiBannerType
  imageFileId: string | null
  order: number
  isActive: boolean
}

type BannerDto = {
  title: string
  type: ApiBannerType
  imageFileId?: string
  order?: number
  isActive?: boolean
}

export const listBanners = () => api.get<ApiBanner[]>('/banners')

export const createBanner = (dto: BannerDto) =>
  api.post<{ ok: true; id: string }>('/banners', dto)

export const updateBanner = (id: string, dto: Partial<BannerDto>) =>
  api.patch<{ ok: true }>(`/banners/${id}`, dto)

export const toggleBanner = (id: string) =>
  api.patch<{ ok: true; isActive: boolean }>(`/banners/${id}/toggle`)

export const deleteBanner = (id: string) => api.delete<{ ok: true }>(`/banners/${id}`)
