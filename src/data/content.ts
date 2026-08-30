/**
 * بيانات وهمية لدومين المحتوى (الإشعارات / البنرات / الصفحات والسياسات /
 * الصيانة / الإعدادات) + شاشات الحالات.
 * كل النصوص منقولة بالحرف من فيجما (fileKey 5tJR1BTN8fFBkm58hKHhsL).
 */

/* ───────────────────────── الإشعارات — node 7:2017 ───────────────────────── */

export const ALERTS_CARD_TITLE = 'تنبيهات الإدارة والسيستم'

/** فورم إرسال إشعار جديد — node 7:2059 */
export const NOTIFY_FORM = {
  cardTitle: 'إرسال إشعار جديد للطلاب',
  titleLabel: 'عنوان الإشعار',
  titlePlaceholder: 'اكتب عنوان الإشعار هنا...',
  /** المكان ده بيعرض معاينة حية (عدد + وصف) بتتغيّر مع فلاتر الاستهداف، مش دروب داون ثابت */
  audienceLabel: 'المستهدفين المستلمين',
  typeLabel: 'نوع الإشعار',
  typeOptions: ['عام'],
  targetingLabel: 'استهداف المستلمين',
  universityLabel: 'استهداف حسب الجامعة',
  collegeLabel: 'استهداف حسب الكلية',
  specializationLabel: 'استهداف حسب التخصص',
  courseLabel: 'استهداف حسب الكورس',
  stageLabel: 'استهداف حسب المرحلة',
  termLabel: 'استهداف حسب الترم',
  /** أول خيار في كل دروب داون استهداف — يعني من غير فلتر */
  allOption: 'الكل',
  bodyLabel: 'محتوى رسالة الإشعار',
  bodyPlaceholder: 'اكتب تفاصيل الرسالة ومحتوى التنبيه الذي سيصل للأجهزة مباشرة...',
  submit: 'إرسال الإشعار فوراً',
}

/** سجل الإشعارات المرسلة سابقاً — node 7:2092 */
export const NOTIFY_HISTORY_TITLE = 'سجل الإشعارات المرسلة سابقاً'

/* ────────────────────────── البنرات — node 7:2210 ────────────────────────── */

export const BANNERS_HEADER = {
  title: 'البنرات النشطة',
  subtitle: 'البنرات الحالية المرفوعة على النظام والمعروضة للطلاب',
  action: 'إضافة بنر جديد',
} as const

/** فورم إضافة بنر — node 7:2234 */
export const BANNER_FORM = {
  cardTitle: 'إضافة بنر إعلاني جديد',
  titleLabel: 'عنوان البنر',
  titlePlaceholder: 'اكتب عنواناً جذاباً للبنر...',
  typeLabel: 'نوع البنر',
  typeOptions: ['ترويجي (Promotional)'],
  imageLabel: 'صورة البنر الإعلاني',
  dropTitle: 'اسحب الملف هنا أو تصفح من جهازك',
  dropHint: 'المقاس المطلوب 1200 × 400 بكسل (PNG, JPG)',
  submit: 'حفظ ونشر البنر',
}

/* ───────────── الصفحات والسياسات — nodes 7:2382 / 45:5 / 45:137 ───────────── */

/** ⚠️ RTL: أول تاب في المصفوفة يظهر على اليمين (فيجما LTR معكوس) */
export const POLICY_TABS = [
  { label: 'سياسة الخصوصية', to: '/pages' },
  { label: 'سياسة الاسترجاع والاستبدال', to: '/pages/refund' },
  { label: 'الشروط والأحكام', to: '/pages/terms' },
]

/** ⚠️ RTL: أول زر في المصفوفة يظهر على اليمين */
export const POLICY_TOOLBAR = [
  ['B', 'I', 'H1', 'H2'],
  ['•', '#'],
  ['R', 'C', 'L'],
]

export const POLICIES_PAGE_TITLE = 'إدارة الصفحات والسياسات العامة'

/* ────────────────────────── الصيانة — node 7:2510 ────────────────────────── */

