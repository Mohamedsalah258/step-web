import { Eye, ImageIcon, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { IconButton } from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/Badge'
import { RowActions, Truncate, type Column } from '@/components/ui/Table'
import { cn } from '@/lib/cn'
import type { DetailRow, PurchaseOrder } from '@/data/orders'

/*
 * أجزاء مشتركة بين شاشات طلبات الشراء (مش صفحات — مفيش default export).
 * الملف جوّه فولدر الدومين زي ما نظام الديزاين بيسمح (قاعدة 4).
 */

const VALUE_TONE = {
  ink: 'text-ink',
  brand: 'text-brand',
  success: 'text-success',
  danger: 'text-danger',
} as const

/**
 * صف مفتاح/قيمة جوّه بلوك بيانات — فيجما node 7:516.
 * RTL: التسمية يمين والقيمة شمال، فالتسمية أول عنصر في الـ DOM.
 */
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
export function DrawerSection({
  title,
  rows,
}: {
  title: string
  rows: DetailRow[]
}) {
  return (
    <div className="flex w-full shrink-0 flex-col gap-2">
      <p className="w-full text-right text-base font-extrabold text-ink">
        {title}
      </p>
      <div className="flex w-full flex-col gap-2 rounded-ctl bg-surface p-3">
        {rows.map((r) => (
          <InfoLine key={r.label} row={r} />
        ))}
      </div>
    </div>
  )
}

/**
 * صورة الإيصال — فيجما node 7:545 (rounded-rectangle بصورة فوتوغرافية).
 * نظام الديزاين بيمنع تنزيل أصول من فيجما، فبنرسم بلوك بديل بنفس المقاسات.
 */
export function ReceiptBox({
  title,
  height = 130,
}: {
  title: string
  height?: number
}) {
  return (
    <div className="flex w-full shrink-0 flex-col gap-2">
      <p className="w-full text-right text-base font-extrabold text-ink">
        {title}
      </p>
      <div
        className="flex w-full items-center justify-center rounded-logo border border-line bg-surface"
        style={{ height }}
      >
        <ImageIcon className="size-8 text-muted" strokeWidth={1.75} />
      </div>
    </div>
  )
}

/**
 * غلاف الدروار — فيجما node 7:505 / 28:443 / 28:701:
 * لوح 420px ملتصق بالحافة اليسرى، بوردر يمين + ظل، p24.
 */
export function OrderDrawer({
  title,
  children,
  onClose,
  gap = 24,
}: {
  title: string
  children: React.ReactNode
  onClose?: () => void
  /** فيجما: 24 في دروار المراجعة و20 في دروار النتيجة */
  gap?: 20 | 24
}) {
  const navigate = useNavigate()
  const close = onClose ?? (() => navigate('/orders'))

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-40 flex w-[420px] max-w-full flex-col overflow-y-auto border-r border-line bg-white p-6 shadow-[8px_0_12px_rgba(0,0,0,0.1)]',
        gap === 24 ? 'gap-6' : 'gap-5',
      )}
    >
      {/* drawer-header — RTL: العنوان يمين وزرار الإغلاق شمال */}
      <div className="flex w-full shrink-0 items-center justify-between">
        <p className="whitespace-nowrap text-lg font-extrabold text-ink">
          {title}
        </p>
        <button
          type="button"
          onClick={close}
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
 * أعمدة جدول طلبات الشراء — فيجما node 7:302.
 * ⚠️ أول عمود في المصفوفة = أول عمود من **اليمين**.
 */
export function orderColumns(
  onOpen: (row: PurchaseOrder) => void,
  compact = false,
): Column<PurchaseOrder>[] {
  return [
    {
      key: 'index',
      header: '#',
      width: compact ? 40 : 50,
      render: (r) => <span className="num text-muted">{r.index}</span>,
    },
    {
      key: 'student',
      header: 'الطالب',
      width: compact ? 180 : 200,
      render: (r) => (
        <span className="font-semibold text-ink">{r.student}</span>
      ),
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
      width: compact ? 90 : 100,
      render: (r) => <span className="mono font-bold text-ink">{r.price}</span>,
    },
    {
      key: 'method',
      header: 'طريقة الدفع',
      width: compact ? 110 : 130,
      render: (r) => <span className="text-ink">{r.method}</span>,
    },
    {
      key: 'reference',
      header: 'الرقم المرجعي',
      width: compact ? 130 : 150,
      render: (r) => <span className="num text-muted">{r.reference}</span>,
    },
    {
      key: 'date',
      header: 'التاريخ',
      width: compact ? 110 : 130,
      render: (r) => <span className="num text-muted">{r.date}</span>,
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
          <IconButton
            icon={Eye}
            label="عرض التفاصيل"
            tone="brand"
            onClick={() => onOpen(r)}
          />
        </RowActions>
      ),
    },
  ]
}
