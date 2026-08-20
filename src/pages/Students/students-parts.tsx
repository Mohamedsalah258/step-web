import { ChevronRight, Eye, RotateCcw, ShieldAlert, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Card, CardHeader } from '@/components/ui/Card'
import { Button, ButtonLink, IconButton } from '@/components/ui/Button'
import { Badge, StatusBadge } from '@/components/ui/Badge'
import { DataTable, RowActions, Truncate, type Column } from '@/components/ui/Table'
import { ProgressBar } from '@/components/ui/Misc'
import { cn } from '@/lib/cn'
import {
  STUDENT_DETAIL,
  STUDENT_DRAWER,
  STUDENT_RESET_LOG,
  STUDENT_SUBSCRIPTIONS,
  type KeyValue,
  type ResetLogRow,
  type StudentRow,
  type SubscriptionRow,
} from '@/data/students'

/*
 * أجزاء مشتركة بين شاشات «الطلاب والأجهزة» (مش صفحات — مفيش default export).
 * الملف جوّه فولدر الدومين زي ما نظام الديزاين بيسمح (قاعدة 4).
 */

/* ========================================================================== */
/* صفوف مفتاح/قيمة                                                            */
/* ========================================================================== */

/**
 * صف تسمية/قيمة — فيجما node 7:931 / 28:812 / 28:957.
 * RTL: التسمية يمين والقيمة شمال، فالتسمية أول عنصر في الـ DOM.
 */
export function SpecRow({
  row,
  valueClassName,
}: {
  row: KeyValue
  valueClassName?: string
}) {
  return (
    <div className="flex w-full items-center justify-between gap-3">
      <span className="shrink-0 text-sm font-normal text-muted">
        {row.label}
      </span>
      <span
        className={cn(
          'min-w-0 truncate text-left text-base font-bold text-ink',
          row.num && 'num text-xs font-normal',
          valueClassName,
        )}
      >
        {row.value}
      </span>
    </div>
  )
}

/** بلوك رمادي فيه صفوف تسمية/قيمة — فيجما node 7:930 / 28:811 / 35:7579 */
export function SpecPlate({
  rows,
  children,
  className,
}: {
  rows?: KeyValue[]
  children?: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex w-full shrink-0 flex-col gap-3 rounded-ctl bg-surface p-4',
        className,
      )}
    >
      {rows?.map((r) => <SpecRow key={r.label} row={r} />)}
      {children}
    </div>
  )
}

/* ========================================================================== */
/* جدول الطلاب — فيجما node 7:1015                                             */
/* ========================================================================== */

/** ⚠️ أول عمود في المصفوفة = أول عمود من **اليمين** */
export function studentColumns(
  onOpen: (row: StudentRow) => void,
): Column<StudentRow>[] {
  return [
    {
      key: 'index',
      header: '#',
      width: 50,
      render: (r) => <span className="num text-muted">{r.index}</span>,
    },
    {
      key: 'name',
      header: 'الاسم',
      width: 180,
      render: (r) => (
        <Truncate>
          <span className="font-semibold text-ink">{r.name}</span>
        </Truncate>
      ),
    },
    {
      key: 'email',
      header: 'البريد الإلكتروني',
      width: 200,
      render: (r) => <span className="num text-muted">{r.email}</span>,
    },
    {
      key: 'phone',
      header: 'الهاتف',
      width: 130,
      render: (r) => <span className="num text-muted">{r.phone}</span>,
    },
    {
      key: 'subscriptions',
      header: 'الاشتراكات',
      width: 80,
      render: (r) => <span className="num text-muted">{r.subscriptions}</span>,
    },
    {
      key: 'device',
      header: 'الجهاز المربوط',
      width: 150,
      render: (r) => <Truncate>{r.device}</Truncate>,
    },
    {
      key: 'status',
      header: 'الحالة',
      width: 90,
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
            label="تفاصيل الطالب والجهاز"
            tone="brand"
            onClick={() => onOpen(r)}
          />
        </RowActions>
      ),
    },
  ]
}

/* ========================================================================== */
/* الدروار — فيجما node 7:921 (لوح 400px على الحافة اليسرى)                    */
/* ========================================================================== */

