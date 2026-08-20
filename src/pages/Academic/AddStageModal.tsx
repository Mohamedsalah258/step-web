import {
  Modal,
  ModalButton,
  ModalField,
  ModalSelect,
  ModalToggleRow,
} from '@/components/ui/Modal'
import { ADD_STAGE_MODAL as M } from '@/data/academic'

/** فيجما frame: v3-add-stage-modal (node 2003:3567) — modal-card 2003:3683 */
export default function AddStageModal() {
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
      <ModalField label={M.nameLabel} placeholder={M.namePlaceholder} />
      <ModalToggleRow label={M.statusLabel} value={M.statusValue} />
    </Modal>
  )
}
