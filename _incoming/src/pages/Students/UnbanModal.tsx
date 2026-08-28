import { useState } from 'react'
import { Info } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { Modal, ModalButton } from '@/components/ui/Modal'
import { CardSkeleton, ErrorState } from '@/components/ui/States'
import { useAsync } from '@/lib/useAsync'
import { unbanStudent, getStudentDetail } from '@/api/students'
import { UNBAN_MODAL_TEXT } from '@/data/students'
import { SpecPlate } from './students-parts'

/** فيجما frame: v3-student-unban-modal (node 35:8722 → modal-box 35:8950) */
export default function UnbanModal() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const m = UNBAN_MODAL_TEXT

  const { data: student, loading, error } = useAsync(() => getStudentDetail(id!), [id])
  if (!id) return null

  const handleConfirm = async () => {
    setSubmitting(true)
    setSubmitError(null)
    try {
      await unbanStudent(id)
      navigate(-1)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'حدث خطأ، حاول مرة أخرى')
      setSubmitting(false)
    }
  }

  return (
    <Modal
      title={m.title}
      width={480}
      actions={
        <>
          <ModalButton variant="cancel">{m.cancel}</ModalButton>
          <ModalButton tone="success" onClick={handleConfirm} disabled={submitting || !student}>
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
          <SpecPlate
            rows={[
              { label: 'الطالب:', value: student.name },
              { label: 'البريد الإلكتروني:', value: student.email, num: true },
              { label: 'الجهاز:', value: student.device?.model ?? 'لا يوجد' },
            ]}
          />
          <div className="flex w-full items-center gap-3 rounded-ctl bg-success-bg px-3 py-3">
            <Info className="size-4 shrink-0 text-success" strokeWidth={2.5} />
            <p className="min-w-0 flex-1 text-right text-sm font-semibold leading-relaxed text-success">
              {m.notice}
            </p>
          </div>
          {submitError ? <p className="text-sm font-bold text-danger">{submitError}</p> : null}
        </>
      )}
    </Modal>
  )
}
