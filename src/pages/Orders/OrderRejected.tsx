import {
  REJECTED_TABS,
  ORDERS_SUMMARY,
  ORDER_DETAIL_REJECTED as D,
  DRAWER_SECTIONS,
} from '@/data/orders'
import { OrdersScreen } from './OrdersScreen'
import { DrawerSection, InfoLine, OrderDrawer } from './orders-parts'

/**
 * فيجما frame: v3-order-rejected (node 28:493) — دروار node 28:701.
 * حالة ما بعد الرفض: بادج أحمر + تنبيه التكرار + سبب الرفض + سجل + ملاحظة إعادة الرفع.
 */
export default function OrderRejected() {
  return (
    <OrdersScreen
      tabs={REJECTED_TABS}
      activeTab={1}
      rows={ORDERS_SUMMARY}
      drawer={
        <OrderDrawer title={D.title} gap={20}>
          <div className="w-full shrink-0 rounded-ctl bg-danger-bg px-4 py-3 text-right text-base font-bold text-danger">
            {D.badge}
          </div>

          <div className="w-full shrink-0 rounded-ctl bg-warning-bg px-4 py-3 text-right text-sm font-bold leading-relaxed text-warning">
            {D.duplicateAlert}
          </div>

          <DrawerSection title={DRAWER_SECTIONS.student} rows={D.student} />
          <DrawerSection title={DRAWER_SECTIONS.course} rows={D.course} />
          <DrawerSection title={DRAWER_SECTIONS.payment} rows={D.payment} />

          {/* rejection-reason — node 28:744 */}
          <div className="flex w-full shrink-0 flex-col gap-2">
            <p className="w-full text-right text-base font-extrabold text-ink">
              {D.reasonTitle}
            </p>
            <div className="rounded-ctl bg-danger-bg px-4 py-3 text-right text-sm leading-relaxed text-danger">
              {D.reason}
            </div>
          </div>

          <div className="flex w-full shrink-0 flex-col gap-2 rounded-ctl bg-surface p-3">
            {D.log.map((r) => (
              <InfoLine key={r.label} row={r} />
            ))}
          </div>

          <div className="w-full shrink-0 rounded-ctl bg-brand-wash px-4 py-3 text-right text-sm font-semibold leading-relaxed text-brand">
            {D.reuploadNote}
          </div>
        </OrderDrawer>
      }
    />
  )
}
