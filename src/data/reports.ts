/* ============================================================
   بيانات التقارير — فيجما frames:
   37:1035 v3-reports-full · 43:5 v3-report-students
   43:287 v3-report-orders · 43:777 v3-report-devices
   الأرقام والصفوف بقت حقيقية من الـ API (شوف api/reports.ts) — هنا بس
   العناوين الثابتة (تابس/عناوين الرسوم البيانية).
   ============================================================ */

/** تابس التقارير — node 37:1049. RTL: أول عنصر = يمين (إيرادات هي التاب النشط) */
export const REPORT_TABS = [
  { label: 'إيرادات', to: '/reports', end: true },
  { label: 'طلاب واشتراكات', to: '/reports/students' },
  { label: 'طلبات الشراء', to: '/reports/orders' },
  { label: 'أجهزة', to: '/reports/devices' },
]

export const REVENUE_CHART_TITLE = 'الإيرادات بحسب الكلية (ج.م)'
export const STUDENTS_CHART_TITLE = 'الطلاب حسب الكلية (طلاب لهم اشتراك نشط)'
export const ORDERS_CHART_TITLE = 'الطلبات حسب الحالة (عدد الطلبات المستلمة)'
export const DEVICES_CHART_TITLE = 'الأجهزة حسب نظام التشغيل (تقريبي من موديل الجهاز)'
