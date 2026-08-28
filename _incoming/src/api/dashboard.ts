import { api } from './client'

export type ApiDashboardStats = {
  totalStudents: number
  activeSubscriptions: number
  courseRevenue: number
  activeCourses: number
  pendingOrders: number
  pendingDeviceResets: number
}

export type ApiChartSeries = { labels: string[]; points: number[] }
export type ApiBarItem = { label: string; value: number }

export type ApiRecentActivityItem = {
  id: string
  activity: string
  student: string
  content: string
  date: string
  status: string
}

export const getDashboardStats = () => api.get<ApiDashboardStats>('/dashboard/stats')
export const getOrdersTrend = () => api.get<ApiChartSeries>('/dashboard/orders-trend')
export const getSubsPerCourse = () => api.get<ApiBarItem[]>('/dashboard/subs-per-course')
export const getMonthlyRevenue = () => api.get<ApiBarItem[]>('/dashboard/monthly-revenue')
export const getRecentActivity = () =>
  api.get<ApiRecentActivityItem[]>('/dashboard/recent-activity')
