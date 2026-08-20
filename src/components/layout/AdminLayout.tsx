import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'

/**
 * الشِل العام — فيجما: sidebar 260px على اليمين + main-pane 1180px على الشمال.
 *
 * ⚠️ قاعدة RTL في المشروع كله:
 *   الاتجاه rtl، فأول عنصر في الـ DOM جوه أي flex-row بيظهر على **اليمين**.
 *   ولأن `text-end` / `justify-end` في RTL معناها **يسار**،
 *   بنستخدم `text-right` / `text-left` (فيزيائية) للنصوص،
 *   و `justify-start` لدفع العناصر لليمين.
 */
export function AdminLayout() {
  return (
    <div className="flex min-h-screen w-full bg-surface">
      <Sidebar />
      <main className="flex min-w-0 flex-1 flex-col">
        <Outlet />
      </main>
    </div>
  )
}
