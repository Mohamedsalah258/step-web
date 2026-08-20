import { Modal, ModalButton } from '@/components/ui/Modal'
import { CANCEL_SUB_MODAL } from '@/data/students'
import { PriceBadge, SpecPlate, SpecRow } from './students-parts'

/** فيجما frame: v3-student-cancel-sub-modal (node 35:7595 → overlay 35:7816) */
export default function CancelSubModal() {
  const m = CANCEL_SUB_MODAL
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
      {/* details-plate — node 35:7822 */}
      <SpecPlate>
        <SpecRow row={m.specs[0]} />
        <SpecRow row={m.specs[1]} />
        {/* plate-row مع بادج السعر — node 35:7829 */}
        <div className="flex w-full items-center justify-between gap-3">
          <span className="shrink-0 text-sm font-normal text-muted">
            {m.priceLabel}
          </span>
          <PriceBadge>{m.priceValue}</PriceBadge>
        </div>
        <SpecRow row={m.specs[2]} />
      </SpecPlate>
    </Modal>
  )
}
