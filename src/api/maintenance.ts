import { api } from './client'

export type ApiMaintenanceState = {
  isActive: boolean
  message: string
  updatedAt: string
  updatedByAdminName: string | null
}

export type ApiMaintenanceLogRow = {
  id: string
  date: string
  duration: string
  reason: string
}

export const getMaintenanceState = () => api.get<ApiMaintenanceState>('/maintenance')

export const getMaintenanceLog = () => api.get<ApiMaintenanceLogRow[]>('/maintenance/log')

export const updateMaintenanceMessage = (message: string) =>
  api.patch<{ ok: true }>('/maintenance/message', { message })

export const toggleMaintenance = () =>
  api.patch<{ ok: true; isActive: boolean }>('/maintenance/toggle')
