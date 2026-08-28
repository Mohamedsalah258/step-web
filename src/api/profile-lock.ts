import { api } from './client'

export type ApiProfileLockState = {
  isLocked: boolean
  updatedAt: string
  updatedByAdminName: string | null
}

export const getProfileLockState = () => api.get<ApiProfileLockState>('/profile-lock')

export const toggleProfileLock = () =>
  api.patch<{ ok: true; isLocked: boolean }>('/profile-lock/toggle')
