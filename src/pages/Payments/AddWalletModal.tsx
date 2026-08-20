import {
  Modal,
  ModalButton,
  ModalField,
  ModalSelect,
  ModalTextArea,
} from '@/components/ui/Modal'
import { ADD_METHOD_COPY, METHOD_TYPES } from '@/data/payments'
import { MethodToggleField } from './payment-parts'

const C = ADD_METHOD_COPY

/** فيجما frame: v3-payment-add-wallet (node 35:8979) — modal-box 35:9171، عرض 500 */
export default function AddWalletModal() {
  return (
    <Modal
      title={C.title}
      width={500}
      actions={
        <>
          <ModalButton variant="cancel">{C.cancel}</ModalButton>
          <ModalButton>{C.submit}</ModalButton>
        </>
      }
    >
      <ModalField label={C.nameLabel} placeholder={C.namePlaceholder} />
      <ModalSelect
        label={C.typeLabel}
        options={METHOD_TYPES}
        value={METHOD_TYPES[0]}
      />
      <ModalField
        label={C.wallet.accountLabel}
        placeholder={C.wallet.accountPlaceholder}
        mono
      />
      <ModalTextArea
        label={C.instructionsLabel}
        placeholder={C.instructionsPlaceholder}
        rows={3}
      />
      <MethodToggleField label={C.toggleLabel} hint={C.toggleHint} />
    </Modal>
  )
}