export const MAINTENANCE_PAGE_TITLE = 'إدارة عمليات الصيانة وخوادم المنصة'

/** معاينة شاشة الصيانة على هاتف الطالب — node 7:2526 */
export const MAINTENANCE_PREVIEW = {
  cardTitle: 'معاينة شاشة الصيانة على هاتف الطالب',
  clock: '9:41',
  title: 'التطبيق قيد الصيانة',
  description:
    'نعمل حالياً على تحسين وتحديث خوادم منصة STEP لتقديم تجربة أفضل واستقرار أعلى، يسعدنا خدمتك قريباً!',
  cta: 'محاولة الاتصال مجدداً',
} as const

/** إعدادات وضع الصيانة الطارئة — node 7:2550 */
export const MAINTENANCE_PANEL = {
  title: 'إعدادات وضع الصيانة الطارئة',
  subtitle: 'التحكم في تشغيل وإيقاف البوابة التعليمية للصيانة البرمجية',
  serverStatusLabel: 'حالة الاتصال بالخادم',
  serverStatus: 'التطبيق يعمل بشكل طبيعي',
  messageLabel: 'رسالة الصيانة',
  message: 'المنصة تحت الصيانة حالياً — سنعود قريباً إن شاء الله',
  saveMessage: 'حفظ الرسالة',
  toggleTitle: 'وضع الصيانة معطل حالياً',
  toggleHint: 'الطلاب قادرون على تصفح الكورسات والمحتوى بلا قيود',
  warning:
    '⚠ تنبيه هام: عند تفعيل وضع الصيانة، سيتم إغلاق التطبيق فوراً على جميع الطلاب ومنعهم من الوصول للكورسات أو المدفوعات، وسوف تظهر لهم شاشة صيانة توضيحية.',
  logTitle: 'سجل فترات الصيانة السابقة',
} as const

export type MaintenanceLog = {
  id: string
  date: string
  duration: string
  reason: string
}

/** سجل فترات الصيانة السابقة — node 7:2569 */
export const MAINTENANCE_LOG: MaintenanceLog[] = [
  {
    id: 'mt-1',
    date: '2026-04-10',
    duration: '3 ساعات',
    reason: 'تحديث خوادم التخزين وقواعد البيانات',
  },
  {
    id: 'mt-2',
    date: '2026-02-15',
    duration: '4 ساعات',
    reason: 'إطلاق الميزات الأمنية وتشفير الفيديو الجديد',
  },
]

export const MAINTENANCE_LOG_HEADERS = {
  reason: 'السبب/التفاصيل',
  duration: 'المدة المستغرقة',
  date: 'التاريخ',
} as const

/* ───────────────────── قفل تعديل بروفايل الطلاب (كارت داخل الإعدادات) ───────────────────── */

export const PROFILE_LOCK_PANEL = {
  title: 'قفل تعديل المستوى والترم لكل الطلاب',
  subtitle:
    'التحكم في قدرة الطلاب على تعديل المستوى والترم بأنفسهم من التطبيق — استثناء طالب معيّن متاح من صفحة تفاصيله',
  statusLabel: 'حالة التعديل الحالية',
  lockedStatus: 'التعديل مقفول لكل الطلاب',
  unlockedStatus: 'التعديل متاح لكل الطلاب',
  toggleOnLabel: 'قفل التعديل مفعّل حاليًا',
  toggleOffLabel: 'قفل التعديل معطل حاليًا',
  toggleOnHint: 'الطلاب ممنوعون من تعديل المستوى/الترم إلا لو عندهم استثناء يدوي',
  toggleOffHint: 'كل الطلاب قادرين على تعديل المستوى/الترم بحرية من التطبيق',
  warning:
    '⚠ عند تفعيل القفل، هيتمنع كل الطلاب من تعديل المستوى والترم بتاعهم إلا لو الأدمن فتح استثناء يدوي لطالب معيّن من صفحة تفاصيله.',
  updatedByPrefix: 'آخر تحديث بواسطة',
} as const

