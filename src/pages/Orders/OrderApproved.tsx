import { useParams } from 'react-router-dom'
import { OrdersShell } from './OrdersScreen'

/**
 * فيجما frame: v3-order-approved (node 28:235) — دروار مفتوح تلقائيًا لطلب
 * محدد من الراوت، بحالته الحقيقية (مقبول).
 */
export default function OrderApproved() {
  const { id } = useParams()
  return <OrdersShell initialTab="approved" autoOpenId={id} />
}
