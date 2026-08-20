import type { TabItem } from '@/components/ui/Tabs'

/** صف جدول طلبات الشراء — فيجما request-row-* (node 7:312 → 7:417) */
export type PurchaseOrder = {
  id: string
  /** عمود # */
  index: string
  student: string
  course: string
  /** نص السعر بالحرف زي فيجما */
  price: string
  method: string
  reference: string
  date: string
  status: string
}

/** tabs-row — node 7:271 (RTL: أول تاب في الـ DOM يظهر يمين) */
export const ORDER_TABS: TabItem[] = [
  { label: 'الكل', count: 124 },
  { label: 'قيد المراجعة', count: 14 },
  { label: 'مقبول', count: 98 },
  { label: 'مرفوض', count: 12 },
]

/** التاب النشط في فريم v3-purchase-orders = قيد المراجعة */
export const ORDER_TAB_PENDING = 1

/** tabs-row في v3-order-approved — node 28:250 */
export const APPROVED_TABS: TabItem[] = [
  { label: 'الكل', count: 124 },
  { label: 'مقبول', count: 98 },
]

/** tabs-row في v3-order-rejected — node 28:508 */
export const REJECTED_TABS: TabItem[] = [
  { label: 'الكل', count: 124 },
  { label: 'مرفوض', count: 12 },
]

/** filters-row — node 7:288 */
export const ORDER_FILTERS = {
  searchPlaceholder: 'بحث بالاسم أو الرقم المرجعي...',
  dateLabel: 'التاريخ',
  courseLabel: 'كل الكورسات',
  courseOptions: [
    'أساسيات التشريح',
    'علم الأدوية',
    'الكيمياء الحيوية',
    'الفسيولوجي',
    'الهستولوجي',
  ],
} as const

/** إجمالي الطلبات في الـ pagination — node 7:447 */
export const ORDERS_TOTAL = 124
export const ORDERS_PAGES = 3

/** data-table-card — node 7:301 (8 صفوف) */
export const ORDERS: PurchaseOrder[] = [
  {
    id: 'po-1',
    index: '1',
    student: 'أحمد محمود علي',
    course: 'أساسيات التشريح',
    price: 'ج.م 350',
    method: 'إنستاباي',
    reference: 'INSTA-9923812',
    date: '2026-05-24',
    status: 'قيد المراجعة',
  },
  {
    id: 'po-2',
    index: '2',
    student: 'سارة أحمد حسن',
    course: 'علم الأدوية',
    price: 'ج.م 400',
    method: 'فودافون كاش',
    reference: 'VF-20381023',
    date: '2026-05-24',
    status: 'مقبول',
  },
  {
    id: 'po-3',
    index: '3',
    student: 'محمد خالد إبراهيم',
    course: 'الكيمياء الحيوية',
    price: 'ج.م 350',
    method: 'تحويل بنكي',
    reference: 'BNK-449201',
    date: '2026-05-24',
    status: 'قيد المراجعة',
  },
  {
    id: 'po-4',
    index: '4',
    student: 'نورا السيد محمد',
    course: 'الفسيولوجي',
    price: 'ج.م 450',
    method: 'اتصالات كاش',
    reference: 'ET-883019',
    date: '2026-05-24',
    status: 'مرفوض',
  },
  {
    id: 'po-5',
    index: '5',
    student: 'يوسف عمر الدسوقي',
    course: 'الهستولوجي',
    price: 'ج.م 380',
    method: 'إنستاباي',
    reference: 'INSTA-110294',
    date: '2026-05-23',
    status: 'مقبول',
  },
  {
    id: 'po-6',
    index: '6',
    student: 'منى حسين السعيد',
    course: 'أساسيات التشريح',
    price: 'ج.م 350',
    method: 'فودافون كاش',
    reference: 'VF-1192830',
    date: '2026-05-23',
    status: 'مقبول',
  },
  {
    id: 'po-7',
    index: '7',
    student: 'عبد الرحمن طارق',
    course: 'علم الأدوية',
    price: 'ج.م 400',
    method: 'تحويل بنكي',
    reference: 'BNK-339201',
    date: '2026-05-23',
    status: 'مقبول',
  },
  {
    id: 'po-8',
    index: '8',
    student: 'هدى محمد فؤاد',
    course: 'الكيمياء الحيوية',
    price: 'ج.م 350',
    method: 'اتصالات كاش',
    reference: 'ET-920183',
    date: '2026-05-24',
    status: 'مرفوض',
  },
]

