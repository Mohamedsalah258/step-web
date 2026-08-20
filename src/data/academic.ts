/**
 * بيانات وهمية للهيكل الأكاديمي — كل النصوص والأرقام مأخوذة بالحرف من فيجما.
 * الفريمات: 29:365 (الجامعات) · 29:490 (الكليات) · 29:631 (التخصصات)
 * · 29:772 (المراحل) · 29:958 (الترمات) · 26:246 + 35:6652 (تصفير الترم)
 * · 2003:3894 / 2003:3198 / 2003:3379 / 2003:3567 / 2003:3727 (مودالز الإضافة)
 */

/* ───────────────────────── الجامعات — node 29:388 ───────────────────────── */

export type University = {
  id: string
  index: string
  name: string
  colleges: string
  courses: string
  status: string
  date: string
}

export const UNIVERSITIES: University[] = [
  {
    id: 'u1',
    index: '1',
    name: 'جامعة القاهرة',
    colleges: '12 كلية',
    courses: '84 كورس',
    status: 'نشط',
    date: '2025/01/10',
  },
  {
    id: 'u2',
    index: '2',
    name: 'جامعة عين شمس',
    colleges: '10 كليات',
    courses: '62 كورس',
    status: 'نشط',
    date: '2025/01/15',
  },
  {
    id: 'u3',
    index: '3',
    name: 'جامعة الإسكندرية',
    colleges: '8 كليات',
    courses: '45 كورس',
    status: 'نشط',
    date: '2025/02/01',
  },
]

/* ───────────────────────── الكليات — node 29:518 ───────────────────────── */

export type College = {
  id: string
  index: string
  name: string
  departments: string
  courses: string
  status: string
}

export const COLLEGES: College[] = [
  {
    id: 'c1',
    index: '1',
    name: 'كلية الطب البشري',
    departments: '6 أقسام',
    courses: '24 كورس',
    status: 'نشط',
  },
  {
    id: 'c2',
    index: '2',
    name: 'كلية الهندسة',
    departments: '8 أقسام',
    courses: '32 كورس',
    status: 'نشط',
  },
  {
    id: 'c3',
    index: '3',
    name: 'كلية الصيدلة',
    departments: '4 أقسام',
    courses: '18 كورس',
    status: 'نشط',
  },
  {
    id: 'c4',
    index: '4',
    name: 'كلية العلوم',
    departments: '5 أقسام',
    courses: '15 كورس',
    status: 'نشط',
  },
]

/* ──────────────────────── التخصصات — node 29:665 ──────────────────────── */

export type Specialization = {
  id: string
  index: string
  name: string
  stages: string
  courses: string
  status: string
}

export const SPECIALIZATIONS: Specialization[] = [
  {
    id: 's1',
    index: '1',
    name: 'الطب العام',
    stages: '6 مراحل',
    courses: '8 كورسات',
    status: 'نشط',
  },
  {
    id: 's2',
    index: '2',
    name: 'طب الأسنان',
    stages: '5 مراحل',
    courses: '4 كورسات',
    status: 'نشط',
  },
  {
    id: 's3',
    index: '3',
    name: 'التمريض',
    stages: '4 مراحل',
    courses: '2 كورسات',
    status: 'نشط',
  },
]

/* ───────────────────────── المراحل — node 29:809 ───────────────────────── */

export type Stage = {
  id: string
  index: string
  name: string
  terms: string
  courses: string
  status: string
}

export const STAGES: Stage[] = [
  {
    id: 'g1',
    index: '1',
    name: 'السنة الأولى',
    terms: '2 ترم',
    courses: '4 كورسات',
    status: 'نشط',
  },
  {
    id: 'g2',
    index: '2',
    name: 'السنة الثانية',
    terms: '2 ترم',
    courses: '3 كورسات',
    status: 'نشط',
  },
  {
    id: 'g3',
    index: '3',
    name: 'السنة الثالثة',
    terms: '2 ترم',
    courses: '1 كورس',
    status: 'نشط',
  },
  {
    id: 'g4',
    index: '4',
    name: 'السنة الرابعة',
    terms: '0 ترم',
    courses: '0 كورسات',
    status: 'معطل',
  },
  {
    id: 'g5',
    index: '5',
    name: 'السنة الخامسة',
    terms: '0 ترم',
    courses: '0 كورسات',
    status: 'معطل',
  },
  {
    id: 'g6',
    index: '6',
    name: 'السنة السادسة',
    terms: '0 ترم',
    courses: '0 كورسات',
    status: 'معطل',
  },
]

