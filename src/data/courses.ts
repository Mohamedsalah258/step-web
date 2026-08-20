/**
 * بيانات وهمية لدومين الكورسات — النصوص والأرقام بالحرف من فيجما
 * (fileKey 5tJR1BTN8fFBkm58hKHhsL).
 */

/* ---------------------------------------------------------------- */
/* قائمة الكورسات — فيجما node 13:45 (v3-courses-list)              */
/* ---------------------------------------------------------------- */

export type Course = {
  id: string
  /** رقم الصف في عمود # */
  index: string
  name: string
  college: string
  term: string
  /** سعر الاشتراك كما هو مكتوب في الديزاين */
  price: string
  videos: string
  students: string
  status: string
}

export const COURSES: Course[] = [
  {
    id: 'c1',
    index: '1',
    name: 'أساسيات التشريح — الترم الأول',
    college: 'كلية الطب البشري',
    term: 'الترم الأول',
    price: '350 ج.م',
    videos: '12 فيديو',
    students: '234 طالب',
    status: 'مفعّل',
  },
  {
    id: 'c2',
    index: '2',
    name: 'علم وظائف الأعضاء المتقدم',
    college: 'كلية الطب البشري',
    term: 'الترم الثاني',
    price: '400 ج.م',
    videos: '18 فيديو',
    students: '189 طالب',
    status: 'مفعّل',
  },
  {
    id: 'c3',
    index: '3',
    name: 'الكيمياء الحيوية الطبية',
    college: 'كلية الصيدلة',
    term: 'الترم الأول',
    price: '350 ج.م',
    videos: '15 فيديو',
    students: '156 طالب',
    status: 'مفعّل',
  },
  {
    id: 'c4',
    index: '4',
    name: 'علم الأدوية السريري',
    college: 'كلية الصيدلة',
    term: 'الترم الثاني',
    price: '380 ج.م',
    videos: '20 فيديو',
    students: '142 طالب',
    status: 'مفعّل',
  },
  {
    id: 'c5',
    index: '5',
    name: 'تشريح الرأس والعنق',
    college: 'كلية طب الأسنان',
    term: 'الترم الأول',
    price: '300 ج.م',
    videos: '10 فيديو',
    students: '98 طالب',
    status: 'معطّل',
  },
  {
    id: 'c6',
    index: '6',
    name: 'العلاج الطبيعي العصبي',
    college: 'كلية العلاج الطبيعي',
    term: 'الترم الثاني',
    price: '450 ج.م',
    videos: '22 فيديو',
    students: '76 طالب',
    status: 'مفعّل',
  },
  {
    id: 'c7',
    index: '7',
    name: 'أساسيات التمريض',
    college: 'كلية التمريض',
    term: 'الترم الأول',
    price: '250 ج.م',
    videos: '8 فيديو',
    students: '112 طالب',
    status: 'مفعّل',
  },
  {
    id: 'c8',
    index: '8',
    name: 'الأحياء الدقيقة الطبية',
    college: 'كلية العلوم الطبية',
    term: 'الترم الثاني',
    price: '320 ج.م',
    videos: '14 فيديو',
    students: '88 طالب',
    status: 'معطّل',
  },
]

/** tabs-stack-row — فيجما node 13:32 (أول عنصر = يمين) */
export const COURSES_LIST_TABS = [
  { label: 'كل الكورسات', count: 45 },
  { label: 'مفعّل', count: 38 },
  { label: 'معطّل', count: 7 },
]

/** نفس التابس في الحالة الفارغة — فيجما node 2009:4943 */
export const COURSES_LIST_TABS_EMPTY = [
  { label: 'كل الكورسات', count: 0 },
  { label: 'مفعّل', count: 0 },
  { label: 'معطّل', count: 0 },
]

/** فلاتر صف الفلترة — فيجما node 13:18 */
export const COURSE_STATUS_FILTER = ['مفعّل', 'معطّل']
export const COURSE_COLLEGE_FILTER = [
  'كلية الطب البشري',
  'كلية الصيدلة',
  'كلية طب الأسنان',
  'كلية العلاج الطبيعي',
  'كلية التمريض',
  'كلية العلوم الطبية',
]

/** pagination-row — فيجما node 13:184 */
export const COURSES_PAGINATION = { page: 1, pages: 3, total: 45 }

/** الحالة الفارغة لقائمة الكورسات — فيجما node 2009:4957 */
export const COURSES_EMPTY = {
  title: 'لا توجد كورسات حالياً',
  description:
    'ستظهر الكورسات هنا بمجرد إضافتها. اضغط على «إضافة كورس جديد» للبدء',
  cta: '+ إضافة كورس جديد',
}

