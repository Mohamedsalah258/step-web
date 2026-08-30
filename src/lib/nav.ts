import {
  LayoutDashboard,
  ReceiptText,
  BookOpen,
  GraduationCap,
  Users2,
  CreditCard,
  BarChart3,
  BellDot,
  Image as ImageIcon,
  FileText,
  Wrench,
  Settings2,
  LifeBuoy,
  type LucideIcon,
} from 'lucide-react'

export type NavItem = {
  label: string
  to: string
  icon: LucideIcon
  /** مسارات إضافية تعتبر نفس القسم عشان التحديد يفضل شغال */
  match?: string[]
}

/** نفس ترتيب nav-list في فيجما (node 7:207) */
export const NAV_ITEMS: NavItem[] = [
  { label: 'لوحة التحكم', to: '/', icon: LayoutDashboard },
  {
    label: 'طلبات الشراء',
    to: '/orders',
    icon: ReceiptText,
    match: ['/orders'],
  },
  {
    label: 'الهيكل الأكاديمي',
    to: '/academic/universities',
    icon: BookOpen,
    match: ['/academic'],
  },
  {
    label: 'الكورسات',
    to: '/courses',
    icon: GraduationCap,
    match: ['/courses'],
  },
  {
    label: 'الطلاب والأجهزة',
    to: '/students',
    icon: Users2,
    match: ['/students'],
  },
  {
    label: 'طرق الدفع',
    to: '/payments',
    icon: CreditCard,
    match: ['/payments'],
  },
  { label: 'التقارير', to: '/reports', icon: BarChart3, match: ['/reports'] },
  {
    label: 'الإشعارات',
    to: '/notifications',
    icon: BellDot,
    match: ['/notifications'],
  },
  {
    label: 'تذاكر الدعم',
    to: '/tickets',
    icon: LifeBuoy,
    match: ['/tickets'],
  },
  { label: 'البنرات', to: '/banners', icon: ImageIcon, match: ['/banners'] },
  {
    label: 'الصفحات والسياسات',
    to: '/pages',
    icon: FileText,
    match: ['/pages'],
  },
  {
    label: 'الصيانة',
    to: '/maintenance',
    icon: Wrench,
    match: ['/maintenance'],
  },
  { label: 'الإعدادات', to: '/settings', icon: Settings2, match: ['/settings'] },
]
