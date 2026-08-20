import {
  BarChart3,
  GraduationCap,
  ReceiptText,
  Smartphone,
  Users2,
  Wallet,
} from 'lucide-react'
import type { Stat } from '@/components/ui/StatCard'

/** kpi-row — فيجما node 7:20 (RTL: أول عنصر يظهر يمين) */
export const DASHBOARD_STATS: Stat[] = [
  {
    label: 'عدد الطلاب',
    value: '1,247',
    note: '+12% هذا الأسبوع',
    noteTone: 'success',
    trend: 'up',
    icon: Users2,
  },
  {
    label: 'اشتراكات نشطة',
    value: '892',
    note: '+5% منذ أمس',
    noteTone: 'success',
    trend: 'up',
    icon: GraduationCap,
  },
  {
    label: 'إيراد الكورسات',
    value: '127,450 ج.م',
    note: 'الإجمالي المعتمد',
    mono: true,
    icon: Wallet,
  },
  {
    label: 'كورسات نشطة',
    value: '23',
    note: 'متاحة بالمنصة',
    icon: BarChart3,
  },
  {
    label: 'طلبات قيد المراجعة',
    value: '14',
    note: 'قيد الانتظار',
    icon: ReceiptText,
  },
  {
    label: 'ريست أجهزة',
    value: '5',
    note: 'طلبات معلقة',
    noteTone: 'danger',
    icon: Smartphone,
  },
]

/**
 * line-chart-area — فيجما node 7:76.
 * الترتيب هنا من **الشمال لليمين** زي الديزاين بالظبط
 * (الـ x-axis في فيجما بيقرأ: يونيو ... يناير).
 * النِّسب مستخرجة من إحداثيات النقط y: 108, 66, 90, 36, 54, 15 في صندوق 130px.
 */
export const ORDERS_TREND = {
  labels: ['يونيو', 'مايو', 'أبريل', 'مارس', 'فبراير', 'يناير'],
  points: [17, 49, 31, 72, 58, 88],
}

/** horizontal-bars-area — فيجما node 7:102 */
export const SUBS_PER_COURSE = [
  { label: 'أساسيات التشريح', value: 340 },
  { label: 'الكيمياء الحيوية', value: 280 },
  { label: 'علم الأدوية', value: 210 },
  { label: 'الفسيولوجي', value: 195 },
  { label: 'الهستولوجي', value: 155 },
]

/** vertical-bars-area — فيجما node 7:130 (ترتيب من الشمال لليمين) */
export const MONTHLY_REVENUE = [
  { label: 'يناير', value: 40 },
  { label: 'فبراير', value: 70 },
  { label: 'مارس', value: 60 },
  { label: 'أبريل', value: 110 },
  { label: 'مايو', value: 95 },
  { label: 'يونيو', value: 130 },
]

export type Activity = {
  id: string
  activity: string
  student: string
  content: string
  date: string
  status: string
}

/** activity-table-card — فيجما node 7:149 */
export const RECENT_ACTIVITY: Activity[] = [
  {
    id: 'a1',
    activity: 'شراء كورس',
    student: 'أحمد محمود محمود',
    content: 'أساسيات التشريح — الترم الأول',
    date: '2026-05-24 14:32',
    status: 'مقبول',
  },
  {
    id: 'a2',
    activity: 'طلب ريست جهاز',
    student: 'مريم عبد الرحمن الصاوي',
    content: 'علم وظائف الأعضاء (Physiology)',
    date: '2026-05-24 14:15',
    status: 'قيد المراجعة',
  },
  {
    id: 'a3',
    activity: 'شراء كورس',
    student: 'خالد عبد الله الرفاعي',
    content: 'الكيمياء الحيوية الطبية',
    date: '2026-05-24 13:58',
    status: 'مقبول',
  },
  {
    id: 'a4',
    activity: 'شراء كورس',
    student: 'سارة عبد الله الشريف',
    content: 'علم الأمراض العام',
    date: '2026-05-24 13:40',
    status: 'مرفوض',
  },
  {
    id: 'a5',
    activity: 'طلب ريست جهاز',
    student: 'عبد الله فيصل الحارثي',
    content: 'علم الأدوية الإكلينيكي',
    date: '2026-05-24 13:12',
    status: 'مقبول',
  },
]
