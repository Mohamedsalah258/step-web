import { useState } from 'react'
import { ArrowRight, Download, FileText, Pencil, Trash2 } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { Page } from '@/components/layout/Page'
import { Card, CardHeader } from '@/components/ui/Card'
import { Button, ButtonLink } from '@/components/ui/Button'
import { ConfirmDeleteModal } from '@/components/ui/Modal'
import { InfoRow } from '@/components/ui/Misc'
import { CardSkeleton, ErrorState } from '@/components/ui/States'
import { useAsync } from '@/lib/useAsync'
import { formatDate } from '@/lib/format'
import { examsApi, updateContentItem, deleteContentItem } from '@/api/courses'
import { uploadFile, uploadUrl } from '@/api/uploads'
import { UploadDrop } from './courses-parts'

/** فيجما frame: v3-exam-detail (node 20:26) — تفاصيل الملف node 20:62 */
export default function ExamDetail() {
  const { id: courseId = '', examId = '' } = useParams()
  const navigate = useNavigate()
  const [refreshKey, setRefreshKey] = useState(0)
  const { data: exams, loading, error } = useAsync(
    () => examsApi.list(courseId),
    [courseId, refreshKey],
  )
  const exam = exams?.find((e) => e.id === examId)
  const [replaceFile, setReplaceFile] = useState<File | null>(null)
  const [replacing, setReplacing] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  if (loading && !exams) return <CardSkeleton />
  if (error || !exam) return <ErrorState description={error ?? 'تعذر العثور على الامتحان'} />

  const handleDelete = async () => {
    setDeleting(true)
    await deleteContentItem(examId)
    navigate(`/courses/${courseId}/exams`)
  }

  const handleReplace = async () => {
    if (!replaceFile) return
    setReplacing(true)
    setActionError(null)
    try {
      const { fileId } = await uploadFile(replaceFile)
      await updateContentItem(examId, { fileId })
      setReplaceFile(null)
      setRefreshKey((k) => k + 1)
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'حدث خطأ، حاول مرة أخرى')
    } finally {
      setReplacing(false)
    }
  }

  return (
    <Page title="تفاصيل الامتحان" outletContext={{ onDataChanged: () => setRefreshKey((k) => k + 1) }}>
      {/* header — RTL: العنوان والميتا يمين والأزرار شمال */}
      <div className="flex w-full shrink-0 flex-col-reverse gap-4 md:flex-row md:items-start md:justify-between md:gap-6">
        <div className="flex min-w-0 flex-col items-end gap-2">
          <h2 className="text-right text-xl font-extrabold text-ink">{exam.title}</h2>
          {exam.description ? (
            <p className="text-right text-sm text-muted">{exam.description}</p>
          ) : null}
          <div className="flex flex-wrap items-center justify-end gap-3 text-2xs text-muted">
            <span className="mono">تاريخ الرفع: {formatDate(exam.createdAt)}</span>
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-3">
          <Button variant="danger" icon={Trash2} size="sm" onClick={() => setConfirmingDelete(true)}>
            حذف الامتحان
          </Button>
          {exam.fileId ? (
            <Button
              variant="secondary"
              icon={Download}
              size="sm"
              onClick={() => window.open(uploadUrl(exam.fileId!), '_blank')}
            >
              تحميل الملف
            </Button>
          ) : null}
          <ButtonLink
            to={`/courses/${courseId}/exams/${examId}/edit`}
            variant="secondary"
            size="sm"
            icon={Pencil}
          >
            تعديل البيانات
          </ButtonLink>
          <ButtonLink
            to={`/courses/${courseId}/exams`}
            variant="secondary"
            size="sm"
            icon={ArrowRight}
          >
            رجوع للقائمة
          </ButtonLink>
        </div>
      </div>

      {/* RTL: المعاينة يمين وعمود المعلومات شمال */}
      <div className="flex w-full shrink-0 flex-col gap-4 lg:flex-row lg:items-start">
        <Card className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <CardHeader title="معاينة ملف الامتحان" />
          {/* بديل معاينة PDF — نظام الديزاين يمنع تنزيل أصول من فيجما، والمعاينة الحقيقية محتاجة PDF renderer (خارج نطاق الخطة الحالية) */}
          <div className="flex h-[360px] items-center justify-center bg-surface md:h-[560px]">
            <FileText className="size-16 text-line" strokeWidth={1.5} />
          </div>
        </Card>

        <div className="flex w-full shrink-0 flex-col gap-4 lg:w-[340px] lg:self-start">
          <Card className="flex flex-col">
            <CardHeader title="معلومات الملف" />
            <div className="flex flex-col px-5 py-2">
              <InfoRow label="تاريخ الرفع">
                <span className="mono">{formatDate(exam.createdAt)}</span>
              </InfoRow>
              <InfoRow label="نوع الملف">
                <span className="mono">{exam.fileId ? 'PDF' : 'رابط خارجي'}</span>
              </InfoRow>
            </div>
          </Card>

          <Card className="flex flex-col">
            <CardHeader title="استبدال الملف" />
            <div className="flex flex-col gap-4 p-5">
              <label className="w-full cursor-pointer">
                <input
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={(e) => setReplaceFile(e.target.files?.[0] ?? null)}
                />
                <UploadDrop
                  title={replaceFile ? replaceFile.name : 'اسحب الملف الجديد هنا'}
                  hint="PDF فقط — حتى 50MB"
                />
              </label>
              <Button full onClick={handleReplace} disabled={!replaceFile || replacing}>
                {replacing ? '...جاري التحديث' : 'تحديث الملف'}
              </Button>
              {actionError ? <p className="text-sm font-bold text-danger">{actionError}</p> : null}
            </div>
          </Card>
        </div>
      </div>
      {confirmingDelete ? (
        <ConfirmDeleteModal
          message="حذف الامتحان ده؟"
          submitting={deleting}
          onClose={() => setConfirmingDelete(false)}
          onConfirm={handleDelete}
        />
      ) : null}
    </Page>
  )
}
