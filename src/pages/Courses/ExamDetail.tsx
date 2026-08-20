import { ArrowRight, Download, FileText, Trash2 } from 'lucide-react'
import { Page } from '@/components/layout/Page'
import { Card, CardHeader } from '@/components/ui/Card'
import { Button, ButtonLink } from '@/components/ui/Button'
import { InfoRow } from '@/components/ui/Misc'
import { EXAM_DETAIL as D } from '@/data/courses'
import { UploadDrop } from './courses-parts'

/** فيجما frame: v3-exam-detail (node 20:26) — تفاصيل الملف node 20:62 */
export default function ExamDetail() {
  return (
    <Page title="تفاصيل الامتحان">
      {/* header — RTL: العنوان والميتا يمين والأزرار شمال */}
      <div className="flex w-full shrink-0 items-start justify-between gap-6">
        <div className="flex min-w-0 flex-col items-end gap-2">
          <h2 className="text-right text-xl font-extrabold text-ink">
            {D.title}
          </h2>
          <div className="flex flex-wrap items-center justify-end gap-3 text-2xs text-muted">
            {D.meta.map((m) => (
              <span key={m} className="mono">
                {m}
              </span>
            ))}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <Button variant="danger" icon={Trash2} size="sm">
            {D.deleteBtn}
          </Button>
          <Button variant="secondary" icon={Download} size="sm">
            {D.downloadBtn}
          </Button>
          <ButtonLink
            to="/courses/1/exams"
            variant="secondary"
            size="sm"
            icon={ArrowRight}
          >
            {D.backBtn}
          </ButtonLink>
        </div>
      </div>

      {/* RTL: المعاينة يمين وعمود المعلومات شمال */}
      <div className="flex w-full shrink-0 items-start gap-4">
        <Card className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <CardHeader
            title={D.previewLabel}
            actions={
              <span className="num rounded-badge bg-surface px-3 py-1 text-2xs font-bold text-muted">
                {D.pageIndicator}
              </span>
            }
          />
          {/* بديل معاينة PDF — نظام الديزاين يمنع تنزيل أصول من فيجما */}
          <div className="flex h-[560px] items-center justify-center bg-surface">
            <FileText className="size-16 text-line" strokeWidth={1.5} />
          </div>
        </Card>

        <div className="flex w-[340px] shrink-0 flex-col gap-4 self-start">
          <Card className="flex flex-col">
            <CardHeader title={D.fileCardTitle} />
            <div className="flex flex-col px-5 py-2">
              {D.info.map((i) => (
                <InfoRow key={i.label} label={i.label}>
                  <span className="mono">{i.value}</span>
                </InfoRow>
              ))}
            </div>
          </Card>

          <Card className="flex flex-col">
            <CardHeader title={D.replaceTitle} />
            <div className="flex flex-col gap-4 p-5">
              <UploadDrop title={D.replaceDrop} hint={D.replaceHint} />
              <Button full>{D.replaceSubmit}</Button>
            </div>
          </Card>
        </div>
      </div>
    </Page>
  )
}
