import { useSyncExternalStore } from 'react'
import { getSnapshot, subscribe } from './auth-store'

/** بيرجع حالة تسجيل الدخول الحالية، وبيعيد رندر أي مكوّن بيستخدمه أول ما تتغيّر. */
export function useAuth() {
  return useSyncExternalStore(subscribe, getSnapshot)
}
