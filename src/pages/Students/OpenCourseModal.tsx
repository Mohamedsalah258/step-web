import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { useNavigate, useOutletContext, useParams } from 'react-router-dom'
import { Modal, ModalButton, ModalSelect } from '@/components/ui/Modal'
import { CardSkeleton, ErrorState } from '@/components/ui/States'
import { useAsync } from '@/lib/useAsync'
import { getStudentDetail, openCourse } from '@/api/students'
import { OPEN_COURSE_MODAL_TEXT } from '@/data/students'
import type { StudentDetailOutletContext } from './students-parts'

/** فيجما frame: v3-student-open-course-modal (node 35:7984 → modal-box 35:8239) */
export default function OpenCourseModal() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { onDataChanged } = useOutletContext<StudentDetailOutletContext>()
  const m = OPEN_COURSE_MODAL_TEXT
  const [courseName, setCourseName] = useState<string>(m.selectOptions[0])
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const { data: student, loading, error } = useAsync(() => getStudentDetail(id!), [id])
  if (!id) return null

  const handleConfirm = async () => {
    setSubmitting(true)
    setSubmitError(null)
    try {
      await openCourse(id, { courseName })
      onDataChanged()
      navigate(-1)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'حدث خطأ، حاول مرة أخرى')
      setSubmitting(false)
    }
  }

  return (
    <Modal
      title={m.title}
      width={500}
      actions={
        <>
          <ModalButton variant="cancel">{m.cancel}</ModalButton>
          <ModalButton onClick={handleConfirm} disabled={submitting || !student}>
            {submitting ? '...جاري التنفيذ' : m.confirm}
          </ModalButton>
        </>
      }
    >
      {loading ? (
        <CardSkeleton />
      ) : error || !student ? (
        <ErrorState description={error ?? 'تعذر تحميل بيانات الطالب'} />
      ) : (
        <>
          <p className="text-right text-base leading-relaxed text-muted">{m.body}</p>
          <ModalSelect
            label={m.selectLabel}
            options={[...m.selectOptions]}
            value={courseName}
            onChange={setCourseName}
          />
          <div className="flex w-full items-center justify-between gap-3 rounded-ctl bg-surface px-3 py-3">
            <span className="shrink-0 text-sm font-bold text-ink">
              الطالب: {student.name}
            </span>
            <span className="num shrink-0 text-xs text-muted">{student.email}</span>
          </div>
          <div className="flex w-full items-center gap-3 rounded-ctl bg-warning-bg px-3 py-3">
            <AlertTriangle className="size-4 shrink-0 text-warning" strokeWidth={2.5} />
            <p className="min-w-0 flex-1 text-right text-sm font-semibold leading-relaxed text-warning">
              {m.warning}
            </p>
          </div>
          {submitError ? <p className="text-sm font-bold text-danger">{submitError}</p> : null}
        </>
      )}
    </Modal>
  )
}
