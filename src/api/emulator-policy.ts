import { api } from './client'

export type ApiEmulatorPolicy = {
  allowEmulators: boolean
  updatedAt: string
  updatedByAdminName: string | null
}

export const getEmulatorPolicy = () => api.get<ApiEmulatorPolicy>('/emulator-policy/admin')

/** قيمة صريحة مش toggle — عشان صفحة قديمة أو دبل كليك ميقلبوش الحالة من غير تأكيد */
export const setEmulatorPolicy = (allowEmulators: boolean) =>
  api.patch<{ ok: true; allowEmulators: boolean }>('/emulator-policy', { allowEmulators })
