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
import { ADD_STAGE_MODAL as M } from '@/data/academic'
import { createStage, listSpecializations } from '@/api/academic'

type AcademicOutletContext = { onDataChanged: () => void }

/** فيجما frame: v3-add-stage-modal (node 2003:3567) — modal-card 2003:3683 */
export default function AddStageModal() {
  const navigate = useNavigate()
  const { onDataChanged } = useOutletContext<AcademicOutletContext>()
  const { data, loading, error } = useAsync(() => listSpecializations({ limit: 100 }), [])
  const specializations = data?.data ?? []

  const [specializationName, setSpecializationName] = useState('')
  const [name, setName] = useState('')
  const [active, setActive] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const selectedSpecialization =
    specializations.find((s) => s.name === specializationName) ?? specializations[0]

  const handleConfirm = async () => {
    if (!selectedSpecialization) return
    setSubmitting(true)
    setSubmitError(null)
    try {
      await createStage({
        specializationId: selectedSpecialization.id,
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
            disabled={submitting || !name.trim() || !selectedSpecialization}
          >
            {submitting ? '...جاري الإضافة' : M.submit}
          </ModalButton>
        </>
      }
    >
      {loading ? (
        <CardSkeleton />
      ) : error || specializations.length === 0 ? (
        <ErrorState description={error ?? 'لازم تضيف تخصص أولاً قبل المراحل'} />
      ) : (
        <>
          <ModalSelect
            label={M.specializationLabel}
            options={specializations.map((s) => s.name)}
            value={specializationName || selectedSpecialization?.name}
            onChange={setSpecializationName}
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