/* ───────────────────────── الترمات — node 29:998 ───────────────────────── */

export type Term = {
  id: string
  index: string
  name: string
  courses: string
  status: string
}

export const TERMS: Term[] = [
  {
    id: 't1',
    index: '1',
    name: 'الترم الأول',
    courses: '2 كورسات',
    status: 'نشط',
  },
  {
    id: 't2',
    index: '2',
    name: 'الترم الثاني',
    courses: '2 كورسات',
    status: 'نشط',
  },
]

/** linked-courses-section — node 29:1031 */
export type LinkedCourse = {
  id: string
  status: string
  term: string
  name: string
  price: string
}

export const TERM_LINKED_COURSES: LinkedCourse[] = [
  {
    id: 'lc1',
    status: 'منشور',
    term: 'الترم الأول',
    name: 'تشريح جسم الإنسان 1',
    price: '350 ج.م',
  },
  {
    id: 'lc2',
    status: 'منشور',
    term: 'الترم الأول',
    name: 'علم وظائف الأعضاء الأساسي',
    price: '400 ج.م',
  },
  {
    id: 'lc3',
    status: 'مسودة',
    term: 'الترم الثاني',
    name: 'علم الكيمياء الحيوية الطبية',
    price: '300 ج.م',
  },
  {
    id: 'lc4',
    status: 'منشور',
    term: 'الترم الثاني',
    name: 'مقدمة في علم الأنسجة',
    price: '350 ج.م',
  },
]

/* ────────────────────── تصفير الترم — node 26:259 ────────────────────── */

export const TERM_RESET_WARNING =
  'تصفير الترم يحذف كل اشتراكات الطلاب في الكورسات المحددة — الطلاب هيبدأوا من الأول. العملية لا يمكن التراجع عنها.'

export type ResetLogRow = {
  id: string
  by: string
  students: string
  scope: string
  date: string
}

/** سجل عمليات التصفير السابقة — node 26:266 */
export const TERM_RESET_LOG: ResetLogRow[] = [
  {
    id: 'r1',
    by: 'د. الحسن',
    students: '198 طالب',
    scope: 'الترم الأول - الطب البشري',
    date: '2026-01-15',
  },
  {
    id: 'r2',
    by: 'د. الحسن',
    students: '145 طالب',
    scope: 'الترم الثاني - الصيدلة',
    date: '2025-07-20',
  },
]

/** اختر المستوى الأكاديمي للتصفير — nodes 26:284 … 26:310 */
export const TERM_RESET_LEVELS: Array<{
  label: string
  value: string
  options: string[]
}> = [
  {
    label: 'الجامعة',
    value: 'جامعة عين شمس',
    options: ['جامعة عين شمس', 'جامعة القاهرة', 'جامعة الإسكندرية'],
  },
  {
    label: 'الكلية',
    value: 'كلية الطب البشري',
    options: [
      'كلية الطب البشري',
      'كلية الهندسة',
      'كلية الصيدلة',
      'كلية العلوم',
    ],
  },
  {
    label: 'التخصص',
    value: 'جميع التخصصات بالأقسام',
    options: [
      'جميع التخصصات بالأقسام',
      'الطب العام',
      'طب الأسنان',
      'التمريض',
    ],
  },
  {
    label: 'المرحلة',
    value: 'المرحلة الأولى',
    options: ['المرحلة الأولى', 'المرحلة الثانية', 'المرحلة الثالثة'],
  },
  {
    label: 'الترم',
    value: 'الترم الأول',
    options: ['الترم الأول', 'الترم الثاني'],
  },
]

/** node 26:315 */
export const TERM_RESET_IMPACT =
  '⚠ الكورسات المتأثرة: 8 كورسات · الطلاب المتأثرون: 234 طالب · الاشتراكات المتأثرة: 412 اشتراك'

/** modal-container — node 35:6786 */
export const TERM_RESET_CONFIRM = {
  title: 'تأكيد تصفير الترم',
  intro:
    'أنت على وشك تصفير الترم الأول — المرحلة الأولى — كلية الطب البشري. هذا سيؤثر على:',
  bullets: [
    '• 8 كورسات أكاديمية',
    '• 234 طالب مسجل حالياً',
    '• 412 اشتراك مفعل',
  ],
  warning:
    'الطلاب هيفقدوا كورساتهم ويبدأوا من الأول — هل أنت متأكد من المتابعة؟',
  confirmLabel: 'اكتب «تصفير» للتأكيد',
  confirmValue: 'تصفير',
  submit: 'تأكيد التصفير',
  cancel: 'إلغاء',
}

