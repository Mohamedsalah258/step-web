import { useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { useAuth } from '@/lib/useAuth'

/**
 * الشِل العام — فيجما: sidebar 260px على اليمين + main-pane 1180px على الشمال.
 *
 * Responsive:
 *   ≥ lg (1024px): السايدبار ثابت، الـ main بيأخذ الباقي.
 *   < lg: السايدبار مخفي، يظهر كـ overlay مع backdrop عند الضغط على hamburger.
 *
 * ⚠️ قاعدة RTL في المشروع كله:
 *   الاتجاه rtl، فأول عنصر في الـ DOM جوه أي flex-row بيظهر على **اليمين**.
 *   ولأن `text-end` / `justify-end` في RTL معناها **يسار**،
 *   بنستخدم `text-right` / `text-left` (فيزيائية) للنصوص،
 *   و `justify-start` لدفع العناصر لليمين.
 */
export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const auth = useAuth()

  // لسه بنتحقق من التوكن المخزن (أول تحميل للصفحة) — مانورّيش الشِل ولا
  // نحوّل لـ /login لحد ما نعرف الحالة الحقيقية.
  if (auth.status === 'loading') {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-surface">
        <p className="text-base font-semibold text-muted">...جارِ التحقق من الجلسة</p>
      </div>
    )
  }

  if (auth.status === 'unauthenticated') {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="flex min-h-screen w-full bg-surface">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="flex min-w-0 flex-1 flex-col">
        <Outlet context={{ onToggleSidebar: () => setSidebarOpen(true) }} />
      </main>
    </div>
  )
}
