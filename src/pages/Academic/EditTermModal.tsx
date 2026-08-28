import { useEffect, useState } from 'react'
import { useNavigate, useOutletContext, useParams } from 'react-router-dom'
import {
  Modal,
  ModalButton,
  ModalField,
  ModalToggleRow,
} from '@/components/ui/Modal'
import { CardSkeleton, ErrorState } from '@/components/ui/States'
import { useAsync } from '@/lib/useAsync'
import { listTerms, updateTerm } from '@/api/academic'

type AcademicOutletContext = { onDataChanged: () => void }

export default function EditTermModal() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { onDataChanged } = useOutletContext<AcademicOutletContext>()
  const { data, loading, error } = useAsync(() => listTerms({ limit: 200 }), [])
  const term = data?.data.find((t) => t.id === id)

  const [name, setName] = useState('')
  const [active, setActive] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    if (term) {
      setName(term.name)
      setActive(term.status === 'نشط')
    }
  }, [term])

  if (!id) return null

  const handleConfirm = async () => {
    setSubmitting(true)
    setSubmitError(null)
    try {
      await updateTerm(id, { name, status: active ? 'ACTIVE' : 'DISABLED' })
      onDataChanged()
      navigate(-1)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'حدث خطأ، حاول مرة أخرى')
      setSubmitting(false)
    }
  }

  return (
    <Modal
      title="تعديل بيانات الترم"
      actions={
        <>
          <ModalButton variant="cancel">إلغاء</ModalButton>
          <ModalButton onClick={handleConfirm} disabled={submitting || !name.trim() || !term}>
            {submitting ? '...جاري الحفظ' : 'حفظ التعديلات'}
          </ModalButton>
        </>
      }
    >
      {loading ? (
        <CardSkeleton />
      ) : error || !term ? (
        <ErrorState description={error ?? 'تعذر العثور على الترم'} />
      ) : (
        <>
          <ModalField label="اسم الترم" value={name} onChange={setName} />
          <ModalToggleRow
            label="الحالة"
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
