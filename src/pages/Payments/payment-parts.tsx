import { useState } from 'react'
import { Landmark, Pencil, Wallet } from 'lucide-react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { IconButton } from '@/components/ui/Button'
import { Switch } from '@/components/ui/Switch'
import { Modal, ModalButton, ModalField, ModalSelect, ModalTextArea } from '@/components/ui/Modal'
import { cn } from '@/lib/cn'
import { ADD_METHOD_COPY, METHOD_TYPES } from '@/data/payments'
import { createPaymentMethod, type ApiPaymentMethod, type ApiPaymentMethodType } from '@/api/payments'

const C = ADD_METHOD_COPY

const LABEL_TO_TYPE: Record<string, ApiPaymentMethodType> = {
  [METHOD_TYPES[0]]: 'WALLET',
  [METHOD_TYPES[1]]: 'BANK',
}

type PaymentsOutletContext = { onDataChanged: () => void }

/**
 * كارت طريقة دفع — فيجما node 7:1845. بيانات حقيقية: الحقول المعروضة
 * بتتبني من accountNumber/bankName/holderName/instructions الحقيقيين، مش
 * array ثابت.
 */
export function MethodCard({
  method,
  onToggle,
}: {
  method: ApiPaymentMethod
  onToggle: () => void
}) {
  const Icon = method.type === 'BANK' ? Landmark : Wallet
  const fields =
    method.type === 'BANK'
      ? [
          { label: C.bank.bankNameLabel, value: method.bankName ?? '—' },
          { label: C.bank.accountLabel, value: method.accountNumber ?? '—', num: true },
          { label: C.bank.holderLabel, value: method.holderName ?? '—' },
          { label: C.instructionsLabel, value: method.instructions ?? '—' },
        ]
      : [
          { label: C.wallet.accountLabel, value: method.accountNumber ?? '—', num: true },
          { label: C.instructionsLabel, value: method.instructions ?? '—' },
        ]

  return (
    <Card className="flex min-w-0 flex-col gap-5 p-6">
      <div className="flex w-full items-center justify-between gap-3">
        <div className="flex shrink-0 items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-logo bg-brand-tint">
            <Icon className="size-5 text-brand" strokeWidth={2} />
          </span>
          <h2 className="whitespace-nowrap text-lg font-extrabold text-ink">{method.name}</h2>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Switch on={method.isActive} onChange={onToggle} />
          <span
            className={cn(
              'whitespace-nowrap text-sm font-bold',
              method.isActive ? 'text-success' : 'text-muted',
            )}
          >
            {method.isActive ? 'نشط' : 'معطّل'}
          </span>
        </div>
      </div>

      <div className="h-px w-full shrink-0 bg-line" />

      <div className="flex flex-col gap-3">
        {fields.map((f) => (
          <div key={f.label} className="flex flex-col gap-1">
            <p className="w-full text-right text-xs font-normal text-muted">{f.label}</p>
            <div className="w-full rounded-ctl border border-line bg-surface px-3 py-2">
              <p
                className={cn(
                  'w-full text-right',
                  f.num ? 'num text-base font-bold text-ink' : 'text-sm font-normal text-ink',
                )}
              >
                {f.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-auto w-full pt-2">
        <IconButton icon={Pencil} label="تعديل البيانات" tone="brand" to={`/payments/${method.id}/edit`} />
      </div>
    </Card>
  )
}

/** صف السويتش في مودالز الإضافة/التعديل — فيجما node 35:9198 */
export function MethodToggleField({
  label,
  hint,
  on,
  onChange,
}: {
  label: string
  hint: string
  on: boolean
  onChange: (on: boolean) => void
}) {
  return (
    <div className="flex w-full items-center justify-between gap-4">
      <div className="flex min-w-0 flex-col items-start gap-0.5">
        <span className="text-base font-bold text-ink">{label}</span>
        <span className="text-xs font-normal text-muted">{hint}</span>
      </div>
      <Switch on={on} onChange={onChange} />
    </div>
  )
}

/**
 * حقول نوع الطريقة (محفظة/بنك) — مشتركة بين مودالي الإضافة والتعديل.
 */
export function MethodTypeFields({
  type,
  onTypeChange,
  accountNumber,
  onAccountNumberChange,
  bankName,
  onBankNameChange,
  holderName,
  onHolderNameChange,
}: {
  type: string
  onTypeChange: (v: string) => void
  accountNumber: string
  onAccountNumberChange: (v: string) => void
  bankName: string
  onBankNameChange: (v: string) => void
  holderName: string
  onHolderNameChange: (v: string) => void
}) {
  const isBank = type === METHOD_TYPES[1]
  return (
    <>
      <ModalSelect label={C.typeLabel} options={METHOD_TYPES} value={type} onChange={onTypeChange} />
      {isBank ? (
        <>
          <ModalField
            label={C.bank.bankNameLabel}
            placeholder={C.bank.bankNamePlaceholder}
            value={bankName}
            onChange={onBankNameChange}
          />
          <ModalField
            label={C.bank.accountLabel}
            placeholder={C.bank.accountPlaceholder}
            value={accountNumber}
            onChange={onAccountNumberChange}
            mono
          />
          <ModalField
            label={C.bank.holderLabel}
            placeholder={C.bank.holderPlaceholder}
            value={holderName}
            onChange={onHolderNameChange}
          />
        </>
      ) : (
        <ModalField
          label={C.wallet.accountLabel}
          placeholder={C.wallet.accountPlaceholder}
          value={accountNumber}
          onChange={onAccountNumberChange}
          mono
        />
      )}
    </>
  )
}

/**
 * مودال إضافة طريقة دفع — فيجما node 35:8979 (محفظة) و41:235 (بنك). الفريمين
 * نفس المودال بفرق حقل واحد بس (نوع الطريقة)، فبقوا نفس المكوّن.
 */
export function AddMethodModal({ defaultType = METHOD_TYPES[0] }: { defaultType?: string }) {
  const navigate = useNavigate()
  const { onDataChanged } = useOutletContext<PaymentsOutletContext>()

  const [type, setType] = useState(defaultType)
  const [name, setName] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [bankName, setBankName] = useState('')
  const [holderName, setHolderName] = useState('')
  const [instructions, setInstructions] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleConfirm = async () => {
    if (!name.trim()) return
    setSubmitting(true)
    setSubmitError(null)
    try {
      await createPaymentMethod({
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
      title={C.title}
      width={500}
      actions={
        <>
          <ModalButton variant="cancel">{C.cancel}</ModalButton>
          <ModalButton onClick={handleConfirm} disabled={submitting || !name.trim()}>
            {submitting ? '...جاري الحفظ' : C.submit}
          </ModalButton>
        </>
      }
    >
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
      <MethodToggleField label={C.toggleLabel} hint={C.toggleHint} on={isActive} onChange={setIsActive} />
      {submitError ? <p className="text-sm font-bold text-danger">{submitError}</p> : null}
    </Modal>
  )
}

