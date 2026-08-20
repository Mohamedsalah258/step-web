import {
  APPROVED_TABS,
  ORDERS_SUMMARY,
  ORDER_DETAIL_APPROVED as D,
  DRAWER_SECTIONS,
} from '@/data/orders'
import { OrdersScreen } from './OrdersScreen'
import { DrawerSection, InfoLine, OrderDrawer, ReceiptBox } from './orders-parts'

/**
 * فيجما frame: v3-order-approved (node 28:235) — دروار node 28:443.
 * حالة ما بعد الموافقة: بادج أخضر + سجل المراجعة + ملاحظة الإشعار.
 */
export default function OrderApproved() {
  return (
    <OrdersScreen
      tabs={APPROVED_TABS}
      activeTab={1}
      rows={ORDERS_SUMMARY}
      drawer={
        <OrderDrawer title={D.title} gap={20}>
          {/* status-badge — node 28:447 */}
          <div className="w-full shrink-0 rounded-ctl bg-success-bg px-4 py-3 text-right text-base font-bold text-success">
            {D.badge}
          </div>

          <DrawerSection title={DRAWER_SECTIONS.student} rows={D.student} />
          <DrawerSection title={DRAWER_SECTIONS.course} rows={D.course} />
          <DrawerSection title={DRAWER_SECTIONS.payment} rows={D.payment} />
          <ReceiptBox title={D.receiptTitle} />

          {/* review-log — node 28:490 */}
          <div className="flex w-full shrink-0 flex-col gap-2 rounded-ctl bg-surface p-3">
            {D.log.map((r) => (
              <InfoLine key={r.label} row={r} />
            ))}
          </div>

          <div className="w-full shrink-0 rounded-ctl bg-brand-wash px-4 py-3 text-right text-sm font-semibold leading-relaxed text-brand">
            {D.pushNote}
          </div>
        </OrderDrawer>
      }
    />
  )
}
