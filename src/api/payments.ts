import { api } from './client'

export type ApiPaymentMethodType = 'WALLET' | 'BANK'

export type ApiPaymentMethod = {
  id: string
  name: string
  type: ApiPaymentMethodType
  accountNumber: string | null
  bankName: string | null
  holderName: string | null
  instructions: string | null
  isActive: boolean
}

type PaymentMethodDto = {
  name: string
  type: ApiPaymentMethodType
  accountNumber?: string
  bankName?: string
  holderName?: string
  instructions?: string
  isActive?: boolean
}

export const listPaymentMethods = () => api.get<ApiPaymentMethod[]>('/payment-methods')

export const createPaymentMethod = (dto: PaymentMethodDto) =>
  api.post<{ ok: true; id: string }>('/payment-methods', dto)

export const updatePaymentMethod = (id: string, dto: Partial<PaymentMethodDto>) =>
  api.patch<{ ok: true }>(`/payment-methods/${id}`, dto)

export const togglePaymentMethod = (id: string) =>
  api.patch<{ ok: true; isActive: boolean }>(`/payment-methods/${id}/toggle`)

export const deletePaymentMethod = (id: string) =>
  api.delete<{ ok: true }>(`/payment-methods/${id}`)
