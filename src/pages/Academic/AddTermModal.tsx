import {
  Modal,
  ModalButton,
  ModalField,
  ModalSelect,
  ModalToggleRow,
} from '@/components/ui/Modal'
import { ADD_TERM_MODAL as M } from '@/data/academic'

/** فيجما frame: v3-add-term-modal (node 2003:3727) — modal-card 2003:3843 */
export default function AddTermModal() {
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
      <ModalSelect
        label={M.specializationLabel}
        options={M.specializationOptions}
        value={M.specializationValue}
      />
      <ModalSelect
        label={M.stageLabel}
        options={M.stageOptions}
        value={M.stageValue}
      />
      <ModalField label={M.nameLabel} placeholder={M.namePlaceholder} />
      <ModalToggleRow label={M.statusLabel} value={M.statusValue} />
    </Modal>
  )
}
