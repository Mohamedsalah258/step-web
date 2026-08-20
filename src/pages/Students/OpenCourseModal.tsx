import { AlertTriangle } from 'lucide-react'
import { Modal, ModalButton, ModalSelect } from '@/components/ui/Modal'
import { OPEN_COURSE_MODAL } from '@/data/students'

/** فيجما frame: v3-student-open-course-modal (node 35:7984 → modal-box 35:8239) */
export default function OpenCourseModal() {
  const m = OPEN_COURSE_MODAL
  return (
    <Modal
      title={m.title}
      width={500}
      actions={
        <>
          <ModalButton variant="cancel">{m.cancel}</ModalButton>
          <ModalButton>{m.confirm}</ModalButton>
        </>
      }
    >
      <p className="text-right text-base leading-relaxed text-muted">
        {m.body}
      </p>
      <ModalSelect
        label={m.selectLabel}
        options={[...m.selectOptions]}
        value={m.selectOptions[0]}
      />
      {/* student-plate — node 35:8254: اسم الطالب يمين والإيميل شمال */}
      <div className="flex w-full items-center justify-between gap-3 rounded-ctl bg-surface px-3 py-3">
        <span className="shrink-0 text-sm font-bold text-ink">
          {m.studentLabel}
        </span>
        <span className="num shrink-0 text-xs text-muted">
          {m.studentEmail}
        </span>
      </div>
      {/* warning-plate — node 35:8257: الأيقونة يمين والنص بعدها */}
      <div className="flex w-full items-center gap-3 rounded-ctl bg-warning-bg px-3 py-3">
        <AlertTriangle className="size-4 shrink-0 text-warning" strokeWidth={2.5} />
        <p className="min-w-0 flex-1 text-right text-sm font-semibold leading-relaxed text-warning">
          {m.warning}
        </p>
      </div>
    </Modal>
  )
}
