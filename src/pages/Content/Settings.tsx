import { useEffect, useState } from 'react'
import { Page } from '@/components/layout/Page'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ConfirmDeleteModal } from '@/components/ui/Modal'
import { TextField, ToggleRow } from '@/components/ui/Field'
import { CardSkeleton, ErrorState } from '@/components/ui/States'
import { useAsync } from '@/lib/useAsync'
import { formatDateTime } from '@/lib/format'
import { changePassword, getMe, updateMe } from '@/api/auth'
import { uploadFile, uploadUrl } from '@/api/uploads'
import { getProfileLockState, toggleProfileLock } from '@/api/profile-lock'
import { updateAdmin } from '@/lib/auth-store'
import { PASSWORD_CARD, PROFILE_CARD, PROFILE_LOCK_PANEL, SETTINGS_PAGE_TITLE } from '@/data/content'

/** فيجما frame: v3-settings (node 7:2653) */
export default function Settings() {
  const { data: me, loading, error, reload } = useAsync(() => getMe(), [])
  const {
    data: lockState,
    loading: lockLoading,
    error: lockError,
    reload: reloadLock,
  } = useAsync(() => getProfileLockState(), [])
  const [lockToggling, setLockToggling] = useState(false)
  const [lockActionError, setLockActionError] = useState<string | null>(null)
  const [confirmingLock, setConfirmingLock] = useState(false)
  const p = PROFILE_LOCK_PANEL

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [savingProfile, setSavingProfile] = useState(false)
  const [profileError, setProfileError] = useState<string | null>(null)
  const [profileSaved, setProfileSaved] = useState(false)

  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [avatarError, setAvatarError] = useState<string | null>(null)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [savingPassword, setSavingPassword] = useState(false)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [passwordSaved, setPasswordSaved] = useState(false)

  useEffect(() => {
    if (me) {
      setName(me.name)
      setEmail(me.email)
    }
  }, [me])

  const handleSaveProfile = async () => {
    if (!name.trim() || !email.trim()) return
    setSavingProfile(true)
    setProfileError(null)
    setProfileSaved(false)
    try {
      const updated = await updateMe({ name, email })
      setProfileSaved(true)
      reload()
      updateAdmin(updated)
    } catch (err) {
      setProfileError(err instanceof Error ? err.message : 'حدث خطأ، حاول مرة أخرى')
    } finally {
      setSavingProfile(false)
    }
  }

  const handleAvatarChange = async (file: File | null) => {
    if (!file) return
    setUploadingAvatar(true)
    setAvatarError(null)
    try {
      const { fileId } = await uploadFile(file)
      const updated = await updateMe({ avatarFileId: fileId })
      reload()
      updateAdmin(updated)
    } catch (err) {
      setAvatarError(err instanceof Error ? err.message : 'حدث خطأ أثناء رفع الصورة')
    } finally {
      setUploadingAvatar(false)
    }
  }

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) return
    if (newPassword !== confirmPassword) {
      setPasswordError('كلمة المرور الجديدة وتأكيدها غير متطابقين')
      return
    }
    setSavingPassword(true)
    setPasswordError(null)
    setPasswordSaved(false)
    try {
      await changePassword(currentPassword, newPassword)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setPasswordSaved(true)
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : 'حدث خطأ، حاول مرة أخرى')
    } finally {
      setSavingPassword(false)
    }
  }

  const performLockToggle = async () => {
    setLockToggling(true)
    setLockActionError(null)
    try {
      await toggleProfileLock()
      reloadLock()
    } catch (err) {
      setLockActionError(err instanceof Error ? err.message : 'حدث خطأ، حاول مرة أخرى')
    } finally {
      setLockToggling(false)
      setConfirmingLock(false)
    }
  }

  const handleLockToggle = () => {
    const turningOn = !lockState?.isLocked
    if (turningOn) {
      setConfirmingLock(true)
      return
    }
    performLockToggle()
  }

  return (
    <Page title={SETTINGS_PAGE_TITLE}>
      <div className="flex w-full shrink-0 flex-col gap-6 lg:flex-row lg:items-start">
        <Card className="flex min-w-0 flex-1 flex-col gap-6 p-8">
          <h2 className="text-right text-xl font-extrabold text-ink">{PROFILE_CARD.title}</h2>

          {loading && !me ? (
            <CardSkeleton />
          ) : error || !me ? (
            <ErrorState description={error ?? 'تعذر تحميل البيانات'} onRetry={reload} />
          ) : (
            <>
              <div className="flex flex-col items-center gap-3">
                {me.avatarFileId ? (
                  <img
                    src={uploadUrl(me.avatarFileId)}
                    alt={me.name}
                    className="size-20 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex size-20 items-center justify-center rounded-full bg-brand-tint text-lg font-bold text-brand">
                    {name.slice(0, 2) || 'أد'}
                  </div>
                )}
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploadingAvatar}
                    onChange={(e) => handleAvatarChange(e.target.files?.[0] ?? null)}
                  />
                  <span className="inline-flex h-9 items-center rounded-ctl px-4 text-sm font-bold text-muted transition-colors hover:bg-surface hover:text-ink">
                    {uploadingAvatar ? '...جاري الرفع' : PROFILE_CARD.changePhoto}
                  </span>
                </label>
                {avatarError ? <p className="text-sm font-bold text-danger">{avatarError}</p> : null}
              </div>

              <TextField label={PROFILE_CARD.nameLabel} value={name} onChange={setName} />
              <TextField
                label={PROFILE_CARD.emailLabel}
                value={email}
                onChange={setEmail}
                type="email"
                mono
              />

              <Button full onClick={handleSaveProfile} disabled={savingProfile || !name.trim() || !email.trim()}>
                {savingProfile ? '...جاري الحفظ' : PROFILE_CARD.submit}
              </Button>
              {profileError ? (
                <p className="text-sm font-bold text-danger">{profileError}</p>
              ) : profileSaved ? (
                <p className="text-sm font-bold text-success">تم حفظ التعديلات بنجاح</p>
              ) : null}
            </>
          )}
        </Card>

        <Card className="flex min-w-0 flex-1 flex-col gap-6 p-8">
          <h2 className="text-right text-xl font-extrabold text-ink">{PASSWORD_CARD.title}</h2>

          <TextField
            label={PASSWORD_CARD.currentLabel}
            type="password"
            value={currentPassword}
            onChange={setCurrentPassword}
          />
          <TextField
            label={PASSWORD_CARD.newLabel}
            type="password"
            placeholder={PASSWORD_CARD.newPlaceholder}
            value={newPassword}
            onChange={setNewPassword}
          />
          <TextField
            label={PASSWORD_CARD.confirmLabel}
            type="password"
            placeholder={PASSWORD_CARD.confirmPlaceholder}
            value={confirmPassword}
            onChange={setConfirmPassword}
          />

          <Button
            full
            onClick={handleChangePassword}
            disabled={savingPassword || !currentPassword || !newPassword || !confirmPassword}
          >
            {savingPassword ? '...جاري الحفظ' : PASSWORD_CARD.submit}
          </Button>
          {passwordError ? (
            <p className="text-sm font-bold text-danger">{passwordError}</p>
          ) : passwordSaved ? (
            <p className="text-sm font-bold text-success">تم تغيير كلمة المرور بنجاح</p>
          ) : null}
        </Card>
      </div>

      <Card className="flex w-full shrink-0 flex-col gap-6 p-8">
        <div className="flex flex-col gap-2 text-right">
          <h2 className="text-xl font-extrabold text-ink">{p.title}</h2>
          <p className="text-base text-muted">{p.subtitle}</p>
        </div>

        {lockLoading && !lockState ? (
          <CardSkeleton />
        ) : lockError || !lockState ? (
          <ErrorState description={lockError ?? 'تعذر تحميل حالة القفل'} onRetry={reloadLock} />
        ) : (
          <>
            <div className="flex items-center justify-between gap-4 rounded-ctl border border-line bg-surface p-4">
              <span className="text-base text-muted">{p.statusLabel}</span>
              <div className="flex items-center gap-2">
                <span
                  className={`size-2 shrink-0 rounded-full ${lockState.isLocked ? 'bg-danger' : 'bg-success'}`}
                />
                <span className="text-base font-bold text-ink">
                  {lockState.isLocked ? p.lockedStatus : p.unlockedStatus}
                </span>
              </div>
            </div>

            <ToggleRow
              label={lockState.isLocked ? p.toggleOnLabel : p.toggleOffLabel}
              hint={lockState.isLocked ? p.toggleOnHint : p.toggleOffHint}
              on={lockState.isLocked}
              onChange={handleLockToggle}
              disabled={lockToggling}
            />

            <p className="text-right text-base leading-relaxed text-warning">{p.warning}</p>

            {lockState.updatedByAdminName ? (
              <p className="text-right text-sm text-muted">
                {p.updatedByPrefix} {lockState.updatedByAdminName} —{' '}
                {formatDateTime(lockState.updatedAt)}
              </p>
            ) : null}

            {lockActionError ? (
              <p className="text-sm font-bold text-danger">{lockActionError}</p>
            ) : null}
          </>
        )}
      </Card>

      {confirmingLock ? (
        <ConfirmDeleteModal
          title="تأكيد قفل تعديل بيانات الطلاب"
          message="قفل التعديل هيمنع كل الطلاب من تعديل المستوى والترم إلا لو فيه استثناء يدوي مفتوح لهم. متأكد؟"
          confirmLabel="تأكيد القفل"
          submittingLabel="...جاري التفعيل"
          submitting={lockToggling}
          onClose={() => setConfirmingLock(false)}
          onConfirm={performLockToggle}
        />
      ) : null}
    </Page>
  )
}
