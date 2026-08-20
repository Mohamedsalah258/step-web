import {
  Activity,
  CheckCircle2,
  Clock,
  CreditCard,
  GraduationCap,
  Monitor,
  RotateCcw,
  ShoppingBag,
  Smartphone,
  UserCheck,
  Users2,
  Wallet,
  type LucideIcon,
} from 'lucide-react'
import type { Stat } from '@/components/ui/StatCard'

/* ============================================================
   بيانات التقارير — فيجما frames:
   37:1035 v3-reports-full · 43:5 v3-report-students
   43:287 v3-report-orders · 43:777 v3-report-devices
   ============================================================ */

/** تابس التقارير — node 37:1049. RTL: أول عنصر = يمين (إيرادات هي التاب النشط) */
export const REPORT_TABS = [
  { label: 'إيرادات', to: '/reports', end: true },
  { label: 'طلاب واشتراكات', to: '/reports/students' },
  { label: 'طلبات الشراء', to: '/reports/orders' },
  { label: 'أجهزة', to: '/reports/devices' },
]

/** filters-card — node 37:1060 */
export const REPORT_FILTERS = {
  groupBy: 'تجميع بحسب: الكلية',
  dateRange: '01/01/2026 – 30/06/2026',
  compare: 'مقارنة بالفترة السابقة',
  /** ترتيب فيجما من الشمال لليمين (x=0 / 112 / 230) */
  exports: ['تصدير PDF', 'تصدير Excel', 'تصدير CSV'],
}

export type PreviewRow = {
  summary: string
  label?: string
  icon?: LucideIcon
}

export const PREVIEWS_TITLE = 'معاينات الأقسام الأخرى'

/* ---------------------------------------------------------------
   1) إيرادات — v3-reports-full (node 37:1035)
   --------------------------------------------------------------- */

/** kpi-row node 37:1088 — RTL: أول كارت يمين (إجمالي الإيراد) */
export const REVENUE_STATS: Stat[] = [
  {
    label: 'إجمالي الإيراد',
    value: '127,450 ج.م',
    note: '+12% مقارنة بالفترة السابقة',
    noteTone: 'success',
    trend: 'up',
    icon: Activity,
    mono: true,
  },
  {
    label: 'متوسط قيمة الطلب',
    value: '320 ج.م',
    note: 'لجميع الكورسات والخدمات',
    icon: CreditCard,
    mono: true,
  },
  {
    label: 'طلبات تمت الموافقة عليها',
    value: '398 طلب',
    note: '+8% عن الفترة السابقة',
    noteTone: 'success',
    trend: 'up',
    icon: CheckCircle2,
    mono: true,
  },
]

/**
 * chart node 37:1119 — الترتيب من الشمال لليمين زي فيجما.
 * تحويل المقاسات: ارتفاع العمود بالبكسل / 160px = القيمة / 32200
 * (38→7700، 73→14700، 101→20300، 142→28500، 160→32200)
 * فبنمرّر القيم المطلقة و VBarChart بيقسم على أكبر قيمة.
 */
export const REVENUE_BY_FACULTY = [
  { label: 'التمريض', value: 7700 },
  { label: 'العلاج الطبيعي', value: 14700 },
  { label: 'طب الأسنان', value: 20300 },
  { label: 'الصيدلة', value: 28500 },
  { label: 'كلية الطب', value: 32200 },
]

export const REVENUE_CHART_TITLE = 'الإيرادات بحسب الكلية (ج.م)'

export type RevenueRow = {
  faculty: string
  orders: string
  revenue: string
  /** نسبة (عرض الشريط = القيمة نفسها من 180px) */
  share: number
  shareLabel: string
  delta: string
  up: boolean
}

