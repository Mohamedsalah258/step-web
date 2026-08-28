import { METHOD_TYPES } from '@/data/payments'
import { AddMethodModal } from './payment-parts'

/** فيجما frame: v3-payment-add-bank (node 41:235) — modal-box 41:427، عرض 500 */
export default function AddBankModal() {
  return <AddMethodModal defaultType={METHOD_TYPES[1]} />
}
