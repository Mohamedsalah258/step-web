import { useState } from 'react'
import { Download, FileSpreadsheet, FileText } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { RouteTabs } from '@/components/ui/Tabs'
import { Checkbox, DateField, FilterSelect } from '@/components/ui/Field'
import { VBarChart } from '@/components/charts/Charts'
import { downloadReport, type ReportKind } from '@/api/reports'
import { REPORT_TABS } from '@/data/reports'

/**
 * الأجزاء المشتركة بين شاشات التقارير الأربعة:
 * tabs-row (37:1049) · filters-card (37:1060) · chart-card (37:1117)
 * summary-bar (43:935)
 */

/** tabs-row — RTL: أول تاب في المصفوفة يظهر يمين (إيرادات) */
export function ReportTabs() {
  return <RouteTabs items={REPORT_TABS} />
}

export type ReportFilterState = { from: string; to: string; compare: boolean }

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10)
}

/**
 * الافتراضي = آخر 30 يوم (نفس افتراضي الباك إند بالظبط) — الحقول لازم تتعبّى
 * بتواريخ حقيقية من الأول، مش فاضية: لو فضلت فاضية، أي تصدير قبل ما المستخدم
 * يلمس الفلتر كان بيبعت `from=&to=` (نص فاضي) والباك إند بيرفضه (400) — وده
 * بالظبط كان بيخلي التصدير "مش شغال غير لو عملت فلتر الأول".
 */
function defaultRange(): ReportFilterState {
  const to = new Date()
  const from = new Date(to.getTime() - 29 * 24 * 60 * 60 * 1000)
  return { from: isoDate(from), to: isoDate(to), compare: false }
}

/** حالة الفلاتر (تاريخ + مقارنة) — مشتركة بين الصفحات الأربعة */
export function useReportFilters(): [ReportFilterState, (v: Partial<ReportFilterState>) => void] {
  const [state, setState] = useState<ReportFilterState>(defaultRange)
  const update = (v: Partial<ReportFilterState>) => setState((s) => ({ ...s, ...v }))
  return [state, update]
}

/**
 * filters-card — node 37:1060: تجميع بحسب / نطاق التاريخ (من - إلى) /
 * مقارنة بالفترة السابقة — الثلاثة شغالين فعليًا (بيغيّروا نتيجة الاستعلام
 * الحقيقي). "تجميع بحسب" فيه خيار حقيقي واحد بس (الكلية) حاليًا — التجميعات
 * التانية (مرحلة/تخصص) مش موجودة كاستعلام حقيقي لسه.
 */
export function ReportFilters({
  value,
  onChange,
  report,
}: {
  value: ReportFilterState
  onChange: (v: Partial<ReportFilterState>) => void
  report: ReportKind
}) {
  return (
    <Card
      variant="card"
      className="flex w-full shrink-0 flex-col justify-between gap-4 p-4 lg:flex-row lg:items-center"
    >
      <div className="flex w-full shrink-0 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4 lg:w-auto">
        <FilterSelect label="تجميع بحسب: الكلية" options={['الكلية']} value="الكلية" width={180} onChange={() => {}} />
        <DateField label="من" width={150} value={value.from} onChange={(v) => onChange({ from: v })} />
        <DateField label="إلى" width={150} value={value.to} onChange={(v) => onChange({ to: v })} />
        <Checkbox
          label="مقارنة بالفترة السابقة"
          on={value.compare}
          onChange={(v) => onChange({ compare: v })}
        />
      </div>
      <ReportExportButtons report={report} params={value} />
    </Card>
  )
}

/** أزرار التصدير الثلاثة — الثلاثة حقيقيين فعليًا (PDF/Excel/CSV حقيقيين، مش شكل بس) */
function ReportExportButtons({ report, params }: { report: ReportKind; params: ReportFilterState }) {
  const [downloading, setDownloading] = useState<'csv' | 'xlsx' | 'pdf' | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleDownload = async (format: 'csv' | 'xlsx' | 'pdf') => {
    setDownloading(format)
    setError(null)
    try {
      await downloadReport(report, format, params)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'تعذّر تصدير الملف')
    } finally {
      setDownloading(null)
    }
  }

  return (
    <div className="flex w-full shrink-0 flex-col items-end gap-2 lg:w-auto">
      <div className="flex w-full flex-wrap flex-row-reverse items-center gap-2 lg:w-auto">
        <Button
          variant="secondary"
          size="sm"
          icon={FileText}
          onClick={() => handleDownload('pdf')}
          disabled={downloading !== null}
        >
          {downloading === 'pdf' ? '...جاري التصدير' : 'تصدير PDF'}
        </Button>
        <Button
          variant="secondary"
          size="sm"
          icon={FileSpreadsheet}
          onClick={() => handleDownload('xlsx')}
          disabled={downloading !== null}
        >
          {downloading === 'xlsx' ? '...جاري التصدير' : 'تصدير Excel'}
        </Button>
        <Button
          variant="secondary"
          size="sm"
          icon={Download}
          onClick={() => handleDownload('csv')}
          disabled={downloading !== null}
        >
          {downloading === 'csv' ? '...جاري التصدير' : 'تصدير CSV'}
        </Button>
      </div>
      {error ? <p className="text-2xs font-bold text-danger">{error}</p> : null}
    </div>
  )
}

/** chart-card — node 37:1117: كارت h304، عنوان 16px extrabold، أعمدة رأسية */
export function ReportChartCard({
  title,
  items,
}: {
  title: string
  items: Array<{ label: string; value: number }>
}) {
  return (
    <Card className="flex h-auto w-full shrink-0 flex-col gap-4 p-5 lg:h-[304px]">
      <h2 className="w-full text-right text-lg font-extrabold text-ink">{title}</h2>
      <VBarChart items={items} maxHeight={180} />
    </Card>
  )
}

/** شريط الملخص — node 43:935: (يمين) نص ink، (شمال) نص brand */
export function ReportSummaryBar({ right, left }: { right: string; left: string }) {
  return (
    <Card
      variant="card"
      className="flex w-full shrink-0 flex-col justify-between gap-4 p-4 text-base font-bold sm:flex-row sm:items-center"
    >
      <p className="whitespace-nowrap text-ink">{right}</p>
      <p className="whitespace-nowrap text-brand">{left}</p>
    </Card>
  )
}

/** سهم + نص % مقارنة — بيرجع null لو مفيش قيمة سابقة يتقاس عليها (مش رقم وهمي) */
export function DeltaBadge({ delta }: { delta: number | null }) {
  if (delta === null) return <span className="text-2xs text-muted">—</span>
  const up = delta >= 0
  return (
    <span className={`num flex items-center gap-1 text-sm font-bold ${up ? 'text-success' : 'text-danger'}`}>
      {up ? '▲' : '▼'} {Math.abs(delta)}%
    </span>
  )
}