/* ---------------------------------------------------------------- */
/* هيدر الكورس — فيجما node 2007:4077                                */
/* ---------------------------------------------------------------- */

export const COURSE_DETAIL = {
  path: 'المرحلة الأولى / الترم الأول / جامعة عين شمس / كلية الطب البشري',
  name: 'أساسيات التشريح — الترم الأول',
  description:
    'يشمل هذا الكورس المبادئ الأساسية لعلم التشريح البشري مع التركيز على دراسة المحاور والمفاصل والعضلات الرئيسية.',
  price: 'ج.م 350 · سعر الاشتراك',
  badge: 'مدفوع',
  editLabel: 'تعديل الكورس',
}

/** عدّادات تابس تفاصيل الكورس — فيجما node 13:343 / 13:533 / 13:694 */
export type CourseTabCounts = {
  videos: number
  notes: number
  summaries: number
  exams: number
  remarks: number
}

export const COURSE_TAB_COUNTS: CourseTabCounts = {
  videos: 12,
  notes: 5,
  summaries: 3,
  exams: 4,
  remarks: 2,
}

/** نفس التابس في الحالات الفارغة — فيجما node 2009:5168 */
export const COURSE_TAB_COUNTS_EMPTY: CourseTabCounts = {
  videos: 0,
  notes: 0,
  summaries: 0,
  exams: 0,
  remarks: 0,
}

/* ---------------------------------------------------------------- */
/* فيديوهات الكورس — فيجما node 2007:4140                            */
/* ---------------------------------------------------------------- */

export type CourseVideo = {
  id: string
  title: string
  duration: string
  date: string
}

export const COURSE_VIDEOS: CourseVideo[] = [
  {
    id: 'v1',
    title: 'المقدمة والمصطلحات التشريحية العامة',
    duration: '19:45',
    date: '2026-05-10',
  },
  {
    id: 'v2',
    title: 'الهيكل العظمي ومحاور الجسم الرئيسية',
    duration: '32:10',
    date: '2026-05-12',
  },
  {
    id: 'v3',
    title: 'الجهاز العضلي وأنواع العضلات الهيكلية',
    duration: '25:00',
    date: '2026-05-14',
  },
  {
    id: 'v4',
    title: 'فجر المفاصل والأربطة المفصلية بالتفصيل',
    duration: '29:15',
    date: '2026-05-18',
  },
  {
    id: 'v5',
    title: 'التشريح السطحي والمقاطع الجسمانية الأساسية',
    duration: '22:50',
    date: '2026-05-20',
  },
]

/** كارت «إضافة فيديو جديد» — فيجما node 2007:4101 */
export const ADD_VIDEO_FORM = {
  title: 'إضافة فيديو جديد',
  uploadTitle: 'رفع فيديو محمي (Encrypted HLS)',
  uploadHint: 'اسحب الملف هنا أو اضغط للتصفح',
  divider: 'أو',
  urlLabel: 'رابط الفيديو',
  urlPlaceholder: 'https://www.youtube.com/watch?v=...',
  titleLabel: 'عنوان الفيديو',
  titlePlaceholder: 'مثال: العضلات الهيكلية والأطراف',
  descLabel: 'وصف الفيديو',
  descPlaceholder: 'تفاصيل شرح الفيديو والمحاور الرئيسية...',
  notice: 'المحتوى محمي — رفع مباشر بتشفير HLS + DRM',
  submit: 'بدء الرفع والتشفير',
}

export const VIDEOS_LIST_HEADER = {
  title: 'قائمة فيديوهات الكورس',
  reorder: 'إعادة الترتيب',
}

/** الحالة الفارغة للفيديوهات — فيجما node 2009:5061 */
export const VIDEOS_EMPTY = {
  title: 'لا توجد فيديوهات مرفوعة',
  description: 'ستظهر الفيديوهات هنا بمجرد رفعها. استخدم النموذج لإضافة أول فيديو',
  cta: '+ إضافة فيديو جديد',
}

/* ---------------------------------------------------------------- */
/* مذكرات الكورس — فيجما node 13:380                                 */
/* ---------------------------------------------------------------- */

export type CourseFile = {
  id: string
  index: string
  title: string
  type: string
  size: string
  date: string
  downloads: string
}

