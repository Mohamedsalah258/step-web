import { useParams } from 'react-router-dom'
import { OrdersShell } from './OrdersScreen'

/**
 * فيجما frame: v3-order-rejected (node 28:493) — دروار مفتوح تلقائيًا لطلب
 * محدد من الراوت، بحالته الحقيقية (مرفوض).
 */
export default function OrderRejected() {
  const { id } = useParams()
  return <OrdersShell initialTab="rejected" autoOpenId={id} />
}
