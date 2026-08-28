import { useCallback, useEffect, useRef, useState } from 'react'
import { ApiError } from '@/api/client'

/**
 * هوك عام لجلب بيانات من الـ API الحقيقي مع حالة loading/error بسيطة.
 * الهدف إنه يتكرر في كل صفحة بدل ما كل صفحة تعمل useState/useEffect بنفسها.
 *
 * `deps` بتشتغل زي useEffect: أي تغيير فيها (بحث جديد، صفحة جديدة...) بيعيد
 * الجلب تلقائي.
 */
export function useAsync<T>(fetcher: () => Promise<T>, deps: unknown[]) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  // عشان لو الطلب اتلغى (تغيّر deps قبل ما يخلص) نتجاهل نتيجته القديمة
  const requestId = useRef(0)

  const load = useCallback(() => {
    const id = ++requestId.current
    setLoading(true)
    setError(null)
    fetcher()
      .then((result) => {
        if (id === requestId.current) setData(result)
      })
      .catch((err: unknown) => {
        if (id === requestId.current) {
          setError(err instanceof ApiError ? err.message : 'تعذر الاتصال بالسيرفر')
        }
      })
      .finally(() => {
        if (id === requestId.current) setLoading(false)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [load])

  return { data, loading, error, reload: load }
}