export const COURSE_NOTES: CourseFile[] = [
  {
    id: 'n1',
    index: '1',
    title: 'ملخص محاضرة المصطلحات التشريحية',
    type: 'PDF',
    size: '2.4 MB',
    date: '2026-05-10',
    downloads: '156 تحميل',
  },
  {
    id: 'n2',
    index: '2',
    title: 'أطلس تشريح الجسم البشري — الفصل الأول',
    type: 'PDF',
    size: '8.1 MB',
    date: '2026-05-12',
    downloads: '234 تحميل',
  },
  {
    id: 'n3',
    index: '3',
    title: 'مراجعة شاملة — العظام والمفاصل',
    type: 'PDF',
    size: '3.7 MB',
    date: '2026-05-15',
    downloads: '189 تحميل',
  },
  {
    id: 'n4',
    index: '4',
    title: 'رسومات توضيحية للعضلات الهيكلية',
    type: 'PDF',
    size: '5.2 MB',
    date: '2026-05-18',
    downloads: '142 تحميل',
  },
  {
    id: 'n5',
    index: '5',
    title: 'دليل المعامل العملية — الترم الأول',
    type: 'PDF',
    size: '4.8 MB',
    date: '2026-05-20',
    downloads: '98 تحميل',
  },
]

/** كارت «إضافة مذكرة جديدة» — فيجما node 13:356 */
export const ADD_NOTE_FORM = {
  title: 'إضافة مذكرة جديدة',
  titleLabel: 'عنوان المذكرة',
  titlePlaceholder: 'مثال: مراجعة العظام والمفاصل',
  descLabel: 'وصف المذكرة',
  descPlaceholder: 'اكتب تفاصيل ومحتويات هذه المذكرة...',
  uploadTitle: 'تحميل الملف للمنصة',
  uploadHint: 'اسحب الملف هنا أو اضغط للتصفح — PDF, DOCX حتى 50MB',
  notice: 'سيتم تشفير وحماية المستندات المرفوعة لمنع مشاركتها دون تصريح.',
  submit: 'رفع المذكرة',
}

export const NOTES_LIST_HEADER = {
  title: 'قائمة مذكرات الكورس المرفوعة',
  reorder: 'إعادة الترتيب',
  titleColumn: 'عنوان المذكرة',
}

/** الحالة الفارغة للمذكرات — فيجما node 2009:5180 */
export const NOTES_EMPTY = {
  title: 'لا توجد مذكرات مرفوعة',
  description: 'ستظهر المذكرات هنا بمجرد رفعها. استخدم النموذج لإضافة أول مذكرة',
  cta: '+ إضافة مذكرة جديدة',
}

/* ---------------------------------------------------------------- */
/* ملخصات / ملاحظات الكورس — فيجما node 13:564                       */
/* ---------------------------------------------------------------- */

export type CourseSummary = {
  id: string
  title: string
  meta: string
  downloads: string
  date: string
}

export const COURSE_SUMMARIES: CourseSummary[] = [
  {
    id: 's1',
    title: 'ملخص الفصل الأول — المصطلحات والتراكيب الأساسية',
    meta: '12 صفحة · 1.8 MB',
    downloads: '230 تحميل',
    date: '2026-05-10',
  },
  {
    id: 's2',
    title: 'ملخص الفصل الثاني — الهيكل العظمي والمفاصل',
    meta: '18 صفحة · 3.2 MB',
    downloads: '412 تحميل',
    date: '2026-05-13',
  },
  {
    id: 's3',
    title: 'ملخص الفصل الثالث — الجهاز العضلي',
    meta: '15 صفحة · 2.6 MB',
    downloads: '180 تحميل',
    date: '2026-05-17',
  },
]

/** كارت «إضافة ملخص جديد» — فيجما node 13:546 */
export const ADD_SUMMARY_FORM = {
  title: 'إضافة ملخص جديد',
  titleLabel: 'عنوان الملخص',
  titlePlaceholder: 'مثال: ملخص شامل الفصل الثاني',
  descLabel: 'الوصف',
  descPlaceholder: 'وصف وتلخيص محاور هذا الملف...',
  uploadTitle: 'تحميل الملف للمنصة',
  uploadHint: 'ارفق ملف الملخص المكتوب هنا — PDF, DOCX',
  submit: 'رفع الملخص',
}

export const SUMMARIES_LIST_TITLE = 'ملاحظات الكورس المعتمدة'

export const SUMMARY_CARD_ACTIONS = {
  delete: 'حذف',
  edit: 'تعديل',
  download: 'تحميل',
}

