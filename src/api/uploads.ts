import { api, BASE_URL } from './client'

export type ApiUploadResult = { fileId: string; originalName: string; sizeBytes: number }

export function uploadFile(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  return api.postForm<ApiUploadResult>('/uploads', formData)
}

/** رابط عرض/تحميل مباشر لملف مرفوع — الـ endpoint عام (@Public) عمدًا، شوف تعليق الباك إند */
export function uploadUrl(fileId: string): string {
  return new URL(`/uploads/${fileId}`, BASE_URL).toString()
}
