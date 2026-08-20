import {
  Modal,
  ModalButton,
  ModalField,
  ModalSelect,
  ModalToggleRow,
} from '@/components/ui/Modal'
import { ADD_COLLEGE_MODAL as M } from '@/data/academic'

/** فيجما frame: v3-add-college-modal (node 2003:3198) — modal-card 2003:3349 */
export default function AddCollegeModal() {
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
      <ModalField label={M.nameLabel} placeholder={M.namePlaceholder} />
      <ModalToggleRow label={M.statusLabel} value={M.statusValue} />
    </Modal>
  )
}
