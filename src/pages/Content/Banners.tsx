import { Plus, Upload } from 'lucide-react'
import { Page } from '@/components/layout/Page'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { TextField, SelectField } from '@/components/ui/Field'
import {
  BANNERS,
  BANNERS_HEADER,
  BANNER_ACTIONS,
  BANNER_FORM,
} from '@/data/content'
import { PanelCard } from './content-parts'

/** فيجما frame: v3-banners (node 7:2210) */
export default function Banners() {
  return (
    <Page title="لوحة إدارة البنرات الإعلانية">
      {/* header-row — node 7:2227: العنوان يمين والزر يسار */}
      <div className="flex w-full shrink-0 items-center justify-between gap-4">
        <div className="flex flex-col gap-1 text-right">
          <h2 className="text-xl font-extrabold text-ink">
            {BANNERS_HEADER.title}
          </h2>
          <p className="text-base text-muted">{BANNERS_HEADER.subtitle}</p>
        </div>
        <Button icon={Plus}>{BANNERS_HEADER.action}</Button>
      </div>

      {/* RTL: معرض البنرات يمين (فيجما x=444) وفورم الإضافة يسار (x=0) */}
      <div className="flex w-full shrink-0 flex-col gap-6 lg:flex-row lg:items-start">
        {/* البنرات النشطة — node 7:2257 */}
        <div className="grid min-w-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-2">
          {BANNERS.map((b) => (
            <Card key={b.id} className="flex flex-col overflow-hidden">
              <div className="flex h-40 shrink-0 items-center justify-center bg-navy p-6">
                <p className="text-center text-lg font-bold text-white">
                  {b.cover}
                </p>
              </div>
              <div className="flex flex-col gap-4 p-4">
                {/* RTL: الاسم يمين والشارة يسار */}
                <div className="flex items-center justify-between gap-3">
                  <span className="min-w-0 truncate text-right text-base font-bold text-ink">
                    {b.name}
                  </span>
                  <Badge
                    tone={b.type === 'ترويجي' ? 'success' : 'brand'}
                    className="shrink-0"
                  >
                    {b.type}
                  </Badge>
                </div>
                {/* RTL: تعديل يمين وحذف يسار (فيجما: حذف x=0، تعديل x=332) */}
                <div className="flex items-stretch gap-2">
                  <Button variant="secondary" size="sm" className="min-w-0 flex-1">
                    {BANNER_ACTIONS.edit}
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="min-w-0 flex-1 !border-danger hover:!bg-danger-bg"
                  >
                    <span className="text-danger">{BANNER_ACTIONS.remove}</span>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* فورم إضافة بنر — node 7:2234 */}
        <PanelCard className="w-full shrink-0 lg:w-[420px]">
          <h2 className="text-right text-md font-bold text-ink">
            {BANNER_FORM.cardTitle}
          </h2>

          <TextField
            label={BANNER_FORM.titleLabel}
            placeholder={BANNER_FORM.titlePlaceholder}
          />
          <SelectField
            label={BANNER_FORM.typeLabel}
            options={BANNER_FORM.typeOptions}
          />

          <div className="flex flex-col gap-1.5">
            <span className="text-right text-sm font-bold text-ink">
              {BANNER_FORM.imageLabel}
            </span>
            <div className="flex h-[149px] flex-col items-center justify-center gap-3 rounded-ctl border border-dashed border-line bg-surface p-4 text-center">
              <Upload className="size-6 shrink-0 text-brand" strokeWidth={2} />
              <span className="text-base font-bold text-ink">
                {BANNER_FORM.dropTitle}
              </span>
              <span className="text-2xs text-muted">{BANNER_FORM.dropHint}</span>
            </div>
          </div>

          <Button full>{BANNER_FORM.submit}</Button>
        </PanelCard>
      </div>
    </Page>
  )
}