export function StudentDrawer({ onClose }: { onClose: () => void }) {
  const d = STUDENT_DRAWER
  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-[400px] max-w-full flex-col gap-6 overflow-y-auto border-r border-line bg-white p-6 shadow-[8px_0_12px_rgba(0,0,0,0.1)]">
      {/* drawer-header — RTL: العنوان يمين وزرار الإغلاق شمال */}
      <div className="flex w-full shrink-0 items-center justify-between">
        <p className="whitespace-nowrap text-lg font-extrabold text-ink">
          {d.title}
        </p>
        <button
          type="button"
          onClick={onClose}
          aria-label="إغلاق"
          className="flex size-7 shrink-0 items-center justify-center rounded-full bg-surface text-ink transition-colors hover:bg-line"
        >
          <X className="size-3.5" strokeWidth={2.5} />
        </button>
      </div>

      {/* section-student-info — node 7:928 */}
      <DrawerSection title={d.studentSectionTitle}>
        <SpecPlate rows={d.student} className="gap-2 p-3" />
      </DrawerSection>

      {/* section-subscriptions — node 7:940 */}
      <DrawerSection title={d.subscriptionsTitle}>
        {d.subscriptions.map((s) => (
          <div
            key={s.course}
            className="flex w-full shrink-0 flex-col gap-2 rounded-ctl border border-line p-2.5"
          >
            {/* RTL: اسم الكورس يمين والبادج شمال */}
            <div className="flex w-full items-center justify-between gap-3">
              <span className="min-w-0 truncate text-sm font-bold text-ink">
                {s.course}
              </span>
              <StatusBadge status={s.status} />
            </div>
            <p className="text-2xs text-muted">
              {s.startLabel} <span className="num">{s.startDate}</span>
            </p>
          </div>
        ))}
      </DrawerSection>

      {/* section-device-data — node 7:952 */}
      <DrawerSection title={d.deviceSectionTitle}>
        <SpecPlate rows={d.device} className="gap-2 p-3" />
      </DrawerSection>

      {/* reset-status-card — node 7:961 */}
      <div className="flex w-full shrink-0 flex-col gap-3 rounded-ctl bg-brand-wash p-3">
        {d.resetCard.map((r) => (
          <SpecRow key={r.label} row={r} />
        ))}
        <ButtonLink
          to={`/students/${STUDENT_DETAIL.id}/device-reset`}
          icon={RotateCcw}
          full
        >
          {d.resetButton}
        </ButtonLink>
      </div>

      {/* warning-banner — node 7:973 */}
      <div className="flex w-full shrink-0 flex-col gap-3 rounded-ctl bg-danger-bg p-3">
        <p className="text-right text-sm font-semibold leading-relaxed text-danger">
          {d.warning}
        </p>
        <Button variant="danger" icon={ShieldAlert} full>
          {d.banButton}
        </Button>
      </div>
    </aside>
  )
}

function DrawerSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="flex w-full shrink-0 flex-col gap-2">
      <p className="w-full text-right text-base font-extrabold text-ink">
        {title}
      </p>
      {children}
    </div>
  )
}

/* ========================================================================== */
/* شاشة تفاصيل الطالب — فيجما node 28:764 / 35:7138                            */
/* ========================================================================== */

/** بطاقة البروفايل — node 28:769 */
export function StudentProfileCard({ onBan }: { onBan: () => void }) {
  const s = STUDENT_DETAIL
  return (
    <Card className="flex w-full shrink-0 items-center justify-between gap-6 p-6">
      {/* profile-info-group — RTL: الأفاتار يمين */}
      <div className="flex min-w-0 items-center gap-5">
        <span className="flex size-16 shrink-0 items-center justify-center rounded-full bg-brand-tint text-xl font-extrabold text-brand">
          {s.initials}
        </span>
        <div className="flex min-w-0 flex-col gap-1">
          <div className="flex items-center gap-2">
            <h2 className="truncate text-2xl font-extrabold text-ink">
              {s.name}
            </h2>
            <StatusBadge status={s.status} />
          </div>
          {/* contact-meta — node 28:785 */}
          <div className="flex items-center gap-5 text-sm text-muted">
            <span>{s.registered}</span>
            <Dot />
            <span className="num">{s.email}</span>
            <Dot />
            <span className="num">{s.phone}</span>
          </div>
        </div>
      </div>

      {/* profile-actions — RTL: «ريست الجهاز» يمين و«حظر الطالب» شمال */}
      <div className="flex shrink-0 items-center gap-3">
        <ButtonLink
          to={`/students/${s.id}/device-reset`}
          variant="secondary"
          icon={RotateCcw}
        >
          {s.resetButton}
        </ButtonLink>
        <Button variant="danger" icon={ShieldAlert} onClick={onBan}>
          {s.banButton}
        </Button>
      </div>
    </Card>
  )
}

function Dot() {
  return <span className="size-1 shrink-0 rounded-full bg-line" />
}

/** reset-table — node 28:796 (⚠️ أول عمود = أول عمود من اليمين) */
export const RESET_LOG_COLUMNS: Column<ResetLogRow>[] = [
  {
    key: 'date',
    header: 'التاريخ',
    width: 120,
    render: (r) => <span className="num text-muted">{r.date}</span>,
  },
  {
    key: 'model',
    header: 'الموديل',
    width: 120,
    render: (r) => <span className="text-ink">{r.model}</span>,
  },
  {
    key: 'by',
    header: 'بواسطة',
    flex: true,
    render: (r) => <Truncate>{r.by}</Truncate>,
  },
]

