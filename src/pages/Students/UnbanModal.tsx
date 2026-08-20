import { Info } from 'lucide-react'
import { Modal, ModalButton } from '@/components/ui/Modal'
import { UNBAN_MODAL } from '@/data/students'
import { SpecPlate } from './students-parts'

/** فيجما frame: v3-student-unban-modal (node 35:8722 → modal-box 35:8950) */
export default function UnbanModal() {
  const m = UNBAN_MODAL
  return (
    <Modal
      title={m.title}
      width={480}
      actions={
        <>
          <ModalButton variant="cancel">{m.cancel}</ModalButton>
          <ModalButton tone="success">{m.confirm}</ModalButton>
        </>
      }
    >
      <p className="text-right text-base leading-relaxed text-muted">
        {m.body}
      </p>
      <SpecPlate rows={[...m.specs]} />
      {/* success-plate — node 35:8968: الأيقونة يمين والنص بعدها */}
      <div className="flex w-full items-center gap-3 rounded-ctl bg-success-bg px-3 py-3">
        <Info className="size-4 shrink-0 text-success" strokeWidth={2.5} />
        <p className="min-w-0 flex-1 text-right text-sm font-semibold leading-relaxed text-success">
          {m.notice}
        </p>
      </div>
    </Modal>
  )
}