/* ──────────────────────── مودالز الإضافة ──────────────────────── */

/** node 2003:4036 */
export const ADD_UNIVERSITY_MODAL = {
  title: 'إضافة جامعة جديدة',
  nameLabel: 'اسم الجامعة',
  namePlaceholder: 'مثال: جامعة المنصورة',
  statusLabel: 'الحالة',
  statusValue: 'نشط',
  submit: 'إضافة الجامعة',
  cancel: 'إلغاء',
}

/** node 2003:3349 */
export const ADD_COLLEGE_MODAL = {
  title: 'إضافة كلية جديدة',
  universityLabel: 'الجامعة التابعة',
  universityValue: 'جامعة القاهرة',
  universityOptions: ['جامعة القاهرة', 'جامعة عين شمس', 'جامعة الإسكندرية'],
  nameLabel: 'اسم الكلية',
  namePlaceholder: 'مثال: كلية الهندسة',
  statusLabel: 'الحالة',
  statusValue: 'نشط',
  submit: 'إضافة الكلية',
  cancel: 'إلغاء',
}

/** node 2003:3530 */
export const ADD_SPECIALIZATION_MODAL = {
  title: 'إضافة تخصص جديد',
  universityLabel: 'الجامعة',
  universityValue: 'جامعة القاهرة',
  universityOptions: ['جامعة القاهرة', 'جامعة عين شمس', 'جامعة الإسكندرية'],
  collegeLabel: 'الكلية',
  collegeValue: 'كلية الطب',
  collegeOptions: ['كلية الطب', 'كلية الهندسة', 'كلية الحاسبات', 'كلية الحقوق'],
  nameLabel: 'اسم التخصص',
  namePlaceholder: 'مثال: جراحة القلب',
  statusLabel: 'الحالة',
  statusValue: 'نشط',
  submit: 'إضافة التخصص',
  cancel: 'إلغاء',
}

/** node 2003:3683 */
export const ADD_STAGE_MODAL = {
  title: 'إضافة مرحلة جديدة',
  universityLabel: 'الجامعة الشريكة',
  universityValue: 'جامعة القاهرة',
  universityOptions: ['جامعة القاهرة', 'جامعة عين شمس', 'جامعة الإسكندرية'],
  collegeLabel: 'الكلية',
  collegeValue: 'كلية الطب',
  collegeOptions: ['كلية الطب', 'كلية الهندسة', 'كلية الحاسبات', 'كلية الحقوق'],
  specializationLabel: 'التخصص',
  specializationValue: 'الطب العام',
  specializationOptions: ['الطب العام', 'طب الأسنان', 'التمريض'],
  nameLabel: 'اسم المرحلة',
  namePlaceholder: 'مثال: المرحلة السابعة',
  statusLabel: 'الحالة نشطة',
  statusValue: 'نشط',
  submit: 'إضافة المرحلة',
  cancel: 'إلغاء',
}

/** node 2003:3843 */
export const ADD_TERM_MODAL = {
  title: 'إضافة ترم جديد',
  universityLabel: 'الجامعة',
  universityValue: 'جامعة القاهرة',
  universityOptions: ['جامعة القاهرة', 'جامعة عين شمس', 'جامعة الإسكندرية'],
  collegeLabel: 'الكلية',
  collegeValue: 'كلية الطب',
  collegeOptions: ['كلية الطب', 'كلية الهندسة', 'كلية الحاسبات', 'كلية الحقوق'],
  specializationLabel: 'التخصص',
  specializationValue: 'الطب العام',
  specializationOptions: ['الطب العام', 'طب الأسنان', 'التمريض'],
  stageLabel: 'المرحلة',
  stageValue: 'المرحلة الأولى',
  stageOptions: ['المرحلة الأولى', 'المرحلة الثانية', 'المرحلة الثالثة'],
  nameLabel: 'اسم الترم',
  namePlaceholder: 'مثال: الترم الثالث',
  statusLabel: 'الحالة نشطة',
  statusValue: 'نشط',
  submit: 'إضافة الترم',
  cancel: 'إلغاء',
}