/** sub-table — node 28:832 (⚠️ أول عمود = أول عمود من اليمين) */
export function subscriptionColumns(
  studentId: string,
): Column<SubscriptionRow>[] {
  return [
    {
      key: 'index',
      header: '#',
      width: 40,
      render: (r) => <span className="num text-muted">{r.index}</span>,
    },
    {
      key: 'course',
      header: 'اسم الكورس',
      flex: true,
      render: (r) => (
        <Truncate>
          <span className="font-semibold text-ink">{r.course}</span>
        </Truncate>
      ),
    },
    {
      key: 'college',
      header: 'الكلية',
      width: 150,
      render: (r) => <span className="text-muted">{r.college}</span>,
    },
    {
      key: 'date',
      header: 'تاريخ الاشتراك',
      width: 120,
      render: (r) => <span className="num text-muted">{r.date}</span>,
    },
    {
      key: 'status',
      header: 'الحالة',
      width: 100,
      render: (r) => <StatusBadge status={r.status} />,
    },
    {
      key: 'price',
      header: 'السعر',
      width: 100,
      render: (r) => <span className="mono font-bold text-ink">{r.price}</span>,
    },
    {
      key: 'action',
      header: 'إجراء',
      width: 120,
      render: (r) =>
        r.status === 'ملغي' ? (
          <ButtonLink
            to={`/students/${studentId}/open-course`}
            variant="primary"
            size="sm"
          >
            {r.action}
          </ButtonLink>
        ) : (
          <ButtonLink
            to={`/students/${studentId}/cancel-sub`}
            variant="danger"
            size="sm"
          >
            {r.action}
          </ButtonLink>
        ),
    },
  ]
}

/**
 * جسم شاشة التفاصيل — نفس الليّاوت في فريم v3-student-detail
 * وفي كل فريمات المودالز اللي مبنية فوقه.
 */
export function StudentDetailBody({ onBan }: { onBan: () => void }) {
  const s = STUDENT_DETAIL
  const navigate = useNavigate()

  return (
    <>
      {/* back-to-list — RTL: السهم يمين والنص بعده — node 28:765 */}
      <button
        type="button"
        onClick={() => navigate('/students')}
        className="flex shrink-0 items-center gap-2 self-start text-base font-semibold text-muted transition-colors hover:text-brand"
      >
        <ChevronRight className="size-3.5 shrink-0" strokeWidth={2.5} />
        {s.backLabel}
      </button>

      <StudentProfileCard onBan={onBan} />

      {/* middle-panels — RTL: لوح الجهاز يمين وسجل الريست شمال — node 28:793 */}
      <div className="flex w-full shrink-0 items-start gap-6">
        {/* device-panel — node 28:809 */}
        <Card className="flex w-[480px] shrink-0 flex-col gap-4 p-5">
          <p className="w-full text-right text-lg font-extrabold text-ink">
            {s.devicePanelTitle}
          </p>
          <SpecPlate rows={s.device} />
          {/* reset-progress — node 28:818 */}
          <div className="flex w-full flex-col gap-2">
            <div className="flex w-full items-center justify-between gap-3 text-sm">
              <span className="shrink-0 text-muted">{s.resetsUsedLabel}</span>
              <span className="mono shrink-0 font-bold text-brand">
                {s.resetsUsedValue}
              </span>
            </div>
            <ProgressBar value={s.resetsPercent} tone="warning" />
            <div className="flex w-full items-center justify-between gap-3 pt-1 text-xs">
              <span className="shrink-0 text-muted">{s.nextResetLabel}</span>
              <span className="num shrink-0 text-success">
                {s.nextResetValue}
              </span>
            </div>
          </div>
        </Card>

        {/* resets-panel — node 28:794 */}
        <Card className="flex min-w-0 flex-1 flex-col gap-4 overflow-hidden p-5">
          <p className="w-full text-right text-lg font-extrabold text-ink">
            {s.resetsPanelTitle}
          </p>
          <div className="-mx-5 overflow-hidden">
            <DataTable
              columns={RESET_LOG_COLUMNS}
              rows={STUDENT_RESET_LOG}
              rowKey={(r) => r.id}
            />
          </div>
        </Card>
      </div>

      {/* subscriptions-section — node 28:827 */}
      <Card className="w-full shrink-0 overflow-hidden">
        <CardHeader
          title={s.subscriptionsTitle}
          actions={
            <ButtonLink
              to={`/students/${s.id}/open-course`}
              variant="primary"
              size="sm"
            >
              {s.addSubscriptionButton}
            </ButtonLink>
          }
        />
        <DataTable
          columns={subscriptionColumns(s.id)}
          rows={STUDENT_SUBSCRIPTIONS}
          rowKey={(r) => r.id}
        />
      </Card>
    </>
  )
}

/** بادج سعر جوّه مودال إلغاء الاشتراك — node 35:7830 */
export function PriceBadge({ children }: { children: React.ReactNode }) {
  return (
    <Badge tone="brand" className="mono">
      {children}
    </Badge>
  )
}
