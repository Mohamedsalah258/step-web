import { useState } from 'react'
import { ImageIcon, Plus, Upload } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Page } from '@/components/layout/Page'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { ConfirmDeleteModal } from '@/components/ui/Modal'
import { Switch } from '@/components/ui/Switch'
import { TextField, SelectField } from '@/components/ui/Field'
import { EmptyState, ErrorState, CardSkeleton } from '@/components/ui/States'
import { useAsync } from '@/lib/useAsync'
import {
  createBanner,
  deleteBanner,
  listBanners,
  toggleBanner,
  type ApiBanner,
  type ApiBannerType,
} from '@/api/banners'
import { uploadFile, uploadUrl } from '@/api/uploads'
import { BANNERS_HEADER, BANNER_FORM } from '@/data/content'
import { PanelCard } from './content-parts'

const TYPE_OPTIONS = ['ترويجي', 'إعلامي']
const LABEL_TO_TYPE: Record<string, ApiBannerType> = {
  ترويجي: 'PROMOTIONAL',
  إعلامي: 'INFORMATIONAL',
}
const TYPE_TO_LABEL: Record<ApiBannerType, string> = {
  PROMOTIONAL: 'ترويجي',
  INFORMATIONAL: 'إعلامي',
}

function BannerCard({
  banner,
  onToggle,
  onEdit,
  onDelete,
}: {
  banner: ApiBanner
  onToggle: () => void
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <Card className="flex flex-col overflow-hidden">
      <div className="flex h-40 shrink-0 items-center justify-center overflow-hidden bg-navy p-6">
        {banner.imageFileId ? (
          <img
            src={uploadUrl(banner.imageFileId)}
            alt={banner.title}
            className="size-full object-cover"
          />
        ) : (
          <ImageIcon className="size-8 text-white/60" strokeWidth={1.5} />
        )}
      </div>
      <div className="flex flex-col gap-4 p-4">
        <div className="flex items-center justify-between gap-3">
          <span className="min-w-0 truncate text-right text-base font-bold text-ink">
            {banner.title}
          </span>
          <Badge
            tone={banner.type === 'PROMOTIONAL' ? 'success' : 'brand'}
            className="shrink-0"
          >
            {TYPE_TO_LABEL[banner.type]}
          </Badge>
        </div>
        <div className="flex items-center justify-between gap-3">
          <Switch on={banner.isActive} onChange={onToggle} />
          <span className="text-sm font-bold text-ink">{banner.isActive ? 'نشط' : 'معطّل'}</span>
        </div>
        <div className="flex items-stretch gap-2">
          <Button variant="secondary" size="sm" className="min-w-0 flex-1" onClick={onEdit}>
            تعديل
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="min-w-0 flex-1 !border-danger hover:!bg-danger-bg"
            onClick={onDelete}
          >
            <span className="text-danger">حذف</span>
          </Button>
        </div>
      </div>
    </Card>
  )
}

/** فيجما frame: v3-banners (node 7:2210) */
export default function Banners() {
  const navigate = useNavigate()
  const { data: banners, loading, error, reload } = useAsync(() => listBanners(), [])

  const [title, setTitle] = useState('')
  const [type, setType] = useState(TYPE_OPTIONS[0])
  const [file, setFile] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const handleToggle = async (id: string) => {
    await toggleBanner(id)
    reload()
  }

  const handleDelete = async () => {
    if (!deletingId) return
    setDeleting(true)
    await deleteBanner(deletingId)
    setDeleting(false)
    setDeletingId(null)
    reload()
  }

  const handleAdd = async () => {
    if (!title.trim()) return
    setSubmitting(true)
    setSubmitError(null)
    try {
      let imageFileId: string | undefined
      if (file) imageFileId = (await uploadFile(file)).fileId
      await createBanner({ title, type: LABEL_TO_TYPE[type], imageFileId })
      setTitle('')
      setType(TYPE_OPTIONS[0])
      setFile(null)
      reload()
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'حدث خطأ، حاول مرة أخرى')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Page title="لوحة إدارة البنرات الإعلانية" outletContext={{ onDataChanged: reload }}>
      <div className="flex w-full shrink-0 items-center justify-between gap-4">
        <div className="flex flex-col gap-1 text-right">
          <h2 className="text-xl font-extrabold text-ink">{BANNERS_HEADER.title}</h2>
          <p className="text-base text-muted">{BANNERS_HEADER.subtitle}</p>
        </div>
      </div>

      <div className="flex w-full shrink-0 flex-col gap-6 lg:flex-row lg:items-start">
        <div className="grid min-w-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-2">
          {error ? (
            <ErrorState description={error} onRetry={reload} />
          ) : !banners && loading ? (
            <CardSkeleton />
          ) : !banners || banners.length === 0 ? (
            <EmptyState
              title="لا يوجد بنرات مضافة بعد"
              description="ابدأ بإضافة أول بنر إعلاني من النموذج بجانبك."
            />
          ) : (
            banners.map((b) => (
              <BannerCard
                key={b.id}
                banner={b}
                onToggle={() => handleToggle(b.id)}
                onEdit={() => navigate(`/banners/${b.id}/edit`)}
                onDelete={() => setDeletingId(b.id)}
              />
            ))
          )}
        </div>

        <PanelCard className="w-full shrink-0 lg:w-[420px]">
          <h2 className="text-right text-md font-bold text-ink">{BANNER_FORM.cardTitle}</h2>

          <TextField
            label={BANNER_FORM.titleLabel}
            placeholder={BANNER_FORM.titlePlaceholder}
            value={title}
            onChange={setTitle}
          />
          <SelectField label={BANNER_FORM.typeLabel} options={TYPE_OPTIONS} value={type} onChange={setType} />

          <div className="flex flex-col gap-1.5">
            <span className="text-right text-sm font-bold text-ink">{BANNER_FORM.imageLabel}</span>
            <label className="w-full cursor-pointer">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
              <div className="flex h-[149px] flex-col items-center justify-center gap-3 rounded-ctl border border-dashed border-line bg-surface p-4 text-center">
                <Upload className="size-6 shrink-0 text-brand" strokeWidth={2} />
                <span className="text-base font-bold text-ink">
                  {file ? file.name : BANNER_FORM.dropTitle}
                </span>
                <span className="text-2xs text-muted">{BANNER_FORM.dropHint}</span>
              </div>
            </label>
          </div>

          <Button full icon={Plus} onClick={handleAdd} disabled={submitting || !title.trim()}>
            {submitting ? '...جاري الحفظ' : BANNER_FORM.submit}
          </Button>
          {submitError ? <p className="text-sm font-bold text-danger">{submitError}</p> : null}
        </PanelCard>
      </div>
      {deletingId ? (
        <ConfirmDeleteModal
          message="حذف البنر ده؟"
          submitting={deleting}
          onClose={() => setDeletingId(null)}
          onConfirm={handleDelete}
        />
      ) : null}
    </Page>
  )
}