/* ───────────────────────── الإعدادات — node 7:2653 ───────────────────────── */

export const SETTINGS_PAGE_TITLE = 'إعدادات الحساب والأمان'

/** تحديث كلمة المرور والحماية — node 7:2669 */
export const PASSWORD_CARD = {
  title: 'تحديث كلمة المرور والحماية',
  currentLabel: 'كلمة المرور الحالية',
  currentValue: '••••••••',
  newLabel: 'كلمة المرور الجديدة',
  newPlaceholder: 'اكتب كلمة مرور جديدة قوية أرقام ورموز',
  confirmLabel: 'تأكيد كلمة المرور الجديدة',
  confirmPlaceholder: 'أعد كتابة كلمة المرور الجديدة للتأكيد',
  submit: 'حفظ وتغيير كلمة المرور',
} as const

/** بيانات الملف الشخصي — node 7:2685 */
export const PROFILE_CARD = {
  title: 'بيانات الملف الشخصي لـ Admin',
  avatar: 'الحسن',
  changePhoto: 'تغيير الصورة الشخصية',
  nameLabel: 'الاسم الكامل',
  nameValue: 'د. الحسن محمد الطيب',
  emailLabel: 'البريد الإلكتروني المعتمد',
  emailValue: 'admin@step-edu.com',
  submit: 'حفظ التعديلات العامة',
} as const

/* ────────────── شاشات الحالات — nodes 29:1510 / 29:1603 / 29:1768 ────────────── */

/** الحالة الفارغة — node 29:1510 */
export const STATE_EMPTY = {
  pageTitle: 'إدارة طلبات الشراء',
  tabs: [
    { label: 'الكل', count: 0 },
    { label: 'قيد المراجعة', count: 0 },
    { label: 'مقبول', count: 0 },
    { label: 'مرفوض', count: 0 },
  ],
  searchPlaceholder: 'بحث بالاسم أو الرقم المرجعي...',
  dateLabel: 'التاريخ',
  courseLabel: 'كل الكورسات',
  title: 'لا توجد طلبات شراء حالياً',
  description:
    'ستظهر طلبات الشراء هنا بمجرد تقديم الطلاب لطلبات جديدة عبر المنصة',
} as const

/** حالة التحميل (سكيلتون) — node 29:1603. ⚠️ الأعمدة: أول عنصر = أول عمود من اليمين */
export const STATE_SKELETON = {
  pageTitle: 'إدارة الكورسات والمناهج',
  statsWidths: [60, 100, 80],
  columns: [
    { key: 'index', header: '#', width: 60, bars: [20, 20, 20, 20, 20, 20] },
    {
      key: 'name',
      header: 'اسم الكورس الأكاديمي',
      width: 280,
      bars: [180, 220, 150, 200, 170, 240],
    },
    {
      key: 'stage',
      header: 'المرحلة الدراسية',
      width: 150,
      bars: [120, 100, 140, 110, 130, 90],
    },
    {
      key: 'price',
      header: 'السعر',
      width: 100,
      bars: [70, 80, 90, 60, 85, 75],
    },
    {
      key: 'students',
      header: 'عدد الطلاب',
      width: 110,
      bars: [60, 50, 70, 60, 55, 80],
    },
    {
      key: 'date',
      header: 'تاريخ النشر',
      width: 120,
      bars: [90, 100, 80, 90, 100, 70],
    },
    {
      key: 'actions',
      header: 'الخيارات',
      width: 80,
      bars: [32, 32, 32, 32, 32, 32],
    },
  ],
} as const

/** حالة الخطأ — node 29:1768 */
export const STATE_ERROR = {
  pageTitle: 'إدارة الطلاب والأجهزة',
  title: 'حدث خطأ أثناء تحميل البيانات',
  description:
    'تعذر الاتصال بالخادم الرئيسي للمنصة — يرجى التحقق من استقرار اتصالك بالإنترنت وإعادة المحاولة مجدداً',
  cta: 'إعادة المحاولة',
  code: 'كود الخطأ: ERR_NETWORK_TIMEOUT',
} as const
