import { useState } from 'react'
import { Modal, ModalButton, ModalSelect, ModalTextArea } from '@/components/ui/Modal'
import { updateTicketStatus, type ApiTicketDetail, type TicketStatusRaw } from '@/api/tickets'
import { ALLOWED_NEXT_STATUS, STATUS_MODAL } from '@/data/tickets'

export function TicketStatusModal({
  ticket,
  onClose,
  onChanged,
}: {
  ticket: ApiTicketDetail
  onClose: () => void
  onChanged: () => void
}) {
  const options = ALLOWED_NEXT_STATUS[ticket.statusRaw] ?? []
  const [status, setStatus] = useState(options[0]?.value ?? '')
  const [resolution, setResolution] = useState(ticket.resolution ?? '')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const needsResolution = status === 'RESOLVED'

  const handleConfirm = async () => {
    if (!status) return
    if (needsResolution && !resolution.trim()) return
    setSubmitting(true)
    setSubmitError(null)
    try {
      await updateTicketStatus(ticket.id, status as TicketStatusRaw, resolution.trim() || undefined)
      onChanged()
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'حدث خطأ، حاول مرة أخرى')
      setSubmitting(false)
    }
  }

  return (
    <Modal
      title={STATUS_MODAL.title}
      width={520}
      onClose={onClose}
      actions={
        options.length > 0 ? (
          <>
            <ModalButton variant="cancel" onClick={onClose}>
              {STATUS_MODAL.cancel}
            </ModalButton>
            <ModalButton
              onClick={handleConfirm}
              disabled={submitting || !status || (needsResolution && !resolution.trim())}
            >
              {submitting ? '...جاري الحفظ' : STATUS_MODAL.submit}
            </ModalButton>
          </>
        ) : (
          <ModalButton variant="cancel" onClick={onClose}>
            {STATUS_MODAL.cancel}
          </ModalButton>
        )
      }
    >
      {options.length === 0 ? (
        <p className="text-right text-base leading-relaxed text-muted">{STATUS_MODAL.noneAvailable}</p>
      ) : (
        <>
          <ModalSelect
            label={STATUS_MODAL.statusLabel}
            options={options.map((o) => o.label)}
            value={options.find((o) => o.value === status)?.label ?? ''}
            onChange={(label) => setStatus(options.find((o) => o.label === label)?.value ?? '')}
          />
          {needsResolution ? (
            <ModalTextArea
              label={`${STATUS_MODAL.resolutionLabel} — ${STATUS_MODAL.resolutionHint}`}
              placeholder={STATUS_MODAL.resolutionPlaceholder}
              rows={4}
              value={resolution}
              onChange={setResolution}
            />
          ) : null}
          {submitError ? <p className="text-sm font-bold text-danger">{submitError}</p> : null}
        </>
      )}
    </Modal>
  )
}
