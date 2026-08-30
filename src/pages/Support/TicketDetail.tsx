import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { RefreshCcw } from 'lucide-react'
import { Page } from '@/components/layout/Page'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Badge, StatusBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Breadcrumb, InfoGrid } from '@/components/ui/Misc'
import { Checkbox } from '@/components/ui/Field'
import { CardSkeleton, ErrorState } from '@/components/ui/States'
import { cn } from '@/lib/cn'
import { formatDateTime } from '@/lib/format'
import { useAsync } from '@/lib/useAsync'
import { uploadUrl } from '@/api/uploads'
import { getTicketDetail, replyToTicket } from '@/api/tickets'
import { PRIORITY_AR, PRIORITY_TONE, REPLY_COMPOSER, TICKET_DETAIL_SECTIONS, TICKETS_PAGE_TITLE } from '@/data/tickets'
import { TicketStatusModal } from './TicketStatusModal'

/** فيجما: صفحة تفاصيل تذكرة واحدة — بيانات + محادثة كاملة + رد الأدمن. */
export default function TicketDetail() {
  const { id = '' } = useParams()
  const { data: ticket, loading, error, reload } = useAsync(() => getTicketDetail(id), [id])
  const [statusModalOpen, setStatusModalOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [isInternal, setIsInternal] = useState(false)
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState<string | null>(null)

  if (!id) return null

  const handleSend = async () => {
    if (!message.trim()) return
    setSending(true)
    setSendError(null)
    try {
      await replyToTicket(id, message.trim(), isInternal)
      setMessage('')
      setIsInternal(false)
      reload()
    } catch (err) {
      setSendError(err instanceof Error ? err.message : 'حدث خطأ، حاول مرة أخرى')
    } finally {
      setSending(false)
    }
  }

  return (
    <Page title={TICKETS_PAGE_TITLE}>
      <Breadcrumb items={[{ label: TICKETS_PAGE_TITLE, to: '/tickets' }, { label: ticket?.subject ?? '...' }]} />

      {loading && !ticket ? (
        <CardSkeleton />
      ) : error || !ticket ? (
        <ErrorState description={error ?? 'تعذر العثور على التذكرة'} onRetry={reload} />
      ) : (
        <div className="flex w-full flex-col gap-5 lg:flex-row lg:items-start">
          {/* العمود الرئيسي — بيانات التذكرة + المحادثة */}
          <div className="flex min-w-0 flex-1 flex-col gap-5">
            <Card>
              <CardHeader
                title={ticket.subject}
                actions={
                  <Button variant="secondary" icon={RefreshCcw} size="sm" onClick={() => setStatusModalOpen(true)}>
                    تغيير الحالة
                  </Button>
                }
              />
              <CardBody className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={ticket.status} />
                  <Badge tone={PRIORITY_TONE[ticket.priority]}>{PRIORITY_AR[ticket.priority]}</Badge>
                  {ticket.category ? <Badge tone="neutral">{ticket.category.name}</Badge> : null}
                </div>
                <p className="text-right text-base leading-relaxed text-ink">{ticket.description}</p>
                {ticket.resolution ? (
                  <div className="rounded-ctl bg-success-bg px-4 py-3 text-right text-sm leading-relaxed text-success">
                    <span className="font-extrabold">ملاحظة الحل: </span>
                    {ticket.resolution}
                  </div>
                ) : null}
              </CardBody>
            </Card>

            <Card>
              <CardHeader title={TICKET_DETAIL_SECTIONS.conversation} />
              <CardBody className="flex flex-col gap-4">
                {ticket.messages.length === 0 ? (
                  <p className="text-center text-sm text-muted">لا توجد رسائل بعد.</p>
                ) : (
                  <div className="flex flex-col gap-3">
                    {ticket.messages.map((m) => (
                      <div
                        key={m.id}
                        className={cn(
                          'flex max-w-[80%] flex-col gap-1 rounded-ctl px-4 py-3',
                          m.senderType === 'ADMIN' ? 'self-end' : 'self-start',
                          m.isInternal
                            ? 'bg-warning-bg'
                            : m.senderType === 'ADMIN'
                              ? 'bg-brand-wash'
                              : 'bg-surface',
                        )}
                      >
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-sm font-bold text-ink">{m.senderName}</span>
                          <span className="num text-2xs text-muted">{formatDateTime(m.createdAt)}</span>
                        </div>
                        {m.isInternal ? (
                          <span className="text-2xs font-bold text-warning">ملاحظة داخلية</span>
                        ) : null}
                        <p className="whitespace-pre-wrap text-right text-sm leading-relaxed text-ink">
                          {m.message}
                        </p>
                        {m.attachmentFileId ? (
                          <a
                            href={uploadUrl(m.attachmentFileId)}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm font-bold text-brand hover:underline"
                          >
                            عرض المرفق
                          </a>
                        ) : null}
                      </div>
                    ))}
                  </div>
                )}

                <div className="h-px w-full bg-line" />

                <div className="flex flex-col gap-2.5">
                  <textarea
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={REPLY_COMPOSER.placeholder}
                    className="w-full resize-y rounded-ctl border border-line bg-white p-3 text-right text-base leading-relaxed text-ink outline-none transition-colors placeholder:text-muted focus:border-brand"
                  />
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <Checkbox
                      label={REPLY_COMPOSER.internalLabel}
                      on={isInternal}
                      onChange={setIsInternal}
                    />
                    <Button onClick={handleSend} disabled={sending || !message.trim()} size="sm">
                      {sending ? REPLY_COMPOSER.sending : REPLY_COMPOSER.send}
                    </Button>
                  </div>
                  {sendError ? <p className="text-sm font-bold text-danger">{sendError}</p> : null}
                </div>
              </CardBody>
            </Card>
          </div>

          {/* العمود الجانبي — بيانات الطالب والتذكرة */}
          <div className="flex w-full shrink-0 flex-col gap-5 lg:w-[320px]">
            <Card>
              <CardHeader title={TICKET_DETAIL_SECTIONS.student} />
              <CardBody>
                <InfoGrid
                  cols={1}
                  items={[
                    { label: 'الاسم:', value: ticket.student.name },
                    { label: 'رقم الهاتف:', value: ticket.student.phone },
                    { label: 'البريد الإلكتروني:', value: ticket.student.email },
                  ]}
                />
              </CardBody>
            </Card>

            <Card>
              <CardHeader title={TICKET_DETAIL_SECTIONS.ticket} />
              <CardBody>
                <InfoGrid
                  cols={1}
                  items={[
                    { label: 'المتابع:', value: ticket.assignedAdminName ?? '—' },
                    { label: 'تاريخ الإنشاء:', value: formatDateTime(ticket.createdAt) },
                    { label: 'آخر تحديث:', value: formatDateTime(ticket.updatedAt) },
                    ...(ticket.resolvedAt
                      ? [{ label: 'تاريخ الحل:', value: formatDateTime(ticket.resolvedAt) }]
                      : []),
                    ...(ticket.closedAt
                      ? [{ label: 'تاريخ الإغلاق:', value: formatDateTime(ticket.closedAt) }]
                      : []),
                  ]}
                />
              </CardBody>
            </Card>
          </div>
        </div>
      )}

      {statusModalOpen && ticket ? (
        <TicketStatusModal
          ticket={ticket}
          onClose={() => setStatusModalOpen(false)}
          onChanged={() => {
            reload()
            setStatusModalOpen(false)
          }}
        />
      ) : null}
    </Page>
  )
}
