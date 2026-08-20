import { Modal, ModalButton, ModalNotice } from '@/components/ui/Modal'
import { DEVICE_RESET_MODAL } from '@/data/students'
import { SpecPlate } from './students-parts'

/** فيجما frame: v3-student-device-reset-modal (node 35:7348 → overlay 35:7573) */
export default function DeviceResetModal() {
  const m = DEVICE_RESET_MODAL
  return (
    <Modal
      title={m.title}
      width={480}
      actions={
        <>
          <ModalButton variant="cancel">{m.cancel}</ModalButton>
          <ModalButton tone="danger">{m.confirm}</ModalButton>
        </>
      }
    >
      <p className="text-right text-base leading-relaxed text-muted">
        {m.body}
      </p>
      <SpecPlate rows={[...m.specs]} />
      <ModalNotice tone="warning">
        <span className="mb-2 block text-base font-extrabold">
          {m.noticeTitle}
        </span>
        {m.noticeBody}
      </ModalNotice>
    </Modal>
  )
}
