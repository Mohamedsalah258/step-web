/**
 * نصوص شاشة تسجيل الدخول — فيجما frame v3-admin-login (node 26:6).
 * كل النصوص بالحرف زي فيجما.
 */
export const LOGIN = {
  /** node 26:10 / 26:11 */
  title: 'تسجيل دخول المدير',
  subtitle: 'أدخل بيانات حسابك للوصول للوحة التحكم',

  /** node 26:13 → 26:16 */
  emailLabel: 'البريد الإلكتروني',
  emailPlaceholder: 'admin@step-edu.com',

  /** node 26:17 → 26:20 / 26:21 */
  passwordLabel: 'كلمة المرور',
  passwordPlaceholder: '••••••••',
  passwordToggle: 'عرض',

  /** node 26:24 / 26:25 */
  submit: 'تسجيل الدخول',
  note: 'هذه اللوحة مخصّصة لمدير النظام فقط',
} as const

/**
 * policy-links — node 47:2 (RTL: أول عنصر يظهر يمين).
 * ⚠️ لازم تشاور لصفحات عامة تحت /legal (خارج RequireAuth) مش /pages/*
 * (اللي محتاجة تسجيل دخول) — زائر بيدوس عليها وهو لسه في شاشة اللوجين.
 */
export const LOGIN_POLICIES: Array<{ label: string; to: string }> = [
  { label: 'الشروط والأحكام', to: '/legal/terms' },
  { label: 'سياسة الاسترجاع', to: '/legal/refund' },
  { label: 'الخصوصية', to: '/legal/privacy' },
  { label: 'حذف الحساب', to: '/legal/deletion' },
]

/** hero-branding — node 26:26 */
export const LOGIN_HERO = {
  title: 'مرحباً بك في لوحة تحكم STEP',
  subtitle: 'منصة إدارة العمليات التعليمية والأكاديمية الشاملة بكل سهولة وأمان',
  version: 'v3.4.0 • STEP Platform',
} as const
