import { useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import {
  Modal,
  ModalButton,
  ModalField,
  ModalToggleRow,
} from '@/components/ui/Modal'
import { ADD_UNIVERSITY_MODAL as M } from '@/data/academic'
import { createUniversity } from '@/api/academic'

type AcademicOutletContext = { onDataChanged: () => void }

/** فيجما frame: v3-add-university-modal (node 2003:3894) — modal-card 2003:4036، 520px */
export default function AddUniversityModal() {
  const navigate = useNavigate()
  const { onDataChanged } = useOutletContext<AcademicOutletContext>()
  const [name, setName] = useState('')
  const [active, setActive] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleConfirm = async () => {
    setSubmitting(true)
    setSubmitError(null)
    try {
      await createUniversity({ name, status: active ? 'ACTIVE' : 'DISABLED' })
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
          <ModalButton onClick={handleConfirm} disabled={submitting || !name.trim()}>
            {submitting ? '...جاري الإضافة' : M.submit}
          </ModalButton>
        </>
      }
    >
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
    </Modal>
  )
}
