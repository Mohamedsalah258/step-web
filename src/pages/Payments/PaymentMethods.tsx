import { Plus } from 'lucide-react'
import { Page } from '@/components/layout/Page'
import { Card } from '@/components/ui/Card'
import { ButtonLink } from '@/components/ui/Button'
import { EmptyState, ErrorState, CardSkeleton } from '@/components/ui/States'
import { useAsync } from '@/lib/useAsync'
import { listPaymentMethods, togglePaymentMethod } from '@/api/payments'
import { PAYMENTS_HEADER } from '@/data/payments'
import { MethodCard } from './payment-parts'

/** فيجما frame: v3-payment-methods (node 7:1825) */
export default function PaymentMethods() {
  const { data: methods, loading, error, reload } = useAsync(() => listPaymentMethods(), [])

  const handleToggle = async (id: string) => {
    await togglePaymentMethod(id)
    reload()
  }

  return (
    <Page title="طرق الدفع" outletContext={{ onDataChanged: reload }}>
      {/* header card — node 7:1840: العنوان يمين وزر الإضافة شمال */}
      <Card variant="card" className="flex w-full shrink-0 flex-col gap-1.5 p-5">
        <div className="flex w-full flex-col justify-between gap-4 md:h-[42px] md:flex-row md:items-center">
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
      {error ? (
        <ErrorState description={error} onRetry={reload} />
      ) : !methods && loading ? (
        <CardSkeleton />
      ) : !methods || methods.length === 0 ? (
        <EmptyState
          title="لا يوجد طرق دفع مضافة بعد"
          description="ابدأ بإضافة أول طريقة دفع للطلاب."
        />
      ) : (
        <div className="grid w-full shrink-0 grid-cols-1 items-start gap-6 md:grid-cols-2">
          {methods.map((m) => (
            <MethodCard key={m.id} method={m} onToggle={() => handleToggle(m.id)} />
          ))}
        </div>
      )}
    </Page>
  )
}