/** table node 37:1140 */
export const REVENUE_ROWS: RevenueRow[] = [
  {
    faculty: 'كلية الطب',
    orders: '184 طلب',
    revenue: '64,400 ج.م',
    share: 50.5,
    shareLabel: '50.5%',
    delta: '+15%',
    up: true,
  },
  {
    faculty: 'الصيدلة',
    orders: '92 طلب',
    revenue: '32,200 ج.م',
    share: 25.3,
    shareLabel: '25.3%',
    delta: '+8%',
    up: true,
  },
  {
    faculty: 'طب الأسنان',
    orders: '58 طلب',
    revenue: '20,300 ج.م',
    share: 15.9,
    shareLabel: '15.9%',
    delta: '-3%',
    up: false,
  },
  {
    faculty: 'العلاج الطبيعي',
    orders: '42 طلب',
    revenue: '14,700 ج.م',
    share: 11.5,
    shareLabel: '11.5%',
    delta: '+5%',
    up: true,
  },
  {
    faculty: 'التمريض',
    orders: '22 طلب',
    revenue: '7,700 ج.م',
    share: 6.0,
    shareLabel: '6.0%',
    delta: '+2%',
    up: true,
  },
]

/** node 37:1207 */
export const REVENUE_PREVIEWS: PreviewRow[] = [
  {
    label: 'طلاب واشتراكات',
    icon: Users2,
    summary: 'إجمالي الطلاب: 1,247 · اشتراكات نشطة: 892',
  },
  {
    label: 'طلبات الشراء',
    icon: ShoppingBag,
    summary: 'قيد المراجعة: 14 · مقبول: 398 · مرفوض: 23',
  },
  { summary: 'إجمالي المشاهدات: 45,320 · تحميلات PDF: 12,450' },
  {
    label: 'الأجهزة',
    icon: Monitor,
    summary: 'أجهزة مربوطة: 1,180 · طلبات ريست: 36',
  },
]

/* ---------------------------------------------------------------
   2) طلاب واشتراكات — v3-report-students (node 43:5)
   --------------------------------------------------------------- */

/** kpi-row node 43:58 — RTL: أول كارت يمين */
export const STUDENT_STATS: Stat[] = [
  {
    label: 'إجمالي الطلاب المسجلين',
    value: '1,245 طالب',
    note: 'شامل كافة الكليات',
    icon: Users2,
    mono: true,
  },
  {
    label: 'الطلاب النشطين',
    value: '890 طالب',
    note: '+12% عن الشهر السابق',
    noteTone: 'success',
    trend: 'up',
    icon: UserCheck,
    mono: true,
  },
  {
    label: 'الاشتراكات الفعالة',
    value: '2,340 اشتراك',
    note: 'فعالة للترم الحالي',
    icon: GraduationCap,
    mono: true,
  },
]

export const STUDENTS_CHART_TITLE = 'الطلاب حسب الكلية (عدد الطلاب المسجلين)'

/**
 * chart node 43:90 — من الشمال لليمين.
 * تحويل: 160px = 450 طالب (38→100، 63→165، 81→210، 122→320، 160→450)
 */
export const STUDENTS_BY_FACULTY = [
  { label: 'التمريض', value: 100 },
  { label: 'العلاج الطبيعي', value: 165 },
  { label: 'طب الأسنان', value: 210 },
  { label: 'الصيدلة', value: 320 },
  { label: 'كلية الطب', value: 450 },
]

export type StudentRow = {
  faculty: string
  total: string
  active: string
  subs: string
  /** عرض الشريط من 180px → النسبة نفسها */
  activity: number
  activityLabel: string
  rate: string
}

/** table node 43:111 */
export const STUDENT_ROWS: StudentRow[] = [
  {
    faculty: 'كلية الطب',
    total: '450 طالب',
    active: '320 طالب',
    subs: '420 اشتراك',
    activity: 71,
    activityLabel: '71%',
    rate: '71.1%',
  },
  {
    faculty: 'الصيدلة',
    total: '320 طالب',
    active: '240 طالب',
    subs: '310 اشتراك',
    activity: 75,
    activityLabel: '75%',
    rate: '75.0%',
  },
  {
    faculty: 'طب الأسنان',
    total: '210 طالب',
    active: '150 طالب',
    subs: '195 اشتراك',
    activity: 71,
    activityLabel: '71%',
    rate: '71.4%',
  },
  {
    faculty: 'العلاج الطبيعي',
    total: '165 طالب',
    active: '110 طالب',
    subs: '145 اشتراك',
    activity: 66,
    activityLabel: '66%',
    rate: '66.6%',
  },
  {
    faculty: 'التمريض',
    total: '100 طالب',
    active: '70 طالب',
    subs: '90 اشتراك',
    activity: 70,
    activityLabel: '70%',
    rate: '70.0%',
  },
]

