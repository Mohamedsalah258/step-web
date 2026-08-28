import { Check, Eye, ImageIcon, X } from 'lucide-react'
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button, IconButton } from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/Badge'
import { RowActions, Truncate, type Column } from '@/components/ui/Table'
import { CardSkeleton, ErrorState } from '@/components/ui/States'
import { cn } from '@/lib/cn'
import { formatDateTime, formatEGP } from '@/lib/format'
import { useAsync } from '@/lib/useAsync'
import { uploadUrl } from '@/api/uploads'
import { getOrderDetail, type ApiOrderListItem } from '@/api/orders'
import { DRAWER_SECTIONS, type DetailRow } from '@/data/orders'

/*
 * أجزاء مشتركة بين شاشات طلبات الشراء (مش صفحات — مفيش default export).
 */

const VALUE_TONE = {
  ink: 'text-ink',
  brand: 'text-brand',
  success: 'text-success',
  danger: 'text-danger',
} as const

/** صف مفتاح/قيمة جوّه بلوك بيانات — فيجما node 7:516 */
export function InfoLine({ row }: { row: DetailRow }) {
  return (
    <div className="flex w-full items-center justify-between gap-3 text-sm">
      <span className="shrink-0 font-normal text-muted">{row.label}</span>
      <span
        className={cn(
          'min-w-0 truncate text-left',
          row.mono && 'num',
          row.bold ? 'font-bold' : 'font-normal',
          VALUE_TONE[row.tone ?? 'ink'],
        )}
      >
        {row.value}
      </span>
    </div>
  )
}

/** قسم بعنوان + بلوك رمادي — فيجما node 7:513 / 28:451 */
export function DrawerSection({ title, rows }: { title: string; rows: DetailRow[] }) {
  return (
    <div className="flex w-full shrink-0 flex-col gap-2">
      <p className="w-full text-right text-base font-extrabold text-ink">{title}</p>
      <div className="flex w-full flex-col gap-2 rounded-ctl bg-surface p-3">
        {rows.map((r) => (
          <InfoLine key={r.label} row={r} />
        ))}
      </div>
    </div>
  )
}

/** صورة الإيصال — فيجما node 7:545: صورة حقيقية لو موجودة، بلوك بديل لو لأ */
export function ReceiptBox({
  title,
  fileId,
  height = 130,
}: {
  title: string
  fileId?: string | null
  height?: number
}) {
  return (
    <div className="flex w-full shrink-0 flex-col gap-2">
      <p className="w-full text-right text-base font-extrabold text-ink">{title}</p>
      {fileId ? (
        <img
          src={uploadUrl(fileId)}
          alt={title}
          className="w-full rounded-logo border border-line object-cover"
          style={{ height }}
        />
      ) : (
        <div
          className="flex w-full items-center justify-center rounded-logo border border-line bg-surface"
          style={{ height }}
        >
          <ImageIcon className="size-8 text-muted" strokeWidth={1.75} />
        </div>
      )}
    </div>
  )
}

/** غلاف الدروار — فيجما node 7:505 / 28:443 / 28:701 */
export function OrderDrawer({
  title,
  children,
  onClose,
  gap = 24,
}: {
  title: string
  children: React.ReactNode
  onClose: () => void
  gap?: 20 | 24
}) {
  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-40 flex w-[420px] max-w-full flex-col overflow-y-auto border-r border-line bg-white p-6 shadow-[8px_0_12px_rgba(0,0,0,0.1)]',
        gap === 24 ? 'gap-6' : 'gap-5',
      )}
    >
      <div className="flex w-full shrink-0 items-center justify-between">
        <p className="whitespace-nowrap text-lg font-extrabold text-ink">{title}</p>
        <button
          type="button"
          onClick={onClose}
          aria-label="إغلاق"
          className="flex size-8 shrink-0 items-center justify-center rounded-full bg-surface text-ink transition-colors hover:bg-line"
        >
          <X className="size-3.5" strokeWidth={2.5} />
        </button>
      </div>
      {children}
    </aside>
  )
}

/**
 * دروار تفاصيل طلب واحد — بيجيب بيانات حقيقية بالـ id ويتكيّف مع حالة
 * الطلب نفسها (قيد المراجعة/مقبول/مرفوض) بدل 3 دروارز منفصلين بنفس الشكل.
 */
