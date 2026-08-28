import { useEffect, useState } from 'react'
import { useNavigate, useOutletContext, useParams } from 'react-router-dom'
import {
  ConfirmDeleteModal,
  Modal,
  ModalButton,
  ModalDangerZone,
  ModalField,
  ModalSelect,
} from '@/components/ui/Modal'
import { CardSkeleton, ErrorState } from '@/components/ui/States'
import { useAsync } from '@/lib/useAsync'
import {
  deleteBanner,
  listBanners,
  updateBanner,
  type ApiBannerType,
} from '@/api/banners'
import { uploadFile, uploadUrl } from '@/api/uploads'

const TYPE_OPTIONS = ['ترويجي', 'إعلامي']
const LABEL_TO_TYPE: Record<string, ApiBannerType> = {
  ترويجي: 'PROMOTIONAL',
  إعلامي: 'INFORMATIONAL',
}
const TYPE_TO_LABEL: Record<ApiBannerType, string> = {
  PROMOTIONAL: 'ترويجي',
  INFORMATIONAL: 'إعلامي',
}

type ContentOutletContext = { onDataChanged: () => void }

/** مودال تعديل بنر — نفس حقول الإضافة + منطقة حذف */
export default function EditBannerModal() {
  const navigate = useNavigate()
  const { id = '' } = useParams()
  const { onDataChanged } = useOutletContext<ContentOutletContext>()
  const { data: banners, loading, error } = useAsync(() => listBanners(), [])
  const banner = banners?.find((b) => b.id === id)

  const [title, setTitle] = useState('')
  const [type, setType] = useState(TYPE_OPTIONS[0])
  const [file, setFile] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (banner) {
      setTitle(banner.title)
      setType(TYPE_TO_LABEL[banner.type])
    }
  }, [banner])

  if (!id) return null

  const handleConfirm = async () => {
    if (!title.trim()) return
    setSubmitting(true)
    setSubmitError(null)
    try {
      let imageFileId = banner?.imageFileId ?? undefined
      if (file) imageFileId = (await uploadFile(file)).fileId
      await updateBanner(id, { title, type: LABEL_TO_TYPE[type], imageFileId })
      onDataChanged()
      navigate(-1)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'حدث خطأ، حاول مرة أخرى')
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await deleteBanner(id)
      onDataChanged()
      navigate('/banners')
    } catch (err) {
      setConfirmingDelete(false)
      setDeleting(false)
      setSubmitError(err instanceof Error ? err.message : 'حدث خطأ أثناء الحذف')
    }
  }

  return (
    <>
    <Modal
      title="تعديل البنر"
      width={500}
      actions={
        <>
          <ModalButton variant="cancel">إلغاء</ModalButton>
          <ModalButton onClick={handleConfirm} disabled={submitting || !title.trim() || !banner}>
            {submitting ? '...جاري الحفظ' : 'حفظ التعديلات'}
          </ModalButton>
        </>
      }
    >
      {loading ? (
        <CardSkeleton />
      ) : error || !banner ? (
        <ErrorState description={error ?? 'تعذر العثور على البنر'} />
      ) : (
        <>
          <ModalField label="عنوان البنر" value={title} onChange={setTitle} />
          <ModalSelect label="نوع البنر" options={TYPE_OPTIONS} value={type} onChange={setType} />

          <div className="flex w-full flex-col items-start gap-1.5">
            <span className="text-sm font-bold text-ink">صورة البنر</span>
            {banner.imageFileId && !file ? (
              <div className="flex w-full items-center gap-3 rounded-ctl border border-line bg-surface p-2">
                <img
                  src={uploadUrl(banner.imageFileId)}
                  alt={banner.title}
                  className="size-16 shrink-0 rounded-ctl object-cover"
                />
                <span className="text-2xs text-muted">الصورة الحالية — اختر ملف جديد لاستبدالها</span>
              </div>
            ) : null}
            <label className="w-full cursor-pointer">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
              <div className="flex h-[100px] flex-col items-center justify-center gap-2 rounded-ctl border border-dashed border-line bg-surface p-4 text-center">
                <span className="text-sm font-bold text-ink">
                  {file ? file.name : 'اسحب صورة جديدة أو تصفح الملفات'}
                </span>
              </div>
            </label>
          </div>

          <ModalDangerZone label="حذف البنر" onClick={() => setConfirmingDelete(true)} />
          {submitError ? <p className="text-sm font-bold text-danger">{submitError}</p> : null}
        </>
      )}
    </Modal>
    {confirmingDelete ? (
      <ConfirmDeleteModal
        message="هل أنت متأكد من حذف البنر ده؟"
        submitting={deleting}
        onClose={() => setConfirmingDelete(false)}
        onConfirm={handleDelete}
      />
    ) : null}
    </>
  )
}
