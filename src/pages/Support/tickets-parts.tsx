import { useState } from 'react'
import { Eye, Mail, Trash2 } from 'lucide-react'
import { IconButton } from '@/components/ui/Button'
import { Badge, StatusBadge } from '@/components/ui/Badge'
import { RowActions, Truncate, type Column } from '@/components/ui/Table'
import { Modal, ModalButton } from '@/components/ui/Modal'
import { ErrorState } from '@/components/ui/States'
import { useAsync } from '@/lib/useAsync'
import { formatDateTime } from '@/lib/format'
import {
  createTicketCategory,
  deactivateTicketCategory,
  listTicketCategories,
  replyToGuestContact,
  type ApiTicketListItem,
} from '@/api/tickets'
import { CATEGORIES_MODAL, GUEST_CONTACT, PRIORITY_AR, PRIORITY_TONE } from '@/data/tickets'

/*
 * أجزاء مشتركة بين شاشات تذاكر الدعم (مش صفحات — مفيش default export).
 * ⚠️ أول عمود في المصفوفة = أول عمود من **اليمين**.
 */

export function ticketColumns({
  page,
  limit,
  onReplyGuest,
}: {
  page: number
  limit: number
  /** GUEST_CONTACT بس — بيفتح مودال الرد بدل ما يودّي لصفحة تفاصيل مش موجودة أصلًا للزوار */
  onReplyGuest: (row: ApiTicketListItem) => void
}): Column<ApiTicketListItem>[] {
  return [
    {
      key: 'index',
      header: '#',
      width: 50,
      render: (_r, i) => <span className="num text-muted">{(page - 1) * limit + i + 1}</span>,
    },
    {
      key: 'student',
      header: 'الطالب',
      width: 180,
      render: (r) => (
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-ink">{r.student.name}</span>
          {r.kind === 'GUEST_CONTACT' ? <Badge tone="neutral">{GUEST_CONTACT.badge}</Badge> : null}
        </div>
      ),
    },
    {
      key: 'subject',
      header: 'الموضوع',
      flex: true,
      render: (r) => <Truncate>{r.subject}</Truncate>,
    },
    {
      key: 'category',
      header: 'التصنيف',
      width: 140,
      render: (r) => <span className="text-ink">{r.category ?? GUEST_CONTACT.emptyField}</span>,
    },
    {
      key: 'priority',
      header: 'الأولوية',
      width: 100,
      render: (r) =>
        r.priority ? (
          <Badge tone={PRIORITY_TONE[r.priority]}>{PRIORITY_AR[r.priority]}</Badge>
        ) : (
          <span className="text-muted">{GUEST_CONTACT.emptyField}</span>
        ),
    },
    {
      key: 'status',
      header: 'الحالة',
      width: 110,
      render: (r) => <StatusBadge status={r.status} />,
    },
    {
      key: 'updatedAt',
      header: 'آخر تحديث',
      width: 150,
      render: (r) => <span className="num text-muted">{formatDateTime(r.updatedAt)}</span>,
    },
    {
      key: 'action',
      header: 'إجراء',
      width: 60,
      align: 'center',
      render: (r) => (
        <RowActions>
          {r.kind === 'GUEST_CONTACT' ? (
            <IconButton icon={Mail} label={GUEST_CONTACT.replyAction} tone="brand" onClick={() => onReplyGuest(r)} />
          ) : (
            <IconButton icon={Eye} label="عرض التذكرة" tone="brand" to={`/tickets/${r.id}`} />
          )}
        </RowActions>
      ),
    },
  ]
}