export function OrderDetailDrawer({
  orderId,
  onClose,
}: {
  orderId: string
  onClose: () => void
}) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { data: order, loading, error } = useAsync(() => getOrderDetail(orderId), [orderId])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <OrderDrawer title="تفاصيل طلب الشراء" onClose={onClose} gap={loading || error ? 24 : 20}>
      {loading ? (
        <CardSkeleton />
      ) : error || !order ? (
        <ErrorState description={error ?? 'تعذر العثور على الطلب'} />
      ) : (
        <>
          {order.statusRaw === 'APPROVED' ? (
            <div className="w-full shrink-0 rounded-ctl bg-success-bg px-4 py-3 text-right text-base font-bold text-success">
              طلب مقبول ونشط ✓
            </div>
          ) : order.statusRaw === 'REJECTED' ? (
            <div className="w-full shrink-0 rounded-ctl bg-danger-bg px-4 py-3 text-right text-base font-bold text-danger">
              تم رفض الطلب ✕
            </div>
          ) : null}

          <DrawerSection
            title={DRAWER_SECTIONS.student}
            rows={[
              { label: 'الاسم:', value: order.student.name },
              { label: 'رقم الهاتف:', value: order.student.phone, mono: true },
              { label: 'البريد الإلكتروني:', value: order.student.email, mono: true },
            ]}
          />
          <DrawerSection
            title={DRAWER_SECTIONS.course}
            rows={[
              { label: 'اسم الكورس:', value: order.course.name },
              { label: 'السعر:', value: formatEGP(order.amount), mono: true, bold: true },
            ]}
          />
          <DrawerSection
            title={DRAWER_SECTIONS.payment}
            rows={[
              { label: 'طريقة الدفع:', value: order.paymentMethodName },
              {
                label: 'الرقم المرجعي:',
                value: order.referenceNumber,
                mono: true,
                bold: true,
                tone:
                  order.statusRaw === 'APPROVED'
                    ? 'success'
                    : order.statusRaw === 'REJECTED'
                      ? 'danger'
                      : 'brand',
              },
            ]}
          />
          <ReceiptBox title="صورة التحويل / الإيصال" fileId={order.receiptFileId} />

          {order.statusRaw === 'PENDING' ? (
            <div className="mt-auto flex w-full shrink-0 flex-col gap-3">
              <Button
                variant="success"
                icon={Check}
                full
                onClick={() => navigate(`${pathname}/${order.id}/approve`)}
              >
                موافقة وتفعيل
              </Button>
              <Button
                variant="danger"
                icon={X}
                full
                onClick={() => navigate(`${pathname}/${order.id}/reject`)}
              >
                رفض الطلب
              </Button>
            </div>
          ) : order.statusRaw === 'APPROVED' ? (
            <>
              <DrawerSection
                title="سجل المراجعة"
                rows={[
                  {
                    label: 'تاريخ الموافقة:',
                    value: order.reviewedAt ? formatDateTime(order.reviewedAt) : '—',
                    mono: true,
                  },
                  { label: 'تمت المراجعة بواسطة:', value: order.reviewedByAdminName ?? '—' },
                ]}
              />
              <div className="w-full shrink-0 rounded-ctl bg-brand-wash px-4 py-3 text-right text-sm font-semibold leading-relaxed text-brand">
                ✓ تم تفعيل محتوى الكورس بالكامل للطالب.
              </div>
            </>
          ) : (
            <>
              <div className="flex w-full shrink-0 flex-col gap-2">
                <p className="w-full text-right text-base font-extrabold text-ink">سبب الرفض:</p>
                <div className="rounded-ctl bg-danger-bg px-4 py-3 text-right text-sm leading-relaxed text-danger">
                  {order.rejectionReason ?? '—'}
                </div>
              </div>
              <DrawerSection
                title="سجل المراجعة"
                rows={[
                  {
                    label: 'تاريخ الرفض:',
                    value: order.reviewedAt ? formatDateTime(order.reviewedAt) : '—',
                    mono: true,
                  },
                ]}
              />
              <div className="w-full shrink-0 rounded-ctl bg-brand-wash px-4 py-3 text-right text-sm font-semibold leading-relaxed text-brand">
                الطالب يمكنه إعادة رفع الإيصال على نفس هذا الطلب
              </div>
            </>
          )}
        </>
      )}
    </OrderDrawer>
  )
}

/**
 * أعمدة جدول ملفات الكورس (فيجما node 7:302).
 * ⚠️ أول عمود في المصفوفة = أول عمود من **اليمين**.
 */
export function orderColumns(onOpen: (row: ApiOrderListItem) => void): Column<ApiOrderListItem>[] {
  return [
    {
      key: 'index',
      header: '#',
      width: 50,
      render: (r) => <span className="num text-muted">{r.index}</span>,
    },
    {
      key: 'student',
      header: 'الطالب',
      width: 200,
      render: (r) => <span className="font-semibold text-ink">{r.student}</span>,
    },
    {
      key: 'course',
      header: 'الكورس',
      flex: true,
      render: (r) => <Truncate>{r.course}</Truncate>,
    },
    {
      key: 'price',
      header: 'السعر',
      width: 100,
      render: (r) => <span className="mono font-bold text-ink">{formatEGP(r.price)}</span>,
    },
    {
      key: 'method',
      header: 'طريقة الدفع',
      width: 130,
      render: (r) => <span className="text-ink">{r.method}</span>,
    },
    {
      key: 'reference',
      header: 'الرقم المرجعي',
      width: 150,
      render: (r) => <span className="num text-muted">{r.reference}</span>,
    },
    {
      key: 'date',
      header: 'التاريخ',
      width: 130,
      render: (r) => <span className="num text-muted">{r.date.slice(0, 10)}</span>,
    },
    {
      key: 'status',
      header: 'الحالة',
      width: 100,
      render: (r) => <StatusBadge status={r.status} />,
    },
    {
      key: 'action',
      header: 'إجراء',
      width: 60,
      align: 'center',
      render: (r) => (
        <RowActions>
          <IconButton icon={Eye} label="عرض التفاصيل" tone="brand" onClick={() => onOpen(r)} />
        </RowActions>
      ),
    },
  ]
}
