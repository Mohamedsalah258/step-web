import {
  Modal,
  ModalButton,
  ModalNotice,
  ModalTextArea,
} from '@/components/ui/Modal'
import { REJECT_MODAL as M } from '@/data/orders'

/** فيجما frame: v3-order-reject-modal (node 2002:2871) — modal node 2002:3178 */
export default function OrderRejectModal() {
  return (
    <Modal
      title={M.title}
      width={560}
      actions={
        <>
          <ModalButton variant="cancel">{M.cancel}</ModalButton>
          <ModalButton tone="danger">{M.submit}</ModalButton>
        </>
      }
    >
      {/* النص مقسّم زي فيجما — اسم الطالب والكورس غامقين */}
      <p className="text-right text-base leading-relaxed text-muted">
        {M.descriptionStart}
        <span className="font-bold text-ink">{M.student}</span>
        {M.descriptionMiddle}
        <span className="font-bold text-ink">{M.course}</span>
        {M.descriptionEnd}
      </p>

      <ModalTextArea
        label={M.reasonLabel}
        placeholder={M.reasonPlaceholder}
        rows={4}
      />

      <ModalNotice tone="brand">{M.note}</ModalNotice>
    </Modal>
  )
}
