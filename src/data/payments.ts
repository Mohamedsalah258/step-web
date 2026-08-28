/** ترويسة الشاشة — فيجما node 7:1840 */
export const PAYMENTS_HEADER = {
  title: 'إعدادات استقبال المدفوعات اليدوية',
  description:
    'تفعيل وتعطيل وتحديث بيانات الاستلام وتأكيد الحسابات لمختلف قنوات الدفع المفعلة بالمنصة للطلاب.',
  addLabel: 'إضافة طريقة دفع جديدة',
}

/** أنواع الطريقة في الدروب داون (فيجما 35:9189 / 41:445) */
export const METHOD_TYPES = ['محفظة إلكترونية', 'حساب بنكي']

/** نصوص مودالز الإضافة/التعديل — فيجما nodes 35:9171 (محفظة) و41:427 (بنك) */
export const ADD_METHOD_COPY = {
  title: 'إضافة طريقة دفع جديدة',
  editTitle: 'تعديل طريقة الدفع',
  cancel: 'إلغاء',
  submit: 'إضافة طريقة الدفع',
  editSubmit: 'حفظ التعديلات',
  deleteLabel: 'حذف طريقة الدفع',
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