/** node 43:184 — (يمين، شمال) */
export const STUDENTS_SUMMARY = {
  right: 'إجمالي طلاب المنصة: 1,245 طالب مسجل',
  left: 'معدل النشاط الكلي للمنصة: 71.5%',
}

/** node 43:187 */
export const STUDENTS_PREVIEWS: PreviewRow[] = [
  {
    label: 'إيرادات الكليات',
    icon: Wallet,
    summary: 'إجمالي الإيرادات: 127,450 ج.م · الكليات النشطة: 5',
  },
  {
    label: 'طلبات الشراء',
    icon: ShoppingBag,
    summary: 'قيد المراجعة: 14 · مقبول: 398 · مرفوض: 23',
  },
  { summary: 'إجمالي المشاهدات: 45,320 · تحميلات PDF: 12,450' },
  {
    label: 'الأجهزة المربوطة',
    icon: Monitor,
    summary: 'أجهزة مربوطة: 1,180 · طلبات ريست: 36',
  },
]

/* ---------------------------------------------------------------
   3) طلبات الشراء — v3-report-orders (node 43:287)
   --------------------------------------------------------------- */

/** kpi-row node 43:340 — RTL: أول كارت يمين */
export const ORDER_STATS: Stat[] = [
  {
    label: 'إجمالي الطلبات المستلمة',
    value: '398 طلب',
    note: 'تمت معالجتها بالكامل',
    icon: ShoppingBag,
    mono: true,
  },
  {
    label: 'طلبات معلقة',
    value: '23 طلب',
    note: 'بحاجة إلى مراجعة',
    icon: Clock,
    mono: true,
  },
  {
    label: 'معدل القبول الكلي',
    value: '87.4%',
    note: 'معدل صحي ومستقر',
    icon: CheckCircle2,
    mono: true,
  },
]

export const ORDERS_CHART_TITLE = 'الطلبات حسب الحالة (عدد الطلبات المستلمة)'

/**
 * chart node 43:370 — من الشمال لليمين.
 * تحويل: 160px = 312 طلب (75→63، والعمود الأصغر 38px هو الحد الأدنى لـ 23 طلب)
 */
export const ORDERS_BY_STATUS = [
  { label: 'معلق', value: 23 },
  { label: 'مرفوض', value: 63 },
  { label: 'مقبول', value: 312 },
]

export type OrderReportRow = {
  index: string
  course: string
  accepted: string
  rejected: string
  pending: string
  total: string
}

/** table node 43:383 */
export const ORDER_ROWS: OrderReportRow[] = [
  {
    index: '1',
    course: 'كورس فسيولوجي متكامل',
    accepted: '145',
    rejected: '12',
    pending: '8',
    total: '165',
  },
  {
    index: '2',
    course: 'أساسيات علم الأدوية',
    accepted: '92',
    rejected: '15',
    pending: '5',
    total: '112',
  },
  {
    index: '3',
    course: 'التشريح التطبيقي للأسنان',
    accepted: '42',
    rejected: '22',
    pending: '4',
    total: '68',
  },
  {
    index: '4',
    course: 'مبادئ العلاج الطبيعي المكثف',
    accepted: '21',
    rejected: '10',
    pending: '4',
    total: '35',
  },
  {
    index: '5',
    course: 'تمريض الرعاية المركزة للبالغين',
    accepted: '12',
    rejected: '4',
    pending: '2',
    total: '18',
  },
]

