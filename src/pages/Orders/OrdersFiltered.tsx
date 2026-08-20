import { ORDERS_SUMMARY, ORDER_TABS } from '@/data/orders'
import { OrdersScreen } from './OrdersScreen'

/**
 * فيجما frame: v3-purchase-orders (variant, node 2002:2274).
 * نفس الشاشة بالتاب «الكل» بدون دروار مفتوح — قائمة كاملة بغير تصفية.
 */
export default function OrdersFiltered() {
  return (
    <OrdersScreen tabs={ORDER_TABS} activeTab={0} rows={ORDERS_SUMMARY} />
  )
}
