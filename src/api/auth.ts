import { api } from './client'

export type ApiAdmin = {
  id: string
  email: string
  name: string
  avatarFileId: string | null
}

export type ApiAuthResponse = {
  accessToken: string
  admin: ApiAdmin
}

export function login(email: string, password: string) {
  return api.post<ApiAuthResponse>('/auth/login', { email, password })
}

export function registerAdmin(dto: {
  email: string
  password: string
  name: string
  inviteCode: string
}) {
  return api.post<ApiAuthResponse>('/auth/register', dto)
}

export function getMe() {
  return api.get<ApiAdmin>('/auth/me')
}

export function updateMe(dto: Partial<{ name: string; email: string; avatarFileId: string }>) {
  return api.patch<ApiAdmin>('/auth/me', dto)
}

export function changePassword(currentPassword: string, newPassword: string) {
  return api.post<{ ok: true }>('/auth/change-password', { currentPassword, newPassword })
}
