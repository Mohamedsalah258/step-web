import { Banknote, Landmark, Smartphone, Wallet, type LucideIcon } from 'lucide-react'

export type MethodField = {
  label: string
  value: string
  /** لاتيني/رقمي صافي — يستخدم كلاس num */
  num?: boolean
}

export type PaymentMethod = {
  id: string
  name: string
  icon: LucideIcon
  status: string
  active: boolean
  fields: MethodField[]
}

/**
 * كروت طرق الدفع — فيجما node 7:1843 (v3-payment-methods).
 * ⚠️ RTL: أول عنصر في المصفوفة يظهر أعلى-يمين، فالترتيب هنا معكوس
 * عن إحداثيات فيجما (اللي فيها اتصالات كاش على الشمال وفودافون على اليمين).
 */
export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'vodafone-cash',
    name: 'فودافون كاش',
    icon: Smartphone,
    status: 'نشط',
    active: true,
    fields: [
      { label: 'الحساب / رقم المستلم', value: '01012345678', num: true },
      {
        label: 'تعليمات الدفع للطلاب',
        value: 'حوّل المبلغ على الرقم ده وارفع صورة الإيصال',
      },
    ],
  },
  {
    id: 'etisalat-cash',
    name: 'اتصالات كاش',
    icon: Wallet,
    status: 'نشط',
    active: true,
    fields: [
      { label: 'الحساب / رقم المستلم', value: '01512345678', num: true },
      {
        label: 'تعليمات الدفع للطلاب',
        value: 'حوّل المبلغ على الرقم ده وارفع صورة الإيصال لتفعيل الكورس يدوياً',
      },
    ],
  },
  {
    id: 'instapay',
    name: 'إنستاباي',
    icon: Banknote,
    status: 'نشط',
    active: true,
    fields: [
      { label: 'عنوان الدفع (IPA)', value: 'instapay@step.com', num: true },
      {
        label: 'تعليمات الدفع للطلاب',
        value: 'حوّل عن طريق إنستاباي وارفع الإيصال للتأكيد المباشر',
      },
    ],
  },
  {
    id: 'bank-transfer',
    name: 'تحويل بنكي',
    icon: Landmark,
    status: 'نشط',
    active: true,
    fields: [
      { label: 'اسم البنك', value: 'بنك مصر' },
      { label: 'رقم الحساب', value: '1234567890', num: true },
      { label: 'اسم صاحب الحساب', value: 'أحمد محمد الحسن' },
      {
        label: 'تعليمات الدفع للطلاب',
        value: 'حوّل على الحساب البنكي وارفع إيصال التحويل مع إرفاق رقم العملية',
      },
    ],
  },
]

/** ترويسة الشاشة — فيجما node 7:1840 */
export const PAYMENTS_HEADER = {
  title: 'إعدادات استقبال المدفوعات اليدوية',
  description:
    'تفعيل وتعطيل وتحديث بيانات الاستلام وتأكيد الحسابات لمختلف قنوات الدفع المفعلة بالمنصة للطلاب.',
  addLabel: 'إضافة طريقة دفع جديدة',
}

/** أنواع الطريقة في الدروب داون (فيجما 35:9189 / 41:445) */
export const METHOD_TYPES = ['محفظة إلكترونية', 'حساب بنكي']

/** نصوص مودالز الإضافة — فيجما nodes 35:9171 (محفظة) و 41:427 (بنك) */
export const ADD_METHOD_COPY = {
  title: 'إضافة طريقة دفع جديدة',
  cancel: 'إلغاء',
  submit: 'إضافة طريقة الدفع',
  toggleLabel: 'نشط',
  toggleHint: 'ستظهر للطلاب في قائمة الدفع',
  instructionsLabel: 'تعليمات الدفع للطالب',
  instructionsPlaceholder: 'اكتب خطوات الدفع اللي هتظهر للطالب...',
  nameLabel: 'اسم الطريقة',
  namePlaceholder: 'مثال: فوري',
  typeLabel: 'نوع الطريقة',
  wallet: {
    accountLabel: 'رقم الحساب/المحفظة',
    accountPlaceholder: '01xxxxxxxxx',
  },
  bank: {
    bankNameLabel: 'اسم البنك',
    bankNamePlaceholder: 'مثال: بنك مصر',
    accountLabel: 'رقم الحساب البنكي',
    accountPlaceholder: '1234567890',
    holderLabel: 'اسم صاحب الحساب',
    holderPlaceholder: 'الاسم كما يظهر في البنك',
  },
}
