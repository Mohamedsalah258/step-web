import { ChevronLeft, Download } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { RouteTabs } from '@/components/ui/Tabs'
import { Checkbox, DateField, FilterSelect } from '@/components/ui/Field'
import { IconBubble } from '@/components/ui/Misc'
import { VBarChart } from '@/components/charts/Charts'
import {
  PREVIEWS_TITLE,
  REPORT_FILTERS,
  REPORT_TABS,
  type PreviewRow,
} from '@/data/reports'

/**
 * الأجزاء المشتركة بين شاشات التقارير الأربعة:
 * tabs-row (37:1049) · filters-card (37:1060) · chart-card (37:1117)
 * summary-bar (43:935) · معاينات الأقسام (37:1207)
 */

/** tabs-row — RTL: أول تاب في المصفوفة يظهر يمين (إيرادات) */
export function ReportTabs() {
  return <RouteTabs items={REPORT_TABS} />
}

/**
 * filters-card — node 37:1060: كارت h72 p16.
 * يمين: تجميع بحسب / نطاق التاريخ / مقارنة بالفترة السابقة.
 * شمال: أزرار التصدير — flex-row-reverse عشان PDF يبقى أقصى الشمال زي فيجما.
 */
export function ReportFilters() {
  return (
    <Card
      variant="card"
      className="flex w-full shrink-0 flex-col justify-between gap-4 p-4 lg:flex-row lg:items-center"
    >
      <div className="flex w-full shrink-0 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4 lg:w-auto">
        <FilterSelect label={REPORT_FILTERS.groupBy} width={180} />
        <DateField label={REPORT_FILTERS.dateRange} width={260} />
        <Checkbox label={REPORT_FILTERS.compare} defaultOn />
      </div>
      <div className="flex w-full shrink-0 flex-wrap flex-row-reverse items-center gap-2 lg:w-auto">
        {REPORT_FILTERS.exports.map((label) => (
          <Button key={label} variant="secondary" size="sm" icon={Download}>
            {label}
          </Button>
        ))}
      </div>
    </Card>
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
      <h2 className="w-full text-right text-lg font-extrabold text-ink">
        {title}
      </h2>
      <VBarChart items={items} maxHeight={180} />
    </Card>
  )
}

/** شريط الملخص — node 43:935: (يمين) نص ink، (شمال) نص brand */
export function ReportSummaryBar({
  right,
  left,
}: {
  right: string
  left: string
}) {
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

/** معاينات الأقسام الأخرى — node 37:1207 */
export function ReportPreviews({ rows }: { rows: PreviewRow[] }) {
  return (
    <div className="flex w-full shrink-0 flex-col gap-3">
      <h2 className="w-full text-right text-lg font-extrabold text-ink">
        {PREVIEWS_TITLE}
      </h2>
      {rows.map((r) => {
        const Icon = r.icon
        return (
          <Card
            key={r.summary}
            variant="card"
            className="flex w-full items-center justify-between gap-4 p-4"
          >
            {r.label ? (
              <div className="flex shrink-0 items-center gap-3">
                <IconBubble size={28}>
                  {Icon ? (
                    <Icon className="size-4" strokeWidth={2} />
                  ) : null}
                </IconBubble>
                <span className="whitespace-nowrap text-base font-bold text-ink">
                  {r.label}
                </span>
              </div>
            ) : (
              <span />
            )}
            <div className="flex shrink-0 items-center gap-2">
              <span className="whitespace-nowrap text-sm font-normal text-muted">
                {r.summary}
              </span>
              <ChevronLeft className="size-4 shrink-0 text-muted" strokeWidth={2} />
            </div>
          </Card>
        )
      })}
    </div>
  )
}
