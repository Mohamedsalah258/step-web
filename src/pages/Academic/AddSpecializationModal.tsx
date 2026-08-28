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
import { ADD_SPECIALIZATION_MODAL as M } from '@/data/academic'
import { createSpecialization, listColleges } from '@/api/academic'

type AcademicOutletContext = { onDataChanged: () => void }

/** فيجما frame: v3-add-specialization-modal (node 2003:3379) — modal-card 2003:3530 */
export default function AddSpecializationModal() {
  const navigate = useNavigate()
  const { onDataChanged } = useOutletContext<AcademicOutletContext>()
  const { data, loading, error } = useAsync(() => listColleges({ limit: 200 }), [])
  const colleges = data?.data ?? []

  const [collegeName, setCollegeName] = useState('')
  const [name, setName] = useState('')
  const [active, setActive] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const selectedCollege = colleges.find((c) => c.name === collegeName) ?? colleges[0]

  const handleConfirm = async () => {
    if (!selectedCollege) return
    setSubmitting(true)
    setSubmitError(null)
    try {
      await createSpecialization({
        collegeId: selectedCollege.id,
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
            disabled={submitting || !name.trim() || !selectedCollege}
          >
            {submitting ? '...جاري الإضافة' : M.submit}
          </ModalButton>
        </>
      }
    >
      {loading ? (
        <CardSkeleton />
      ) : error || colleges.length === 0 ? (
        <ErrorState description={error ?? 'لازم تضيف كلية أولاً قبل التخصصات'} />
      ) : (
        <>
          <ModalSelect
            label={M.collegeLabel}
            options={colleges.map((c) => c.name)}
            value={collegeName || selectedCollege?.name}
            onChange={setCollegeName}
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
