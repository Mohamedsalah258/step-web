import type { BadgeTone } from '@/components/ui/Badge'

export const TICKETS_PAGE_TITLE = 'تذاكر الدعم'

export const TICKET_FILTERS = {
  searchPlaceholder: 'بحث بعنوان التذكرة أو اسم الطالب...',
  priorityLabel: 'كل الأولويات',
  categoryLabel: 'كل التصنيفات',
  manageCategories: 'إدارة التصنيفات',
} as const

export const PRIORITY_AR: Record<string, string> = {
  LOW: 'منخفضة',
  MEDIUM: 'متوسطة',
  HIGH: 'عالية',
  URGENT: 'عاجلة',
}

export const PRIORITY_TONE: Record<string, BadgeTone> = {
  LOW: 'neutral',
  MEDIUM: 'brand',
  HIGH: 'warning',
  URGENT: 'danger',
}

/** نفس منطق ALLOWED_TRANSITIONS في الباك اند — الحالات المسموح التحويل لها من كل حالة حالية */
export const ALLOWED_NEXT_STATUS: Record<string, { value: string; label: string }[]> = {
  OPEN: [
    { value: 'IN_PROGRESS', label: 'قيد المعالجة' },
    { value: 'CANCELLED', label: 'ملغاة' },
  ],
  IN_PROGRESS: [
    { value: 'RESOLVED', label: 'تم الحل' },
    { value: 'CANCELLED', label: 'ملغاة' },
  ],
  RESOLVED: [
    { value: 'CLOSED', label: 'مغلقة' },
    { value: 'IN_PROGRESS', label: 'إعادة فتح (قيد المعالجة)' },
  ],
  CLOSED: [],
  CANCELLED: [],
}

export const STATUS_MODAL = {
  title: 'تغيير حالة التذكرة',
  statusLabel: 'الحالة الجديدة',
  resolutionLabel: 'ملاحظة الحل',
  resolutionHint: 'إجباري عند اختيار "تم الحل"',
  resolutionPlaceholder: 'اشرح باختصار إزاي اتحلت المشكلة...',
  cancel: 'إلغاء',
  submit: 'تأكيد التغيير',
  noneAvailable: 'التذكرة في حالة نهائية ومفيش تحويل متاح منها.',
} as const

export const CATEGORIES_MODAL = {
  title: 'إدارة تصنيفات التذاكر',
  addPlaceholder: 'اسم تصنيف جديد...',
  addButton: 'إضافة',
  deactivate: 'تعطيل',
  empty: 'لا يوجد تصنيفات بعد.',
} as const

export const REPLY_COMPOSER = {
  placeholder: 'اكتب ردك هنا...',
  internalLabel: 'ملاحظة داخلية (الطالب مش هيشوفها)',
  send: 'إرسال الرد',
  sending: '...جاري الإرسال',
} as const

export const TICKET_DETAIL_SECTIONS = {
  student: 'بيانات الطالب',
  ticket: 'بيانات التذكرة',
  conversation: 'المحادثة',
} as const

/** رسايل "تواصل مع الدعم" من زوار مش مسجلين — معروضة في نفس جدول التذاكر
 * (GET /tickets بيدمجهم) بس بتصنيف بصري مختلف، وبدون صفحة تفاصيل. */
export const GUEST_CONTACT = {
  badge: 'زائر',
  emptyField: '—',
  replyAction: 'الرد بالإيميل',
  replyModalTitle: 'الرد على رسالة الزائر',
  replyPlaceholder: 'اكتب ردك — هيتبعت كإيميل مباشر لصاحب الرسالة...',
  cancel: 'إلغاء',
  send: 'إرسال الرد',
  sending: '...جاري الإرسال',
} as const
