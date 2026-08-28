/** filters-row — node 7:288 */
export const ORDER_FILTERS = {
  searchPlaceholder: 'بحث بالاسم أو الرقم المرجعي...',
  dateLabel: 'التاريخ',
  courseLabel: 'كل الكورسات',
} as const

/** عنوان الشاشة في الـ top-bar — node 7:269 */
export const ORDERS_PAGE_TITLE = 'إدارة طلبات الشراء'

/** صف بيانات داخل الدروار */
export type DetailRow = {
  label: string
  value: string
  /** الأرقام والأكواد بتستخدم كلاس num */
  mono?: boolean
  tone?: 'ink' | 'brand' | 'success' | 'danger'
  bold?: boolean
}

/** أقسام الدروار — عناوين ثابتة في كل الفريمات */
export const DRAWER_SECTIONS = {
  student: 'بيانات الطالب',
  course: 'الكورس المطلوب',
  payment: 'تفاصيل الدفع',
} as const

/** modal-box — node 2002:3147 (v3-order-approve-modal) */
export const APPROVE_MODAL = {
  title: 'تأكيد الموافقة على الطلب',
  description: 'بعد الموافقة سيتم فتح الكورس للطالب تلقائياً.',
  cancel: 'إلغاء',
  submit: 'موافقة وتشغيل',
} as const

/** modal — node 2002:3178 (v3-order-reject-modal) */
export const REJECT_MODAL = {
  title: 'رفض طلب الشراء',
  reasonLabel: 'سبب الرفض (إجباري)',
  reasonPlaceholder: 'مثال: صورة الإيصال غير واضحة أو الرقم المرجعي غير صحيح...',
  note: 'ℹ الطالب هيقدر يشوف سبب الرفض ده ويعيد رفع إيصال دفع جديد لنفس الطلب.',
  cancel: 'إلغاء',
  submit: 'تأكيد الرفض',
} as const
