import { Modal, ModalButton, ModalField, ModalNotice } from '@/components/ui/Modal'
import { TERM_RESET_CONFIRM } from '@/data/academic'

/**
 * فيجما frame: v3-term-reset (variant, node 35:6652) — modal-container node 35:6786.
 * خطوة تأكيد فوق شاشة تصفير الترم.
 */
export default function TermResetConfirm() {
  const c = TERM_RESET_CONFIRM
  return (
    <Modal
      title={c.title}
      width={560}
      actions={
        <>
          <ModalButton variant="cancel">{c.cancel}</ModalButton>
          <ModalButton tone="danger">{c.submit}</ModalButton>
        </>
      }
    >
      <p className="text-right text-base leading-relaxed text-ink">{c.intro}</p>

      <ul className="flex flex-col gap-1.5 rounded-ctl bg-surface px-4 py-3">
        {c.bullets.map((b) => (
          <li key={b} className="text-right text-base font-bold text-ink">
            {b}
          </li>
        ))}
      </ul>

      <ModalNotice tone="danger">{c.warning}</ModalNotice>

      <ModalField label={c.confirmLabel} placeholder={c.confirmValue} />
    </Modal>
  )
}