/** الحالة الفارغة للملاحظات — فيجما node 2009:5298 */
export const SUMMARIES_EMPTY = {
  title: 'لا توجد ملاحظات حالياً',
  description:
    'ستظهر الملاحظات هنا بمجرد إضافتها. استخدم النموذج لإضافة أول ملاحظة',
  cta: '+ إضافة ملاحظة جديدة',
}

/* ---------------------------------------------------------------- */
/* امتحانات الكورس — فيجما node 13:738                               */
/* ---------------------------------------------------------------- */

export const COURSE_EXAMS: CourseFile[] = [
  {
    id: 'e1',
    index: '1',
    title: 'امتحان الفصل الأول - المصطلحات التشريحية',
    type: 'PDF',
    size: '1.8 MB',
    date: '2026-05-12',
    downloads: '198 تحميل',
  },
  {
    id: 'e2',
    index: '2',
    title: 'اختبار قصير - العظام والمفاصل',
    type: 'PDF',
    size: '0.9 MB',
    date: '2026-05-18',
    downloads: '156 تحميل',
  },
  {
    id: 'e3',
    index: '3',
    title: 'امتحان منتصف الترم - تشريح عام',
    type: 'PDF',
    size: '2.4 MB',
    date: '2026-05-22',
    downloads: '234 تحميل',
  },
  {
    id: 'e4',
    index: '4',
    title: 'نموذج إجابة - امتحان منتصف الترم',
    type: 'PDF',
    size: '1.2 MB',
    date: '2026-05-23',
    downloads: '189 تحميل',
  },
]

/** كارت «رفع امتحان جديد» — فيجما node 13:707 */
export const ADD_EXAM_FORM = {
  title: 'رفع امتحان جديد',
  titleLabel: 'عنوان الامتحان',
  titlePlaceholder: 'مثال: امتحان نهاية الترم',
  descLabel: 'وصف الامتحان',
  descPlaceholder: 'تفاصيل عن محتوى الامتحان...',
  uploadTitle: 'اسحب الملف هنا أو تصفح من جهازك',
  uploadHint: 'PDF فقط - حتى 50MB',
  notice: 'سيتم تشفير وحماية الملفات المرفوعة لمنع مشاركتها دون تصريح.',
  submit: 'رفع الامتحان',
}

export const EXAMS_LIST_HEADER = {
  title: 'ملفات امتحانات الكورس المرفوعة',
  reorder: 'إعادة الترتيب',
  titleColumn: 'عنوان الامتحان',
}

/** الحالة الفارغة للامتحانات — فيجما node 2009:5416 */
export const EXAMS_EMPTY = {
  title: 'لا توجد امتحانات مرفوعة',
  description: 'ستظهر الامتحانات هنا بمجرد رفعها. استخدم النموذج لإضافة أول امتحان',
  cta: '+ رفع امتحان جديد',
}

/* ---------------------------------------------------------------- */
/* تفاصيل الامتحان — فيجما node 20:62                                */
/* ---------------------------------------------------------------- */

export const EXAM_DETAIL = {
  fileCardTitle: 'معلومات الملف',
  info: [
    { label: 'اسم الملف', value: 'امتحان_الفصل_الاول.pdf' },
    { label: 'الحجم', value: '1.8 MB' },
    { label: 'عدد الصفحات', value: '4' },
    { label: 'تاريخ الرفع', value: '2026-05-12' },
    { label: 'آخر تحديث', value: '2026-05-12' },
    { label: 'رفع بواسطة', value: 'د. الحسن' },
    { label: 'عدد التحميلات', value: '198 تحميل' },
  ],
  replaceTitle: 'استبدال الملف',
  replaceDrop: 'اسحب الملف الجديد هنا',
  replaceHint: 'PDF فقط — حتى 50MB',
  replaceSubmit: 'تحديث الملف',
  title: 'امتحان الفصل الأول — المصطلحات التشريحية',
  meta: [
    'نوع الملف: PDF',
    'حجم الملف: 1.8 MB',
    'تاريخ الرفع: 2026-05-12',
    'عدد التحميلات: 198',
  ],
  previewLabel: 'معاينة ملف الامتحان — صفحة 1 من 4',
  pageIndicator: '1 / 4',
  backBtn: 'رجوع للقائمة',
  deleteBtn: 'حذف الامتحان',
  downloadBtn: 'تحميل الملف',
}

/* ---------------------------------------------------------------- */
/* المودالز                                                          */
/* ---------------------------------------------------------------- */