/** مودال إدارة تصنيفات التذاكر — قايمة بسيطة + إضافة + تعطيل (نفس سطح الـ API المتاح). */
export function TicketCategoriesModal({
  onClose,
  onChanged,
}: {
  onClose: () => void
  onChanged: () => void
}) {
  const { data: categories, loading, error, reload } = useAsync(() => listTicketCategories(), [])
  const [name, setName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleAdd = async () => {
    if (!name.trim()) return
    setSubmitting(true)
    setSubmitError(null)
    try {
      await createTicketCategory(name.trim())
      setName('')
      reload()
      onChanged()
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'حدث خطأ، حاول مرة أخرى')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeactivate = async (id: string) => {
    setSubmitError(null)
    try {
      await deactivateTicketCategory(id)
      reload()
      onChanged()
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'حدث خطأ، حاول مرة أخرى')
    }
  }

  return (
    <Modal title={CATEGORIES_MODAL.title} width={480} onClose={onClose}>
      {error ? (
        <ErrorState description={error} onRetry={reload} />
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            {loading && !categories ? (
              <p className="text-sm text-muted">...جاري التحميل</p>
            ) : !categories || categories.length === 0 ? (
              <p className="text-sm text-muted">{CATEGORIES_MODAL.empty}</p>
            ) : (
              categories.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between gap-3 rounded-ctl bg-surface px-3 py-2.5"
                >
                  <span className="min-w-0 truncate text-sm font-semibold text-ink">{c.name}</span>
                  <IconButton
                    icon={Trash2}
                    label={CATEGORIES_MODAL.deactivate}
                    tone="danger"
                    onClick={() => handleDeactivate(c.id)}
                  />
                </div>
              ))
            )}
          </div>

          <div className="h-px w-full bg-line" />

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={CATEGORIES_MODAL.addPlaceholder}
              className="h-11 min-w-0 flex-1 rounded-ctl border border-line bg-white px-3 text-right text-base text-ink outline-none transition-colors placeholder:text-muted focus:border-brand"
            />
            <div className="shrink-0">
              <ModalButton onClick={handleAdd} disabled={submitting || !name.trim()}>
                {CATEGORIES_MODAL.addButton}
              </ModalButton>
            </div>
          </div>

          {submitError ? <p className="text-sm font-bold text-danger">{submitError}</p> : null}
        </div>
      )}
    </Modal>
  )
}

/** مودال الرد على رسالة زائر (GUEST_CONTACT) — بيتبعت كإيميل حقيقي على طول،
 * عكس رد التذكرة العادي اللي بيضيف رسالة محادثة داخل التطبيق. */
export function GuestContactReplyModal({
  row,
  onClose,
  onSent,
}: {
  row: ApiTicketListItem
  onClose: () => void
  onSent: () => void
}) {
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSend = async () => {
    if (!message.trim()) return
    setSending(true)
    setError(null)
    try {
      await replyToGuestContact(row.id, message.trim())
      onSent()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ، حاول مرة أخرى')
    } finally {
      setSending(false)
    }
  }

  return (
    <Modal title={GUEST_CONTACT.replyModalTitle} width={520} onClose={onClose}>
      <div className="flex flex-col gap-4">
        <div className="rounded-ctl bg-surface p-3">
          <p className="text-xs font-bold text-muted">
            {row.student.name} · {row.student.email}
          </p>
          <p className="mt-1.5 whitespace-pre-wrap text-sm text-ink">{row.message ?? row.subject}</p>
        </div>

        <textarea
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={GUEST_CONTACT.replyPlaceholder}
          className="w-full resize-y rounded-ctl border border-line bg-white p-3 text-right text-base leading-relaxed text-ink outline-none transition-colors placeholder:text-muted focus:border-brand"
        />

        {error ? <p className="text-sm font-bold text-danger">{error}</p> : null}

        <div className="flex items-center gap-2">
          <ModalButton variant="cancel" onClick={onClose}>
            {GUEST_CONTACT.cancel}
          </ModalButton>
          <ModalButton onClick={handleSend} disabled={sending || !message.trim()}>
            {sending ? GUEST_CONTACT.sending : GUEST_CONTACT.send}
          </ModalButton>
        </div>
      </div>
    </Modal>
  )
}
