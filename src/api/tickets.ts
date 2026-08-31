import { api } from './client'

type Meta = { page: number; limit: number; total: number; totalPages: number }

export type TicketStatusRaw = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED' | 'CANCELLED'
export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
export type TicketsTab = 'all' | 'open' | 'in_progress' | 'resolved' | 'closed' | 'cancelled'

/** STUDENT_TICKET = تذكرة طالب مسجل دخول (المحادثة الكاملة في /tickets/:id).
 * GUEST_CONTACT = رسالة "تواصل مع الدعم" من زائر مش مسجّل (شاشة اللوجين) —
 * جدول منفصل تمامًا في الباك اند، مفيهوش تصنيف/أولوية/محادثة داخلية، والرد
 * عليها بيحصل بإيميل عادي مش بفتح صفحة تفاصيل. */
export type TicketKind = 'STUDENT_TICKET' | 'GUEST_CONTACT'

export type ApiTicketListItem = {
  kind: TicketKind
  id: string
  subject: string
  /** النص الكامل لرسالة الزائر — GUEST_CONTACT بس، subject فوق نسخة مقصوصة منه */
  message?: string
  student: { id: string | null; name: string; email?: string }
  category: string | null
  priority: TicketPriority | null
  status: string
  statusRaw: TicketStatusRaw | null
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

/** رد على رسالة "تواصل مع الدعم" من زائر (صف GUEST_CONTACT) — بيتبعت
 * كإيميل حقيقي لصاحب الرسالة، عكس replyToTicket اللي بيضيف رسالة محادثة. */
export const replyToGuestContact = (id: string, message: string) =>
  api.post<{ ok: true }>(`/contact-support/${id}/reply`, { message })

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