/** node 43:426 */
export const ORDERS_SUMMARY = {
  right: 'إجمالي المعالجات الكلية للطلبات: 398 طلب مستلم',
  left: 'معدل القبول العام: 87.4%',
}

/** node 43:429 */
export const ORDERS_PREVIEWS: PreviewRow[] = [
  {
    label: 'إيرادات الكليات',
    icon: Wallet,
    summary: 'إجمالي الإيرادات: 127,450 ج.م · الكليات النشطة: 5',
  },
  {
    label: 'طلاب واشتراكات',
    icon: Users2,
    summary: 'إجمالي الطلاب: 1,247 · اشتراكات نشطة: 892',
  },
  { summary: 'إجمالي المشاهدات: 45,320 · تحميلات PDF: 12,450' },
  {
    label: 'الأجهزة المربوطة',
    icon: Monitor,
    summary: 'أجهزة مربوطة: 1,180 · طلبات ريست: 36',
  },
]

/* ---------------------------------------------------------------
   4) أجهزة — v3-report-devices (node 43:777)
   --------------------------------------------------------------- */

/** kpi-row node 43:837 — كارتين فقط، RTL: طلبات الريست يمين */
export const DEVICE_STATS: Stat[] = [
  {
    label: 'طلبات إعادة تعيين الشهر',
    value: '45 طلب ريست',
    note: '-8% عن الفترة السابقة',
    noteTone: 'success',
    trend: 'down',
    icon: RotateCcw,
    mono: true,
  },
  {
    label: 'إجمالي الأجهزة المسجلة',
    value: '1,870 جهاز',
    note: 'شامل الهواتف والأجهزة اللوحية',
    icon: Smartphone,
    mono: true,
  },
]

export const DEVICES_CHART_TITLE = 'الأجهزة حسب نظام التشغيل'

/**
 * chart node 43:873 — من الشمال لليمين.
 * تحويل: 155px = 1120 جهاز، 95px ≈ 750 جهاز
 */
export const DEVICES_BY_OS = [
  { label: 'iOS', value: 750 },
  { label: 'Android', value: 1120 },
]

export type DeviceReportRow = {
  index: string
  student: string
  devices: string
  os: string
  lastSeen: string
  status: string
}

/** table node 43:882 */
export const DEVICE_ROWS: DeviceReportRow[] = [
  {
    index: '1',
    student: 'أحمد محمد عبد الرحمن',
    devices: '2 جهاز',
    os: 'Android 13',
    lastSeen: 'منذ دقيقتين',
    status: 'نشط',
  },
  {
    index: '2',
    student: 'سارة علي يوسف',
    devices: '1 جهاز',
    os: 'iOS 17.2',
    lastSeen: 'منذ ساعة',
    status: 'نشط',
  },
  {
    index: '3',
    student: 'محمود إبراهيم مصطفى',
    devices: '3 أجهزة',
    os: 'Android 12',
    lastSeen: 'منذ يومين',
    status: 'مغلق',
  },
  {
    index: '4',
    student: 'نوران شريف عبدالله',
    devices: '1 جهاز',
    os: 'iOS 16.5',
    lastSeen: 'منذ ٥ ساعات',
    status: 'نشط',
  },
  {
    index: '5',
    student: 'مصطفى خالد السيد',
    devices: '2 جهاز',
    os: 'Android 14',
    lastSeen: 'منذ أسبوع',
    status: 'خامل',
  },
]

/** node 43:935 */
export const DEVICES_SUMMARY = {
  right: 'إجمالي الأجهزة المسجلة على المنصة: 1,870 جهاز نشط ومسجل',
  left: 'نسبة أجهزة الأندرويد: 59.9% (1,120 جهاز) مقابل 40.1% لنظام iOS',
}

/** node 43:938 */
export const DEVICES_PREVIEWS: PreviewRow[] = [
  {
    label: 'طلبات الشراء والاشتراكات',
    icon: ShoppingBag,
    summary: 'قيد المراجعة: 14 طلب · مقبول: 398 · مرفوض: 23',
  },
]
