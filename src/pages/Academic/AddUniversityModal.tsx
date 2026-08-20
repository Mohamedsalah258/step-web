import {
  Modal,
  ModalButton,
  ModalField,
  ModalToggleRow,
} from '@/components/ui/Modal'
import { ADD_UNIVERSITY_MODAL as M } from '@/data/academic'

/** فيجما frame: v3-add-university-modal (node 2003:3894) — modal-card 2003:4036، 520px */
export default function AddUniversityModal() {
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
      <ModalField label={M.nameLabel} placeholder={M.namePlaceholder} />
      <ModalToggleRow label={M.statusLabel} value={M.statusValue} />
    </Modal>
  )
}