/** فيجما node 29:1206 — v3-add-course-modal (عرض 560) */
export const ADD_COURSE_MODAL = {
  title: 'إضافة كورس جديد',
  universities: ['جامعة القاهرة', 'جامعة عين شمس', 'جامعة المنصورة'],
  colleges: ['كلية الطب', 'كلية الصيدلة', 'كلية طب الأسنان'],
  majors: ['الطب العام', 'طب الأسنان', 'الصيدلة السريرية'],
  stages: ['السنة الأولى', 'السنة الثانية', 'السنة الثالثة'],
  terms: ['الترم الأول', 'الترم الثاني'],
  nameLabel: 'اسم الكورس *',
  namePlaceholder: 'أدخل اسم الكورس (مثال: علم التشريح 1)',
  descLabel: 'وصف الكورس',
  descPlaceholder: 'اكتب وصفاً تفصيلياً لمحتوى المنهج وأهداف الكورس...',
  priceLabel: 'السعر',
  priceValue: 'ج.م 350',
  typeLabel: 'نوع الكورس',
  typeOptions: ['مدفوع', 'مجاني'],
  coverLabel: 'صورة الكورس',
  coverHint: 'اسحب الصورة أو تصفح الملفات',
  statusLabel: 'حالة الكورس الأولى',
  statusOptions: ['منشور', 'مسوّدة'],
  submit: 'إضافة الكورس',
  cancel: 'إلغاء',
}

/** فيجما node 2007:4377 — v3-edit-course-modal (عرض 560) */
export const EDIT_COURSE_MODAL = {
  title: 'تعديل بيانات الكورس',
  name: 'تشريح جسم الإنسان 1',
  description:
    'كورس شامل لتشريح جسم الإنسان للمرحلة الأولى يغطي الأساسيات والتطبيقات العملية',
  price: 'ج.م 350',
  statusLabel: 'حالة الكورس',
  statusOptions: ['منشور', 'مسوّدة', 'مسحوب'],
  submit: 'حفظ التعديلات',
  cancel: 'إلغاء',
}

/** فيجما node 2007:4572 — v3-edit-video-modal (عرض 520) */
export const EDIT_VIDEO_MODAL = {
  title: 'تعديل بيانات الفيديو',
  titleLabel: 'عنوان الفيديو',
  titleValue: 'المقدمة والمصطلحات التشريحية العامة',
  descLabel: 'وصف الفيديو',
  descValue:
    'شرح تفصيلي للمصطلحات التشريحية الأساسية والمستويات والمحاور التشريحية',
  orderLabel: 'ترتيب الفيديو',
  orderValue: '1',
  fileName: 'lecture_anatomy_intro.mp4',
  fileMeta: '45.2 MB · فيديو محمي HLS',
  replaceBtn: 'تغيير الفيديو',
  statusLabel: 'الحالة:',
  statusValue: 'منشور على المنصة',
  deleteBtn: 'حذف الفيديو',
  cancel: 'إلغاء',
  submit: 'حفظ التعديلات',
}

/** فيجما node 2007:4726 — v3-edit-note-modal (عرض 520) */
export const EDIT_NOTE_MODAL = {
  title: 'تعديل بيانات المذكرة',
  titleLabel: 'عنوان المذكرة',
  titleValue: 'ملخص مختصر المصطلحات',
  descLabel: 'وصف المذكرة',
  descValue: 'ملخص شامل لأهم المصطلحات التشريحية للمراجعة السريعة',
  fileName: 'anatomy_terms_summary.pdf',
  fileMeta: '3.1 MB · مستند حماية ذكي',
  replaceBtn: 'تغيير الملف',
  statusLabel: 'الحالة:',
  statusValue: 'منشور للطلاب',
  deleteBtn: 'حذف المذكرة',
  cancel: 'إلغاء',
  submit: 'حفظ التعديلات',
}

/** فيجما node 2007:4876 — v3-edit-exam-modal (عرض 520) */
export const EDIT_EXAM_MODAL = {
  title: 'تعديل بيانات الامتحان',
  titleLabel: 'عنوان الامتحان',
  titleValue: 'امتحان الفصل الأول - عملي',
  descLabel: 'وصف الامتحان',
  descValue: 'التفاصيل عن محتوى الامتحان',
  fileName: 'exam_ch1_practical.pdf',
  fileMeta: '1.8 MB · ملف التقييم المرفق',
  replaceBtn: 'تغيير الملف',
  statusLabel: 'الحالة:',
  statusValue: 'منشور على المنصة',
  deleteBtn: 'حذف الامتحان',
  cancel: 'إلغاء',
  submit: 'حفظ التعديلات',
}
