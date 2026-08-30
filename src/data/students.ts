import type { TabItem } from '@/components/ui/Tabs'
import type { BadgeTone } from '@/components/ui/Badge'
import type { ApiStudentListItem } from '@/api/students'

/* ==========================================================================
 * نصوص UI ثابتة بس لدومين «الطلاب والأجهزة» + «سجل العمليات».
 * كل البيانات الديناميكية (الطلاب، الاشتراكات، سجل الريست، سجل العمليات)
 * بقت بتيجي من STEP API الحقيقي — شوف src/api/students.ts و src/api/dashboard.ts.
 * ========================================================================== */

export type StudentsTab = 'all' | 'active' | 'banned'

/** صف جدول الطلاب — نفس شكل استجابة الـ API (شوف ApiStudentListItem) */
export type StudentRow = ApiStudentListItem

export const STUDENTS_TITLE = 'الطلاب والأجهزة'

/** ترتيب التابس + مفتاح كل تاب اللي بيتبعت للـ API — العدّاد بيجي لايف من tabs.{all,active,banned} */
export const STUDENT_TABS_META: Array<{ key: StudentsTab; label: string }> = [
  { key: 'all', label: 'كل الطلاب' },
  { key: 'active', label: 'نشط' },
  { key: 'banned', label: 'محظور' },
]

export function buildStudentTabs(counts: {
  all: number
  active: number
  banned: number
}): TabItem[] {
  return STUDENT_TABS_META.map((t) => ({ label: t.label, count: counts[t.key] }))
}

/** filter-row — node 7:991. خيارات الكورس بتتجاب لايف من listCourses (شوف StudentsList) */
export const STUDENT_FILTERS = {
  searchPlaceholder: 'بحث بالاسم أو الإيميل...',
  courseSortLabel: 'ترتيب بحسب الكورس',
} as const

/* -------------------------------------------------------------------------- */
/* نصوص الدروار (quick-view) — البيانات نفسها بتيجي من getStudentDetail        */
/* -------------------------------------------------------------------------- */

export type KeyValue = { label: string; value: string; num?: boolean }

export const STUDENT_DRAWER_LABELS = {
  title: 'تفاصيل الطالب والجهاز',
  studentSectionTitle: 'بيانات الطالب الأساسية',
  subscriptionsTitle: (count: number) => `الاشتراكات النشطة (${count})`,
  deviceSectionTitle: 'بيانات الجهاز المربوط',
  resetUsedLabel: 'العدد المستخدم:',
  lastResetLabel: 'آخر ريست:',
  nextResetLabel: 'الريست القادم متاح بعد:',
  resetButton: 'ريست الجهاز',
  warning: '⚠ هيتقفل الإيميل والجهاز — الطالب مش هيقدر يدخل لحد فك الحظر',
  banButton: 'حظر الطالب والجهاز',
  noDevice: 'لا يوجد جهاز مربوط بعد',
} as const

/* -------------------------------------------------------------------------- */
/* نصوص شاشة تفاصيل الطالب                                                    */
/* -------------------------------------------------------------------------- */

export const STUDENT_DETAIL_LABELS = {
  backLabel: 'العودة لقائمة الطلاب',
  banButton: 'حظر الطالب',
  unbanButton: 'فك حظر الطالب',
  resetButton: 'ريست الجهاز',
  lockProfileButton: 'قفل تعديل البروفايل لهذا الطالب',
  unlockProfileButton: 'فتح تعديل البروفايل لهذا الطالب',
  profileEditLockedBadge: 'تعديل البروفايل مقفول',
  profileEditUnlockedBadge: 'تعديل البروفايل متاح',
  academicEditLockedBadge: 'تعديل المستوى/الترم مقفول',
  academicEditUnlockedBadge: 'تعديل المستوى/الترم متاح',
  resetsPanelTitle: 'سجل عمليات إعادة التعيين (Reset)',
  devicePanelTitle: 'الجهاز المربوط',
  resetsUsedLabel: 'عدد مرات إعادة التعيين المستهلكة:',
  nextResetLabel: 'الريست القادم متاح بدءاً من:',
  subscriptionsTitle: 'اشتراكات الطالب النشطة والملغية',
  addSubscriptionButton: '+ فتح كورس يدوياً للطالب',
  noDevice: 'لا يوجد جهاز مربوط بعد',
  noNextReset: 'متاح الآن',
} as const

export type ResetLogRow = { id: string; by: string; model: string; date: string }
export type SubscriptionRow = {
  id: string
  index: string
  course: string
  college: string
  date: string
  status: string
  price: number
  action: string
}

/* -------------------------------------------------------------------------- */
/* المودالز — النصوص الثابتة بس. الـ specs (بيانات الطالب/الاشتراك الفعلية)   */
/* بتتبني وقت العرض من البيانات الحقيقية اللي جايه من الـ API.                 */
/* -------------------------------------------------------------------------- */

