import { useEffect, useState } from 'react'
import { ChevronRight, Eye, Lock, LockOpen, RotateCcw, ShieldAlert, X } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Card, CardHeader } from '@/components/ui/Card'
import { Button, ButtonLink, IconButton } from '@/components/ui/Button'
import { Badge, StatusBadge } from '@/components/ui/Badge'
import { DataTable, RowActions, Truncate, type Column } from '@/components/ui/Table'
import { Modal, ModalButton, ModalNotice } from '@/components/ui/Modal'
import { ProgressBar } from '@/components/ui/Misc'
import { CardSkeleton, ErrorState } from '@/components/ui/States'
import { cn } from '@/lib/cn'
import { useBodyScrollLock } from '@/lib/useBodyScrollLock'
import { useAsync } from '@/lib/useAsync'
import { formatDate, formatEGP } from '@/lib/format'
import {
  banStudent,
  deviceResetStudent,
  getStudentDetail,
  lockStudentProfile,
  unlockStudentProfile,
  type ApiStudentDetail,
} from '@/api/students'
import {
  DEVICE_RESET_MODAL_TEXT,
  STUDENT_DETAIL_LABELS,
  STUDENT_DRAWER_LABELS,
  type KeyValue,
  type ResetLogRow,
  type StudentRow,
  type SubscriptionRow,
} from '@/data/students'

/*
 * أجزاء مشتركة بين شاشات «الطلاب والأجهزة» (مش صفحات — مفيش default export).
 * الملف جوّه فولدر الدومين زي ما نظام الديزاين بيسمح (قاعدة 4).
 */

/**
 * context مودالز صفحة تفاصيل الطالب (device-reset, cancel-sub, open-course,
 * unban) — كل مودال بيستدعي onDataChanged() بعد نجاح العملية عشان يقول
 * لـ StudentDetailBody يعمل reload قبل ما يقفل بـ navigate(-1).
 */
export type StudentDetailOutletContext = {
  onDataChanged: () => void
}

