import { Modal, ModalButton } from '@/components/ui/Modal'
import { APPROVE_MODAL as M, APPROVE_MODAL_PLATE } from '@/data/orders'
import { InfoLine } from './orders-parts'

/** فيجما frame: v3-order-approve-modal (node 2002:2596) — modal-box node 2002:3147 */
export default function OrderApproveModal() {
  return (
    <Modal
      title={M.title}
      actions={
        <>
          <ModalButton variant="cancel">{M.cancel}</ModalButton>
          <ModalButton tone="success">{M.submit}</ModalButton>
        </>
      }
    >
      {/* order-plate — node 2002:3155 */}
      <div className="flex w-full flex-col gap-2 rounded-ctl bg-surface p-4">
        {APPROVE_MODAL_PLATE.map((r) => (
          <InfoLine key={r.label} row={r} />
        ))}
      </div>

      <p className="text-right text-base leading-relaxed text-muted">
        {M.description}
      </p>
    </Modal>
  )
}
