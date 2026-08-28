import { useEffect, useState } from 'react'
import { useNavigate, useOutletContext, useParams } from 'react-router-dom'
import {
  Modal,
  ModalButton,
  ModalDangerZone,
  ModalField,
  ModalToggleRow,
} from '@/components/ui/Modal'
import { CardSkeleton, ErrorState } from '@/components/ui/States'
import { useAsync } from '@/lib/useAsync'
import { listColleges, updateCollege } from '@/api/academic'

type AcademicOutletContext = { onDataChanged: () => void }

export default function EditCollegeModal() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { onDataChanged } = useOutletContext<AcademicOutletContext>()
  const { data, loading, error } = useAsync(() => listColleges({ limit: 200 }), [])
  const college = data?.data.find((c) => c.id === id)

  const [name, setName] = useState('')
  const [active, setActive] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    if (college) {
      setName(college.name)
      setActive(college.status === 'نشط')
    }
  }, [college])

  if (!id) return null

  const handleConfirm = async () => {
    setSubmitting(true)
    setSubmitError(null)
    try {
      await updateCollege(id, { name, status: active ? 'ACTIVE' : 'DISABLED' })
      onDataChanged()
      navigate(-1)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'حدث خطأ، حاول مرة أخرى')
      setSubmitting(false)
    }
  }

  return (
    <Modal
      title="تعديل بيانات الكلية"
      actions={
        <>
          <ModalButton variant="cancel">إلغاء</ModalButton>
          <ModalButton onClick={handleConfirm} disabled={submitting || !name.trim() || !college}>
            {submitting ? '...جاري الحفظ' : 'حفظ التعديلات'}
          </ModalButton>
        </>
      }
    >
      {loading ? (
        <CardSkeleton />
      ) : error || !college ? (
        <ErrorState description={error ?? 'تعذر العثور على الكلية'} />
      ) : (
        <>
          <ModalField label="اسم الكلية" value={name} onChange={setName} />
          <ModalToggleRow
            label="الحالة"
            value={active ? 'نشط' : 'معطل'}
            tone={active ? 'success' : 'danger'}
            defaultOn={active}
            onChange={setActive}
          />
          <ModalDangerZone
            label="حذف الكلية"
            onClick={() => navigate(`/academic/colleges/${id}/delete`)}
          />
          {submitError ? <p className="text-sm font-bold text-danger">{submitError}</p> : null}
        </>
      )}
    </Modal>
  )
}
