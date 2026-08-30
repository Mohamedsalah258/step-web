import { api } from './client'

type Meta = { page: number; limit: number; total: number; totalPages: number }

export type OrderStatusRaw = 'PENDING' | 'APPROVED' | 'REJECTED'

export type ApiOrderListItem = {
  id: string
  index: string
  student: string
  course: string
  price: number
  method: string
  reference: string
  date: string
  status: string
  statusRaw: OrderStatusRaw
}

export type ApiOrderDetail = {
  id: string
  status: string
  statusRaw: OrderStatusRaw
  student: { id: string; name: string; phone: string; email: string }
  course: { id: string; name: string }
  amount: number
  paymentMethodName: string
  referenceNumber: string
  receiptFileId: string | null
  rejectionReason: string | null
  reviewedByAdminName: string | null
  reviewedAt: string | null
  createdAt: string
}

type ListOrdersParams = {
  q?: string
  tab?: 'all' | 'pending' | 'approved' | 'rejected'
  date?: string
  courseId?: string
  universityId?: string
  collegeId?: string
  specializationId?: string
  page?: number
  limit?: number
}

export const listOrders = (params: ListOrdersParams = {}) =>
  api.get<{
    data: ApiOrderListItem[]
    meta: Meta & { tabs: { all: number; pending: number; approved: number; rejected: number } }
  }>('/orders', params)

export const getOrderDetail = (id: string) => api.get<ApiOrderDetail>(`/orders/${id}`)

export const approveOrder = (id: string) => api.post<{ ok: true }>(`/orders/${id}/approve`)

export const rejectOrder = (id: string, reason: string) =>
  api.post<{ ok: true }>(`/orders/${id}/reject`, { reason })
