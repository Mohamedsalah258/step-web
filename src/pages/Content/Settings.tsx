import { Page } from '@/components/layout/Page'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { TextField } from '@/components/ui/Field'
import {
  PASSWORD_CARD,
  PROFILE_CARD,
  SETTINGS_PAGE_TITLE,
} from '@/data/content'

/** فيجما frame: v3-settings (node 7:2653) */
export default function Settings() {
  return (
    <Page title={SETTINGS_PAGE_TITLE}>
      {/* RTL: كارت الملف الشخصي يمين (فيجما x=578) وكارت كلمة المرور يسار (x=0) */}
      <div className="flex w-full shrink-0 flex-col gap-6 lg:flex-row lg:items-start">
        {/* بيانات الملف الشخصي — node 7:2685 */}
        <Card className="flex min-w-0 flex-1 flex-col gap-6 p-8">
          <h2 className="text-right text-xl font-extrabold text-ink">
            {PROFILE_CARD.title}
          </h2>

          <div className="flex flex-col items-center gap-3">
            <div className="flex size-20 items-center justify-center rounded-full bg-brand-tint text-lg font-bold text-brand">
              {PROFILE_CARD.avatar}
            </div>
            <Button variant="ghost" size="sm">
              {PROFILE_CARD.changePhoto}
            </Button>
          </div>

          <TextField
            label={PROFILE_CARD.nameLabel}
            value={PROFILE_CARD.nameValue}
          />
          <TextField
            label={PROFILE_CARD.emailLabel}
            value={PROFILE_CARD.emailValue}
            type="email"
            mono
          />

          <Button full>{PROFILE_CARD.submit}</Button>
        </Card>

        {/* تحديث كلمة المرور والحماية — node 7:2669 */}
        <Card className="flex min-w-0 flex-1 flex-col gap-6 p-8">
          <h2 className="text-right text-xl font-extrabold text-ink">
            {PASSWORD_CARD.title}
          </h2>

          <TextField
            label={PASSWORD_CARD.currentLabel}
            type="password"
            placeholder={PASSWORD_CARD.currentValue}
          />
          <TextField
            label={PASSWORD_CARD.newLabel}
            type="password"
            placeholder={PASSWORD_CARD.newPlaceholder}
          />
          <TextField
            label={PASSWORD_CARD.confirmLabel}
            type="password"
            placeholder={PASSWORD_CARD.confirmPlaceholder}
          />

          <Button full>{PASSWORD_CARD.submit}</Button>
        </Card>
      </div>
    </Page>
  )
}
