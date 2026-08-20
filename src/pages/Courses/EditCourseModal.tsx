import {
  Modal,
  ModalButton,
  ModalField,
  ModalSelect,
  ModalTextArea,
} from '@/components/ui/Modal'
import { EDIT_COURSE_MODAL as M } from '@/data/courses'

/** فيجما frame: v3-edit-course-modal (node 2007:4301) — modal node 2007:4377، عرض 560 */
export default function EditCourseModal() {
  return (
    <Modal
      title={M.title}
      width={560}
      actions={
        <>
          <ModalButton variant="cancel">{M.cancel}</ModalButton>
          <ModalButton>{M.submit}</ModalButton>
        </>
      }
    >
      <ModalField label="اسم الكورس" value={M.name} />
      <ModalTextArea label="وصف الكورس" value={M.description} rows={3} />
      <div className="grid grid-cols-2 gap-4">
        <ModalField label="السعر" value={M.price} mono />
        <ModalSelect label={M.statusLabel} options={M.statusOptions} />
      </div>
    </Modal>
  )
}