/**
 * data-table-card في فريمَي v3-order-approved / v3-order-rejected
 * (node 28:259 / 28:517) — 6 صفوف وأسماء كورسات كاملة.
 */
export const ORDERS_SUMMARY: PurchaseOrder[] = [
  {
    id: 'so-1',
    index: '1',
    student: 'أحمد محمود علي',
    course: 'أساسيات التشريح — الترم الأول',
    price: 'ج.م 350',
    method: 'إنستاباي',
    reference: 'INSTA-9923812',
    date: '2026-05-24',
    status: 'قيد المراجعة',
  },
  {
    id: 'so-2',
    index: '2',
    student: 'سارة أحمد حسن',
    course: 'علم الأدوية الإكلينيكي',
    price: 'ج.م 400',
    method: 'فودافون كاش',
    reference: 'VF-20381023',
    date: '2026-05-24',
    status: 'مقبول',
  },
  {
    id: 'so-3',
    index: '3',
    student: 'محمد خالد إبراهيم',
    course: 'الكيمياء الحيوية الطبية',
    price: 'ج.م 350',
    method: 'تحويل بنكي',
    reference: 'BNK-449201',
    date: '2026-05-24',
    status: 'قيد المراجعة',
  },
  {
    id: 'so-4',
    index: '4',
    student: 'نورا السيد محمد',
    course: 'الفسيولوجي — علم وظائف الأعضاء',
    price: 'ج.م 450',
    method: 'اتصالات كاش',
    reference: 'ET-883019',
    date: '2026-05-24',
    status: 'مرفوض',
  },
  {
    id: 'so-5',
    index: '5',
    student: 'يوسف عمر الدسوقي',
    course: 'الهستولوجي دكتور يوسف',
    price: 'ج.م 380',
    method: 'إنستاباي',
    reference: 'INSTA-110294',
    date: '2026-05-23',
    status: 'مقبول',
  },
  {
    id: 'so-6',
    index: '6',
    student: 'منى حسين السعيد',
    course: 'أساسيات التشريح — الترم الأول',
    price: 'ج.م 350',
    method: 'فودافون كاش',
    reference: 'VF-1192830',
    date: '2026-05-23',
    status: 'مقبول',
  },
]

/** صف بيانات داخل الدروار */
export type DetailRow = {
  label: string
  value: string
  /** الأرقام والأكواد بتستخدم كلاس num */
  mono?: boolean
  tone?: 'ink' | 'brand' | 'success' | 'danger'
  bold?: boolean
}

export type OrderDetail = {
  title: string
  student: DetailRow[]
  course: DetailRow[]
  payment: DetailRow[]
}

/** detail-drawer — node 7:505 (طلب قيد المراجعة) */
export const ORDER_DETAIL_PENDING: OrderDetail & {
  duplicateAlert: string
  receiptTitle: string
  approveLabel: string
  rejectLabel: string
} = {
  title: 'تفاصيل طلب الشراء',
  duplicateAlert: 'الرقم المرجعي ده مستخدم قبل كده ⚠',
  receiptTitle: 'صورة التحويل / الإيصال',
  approveLabel: 'موافقة وتفعيل',
  rejectLabel: 'رفض الطلب',
  student: [
    { label: 'الاسم:', value: 'مصطفى أمين رجب' },
    { label: 'رقم الهاتف:', value: '01023456789', mono: true },
    { label: 'البريد الإلكتروني:', value: 'mostafa.amin@gmail.com', mono: true },
  ],
  course: [
    { label: 'اسم الكورس:', value: 'أساسيات التشريح — الترم الأول' },
    { label: 'السعر:', value: 'ج.م 350', mono: true, bold: true },
  ],
  payment: [
    { label: 'طريقة الدفع:', value: 'إنستاباي (InstaPay)' },
    {
      label: 'الرقم المرجعي:',
      value: 'INSTA-9923812',
      mono: true,
      bold: true,
      tone: 'brand',
    },
  ],
}