/* ========================================================================== */
/* صفوف مفتاح/قيمة                                                            */
/* ========================================================================== */

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
      flex: true,
      render: (r) => (
        <Truncate>
          <Link
            to={`/students/${r.id}`}
            className="font-semibold text-ink underline decoration-transparent transition-colors hover:text-brand hover:decoration-brand"
          >
            {r.name}
          </Link>
        </Truncate>
      ),
    },
    {
      key: 'email',
      header: 'البريد الإلكتروني',
      width: 200,
      render: (r) => (
        <Truncate>
          <span className="num text-muted">{r.email}</span>
        </Truncate>
      ),
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
/* مودال ريست الجهاز — بيجيب بيانات الطالب بنفسه بالـ id، مشترك بين           */
/* الدروار (quick-view) وصفحة الراوت الكاملة `/students/:id/device-reset`     */
/* ========================================================================== */

export function DeviceResetModalContent({
  studentId,
  onClose,
  onConfirmed,
}: {
  studentId: string
  onClose?: () => void
  onConfirmed?: () => void
}) {
  const { data: student, loading, error } = useAsync(() => getStudentDetail(studentId), [studentId])
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const m = DEVICE_RESET_MODAL_TEXT

  const handleConfirm = async () => {
    setSubmitting(true)
    setSubmitError(null)
    try {
      await deviceResetStudent(studentId)
      onConfirmed?.()
      onClose?.()
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'حدث خطأ، حاول مرة أخرى')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal
      title={m.title}
      width={480}
      onClose={onClose}
      actions={
        <>
          <ModalButton variant="cancel" onClick={onClose}>
            {m.cancel}
          </ModalButton>
          <ModalButton tone="danger" onClick={handleConfirm} disabled={submitting || !student}>
            {submitting ? '...جاري التنفيذ' : m.confirm}
          </ModalButton>
        </>
      }
    >
      {loading ? (
        <CardSkeleton />
      ) : error || !student ? (
        <ErrorState description={error ?? 'تعذر تحميل بيانات الطالب'} />
      ) : (
        <>
          <p className="text-right text-base leading-relaxed text-muted">
            سيتم فصل الجهاز الحالي ({student.device?.model ?? 'غير معروف'}) — الطالب
            هيحتاج يسجل دخول من جهاز جديد كلياً للوصول للاشتراكات.
          </p>
          <SpecPlate
            rows={[
              { label: 'اسم الطالب:', value: student.name },
              { label: 'الجهاز الحالي:', value: student.device?.model ?? 'لا يوجد' },
            ]}
          />
          <ModalNotice tone="warning">
            <span className="mb-2 block text-base font-extrabold">{m.noticeTitle}</span>
            الطالب استخدم {student.resetsUsed} من {student.maxResets} ريست متاحين هذه
            الدورة.
            {submitError ? (
              <span className="mt-2 block font-bold text-danger">{submitError}</span>
            ) : null}
          </ModalNotice>
        </>
      )}
    </Modal>
  )
}

/* ========================================================================== */
/* الدروار — فيجما node 7:921 (لوح 400px على الحافة اليسرى)                    */
/* ========================================================================== */

export function StudentDrawer({
  studentId,
  onClose,
  onChanged,
}: {
  studentId: string
  onClose: () => void
  onChanged?: () => void
}) {
  const { data: student, loading, error, reload } = useAsync(
    () => getStudentDetail(studentId),
    [studentId],
  )
  const [resetOpen, setResetOpen] = useState(false)
  const [banning, setBanning] = useState(false)
  const d = STUDENT_DRAWER_LABELS

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  useBodyScrollLock(true)

  const handleBan = async () => {
    setBanning(true)
    try {
      await banStudent(studentId)
      onChanged?.()
      onClose()
    } finally {
      setBanning(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-navy/40 animate-fade-in"
        onClick={onClose}
        role="presentation"
      />
      <aside className="absolute bottom-0 left-0 top-0 flex w-full max-w-full flex-col gap-6 overflow-y-auto border-r border-line bg-white p-6 shadow-modal md:w-[400px]">
        <div className="flex w-full shrink-0 items-center justify-between">
          <p className="whitespace-nowrap text-lg font-extrabold text-ink">{d.title}</p>
          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق"
            className="flex size-7 shrink-0 items-center justify-center rounded-full bg-surface text-ink transition-colors hover:bg-line"
          >
            <X className="size-3.5" strokeWidth={2.5} />
          </button>
        </div>

        {loading ? (
          <CardSkeleton />
        ) : error || !student ? (
          <ErrorState description={error ?? 'تعذر تحميل بيانات الطالب'} onRetry={reload} />
        ) : (
          <>
            <DrawerSection title={d.studentSectionTitle}>
              <SpecPlate
                rows={[
                  { label: 'الاسم:', value: student.name },
                  { label: 'الهاتف:', value: student.phone, num: true },
                  { label: 'البريد:', value: student.email, num: true },
                ]}
                className="gap-2 p-3"
              />
            </DrawerSection>

            <DrawerSection
              title={d.subscriptionsTitle(
                student.subscriptions.filter((s) => s.status === 'نشط').length,
              )}
            >
              {student.subscriptions.map((s) => (
                <div
                  key={s.id}
                  className="flex w-full shrink-0 flex-col gap-2 rounded-ctl border border-line p-2.5"
                >
                  <div className="flex w-full items-center justify-between gap-3">
                    <span className="min-w-0 truncate text-sm font-bold text-ink">
                      {s.course}
                    </span>
                    <StatusBadge status={s.status} />
                  </div>
                  <p className="text-2xs text-muted">
                    تاريخ البدء: <span className="num">{formatDate(s.date)}</span>
                  </p>
                </div>
              ))}
            </DrawerSection>

            <DrawerSection title={d.deviceSectionTitle}>
              {student.device ? (
                <SpecPlate
                  rows={[
                    { label: 'موديل الجهاز:', value: student.device.model },
                    ...(student.device.identifier
                      ? [{ label: 'معرف الجهاز:', value: student.device.identifier, num: true }]
                      : []),
                  ]}
                  className="gap-2 p-3"
                />
              ) : (
                <p className="text-sm text-muted">{d.noDevice}</p>
              )}
            </DrawerSection>

            {student.device ? (
              <div className="flex w-full shrink-0 flex-col gap-3 rounded-ctl bg-brand-wash p-3">
                <SpecRow row={{ label: d.resetUsedLabel, value: `${student.resetsUsed} / ${student.maxResets} مرات` }} />
                {student.lastResetAt ? (
                  <SpecRow row={{ label: d.lastResetLabel, value: formatDate(student.lastResetAt), num: true }} />
                ) : null}
                <Button icon={RotateCcw} full onClick={() => setResetOpen(true)}>
                  {d.resetButton}
                </Button>
              </div>
            ) : null}

            {student.status === 'نشط' ? (
              <div className="flex w-full shrink-0 flex-col gap-3 rounded-ctl bg-danger-bg p-3">
                <p className="text-right text-sm font-semibold leading-relaxed text-danger">
                  {d.warning}
                </p>
                <Button variant="danger" icon={ShieldAlert} full onClick={handleBan} disabled={banning}>
                  {banning ? '...جاري التنفيذ' : d.banButton}
                </Button>
              </div>
            ) : null}
          </>
        )}
      </aside>

      {resetOpen ? (
        <DeviceResetModalContent
          studentId={studentId}
          onClose={() => setResetOpen(false)}
          onConfirmed={() => {
            reload()
            onChanged?.()
          }}
        />
      ) : null}
    </div>
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
      <p className="w-full text-right text-base font-extrabold text-ink">{title}</p>
      {children}
    </div>
  )
}

/* ========================================================================== */
/* شاشة تفاصيل الطالب — فيجما node 28:764 / 35:7138                            */
/* ========================================================================== */

export function StudentProfileCard({
  student,
  onBan,
  onProfileLockChanged,
}: {
  student: ApiStudentDetail
  onBan: () => void
  onProfileLockChanged: () => void
}) {
  const initials = student.name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join(' ')
  const [profileLockSubmitting, setProfileLockSubmitting] = useState(false)
  const l = STUDENT_DETAIL_LABELS

  const handleToggleProfileLock = async () => {
    setProfileLockSubmitting(true)
    try {
      if (student.profileEditUnlocked) {
        await lockStudentProfile(student.id)
      } else {
        await unlockStudentProfile(student.id)
      }
      onProfileLockChanged()
    } finally {
      setProfileLockSubmitting(false)
    }
  }

  return (
    <Card className="flex w-full shrink-0 flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between">
      <div className="flex min-w-0 items-center gap-5">
        <span className="flex size-16 shrink-0 items-center justify-center rounded-full bg-brand-tint text-xl font-extrabold text-brand">
          {initials}
        </span>
        <div className="flex min-w-0 flex-col gap-1">
          <div className="flex items-center gap-2">
            <h2 className="truncate text-2xl font-extrabold text-ink">{student.name}</h2>
            <StatusBadge status={student.status} />
            <Badge tone={student.profileEditUnlocked ? 'success' : 'warning'}>
              {student.profileEditUnlocked ? l.profileEditUnlockedBadge : l.profileEditLockedBadge}
            </Badge>
            <Badge tone={student.academicEditLocked ? 'warning' : 'success'}>
              {student.academicEditLocked ? l.academicEditLockedBadge : l.academicEditUnlockedBadge}
            </Badge>
          </div>
          <div className="flex items-center gap-5 text-sm text-muted">
            <span>تاريخ التسجيل: {formatDate(student.registeredAt)}</span>
            <Dot />
            <span className="num">{student.email}</span>
            <Dot />
            <span className="num">{student.phone}</span>
          </div>
        </div>
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-3">
        {student.device ? (
          <ButtonLink
            to={`/students/${student.id}/device-reset`}
            variant="secondary"
            icon={RotateCcw}
          >
            {STUDENT_DETAIL_LABELS.resetButton}
          </ButtonLink>
        ) : null}
        <Button
          variant="secondary"
          icon={student.profileEditUnlocked ? Lock : LockOpen}
          onClick={handleToggleProfileLock}
          disabled={profileLockSubmitting}
        >
          {profileLockSubmitting
            ? '...جاري التنفيذ'
            : student.profileEditUnlocked
              ? l.lockProfileButton
              : l.unlockProfileButton}
        </Button>
        {student.status === 'نشط' ? (
          <Button variant="danger" icon={ShieldAlert} onClick={onBan}>
            {STUDENT_DETAIL_LABELS.banButton}
          </Button>
        ) : (
          <ButtonLink to={`/students/${student.id}/unban`} variant="secondary">
            {STUDENT_DETAIL_LABELS.unbanButton}
          </ButtonLink>
        )}
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
    render: (r) => <span className="num text-muted">{formatDate(r.date)}</span>,
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
export function subscriptionColumns(studentId: string): Column<SubscriptionRow>[] {
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
      render: (r) => <span className="num text-muted">{formatDate(r.date)}</span>,
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
      render: (r) => <span className="mono font-bold text-ink">{formatEGP(r.price)}</span>,
    },
    {
      key: 'action',
      header: 'إجراء',
      width: 120,
      render: (r) =>
        r.status === 'ملغي' ? (
          <ButtonLink
            to={`/students/${studentId}/subscriptions/${r.id}/reactivate`}
            variant="primary"
            size="sm"
          >
            {r.action}
          </ButtonLink>
        ) : (
          <ButtonLink
            to={`/students/${studentId}/subscriptions/${r.id}/cancel`}
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
 * جسم شاشة التفاصيل — بيجيب بيانات الطالب الحقيقية بالـ id ويبنيها بنفسه
 * بدل ما ياخدها من مود ثابت.
 */
export function StudentDetailBody({
  studentId,
  onBan,
  refreshKey = 0,
}: {
  studentId: string
  onBan: () => void
  /** بيتغيّر لما مودال متفرّع (ريست/إلغاء اشتراك/فتح كورس/فك حظر) ينجح — بيعمل إعادة جلب هادية من غير remount */
  refreshKey?: number
}) {
  const navigate = useNavigate()
  const { data: student, loading, error, reload } = useAsync(
    () => getStudentDetail(studentId),
    [studentId, refreshKey],
  )

  // ⚠️ loading && !student فقط (مش loading لوحدها) — عشان الريلود بعد تعديل
  // زي قفل/فتح البروفايل ميقلبش الصفحة كلها سكيلتون لحظة وترجع تاني، وده
  // اللي كان بيحس المستخدم إن فيه "رفرش سريع" غريب في الصفحة.
  if (loading && !student) return <CardSkeleton className="h-[400px]" />
  if (error || !student) {
    return <ErrorState description={error ?? 'تعذر تحميل بيانات الطالب'} onRetry={reload} />
  }

  const l = STUDENT_DETAIL_LABELS
  const nextReset = student.nextResetAt ? formatDate(student.nextResetAt) : l.noNextReset

  return (
    <>
      <button
        type="button"
        onClick={() => navigate('/students')}
        className="flex shrink-0 items-center gap-2 self-start text-base font-semibold text-muted transition-colors hover:text-brand"
      >
        <ChevronRight className="size-3.5 shrink-0" strokeWidth={2.5} />
        {l.backLabel}
      </button>

      <StudentProfileCard student={student} onBan={onBan} onProfileLockChanged={reload} />

      <div className="flex w-full shrink-0 flex-col gap-6 lg:flex-row lg:items-start">
        <Card className="flex w-full shrink-0 flex-col gap-4 p-5 lg:w-[480px]">
          <p className="w-full text-right text-lg font-extrabold text-ink">
            {l.devicePanelTitle}
          </p>
          {student.device ? (
            <>
              <SpecPlate
                rows={[
                  { label: 'موديل الجهاز:', value: student.device.model },
                  ...(student.device.identifier
                    ? [{ label: 'معرف الجهاز (ID):', value: student.device.identifier, num: true }]
                    : []),
                ]}
              />
              <div className="flex w-full flex-col gap-2">
                <div className="flex w-full items-center justify-between gap-3 text-sm">
                  <span className="shrink-0 text-muted">{l.resetsUsedLabel}</span>
                  <span className="mono shrink-0 font-bold text-brand">
                    {student.resetsUsed} من أصل {student.maxResets} مرات مسموحة
                  </span>
                </div>
                <ProgressBar value={student.resetsPercent} tone="warning" />
                <div className="flex w-full items-center justify-between gap-3 pt-1 text-xs">
                  <span className="shrink-0 text-muted">{l.nextResetLabel}</span>
                  <span className="num shrink-0 text-success">{nextReset}</span>
                </div>
              </div>
            </>
          ) : (
            <p className="text-sm text-muted">{l.noDevice}</p>
          )}
        </Card>

        <Card className="flex min-w-0 flex-1 flex-col gap-4 overflow-hidden p-5">
          <p className="w-full text-right text-lg font-extrabold text-ink">
            {l.resetsPanelTitle}
          </p>
          <div className="-mx-5 overflow-hidden">
            <DataTable
              columns={RESET_LOG_COLUMNS}
              rows={student.resetLog}
              rowKey={(r) => r.id}
              className="min-w-[500px]"
            />
          </div>
        </Card>
      </div>

      <Card className="w-full shrink-0 overflow-hidden">
        <CardHeader
          title={l.subscriptionsTitle}
          actions={
            <ButtonLink to={`/students/${student.id}/open-course`} variant="primary" size="sm">
              {l.addSubscriptionButton}
            </ButtonLink>
          }
        />
        <DataTable
          columns={subscriptionColumns(student.id)}
          rows={student.subscriptions.map((s) => ({
            ...s,
            action: s.status === 'ملغي' ? 'تنشيط يدوي' : 'إلغاء الاشتراك',
          }))}
          rowKey={(r) => r.id}
          className="min-w-[850px]"
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
