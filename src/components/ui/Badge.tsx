import { cn } from '@/lib/cn'

export type BadgeTone = 'success' | 'warning' | 'danger' | 'brand' | 'neutral'

const TONES: Record<BadgeTone, string> = {
  success: 'bg-success-bg text-success',
  warning: 'bg-warning-bg text-warning',
  danger: 'bg-danger-bg text-danger',
  brand: 'bg-brand-tint text-brand',
  neutral: 'bg-surface text-muted',
}

/** فيجما: px12 py4، radius 6، 12px bold */
export function Badge({
  children,
  tone = 'neutral',
  className,
}: {
  children: React.ReactNode
  tone?: BadgeTone
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center whitespace-nowrap rounded-badge px-3 py-1 text-xs font-bold leading-normal',
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}

/** خريطة الحالات العربية المستخدمة في الديزاين */
export const STATUS_TONE: Record<string, BadgeTone> = {
  مقبول: 'success',
  نشط: 'success',
  منشور: 'success',
  مفعّل: 'success',
  مكتمل: 'success',
  متاح: 'success',
  'قيد المراجعة': 'warning',
  'قيد الانتظار': 'warning',
  معلق: 'warning',
  مسودة: 'warning',
  مرفوض: 'danger',
  محظور: 'danger',
  ملغي: 'danger',
  "معطّل": 'danger',
  منتهي: 'neutral',
  مؤرشف: 'neutral',
  // حالات تذاكر الدعم
  مفتوحة: 'warning',
  'قيد المعالجة': 'brand',
  'تم الحل': 'success',
  مغلقة: 'neutral',
  ملغاة: 'danger',
  // حالات قفل/فتح تعديل البروفايل
  مقفول: 'warning',
  مفتوح: 'success',
}

export function StatusBadge({ status }: { status: string }) {
  return <Badge tone={STATUS_TONE[status] ?? 'neutral'}>{status}</Badge>
}
