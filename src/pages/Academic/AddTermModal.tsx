import { useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import {
  Modal,
  ModalButton,
  ModalField,
  ModalSelect,
  ModalToggleRow,
} from '@/components/ui/Modal'
import { CardSkeleton, ErrorState } from '@/components/ui/States'
import { useAsync } from '@/lib/useAsync'
import { ADD_TERM_MODAL as M } from '@/data/academic'
import { createTerm, listStages } from '@/api/academic'

type AcademicOutletContext = { onDataChanged: () => void }

/** فيجما frame: v3-add-term-modal (node 2003:3727) — modal-card 2003:3843 */
export default function AddTermModal() {
  const navigate = useNavigate()
  const { onDataChanged } = useOutletContext<AcademicOutletContext>()
  const { data, loading, error } = useAsync(() => listStages({ limit: 200 }), [])
  const stages = data?.data ?? []

  const [stageName, setStageName] = useState('')
  const [name, setName] = useState('')
  const [active, setActive] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const selectedStage = stages.find((s) => s.name === stageName) ?? stages[0]

  const handleConfirm = async () => {
    if (!selectedStage) return
    setSubmitting(true)
    setSubmitError(null)
    try {
      await createTerm({
        stageId: selectedStage.id,
        name,
        status: active ? 'ACTIVE' : 'DISABLED',
      })
      onDataChanged()
      navigate(-1)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'حدث خطأ، حاول مرة أخرى')
      setSubmitting(false)
    }
  }

  return (
    <Modal
      title={M.title}
      actions={
        <>
          <ModalButton variant="cancel">{M.cancel}</ModalButton>
          <ModalButton
            onClick={handleConfirm}
            disabled={submitting || !name.trim() || !selectedStage}
          >
            {submitting ? '...جاري الإضافة' : M.submit}
          </ModalButton>
        </>
      }
    >
      {loading ? (
        <CardSkeleton />
      ) : error || stages.length === 0 ? (
        <ErrorState description={error ?? 'لازم تضيف مرحلة أولاً قبل الترمات'} />
      ) : (
        <>
          <ModalSelect
            label={M.stageLabel}
            options={stages.map((s) => s.name)}
            value={stageName || selectedStage?.name}
            onChange={setStageName}
          />
          <ModalField
            label={M.nameLabel}
            placeholder={M.namePlaceholder}
            value={name}
            onChange={setName}
          />
          <ModalToggleRow
            label={M.statusLabel}
            value={active ? 'نشط' : 'معطل'}
            tone={active ? 'success' : 'danger'}
            defaultOn={active}
            onChange={setActive}
          />
          {submitError ? <p className="text-sm font-bold text-danger">{submitError}</p> : null}
        </>
      )}
    </Modal>
  )
}