/** detail-drawer — node 28:443 (طلب مقبول) */
export const ORDER_DETAIL_APPROVED: OrderDetail & {
  badge: string
  receiptTitle: string
  log: DetailRow[]
  pushNote: string
} = {
  title: 'تفاصيل طلب الشراء',
  badge: 'طلب مقبول ونشط ✓',
  receiptTitle: 'صورة التحويل / الإيصال',
  student: [
    { label: 'الاسم:', value: 'أحمد محمود علي' },
    { label: 'رقم الهاتف:', value: '01023456789', mono: true },
    { label: 'البريد الإلكتروني:', value: 'ahmed.m@gmail.com', mono: true },
  ],
  course: [
    { label: 'اسم الكورس:', value: 'أساسيات التشريح — الترم الأول' },
    { label: 'السعر:', value: 'ج.م 350', mono: true, bold: true },
  ],
  payment: [
    { label: 'طريقة الدفع:', value: 'فودافون كاش (Vodafone Cash)' },
    {
      label: 'الرقم المرجعي:',
      value: 'VF-29381023',
      mono: true,
      bold: true,
      tone: 'success',
    },
  ],
  log: [
    { label: 'تاريخ الموافقة:', value: '2026-05-24 16:32', mono: true },
    { label: 'تمت المراجعة بواسطة:', value: 'د. الحسن' },
  ],
  pushNote:
    '✓ تم تفعيل محتوى الكورس بالكامل للطالب، وإرسال إشعار دفع (push notification) بنجاح.',
}

/** detail-drawer — node 28:701 (طلب مرفوض) */
export const ORDER_DETAIL_REJECTED: OrderDetail & {
  badge: string
  duplicateAlert: string
  reasonTitle: string
  reason: string
  log: DetailRow[]
  reuploadNote: string
} = {
  title: 'تفاصيل طلب الشراء',
  badge: 'تم رفض الطلب ✕',
  duplicateAlert: '⚠ تنبيه: الرقم المرجعي هذا مستخدم مسبقاً في نظامنا',
  reasonTitle: 'سبب الرفض:',
  reason: 'صورة الإيصال غير واضحة — يرجى إعادة التصوير والرفع مرة أخرى بوضوح.',
  student: [
    { label: 'الاسم:', value: 'مريم عبد الرحمن' },
    { label: 'رقم الهاتف:', value: '01234567890', mono: true },
    { label: 'البريد الإلكتروني:', value: 'mariam.abd@yahoo.com', mono: true },
  ],
  course: [
    { label: 'اسم الكورس:', value: 'الكيمياء الحيوية الطبية' },
    { label: 'السعر:', value: 'ج.م 350', mono: true, bold: true },
  ],
  payment: [
    { label: 'طريقة الدفع:', value: 'إنستاباي (InstaPay)' },
    {
      label: 'الرقم المرجعي:',
      value: 'INSTA-7723812',
      mono: true,
      bold: true,
      tone: 'danger',
    },
  ],
  log: [{ label: 'تاريخ الرفض:', value: '2026-05-24 15:15', mono: true }],
  reuploadNote: 'الطالب يمكنه إعادة رفع الإيصال على نفس هذا الطلب',
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
  description:
    'بعد الموافقة سيتم فتح الكورس للطالب تلقائياً وإرسال إشعار push بنجاح الاشتراك.',
  cancel: 'إلغاء',
  submit: 'موافقة وتشغيل',
} as const

/** order-plate — node 2002:3155 */
export const APPROVE_MODAL_PLATE: DetailRow[] = [
  { label: 'الطالب:', value: 'أحمد محمود علي', bold: true },
  { label: 'الكورس:', value: 'أساسيات التشريح — الترم الأول', bold: true },
  { label: 'السعر:', value: '350 ج.م', bold: true, tone: 'success' },
  { label: 'طريقة الدفع:', value: 'فودافون كاش', bold: true, tone: 'brand' },
  { label: 'الرقم المرجعي:', value: 'VF-29381023', bold: true, mono: true },
]

/** modal — node 2002:3178 (v3-order-reject-modal) */
export const REJECT_MODAL = {
  title: 'رفض طلب الشراء',
  /** النص مقسّم زي فيجما: الأجزاء الغامقة هي اسم الطالب واسم الكورس */
  descriptionStart: 'أنت على وشك رفض طلب الطالب ',
  student: 'مصطفى أمين رجب',
  descriptionMiddle: ' لكورس ',
  course: 'أساسيات التشريح — الترم الأول',
  descriptionEnd: '. يرجى تحديد سبب الرفض بوضوح للطالب.',
  reasonLabel: 'سبب الرفض (إجباري)',
  reasonPlaceholder: 'مثال: صورة الإيصال غير واضحة أو الرقم المرجعي غير صحيح...',
  note: 'ℹ سيتم إرسال إشعار فوري للطالب بسبب الرفض المذكور أعلاه، وسيتمكن من إعادة رفع إيصال دفع جديد للطلب.',
  cancel: 'إلغاء',
  submit: 'تأكيد الرفض',
} as const

/** عنوان الشاشة في الـ top-bar — node 7:269 */
export const ORDERS_PAGE_TITLE = 'إدارة طلبات الشراء'
