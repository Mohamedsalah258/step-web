import { Plus } from 'lucide-react'
import { Page } from '@/components/layout/Page'
import { Card } from '@/components/ui/Card'
import { ButtonLink } from '@/components/ui/Button'
import { PAYMENTS_HEADER, PAYMENT_METHODS } from '@/data/payments'
import { MethodCard } from './payment-parts'

/** فيجما frame: v3-payment-methods (node 7:1825) */
export default function PaymentMethods() {
  return (
    <Page title="طرق الدفع">
      {/* header card — node 7:1840: العنوان يمين وزر الإضافة شمال */}
      <Card variant="card" className="flex w-full shrink-0 flex-col gap-1.5 p-5">
        <div className="flex h-[42px] w-full items-center justify-between gap-4">
          <h2 className="min-w-0 flex-1 text-right text-lg font-extrabold text-ink">
            {PAYMENTS_HEADER.title}
          </h2>
          <ButtonLink
            to="/payments/add-wallet"
            icon={Plus}
            className="h-[42px] w-[200px]"
          >
            {PAYMENTS_HEADER.addLabel}
          </ButtonLink>
        </div>
        <p className="w-full text-right text-sm font-normal text-muted">
          {PAYMENTS_HEADER.description}
        </p>
      </Card>

      {/* شبكة الكروت — node 7:1843: عمودين بعرض 554 وجاب 24 */}
      <div className="grid w-full shrink-0 grid-cols-2 items-start gap-6">
        {PAYMENT_METHODS.map((m) => (
          <MethodCard key={m.id} method={m} />
        ))}
      </div>
    </Page>
  )
}