export const BAN_MODAL_TEXT = {
  title: 'تأكيد حظر الطالب والأجهزة',
  noticeTitle: 'انتبه: إجراء حظر نهائي!',
  noticeBody:
    'سيتم قفل حساب البريد الإلكتروني للطالب والـ Device ID المربوط به حالياً. لن يتمكن الطالب من الدخول للمنصة نهائياً حتى يتم فك الحظر يدوياً من الإدارة، وسيتم تعليق تفعيل كافة كورساته.',
  cancel: 'إلغاء الإجراء',
  confirm: 'تأكيد الحظر والإغلاق',
} as const

export const DEVICE_RESET_MODAL_TEXT = {
  title: 'تأكيد إعادة تعيين الجهاز',
  noticeTitle: 'تنبيه هام للعملية',
  cancel: 'إلغاء',
  confirm: 'تأكيد الريست',
} as const

export const CANCEL_SUB_MODAL_TEXT = {
  title: 'تأكيد إلغاء الاشتراك',
  body: 'هل أنت متأكد من رغبتك في إلغاء اشتراك الطالب في هذا الكورس؟ سيتم سحب إمكانية الوصول إلى المحاضرات والمواد الأكاديمية فوراً.',
  priceLabel: 'قيمة الاشتراك:',
  cancel: 'إلغاء',
  confirm: 'تأكيد الإلغاء',
} as const

export const REACTIVATE_SUB_MODAL_TEXT = {
  title: 'تأكيد تنشيط الاشتراك',
  body: 'هل أنت متأكد من رغبتك في إعادة تنشيط اشتراك الطالب في هذا الكورس؟ سيتمكن فوراً من الوصول إلى المحاضرات والمواد الأكاديمية.',
  priceLabel: 'قيمة الاشتراك:',
  cancel: 'إلغاء',
  confirm: 'تأكيد التنشيط',
} as const

export const OPEN_COURSE_MODAL_TEXT = {
  title: 'فتح كورس يدوياً للطالب',
  body: 'سيتم فتح الكورس التالي للطالب بدون عملية شراء — هذا إجراء استثنائي يتم تسجيله في سجل العمليات.',
  selectLabel: 'اختر الكورس',
  /** دومين Courses لسه مش مبني — قايمة ثابتة مؤقتة (شوف step-backend/README) */
  selectOptions: [
    'أساسيات التشريح — الترم الأول',
    'علم وظائف الأعضاء (Physiology)',
    'الكيمياء الحيوية الطبية',
    'علم الأدوية الإكلينيكي',
    'الفسيولوجي',
    'الهستولوجي',
  ],
  warning: 'تنبيه: الطالب هيقدر يوصل لمحتوى الكورس فوراً بعد التأكيد',
  cancel: 'إلغاء',
  confirm: 'تأكيد فتح الكورس',
} as const

export const UNBAN_MODAL_TEXT = {
  title: 'تأكيد فك حظر الطالب',
  body: 'سيتم فك حظر الطالب وإعادة تفعيل حسابه وجهازه — كورساته السابقة هترجع تشتغل.',
  notice: 'بعد فك الحظر: الطالب هيقدر يسجل دخول من الجهاز المربوط ويوصل لكورساته',
  cancel: 'إلغاء',
  confirm: 'تأكيد فك الحظر',
} as const

/* -------------------------------------------------------------------------- */
/* سجل العمليات — نفس مفاتيح ActionType بتاعة الباك اند بالحرف                 */
/* (step-backend/src/common/action-catalog.ts) — أي تعديل هناك لازم يتحدث هنا */
/* -------------------------------------------------------------------------- */

export const ACTIVITY_TITLE = 'سجل العمليات والأحداث'

export const ACTIVITY_ACTION_TYPES: Array<{ key: string; label: string }> = [
  { key: 'approve_order', label: 'موافقة طلب شراء' },
  { key: 'reject_order', label: 'رفض طلب شراء' },
  { key: 'device_reset', label: 'ريست جهاز' },
  { key: 'ban_student', label: 'حظر طالب' },
  { key: 'unban_student', label: 'فك حظر طالب' },
  { key: 'open_course', label: 'فتح اشتراك يدوي' },
  { key: 'cancel_subscription', label: 'إلغاء اشتراك' },
  { key: 'maintenance_on', label: 'تفعيل وضع الصيانة' },
  { key: 'maintenance_off', label: 'إيقاف وضع الصيانة' },
  { key: 'term_reset', label: 'تصفير ترم' },
  { key: 'profile_lock_on', label: 'قفل تعديل البروفايل لكل الطلاب' },
  { key: 'profile_lock_off', label: 'فتح تعديل البروفايل لكل الطلاب' },
  { key: 'student_profile_unlocked', label: 'فتح تعديل البروفايل لطالب' },
  { key: 'student_profile_locked', label: 'قفل تعديل البروفايل لطالب' },
]

export const ACTIVITY_FILTERS = {
  searchPlaceholder: 'بحث بالطالب، الإيميل أو الكورس...',
  actionLabel: 'نوع العملية: الكل',
  dateLabel: 'كل التواريخ',
  exportLabel: 'تصدير CSV',
} as const

export type ActivityRow = {
  id: string
  index: string
  action: string
  tone: BadgeTone
  details: string | null
  target: string
  datetime: string
  admin: string
}
