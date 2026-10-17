import { api } from './client'

export type AppPlatform = 'ios' | 'android'

export type ApiPaymentVisibility = {
  hiddenOnIos: boolean
  hiddenOnAndroid: boolean
  updatedAt: string
  updatedByAdminName: string | null
}

export const getPaymentVisibility = () =>
  api.get<ApiPaymentVisibility>('/payment-visibility/admin')

/** قيمة صريحة مش toggle — عشان صفحة قديمة أو دبل كليك ميقلبوش الحالة للعكس */
export const setPaymentVisibility = (platform: AppPlatform, hidden: boolean) =>
  api.patch<{ ok: true; platform: AppPlatform; hidden: boolean }>(
    `/payment-visibility/${platform}`,
    { hidden },
  )
