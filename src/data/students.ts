import type { TabItem } from '@/components/ui/Tabs'
import type { BadgeTone } from '@/components/ui/Badge'

/* ==========================================================================
 * بيانات وهمية لدومين «الطلاب والأجهزة» + «سجل العمليات».
 * كل النصوص والأرقام منقولة بالحرف من فيجما (fileKey 5tJR1BTN8fFBkm58hKHhsL):
 * v3-students-devices (7:920 / 35:6810) · v3-student-detail (28:750 / 35:7124)
 * v3-student-device-reset-modal (35:7348) · v3-student-cancel-sub-modal (35:7595)
 * v3-student-open-course-modal (35:7984) · v3-student-unban-modal (35:8722)
 * v3-activity-log (26:36)
 * ========================================================================== */

/** صف جدول الطلاب — فيجما student-row-1 → student-row-8 (node 7:1025 → 7:1130) */
export type StudentRow = {
  id: string
  /** عمود # */
  index: string
  name: string
  email: string
  phone: string
  /** عدد الاشتراكات كنص زي فيجما */
  subscriptions: string
  device: string
  status: string
}

/** عنوان التوب-بار — node 7:989 */
export const STUDENTS_TITLE = 'الطلاب والأجهزة'

/** tabs-stack — node 7:1002 (RTL: أول تاب في الـ DOM يظهر يمين) */
export const STUDENT_TABS: TabItem[] = [
  { label: 'كل الطلاب', count: 1247 },
  { label: 'نشط', count: 1212 },
  { label: 'محظور', count: 35 },
]

/** filter-row — node 7:991 */
export const STUDENT_FILTERS = {
  searchPlaceholder: 'بحث بالاسم أو الإيميل...',
  courseSortLabel: 'ترتيب بحسب الكورس',
  courseSortOptions: [
    'أساسيات التشريح — الترم الأول',
    'علم وظائف الأعضاء (Physiology)',
    'الكيمياء الحيوية الطبية',
  ],
} as const

/** pagination — node 7:1145: «عرض 8 من إجمالي 1,247 طالب» */
export const STUDENTS_TOTAL = 1247
export const STUDENTS_PAGES = 3

/** data-table-card — node 7:1015 (8 صفوف) */
export const STUDENTS: StudentRow[] = [
  {
    id: '1',
    index: '1',
    name: 'أحمد محمود علي',
    email: 'ahmed.mah@gmail.com',
    phone: '01099238120',
    subscriptions: '2',
    device: 'iPhone 15 Pro',
    status: 'نشط',
  },
  {
    id: '2',
    index: '2',
    name: 'مريم عبد الرحمن',
    email: 'mariam.abdo@yahoo.com',
    phone: '01238491023',
    subscriptions: '1',
    device: 'Samsung S23',
    status: 'نشط',
  },
  {
    id: '3',
    index: '3',
    name: 'مصطفى أمين رجب',
    email: 'mostafa.amin@gmail.com',
    phone: '01023456789',
    subscriptions: '2',
    device: 'Galaxy A54',
    status: 'نشط',
  },
  {
    id: '4',
    index: '4',
    name: 'سارة عبد الله الشريف',
    email: 'sara.shereef@gmail.com',
    phone: '01582910391',
    subscriptions: '3',
    device: 'iPad Air 5',
    status: 'محظور',
  },
  {
    id: '5',
    index: '5',
    name: 'يوسف عمر الدسوقي',
    email: 'youssef.omar@outlook.com',
    phone: '01129381029',
    subscriptions: '1',
    device: 'Xiaomi Redm 12',
    status: 'نشط',
  },
  {
    id: '6',
    index: '6',
    name: 'منى حسين السعيد',
    email: 'mona.hassan@gmail.com',
    phone: '01099283011',
    subscriptions: '2',
    device: 'Realme 11 Pro',
    status: 'نشط',
  },
  {
    id: '7',
    index: '7',
    name: 'خالد عبد الله الرفاعي',
    email: 'khaled.ref@gmail.com',
    phone: '01283019283',
    subscriptions: '2',
    device: 'iPhone 13',
    status: 'نشط',
  },
  {
    id: '8',
    index: '8',
    name: 'هدى محمد فؤاد',
    email: 'hoda.fouad@gmail.com',
    phone: '01093019203',
    subscriptions: '1',
    device: 'Samsung Tab S8',
    status: 'نشط',
  },
]

/* -------------------------------------------------------------------------- */
/* detail-drawer — node 7:921 (الطالب مصطفى أمين رجب)                          */
/* -------------------------------------------------------------------------- */

export type KeyValue = {
  label: string
  value: string
  /** لاتيني/رقمي صافي → كلاس num */
  num?: boolean
}

export type DrawerSubscription = {
  course: string
  status: string
  startLabel: string
  startDate: string
}

