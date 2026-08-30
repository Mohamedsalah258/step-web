/**
 * نصوص عرض ثابتة لدومين الكورسات — البيانات الديناميكية (كورسات/فيديوهات/
 * مذكرات/ملخصات/امتحانات) بتيجي من src/api/courses.ts دلوقتي.
 * النصوص هنا لسه بالحرف من فيجما (fileKey 5tJR1BTN8fFBkm58hKHhsL).
 */

/** الحالة الفارغة لقائمة الكورسات — فيجما node 2009:4957 */
export const COURSES_EMPTY = {
  title: 'لا توجد كورسات حالياً',
  description:
    'ستظهر الكورسات هنا بمجرد إضافتها. اضغط على «إضافة كورس جديد» للبدء',
  cta: '+ إضافة كورس جديد',
}

/** عدّادات تابس تفاصيل الكورس — فيجما node 13:343 / 13:533 / 13:694 */
export type CourseTabCounts = {
  videos: number
  notes: number
  summaries: number
  exams: number
}

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
  orderLabel: 'ترتيب الفيديو',
  orderPlaceholder: 'مثال: 1',
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
/* المودالز                                                          */
/* ---------------------------------------------------------------- */

/** فيجما node 29:1206 — v3-add-course-modal (عرض 560) */
export const ADD_COURSE_MODAL = {
  title: 'إضافة كورس جديد',
  nameLabel: 'اسم الكورس *',
  namePlaceholder: 'أدخل اسم الكورس (مثال: علم التشريح 1)',
  descLabel: 'وصف الكورس',
  descPlaceholder: 'اكتب وصفاً تفصيلياً لمحتوى المنهج وأهداف الكورس...',
  priceLabel: 'السعر',
  typeLabel: 'نوع الكورس',
  typeOptions: ['مدفوع', 'مجاني'],
  coverLabel: 'صورة الكورس',
  coverHint: 'اسحب الصورة أو تصفح الملفات',
  orderLabel: 'ترتيب الكورس',
  orderPlaceholder: 'مثال: 1',
  statusLabel: 'حالة الكورس الأولى',
  statusOptions: ['منشور', 'مسوّدة'],
  submit: 'إضافة الكورس',
  cancel: 'إلغاء',
}

/** فيجما node 2007:4377 — v3-edit-course-modal (عرض 560) */
export const EDIT_COURSE_MODAL = {
  title: 'تعديل بيانات الكورس',
  statusLabel: 'حالة الكورس',
  statusOptions: ['منشور', 'مسوّدة', 'مسحوب'],
  submit: 'حفظ التعديلات',
  cancel: 'إلغاء',
}

/** فيجما node 2007:4572 — v3-edit-video-modal (عرض 520) */
export const EDIT_VIDEO_MODAL = {
  title: 'تعديل بيانات الفيديو',
  titleLabel: 'عنوان الفيديو',
  descLabel: 'وصف الفيديو',
  urlLabel: 'رابط الفيديو',
  urlPlaceholder: 'https://www.youtube.com/watch?v=...',
  fileName: 'فيديو مرفوع',
  fileMeta: 'فيديو محمي HLS',
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
  descLabel: 'وصف المذكرة',
  fileName: 'الملف الحالي',
  fileMeta: 'مستند حماية ذكي',
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
  descLabel: 'وصف الامتحان',
  fileName: 'الملف الحالي',
  fileMeta: 'ملف التقييم المرفق',
  replaceBtn: 'تغيير الملف',
  statusLabel: 'الحالة:',
  statusValue: 'منشور على المنصة',
  deleteBtn: 'حذف الامتحان',
  cancel: 'إلغاء',
  submit: 'حفظ التعديلات',
}
