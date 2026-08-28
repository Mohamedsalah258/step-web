import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Modal, ModalButton, ModalField, ModalNotice } from '@/components/ui/Modal'
import { CardSkeleton, ErrorState } from '@/components/ui/States'
import { useAsync } from '@/lib/useAsync'
import { getTermResetImpact, resetTerm } from '@/api/academic'
import { TERM_RESET_CONFIRM } from '@/data/academic'

/**
 * فيجما frame: v3-term-reset (variant, node 35:6652) — modal-container node 35:6786.
 * خطوة تأكيد فوق شاشة تصفير الترم — بيتقفل بـ termId جاي كـ query param من
 * TermReset.tsx (نفس نمط ?parentId= في باقي شاشات الهيكل الأكاديمي).
 */
export default function TermResetConfirm() {
  const [params] = useSearchParams()
  const termId = params.get('termId')
  const navigate = useNavigate()
  const c = TERM_RESET_CONFIRM

  const { data: impact, loading, error } = useAsync(
    () => (termId ? getTermResetImpact(termId) : Promise.resolve(null)),
    [termId],
  )

  const [confirmText, setConfirmText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  if (!termId) return null

  const canSubmit = confirmText.trim() === c.confirmValue && !submitting

  const handleConfirm = async () => {
    if (!canSubmit) return
    setSubmitting(true)
    setSubmitError(null)
    try {
      await resetTerm(termId)
      navigate('/academic/terms')
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'حدث خطأ، حاول مرة أخرى')
      setSubmitting(false)
    }
  }

  return (
    <Modal
      title={c.title}
      width={560}
      actions={
        <>
          <ModalButton variant="cancel">{c.cancel}</ModalButton>
          <ModalButton tone="danger" onClick={handleConfirm} disabled={!canSubmit}>
            {submitting ? '...جاري التصفير' : c.submit}
          </ModalButton>
        </>
      }
    >
      {loading ? (
        <CardSkeleton />
      ) : error || !impact ? (
        <ErrorState description={error ?? 'تعذر العثور على الترم'} />
      ) : (
        <>
          <p className="text-right text-base leading-relaxed text-ink">
            أنت على وشك تصفير ترم <span className="font-bold">{impact.termName}</span>. هذا سيؤثر
            على:
          </p>

          <ul className="flex flex-col gap-1.5 rounded-ctl bg-surface px-4 py-3">
            <li className="text-right text-base font-bold text-ink">
              • {impact.coursesCount} كورس أكاديمي
            </li>
            <li className="text-right text-base font-bold text-ink">
              • {impact.studentsCount} طالب مسجل حاليًا
            </li>
            <li className="text-right text-base font-bold text-ink">
              • {impact.subscriptionsCount} اشتراك نشط
            </li>
          </ul>

          <ModalNotice tone="danger">{c.warning}</ModalNotice>

          <ModalField
            label={c.confirmLabel}
            placeholder={c.confirmValue}
            value={confirmText}
            onChange={setConfirmText}
          />
          {submitError ? <p className="text-sm font-bold text-danger">{submitError}</p> : null}
        </>
      )}
    </Modal>
  )
}