export const STUDENT_DRAWER = {
  title: 'تفاصيل الطالب والجهاز',
  studentSectionTitle: 'بيانات الطالب الأساسية',
  student: [
    { label: 'الاسم:', value: 'مصطفى أمين رجب' },
    { label: 'الهاتف:', value: '01023456789', num: true },
    { label: 'البريد:', value: 'mostafa.amin@gmail.com', num: true },
  ] as KeyValue[],
  subscriptionsTitle: 'الاشتراكات النشطة (2)',
  subscriptions: [
    {
      course: 'أساسيات التشريح — الترم الأول',
      status: 'مقبول',
      startLabel: 'تاريخ البدء:',
      startDate: '2025/02/15',
    },
    {
      course: 'علم وظائف الأعضاء (Physiology)',
      status: 'مقبول',
      startLabel: 'تاريخ البدء:',
      startDate: '2025/03/01',
    },
  ] as DrawerSubscription[],
  deviceSectionTitle: 'بيانات الجهاز المربوط',
  device: [
    { label: 'موديل الجهاز:', value: 'Samsung Galaxy A54' },
    { label: 'معرف الجهاز:', value: 'bf3961a0e9c84b32', num: true },
  ] as KeyValue[],
  resetCard: [
    { label: 'العدد المستخدم:', value: '2 / 3 مرات' },
    { label: 'آخر ريست:', value: '2025/03/15', num: true },
    { label: 'الريست القادم متاح بعد:', value: '2025/04/15', num: true },
  ] as KeyValue[],
  resetButton: 'ريست الجهاز',
  warning: '⚠ هيتقفل الإيميل والجهاز — الطالب مش هيقدر يدخل لحد فك الحظر',
  banButton: 'حظر الطالب والجهاز',
} as const

/* -------------------------------------------------------------------------- */
/* v3-student-detail — node 28:750                                            */
/* -------------------------------------------------------------------------- */

export const STUDENT_DETAIL = {
  backLabel: 'العودة لقائمة الطلاب',
  id: '1',
  name: 'أحمد محمود علي',
  initials: 'أحمد',
  status: 'نشط',
  phone: '01023456789',
  email: 'ahmed.m@gmail.com',
  registered: 'تاريخ التسجيل: 2026-01-15',
  banButton: 'حظر الطالب',
  resetButton: 'ريست الجهاز',
  resetsPanelTitle: 'سجل عمليات إعادة التعيين (Reset)',
  devicePanelTitle: 'الجهاز المربوط',
  device: [
    { label: 'موديل الجهاز:', value: 'iPhone 15 Pro' },
    { label: 'معرف الجهاز (ID):', value: 'A1B2C3D4E5F6G7', num: true },
  ] as KeyValue[],
  resetsUsedLabel: 'عدد مرات إعادة التعيين المستهلكة:',
  resetsUsedValue: '2 من أصل 3 مرات مسموحة',
  /** progress-fill 300 من 440 — node 28:823 */
  resetsPercent: 68,
  nextResetLabel: 'الريست القادم متاح بدءاً من:',
  nextResetValue: '2026-05-20',
  subscriptionsTitle: 'اشتراكات الطالب النشطة والملغية',
  addSubscriptionButton: '+ فتح كورس يدوياً للطالب',
} as const

/** reset-table — node 28:796 */
export type ResetLogRow = {
  id: string
  by: string
  model: string
  date: string
}

export const STUDENT_RESET_LOG: ResetLogRow[] = [
  { id: 'r1', by: 'د. الحسن', model: 'iPhone 15 Pro', date: '2026-04-20' },
  { id: 'r2', by: 'النظام (تلقائي)', model: 'iPhone 13', date: '2026-02-15' },
]

/** sub-table — node 28:832 */
export type SubscriptionRow = {
  id: string
  index: string
  course: string
  college: string
  date: string
  status: string
  price: string
  action: string
}

export const STUDENT_SUBSCRIPTIONS: SubscriptionRow[] = [
  {
    id: 's1',
    index: '1',
    course: 'أساسيات التشريح — الترم الأول',
    college: 'كلية الطب',
    date: '2026-02-10',
    status: 'نشط',
    price: 'ج.م 350',
    action: 'إلغاء الاشتراك',
  },
  {
    id: 's2',
    index: '2',
    course: 'علم وظائف الأعضاء (Physiology)',
    college: 'كلية الطب',
    date: '2026-03-05',
    status: 'نشط',
    price: 'ج.م 400',
    action: 'إلغاء الاشتراك',
  },
  {
    id: 's3',
    index: '3',
    course: 'الكيمياء الحيوية الطبية',
    college: 'كلية الصيدلة',
    date: '2026-04-12',
    status: 'ملغي',
    price: 'ج.م 350',
    action: 'تنشيط يدوي',
  },
]

