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

/** فيجما frame: v3-payment-add-bank (node 41:235) — modal-box 41:427، عرض 500 */
export default function AddBankModal() {
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
        value={METHOD_TYPES[1]}
      />
      <ModalField
        label={C.bank.bankNameLabel}
        placeholder={C.bank.bankNamePlaceholder}
      />
      <ModalField
        label={C.bank.accountLabel}
        placeholder={C.bank.accountPlaceholder}
        mono
      />
      <ModalField
        label={C.bank.holderLabel}
        placeholder={C.bank.holderPlaceholder}
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
