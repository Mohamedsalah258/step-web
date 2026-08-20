import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Check, X } from 'lucide-react'
import {
  ORDERS,
  ORDER_TABS,
  ORDER_TAB_PENDING,
  ORDER_DETAIL_PENDING as D,
  DRAWER_SECTIONS,
} from '@/data/orders'
import { OrdersScreen } from './OrdersScreen'
import { DrawerSection, OrderDrawer, ReceiptBox } from './orders-parts'

/**
 * فيجما frame: v3-purchase-orders (node 7:257).
 * التاب النشط = «قيد المراجعة»، والدروار (node 7:505) بيفتح لما تضغط على
 * زرار «عرض التفاصيل» في أي صف — مقفول لحد ما المستخدم يضغط.
 */
export default function OrdersList() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  return (
    <OrdersScreen
      tabs={ORDER_TABS}
      activeTab={ORDER_TAB_PENDING}
      rows={ORDERS}
      onOpen={() => setOpen(true)}
      drawer={
        open ? (
          <OrderDrawer title={D.title} onClose={() => setOpen(false)}>
            {/* duplicate-alert — node 7:509 */}
            <div className="w-full shrink-0 rounded-ctl bg-warning-bg px-4 py-3 text-right text-sm font-bold text-warning">
              {D.duplicateAlert}
            </div>

            <DrawerSection title={DRAWER_SECTIONS.student} rows={D.student} />
            <DrawerSection title={DRAWER_SECTIONS.course} rows={D.course} />
            <DrawerSection title={DRAWER_SECTIONS.payment} rows={D.payment} />
            <ReceiptBox title={D.receiptTitle} />

            {/* drawer-actions — node 7:552 */}
            <div className="mt-auto flex w-full shrink-0 flex-col gap-3">
              <Button
                variant="success"
                icon={Check}
                full
                onClick={() => navigate('/orders/1/approve')}
              >
                {D.approveLabel}
              </Button>
              <Button
                variant="danger"
                icon={X}
                full
                onClick={() => navigate('/orders/1/reject')}
              >
                {D.rejectLabel}
              </Button>
            </div>
          </OrderDrawer>
        ) : null
      }
    />
  )
}
