import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { isAuthenticated } from '@/lib/auth'

/**
 * حارس الراوت: أي مسار تحت `/` محتاج توكن. لو مفيش، يرجّع لـ `/login`
 * وحافظ على المسار الأصلي في `state.from` عشان اللوجن يرجع بيه بعد الدخول.
 */
export function RequireAuth() {
  const location = useLocation()

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}
