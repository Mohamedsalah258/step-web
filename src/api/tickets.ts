import { api } from './client'

type Meta = { page: number; limit: number; total: number; totalPages: number }

export type TicketStatusRaw = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED' | 'CANCELLED'
export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
export type TicketsTab = 'all' | 'open' | 'in_progress' | 'resolved' | 'closed' | 'cancelled'

export type ApiTicketListItem = {
  id: string
  subject: string
  student: { id: string; name: string }
  category: string | null
  priority: TicketPriority
  status: string
  statusRaw: TicketStatusRaw
  assignedAdminName: string | null
  createdAt: string
  updatedAt: string
}

export type ApiTicketMessage = {
  id: string
  senderType: 'STUDENT' | 'ADMIN'
  senderName: string
  message: string
  attachmentFileId: string | null
  isInternal: boolean
  createdAt: string
}

export type ApiTicketDetail = {
  id: string
  subject: string
  description: string
  student: { id: string; name: string; email: string; phone: string }
  category: { id: string; name: string } | null
  priority: TicketPriority
  status: string
  statusRaw: TicketStatusRaw
  assignedAdminId: string | null
  assignedAdminName: string | null
  resolution: string | null
  resolvedAt: string | null
  closedAt: string | null
  createdAt: string
  updatedAt: string
  messages: ApiTicketMessage[]
}

export type ApiTicketCategory = { id: string; name: string; isActive: boolean; order: number }

type ListTicketsParams = {
  q?: string
  tab?: TicketsTab
  priority?: TicketPriority
  categoryId?: string
  page?: number
  limit?: number
}

export const listTickets = (params: ListTicketsParams = {}) =>
  api.get<{
    data: ApiTicketListItem[]
    meta: Meta & {
      tabs: { all: number; open: number; inProgress: number; resolved: number; closed: number; cancelled: number }
    }
  }>('/tickets', params)

export const getTicketDetail = (id: string) => api.get<ApiTicketDetail>(`/tickets/${id}`)

export const replyToTicket = (id: string, message: string, isInternal?: boolean) =>
  api.post<{ ok: true; id: string }>(`/tickets/${id}/messages`, { message, isInternal })

export const updateTicketStatus = (id: string, status: TicketStatusRaw, resolution?: string) =>
  api.patch<{ ok: true }>(`/tickets/${id}/status`, { status, resolution })

export const listTicketCategories = (includeInactive = false) =>
  api.get<ApiTicketCategory[]>('/ticket-categories', {
    includeInactive: includeInactive ? 'true' : undefined,
  })

export const createTicketCategory = (name: string, order?: number) =>
  api.post<{ ok: true; id: string }>('/ticket-categories', { name, order })

export const deactivateTicketCategory = (id: string) =>
  api.delete<{ ok: true }>(`/ticket-categories/${id}`)