/* -------------------------------------------------------------------------- */
/* المودالز                                                                   */
/* -------------------------------------------------------------------------- */

/** modal-overlay — node 28:946 (مودال الحظر جوّه شاشة التفاصيل) */
export const BAN_MODAL = {
  title: 'تأكيد حظر الطالب والأجهزة',
  noticeTitle: 'انتبه: إجراء حظر نهائي!',
  noticeBody:
    'سيتم قفل حساب البريد الإلكتروني للطالب والـ Device ID المربوط به حالياً. لن يتمكن الطالب من الدخول للمنصة نهائياً حتى يتم فك الحظر يدوياً من الإدارة، وسيتم تعليق تفعيل كافة كورساته.',
  specs: [
    { label: 'الطالب المستهدف:', value: 'أحمد محمود علي' },
    { label: 'البريد الإلكتروني:', value: 'ahmed.m@gmail.com', num: true },
    { label: 'الجهاز المحظور:', value: 'iPhone 15 Pro (A1B2C3D4)' },
  ] as KeyValue[],
  cancel: 'إلغاء الإجراء',
  confirm: 'تأكيد الحظر والإغلاق',
} as const

/** overlay → modal-box — node 35:7573 */
export const DEVICE_RESET_MODAL = {
  title: 'تأكيد إعادة تعيين الجهاز',
  body: 'سيتم فصل الجهاز الحالي (iPhone 15 Pro) — الطالب هيحتاج يسجل دخول من جهاز جديد كلياً للوصول للاشتراكات.',
  specs: [
    { label: 'اسم الطالب:', value: 'أحمد محمود علي' },
    { label: 'الجهاز الحالي:', value: 'iPhone 15 Pro' },
  ] as KeyValue[],
  noticeTitle: 'تنبيه هام للعملية',
  noticeBody:
    'الطالب استخدم 2 من 3 ريست متاحين هذا الشهر. متبقي ريست واحد فقط حتى نهاية الفترة الحالية.',
  cancel: 'إلغاء',
  confirm: 'تأكيد الريست',
} as const

/** overlay → modal-box — node 35:7816 */
export const CANCEL_SUB_MODAL = {
  title: 'تأكيد إلغاء الاشتراك',
  body: 'هل أنت متأكد من رغبتك في إلغاء اشتراك الطالب في هذا الكورس؟ سيتم سحب إمكانية الوصول إلى المحاضرات والمواد الأكاديمية فوراً.',
  specs: [
    { label: 'اسم الطالب:', value: 'أحمد محمود علي' },
    { label: 'الكورس:', value: 'أساسيات التشريح — الترم الأول' },
    { label: 'تاريخ الاشتراك:', value: '2026-02-10', num: true },
  ] as KeyValue[],
  priceLabel: 'قيمة الاشتراك:',
  priceValue: '350 ج.م',
  cancel: 'إلغاء',
  confirm: 'تأكيد الإلغاء',
} as const

/** modal-overlay → modal-box — node 35:8239 */
export const OPEN_COURSE_MODAL = {
  title: 'فتح كورس يدوياً للطالب',
  body: 'سيتم فتح الكورس التالي للطالب بدون عملية شراء — هذا إجراء استثنائي يتم تسجيله في سجل العمليات.',
  selectLabel: 'اختر الكورس',
  selectOptions: [
    'أساسيات علم وظائف الأعضاء — الترم الأول',
    'أساسيات التشريح — الترم الأول',
    'الكيمياء الحيوية الطبية',
  ],
  studentLabel: 'الطالب: أحمد محمود علي',
  studentEmail: 'ahmed.m@gmail.com',
  warning: 'تنبيه: الطالب هيقدر يوصل لمحتوى الكورس فوراً بعد التأكيد',
  cancel: 'إلغاء',
  confirm: 'تأكيد فتح الكورس',
} as const

/** modal-overlay → modal-box — node 35:8950 */
export const UNBAN_MODAL = {
  title: 'تأكيد فك حظر الطالب',
  body: 'سيتم فك حظر الطالب وإعادة تفعيل حسابه وجهازه — كورساته السابقة هترجع تشتغل.',
  specs: [
    { label: 'الطالب:', value: 'مريم عبد الرحمن' },
    { label: 'البريد الإلكتروني:', value: 'mariam.abd@yahoo.com', num: true },
    { label: 'الجهاز:', value: 'Samsung S23' },
  ] as KeyValue[],
  notice:
    'بعد فك الحظر: الطالب هيقدر يسجل دخول من الجهاز المربوط ويوصل لكورساته',
  cancel: 'إلغاء',
  confirm: 'تأكيد فك الحظر',
} as const

/* -------------------------------------------------------------------------- */
/* v3-activity-log — node 26:36                                               */
/* -------------------------------------------------------------------------- */

