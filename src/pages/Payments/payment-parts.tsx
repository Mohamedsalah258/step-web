import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Switch } from '@/components/ui/Switch'
import { cn } from '@/lib/cn'
import type { PaymentMethod } from '@/data/payments'

/**
 * كارت طريقة دفع — فيجما node 7:1845:
 * radius 16، p24، gap20. الهيدر: (يمين) أيقونة + الاسم، (شمال) سويتش + «نشط».
 * الحقول: تسمية 12px muted + بوكس bg #f5f7fb border radius8 px12 py8.
 */
export function MethodCard({ method }: { method: PaymentMethod }) {
  const Icon = method.icon
  return (
    <Card className="flex min-w-0 flex-col gap-5 p-6">
      {/* header — RTL: أول عنصر في الـ DOM يمين */}
      <div className="flex w-full items-center justify-between gap-3">
        <div className="flex shrink-0 items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-logo bg-brand-tint">
            <Icon className="size-5 text-brand" strokeWidth={2} />
          </span>
          <h2 className="whitespace-nowrap text-lg font-extrabold text-ink">
            {method.name}
          </h2>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Switch defaultOn={method.active} />
          <span className="whitespace-nowrap text-sm font-bold text-success">
            {method.status}
          </span>
        </div>
      </div>

      <div className="h-px w-full shrink-0 bg-line" />

      <div className="flex flex-col gap-3">
        {method.fields.map((f) => (
          <div key={f.label} className="flex flex-col gap-1">
            <p className="w-full text-right text-xs font-normal text-muted">
              {f.label}
            </p>
            <div className="w-full rounded-ctl border border-line bg-surface px-3 py-2">
              <p
                className={cn(
                  'w-full text-right',
                  f.num
                    ? 'num text-base font-bold text-ink'
                    : 'text-sm font-normal text-ink',
                )}
              >
                {f.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* زر تعديل بحدود brand — فيجما 7:1868 */}
      <div className="mt-auto w-full pt-2">
        <Button
          variant="secondary"
          full
          className="border-brand text-brand hover:bg-brand-wash"
        >
          تعديل البيانات
        </Button>
      </div>
    </Card>
  )
}

/**
 * صف السويتش في مودالز الإضافة — فيجما node 35:9198:
 * (يمين) «نشط» + وصف تحته، (شمال) السويتش.
 */
export function MethodToggleField({
  label,
  hint,
  defaultOn = true,
}: {
  label: string
  hint: string
  defaultOn?: boolean
}) {
  return (
    <div className="flex w-full items-center justify-between gap-4">
      <div className="flex min-w-0 flex-col items-start gap-0.5">
        <span className="text-base font-bold text-ink">{label}</span>
        <span className="text-xs font-normal text-muted">{hint}</span>
      </div>
      <Switch defaultOn={defaultOn} />
    </div>
  )
}
