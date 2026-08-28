/**
 * بيانات وهمية للهيكل الأكاديمي — كل النصوص والأرقام مأخوذة بالحرف من فيجما.
 * الفريمات: 29:365 (الجامعات) · 29:490 (الكليات) · 29:631 (التخصصات)
 * · 29:772 (المراحل) · 29:958 (الترمات) · 26:246 + 35:6652 (تصفير الترم)
 * · 2003:3894 / 2003:3198 / 2003:3379 / 2003:3567 / 2003:3727 (مودالز الإضافة)
 */

/* ───────────────────────── الجامعات — node 29:388 ───────────────────────── */
/** الأنواع الحقيقية (ApiUniversityRow...) في src/api/academic.ts — هنا بس
 * نصوص العرض الثابتة (labels/placeholders) زي قرار #2 في step-backend/README. */

/* ────────────────────── تصفير الترم — node 26:259 ────────────────────── */

export const TERM_RESET_WARNING =
  'تصفير الترم بيلغي كل اشتراكات الطلاب النشطة في كورسات الترم ده — الطلاب هيفقدوا وصولهم فورًا. العملية لا يمكن التراجع عنها.'

/** modal-container — node 35:6786 */
export const TERM_RESET_CONFIRM = {
  title: 'تأكيد تصفير الترم',
  warning: 'الطلاب هيفقدوا اشتراكاتهم في كورسات الترم ده فورًا — هل أنت متأكد من المتابعة؟',
  confirmLabel: 'اكتب «تصفير» للتأكيد',
  confirmValue: 'تصفير',
  submit: 'تأكيد التصفير',
  cancel: 'إلغاء',
}

/* ──────────────────────── مودالز الإضافة ──────────────────────── */

/**
 * نصوص مودالز الإضافة الخمسة — الأب (select) والحالة (toggle) بقوا ديناميكيين
 * فعليًا (بيتجابوا من الـ API ويتحكم فيهم المستخدم)، فمشيلين values/options
 * الثابتة القديمة من هنا. شوف Add*Modal.tsx.
 */

/** node 2003:4036 */
export const ADD_UNIVERSITY_MODAL = {
  title: 'إضافة جامعة جديدة',
  nameLabel: 'اسم الجامعة',
  namePlaceholder: 'مثال: جامعة المنصورة',
  statusLabel: 'الحالة',
  submit: 'إضافة الجامعة',
  cancel: 'إلغاء',
}

/** node 2003:3349 */
export const ADD_COLLEGE_MODAL = {
  title: 'إضافة كلية جديدة',
  universityLabel: 'الجامعة التابعة',
  nameLabel: 'اسم الكلية',
  namePlaceholder: 'مثال: كلية الهندسة',
  statusLabel: 'الحالة',
  submit: 'إضافة الكلية',
  cancel: 'إلغاء',
}

/** node 2003:3530 */
export const ADD_SPECIALIZATION_MODAL = {
  title: 'إضافة تخصص جديد',
  collegeLabel: 'الكلية',
  nameLabel: 'اسم التخصص',
  namePlaceholder: 'مثال: جراحة القلب',
  statusLabel: 'الحالة',
  submit: 'إضافة التخصص',
  cancel: 'إلغاء',
}

/** node 2003:3683 */
export const ADD_STAGE_MODAL = {
  title: 'إضافة مرحلة جديدة',
  specializationLabel: 'التخصص',
  nameLabel: 'اسم المرحلة',
  namePlaceholder: 'مثال: المرحلة السابعة',
  statusLabel: 'الحالة نشطة',
  submit: 'إضافة المرحلة',
  cancel: 'إلغاء',
}

/** node 2003:3843 */
export const ADD_TERM_MODAL = {
  title: 'إضافة ترم جديد',
  stageLabel: 'المرحلة',
  nameLabel: 'اسم الترم',
  namePlaceholder: 'مثال: الترم الثالث',
  statusLabel: 'الحالة نشطة',
  submit: 'إضافة الترم',
  cancel: 'إلغاء',
}