export const ACTIVITY_TITLE = 'سجل العمليات والأحداث'

/** stats-row — node 26:50 (RTL: أول عنصر في الـ DOM يظهر يمين) */
export const ACTIVITY_STATS: Array<{
  badge: string
  tone: BadgeTone
  label: string
}> = [
  { badge: 'أسبوعي', tone: 'brand', label: 'هذا الأسبوع: 156 عملية' },
  { badge: 'نشط', tone: 'success', label: 'اليوم: 23 عملية' },
  { badge: 'الكل', tone: 'neutral', label: 'كل العمليات: 1,847' },
]

/** filter-row — node 26:63 */
export const ACTIVITY_FILTERS = {
  searchPlaceholder: 'بحث بالطالب، الإيميل أو الكورس...',
  actionLabel: 'نوع العملية: الكل',
  actionOptions: [
    'موافقة طلب شراء',
    'رفض طلب شراء',
    'ريست جهاز',
    'حظر طالب',
    'فك حظر طالب',
    'فتح اشتراك يدوي',
    'إلغاء اشتراك',
    'تفعيل وضع الصيانة',
    'إيقاف وضع الصيانة',
    'تصفير ترم',
  ],
  dateLabel: '24 مايو 2026',
  exportLabel: 'تصدير CSV',
} as const

/** activity-table-card — node 26:75 (10 صفوف) */
export type ActivityRow = {
  id: string
  index: string
  action: string
  tone: BadgeTone
  details: string
  target: string
  datetime: string
  admin: string
}

export const ACTIVITY_LOG: ActivityRow[] = [
  {
    id: 'a1',
    index: '1',
    action: 'موافقة طلب شراء',
    tone: 'success',
    details: 'طلب #REF-29381023',
    target: 'أحمد محمود علي — أساسيات التشريح',
    datetime: '2026-05-24 16:32',
    admin: 'د. الحسن',
  },
  {
    id: 'a2',
    index: '2',
    action: 'رفض طلب شراء',
    tone: 'danger',
    details: 'الإيصال غير واضح',
    target: 'مريم عبد الرحمن — الكيمياء الحيوية',
    datetime: '2026-05-24 15:15',
    admin: 'د. الحسن',
  },
  {
    id: 'a3',
    index: '3',
    action: 'ريست جهاز',
    tone: 'warning',
    details: 'الجهاز iPhone 15 Pro',
    target: 'سارة أحمد حسن (المرة 2 من 3)',
    datetime: '2026-05-24 14:30',
    admin: 'د. الحسن',
  },
  {
    id: 'a4',
    index: '4',
    action: 'حظر طالب',
    tone: 'danger',
    details: 'حظر الإيميل + الجهاز Samsung',
    target: 'يوسف عمر الدسوقي',
    datetime: '2026-05-24 13:45',
    admin: 'د. الحسن',
  },
  {
    id: 'a5',
    index: '5',
    action: 'فك حظر طالب',
    tone: 'success',
    details: 'إعادة تفعيل الحساب والجهاز',
    target: 'خالد عبد الله الرفاعي',
    datetime: '2026-05-23 17:20',
    admin: 'د. الحسن',
  },
  {
    id: 'a6',
    index: '6',
    action: 'فتح اشتراك يدوي',
    tone: 'success',
    details: 'كورس الكيمياء — حالة استثنائية',
    target: 'هدى محمد فؤاد',
    datetime: '2026-05-23 16:10',
    admin: 'د. الحسن',
  },
  {
    id: 'a7',
    index: '7',
    action: 'إلغاء اشتراك',
    tone: 'danger',
    details: 'بناءً على طلب الطالب',
    target: 'منى حسن السعيد — الفسيولوجي',
    datetime: '2026-05-23 14:50',
    admin: 'د. الحسن',
  },
  {
    id: 'a8',
    index: '8',
    action: 'تفعيل وضع الصيانة',
    tone: 'warning',
    details: 'تحديث قواعد البيانات (3 ساعات)',
    target: 'النظام',
    datetime: '2026-05-22 23:00',
    admin: 'النظام',
  },
  {
    id: 'a9',
    index: '9',
    action: 'إيقاف وضع الصيانة',
    tone: 'success',
    details: 'المدة الفعلية: 2.5 ساعة',
    target: 'النظام',
    datetime: '2026-05-23 01:30',
    admin: 'النظام',
  },
  {
    id: 'a10',
    index: '10',
    action: 'تصفير ترم',
    tone: 'danger',
    details: 'الترم الأول — الطب البشري',
    target: 'النظام (234 طالب متأثر)',
    datetime: '2026-05-20 09:00',
    admin: 'النظام',
  },
]

/** pagination — node 26:173: «عرض 10 من إجمالي 1,847 عملية» */
export const ACTIVITY_TOTAL = 1847
export const ACTIVITY_PAGES = 2
