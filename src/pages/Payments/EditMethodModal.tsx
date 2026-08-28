import { useEffect, useState } from 'react'
import { useNavigate, useOutletContext, useParams } from 'react-router-dom'
import {
  Modal,
  ModalButton,
  ModalDangerZone,
  ModalField,
  ModalTextArea,
} from '@/components/ui/Modal'
import { CardSkeleton, ErrorState } from '@/components/ui/States'
import { useAsync } from '@/lib/useAsync'
import {
  listPaymentMethods,
  updatePaymentMethod,
  type ApiPaymentMethodType,
} from '@/api/payments'
import { ADD_METHOD_COPY as C, METHOD_TYPES } from '@/data/payments'
import { MethodToggleField, MethodTypeFields } from './payment-parts'

const LABEL_TO_TYPE: Record<string, ApiPaymentMethodType> = {
  [METHOD_TYPES[0]]: 'WALLET',
  [METHOD_TYPES[1]]: 'BANK',
}
const TYPE_TO_LABEL: Record<ApiPaymentMethodType, string> = {
  WALLET: METHOD_TYPES[0],
  BANK: METHOD_TYPES[1],
}

type PaymentsOutletContext = { onDataChanged: () => void }

/** مودال تعديل طريقة دفع — نفس حقول الإضافة + منطقة حذف */
export default function EditMethodModal() {
  const navigate = useNavigate()
  const { id = '' } = useParams()
  const { onDataChanged } = useOutletContext<PaymentsOutletContext>()
  // مفيش GET /payment-methods/:id مستقل — القائمة كلها صغيرة وبتتجاب أصلًا،
  // فبنلاقي العنصر منها بدل endpoint جديد لعملية بسيطة كده.
  const { data: methods, loading, error } = useAsync(() => listPaymentMethods(), [])
  const method = methods?.find((m) => m.id === id)

  const [type, setType] = useState(METHOD_TYPES[0])
  const [name, setName] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [bankName, setBankName] = useState('')
  const [holderName, setHolderName] = useState('')
  const [instructions, setInstructions] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    if (method) {
      setType(TYPE_TO_LABEL[method.type])
      setName(method.name)
      setAccountNumber(method.accountNumber ?? '')
      setBankName(method.bankName ?? '')
      setHolderName(method.holderName ?? '')
      setInstructions(method.instructions ?? '')
      setIsActive(method.isActive)
    }
  }, [method])

  if (!id) return null

  const handleConfirm = async () => {
    if (!name.trim()) return
    setSubmitting(true)
    setSubmitError(null)
    try {
      await updatePaymentMethod(id, {
        name,
        type: LABEL_TO_TYPE[type],
        accountNumber: accountNumber || undefined,
        bankName: bankName || undefined,
        holderName: holderName || undefined,
        instructions: instructions || undefined,
        isActive,
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
      title={C.editTitle}
      width={500}
      actions={
        <>
          <ModalButton variant="cancel">{C.cancel}</ModalButton>
          <ModalButton onClick={handleConfirm} disabled={submitting || !name.trim() || !method}>
            {submitting ? '...جاري الحفظ' : C.editSubmit}
          </ModalButton>
        </>
      }
    >
      {loading ? (
        <CardSkeleton />
      ) : error || !method ? (
        <ErrorState description={error ?? 'تعذر العثور على طريقة الدفع'} />
      ) : (
        <>
          <ModalField label={C.nameLabel} placeholder={C.namePlaceholder} value={name} onChange={setName} />
          <MethodTypeFields
            type={type}
            onTypeChange={setType}
            accountNumber={accountNumber}
            onAccountNumberChange={setAccountNumber}
            bankName={bankName}
            onBankNameChange={setBankName}
            holderName={holderName}
            onHolderNameChange={setHolderName}
          />
          <ModalTextArea
            label={C.instructionsLabel}
            placeholder={C.instructionsPlaceholder}
            rows={3}
            value={instructions}
            onChange={setInstructions}
          />
          <MethodToggleField
            label={C.toggleLabel}
            hint={C.toggleHint}
            on={isActive}
            onChange={setIsActive}
          />
          <ModalDangerZone
            label={C.deleteLabel}
            onClick={() => navigate(`/payments/${id}/delete`)}
          />
          {submitError ? <p className="text-sm font-bold text-danger">{submitError}</p> : null}
        </>
      )}
    </Modal>
  )
}
