import {
  Modal,
  ModalButton,
  ModalField,
  ModalTextArea,
} from '@/components/ui/Modal'
import { EDIT_EXAM_MODAL as M } from '@/data/courses'
import { FilePlate, StatusLine } from './courses-parts'

/** فيجما frame: v3-edit-exam-modal (node 2007:4763) — modal node 2007:4876 */
export default function EditExamModal() {
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
      <ModalField label={M.titleLabel} value={M.titleValue} />
      <ModalTextArea label={M.descLabel} value={M.descValue} rows={3} />
      <FilePlate name={M.fileName} meta={M.fileMeta} action={M.replaceBtn} />
      <StatusLine label={M.statusLabel} value={M.statusValue} />
      <button
        type="button"
        className="w-full rounded-ctl bg-danger-bg py-2.5 text-sm font-bold text-danger transition-opacity hover:opacity-80"
      >
        {M.deleteBtn}
      </button>
    </Modal>
  )
}
