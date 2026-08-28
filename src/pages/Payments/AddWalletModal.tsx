import { METHOD_TYPES } from '@/data/payments'
import { AddMethodModal } from './payment-parts'

/** فيجما frame: v3-payment-add-wallet (node 35:8979) — modal-box 35:9171، عرض 500 */
export default function AddWalletModal() {
  return <AddMethodModal defaultType={METHOD_TYPES[0]} />
}
