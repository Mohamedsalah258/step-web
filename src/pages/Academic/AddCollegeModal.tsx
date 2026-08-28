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
import { ADD_COLLEGE_MODAL as M } from '@/data/academic'
import { createCollege, listUniversities } from '@/api/academic'

type AcademicOutletContext = { onDataChanged: () => void }

/** فيجما frame: v3-add-college-modal (node 2003:3198) — modal-card 2003:3349 */
export default function AddCollegeModal() {
  const navigate = useNavigate()
  const { onDataChanged } = useOutletContext<AcademicOutletContext>()
  const { data, loading, error } = useAsync(() => listUniversities({ limit: 200 }), [])
  const universities = data?.data ?? []

  const [universityName, setUniversityName] = useState('')
  const [name, setName] = useState('')
  const [active, setActive] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const selectedUniversity =
    universities.find((u) => u.name === universityName) ?? universities[0]

  const handleConfirm = async () => {
    if (!selectedUniversity) return
    setSubmitting(true)
    setSubmitError(null)
    try {
      await createCollege({
        universityId: selectedUniversity.id,
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
            disabled={submitting || !name.trim() || !selectedUniversity}
          >
            {submitting ? '...جاري الإضافة' : M.submit}
          </ModalButton>
        </>
      }
    >
      {loading ? (
        <CardSkeleton />
      ) : error || universities.length === 0 ? (
        <ErrorState description={error ?? 'لازم تضيف جامعة أولاً قبل الكليات'} />
      ) : (
        <>
          <ModalSelect
            label={M.universityLabel}
            options={universities.map((u) => u.name)}
            value={universityName || selectedUniversity?.name}
            onChange={setUniversityName}
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
