import {
  Modal,
  ModalButton,
  ModalField,
  ModalSelect,
  ModalToggleRow,
} from '@/components/ui/Modal'
import { ADD_SPECIALIZATION_MODAL as M } from '@/data/academic'

/** فيجما frame: v3-add-specialization-modal (node 2003:3379) — modal-card 2003:3530 */
export default function AddSpecializationModal() {
  return (
    <Modal
      title={M.title}
      actions={
        <>
          <ModalButton variant="cancel">{M.cancel}</ModalButton>
          <ModalButton>{M.submit}</ModalButton>
        </>
      }
    >
      <ModalSelect
        label={M.universityLabel}
        options={M.universityOptions}
        value={M.universityValue}
      />
      <ModalSelect
        label={M.collegeLabel}
        options={M.collegeOptions}
        value={M.collegeValue}
      />
      <ModalField label={M.nameLabel} placeholder={M.namePlaceholder} />
      <ModalToggleRow label={M.statusLabel} value={M.statusValue} />
    </Modal>
  )
}
