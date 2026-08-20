import { AlertTriangle, RotateCcw } from 'lucide-react'
import { Page } from '@/components/layout/Page'
import { Card, CardHeader } from '@/components/ui/Card'
import { ButtonLink } from '@/components/ui/Button'
import { SelectField } from '@/components/ui/Field'
import { DataTable, type Column } from '@/components/ui/Table'
import {
  TERM_RESET_IMPACT,
  TERM_RESET_LEVELS,
  TERM_RESET_LOG,
  TERM_RESET_WARNING,
  type ResetLogRow,
} from '@/data/academic'
import { AcademicHeader, NumCell, type Crumb } from './AcademicTable'

const CRUMBS: Crumb[] = [
  { label: 'الهيكل الأكاديمي', to: '/academic/universities' },
  { label: 'الترمات', to: '/academic/terms' },
  { label: 'تصفير الترم' },
]

/** سجل عمليات التصفير — فيجما node 26:266 */
const LOG_COLUMNS: Column<ResetLogRow>[] = [
  {
    key: 'date',
    header: 'التاريخ',
    width: 140,
    render: (r) => <NumCell tone="muted">{r.date}</NumCell>,
  },
  {
    key: 'scope',
    header: 'النطاق',
    flex: true,
    render: (r) => <span className="font-semibold">{r.scope}</span>,
  },
  {
    key: 'students',
    header: 'الطلاب المتأثرون',
    width: 150,
    render: (r) => <NumCell>{r.students}</NumCell>,
  },
  {
    key: 'by',
    header: 'بواسطة',
    width: 140,
    render: (r) => <span className="text-muted">{r.by}</span>,
  },
]

/** فيجما frame: v3-term-reset (node 26:246) */
export default function TermReset() {
  return (
    <Page title="تصفير الترم الدراسي">
      <AcademicHeader heading="تصفير الترم" breadcrumb={CRUMBS} />

      {/* warning-banner — node 26:259 */}
      <div className="flex w-full shrink-0 items-start gap-3 rounded-panel border border-danger/20 bg-danger-bg p-5">
        <div className="min-w-0 flex-1 text-right text-base font-semibold leading-relaxed text-danger">
          {TERM_RESET_WARNING}
        </div>
        <AlertTriangle className="size-5 shrink-0 text-danger" strokeWidth={2.5} />
      </div>

      {/* level-selectors — nodes 26:284 … 26:310 */}
      <Card className="w-full shrink-0">
        <CardHeader title="اختر المستوى الأكاديمي للتصفير" />
        <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 lg:grid-cols-3">
          {TERM_RESET_LEVELS.map((l) => (
            <SelectField
              key={l.label}
              label={l.label}
              options={l.options}
              value={l.value}
            />
          ))}
        </div>
        {/* impact-line — node 26:315 */}
        <div className="border-t border-line bg-warning-bg px-5 py-4 text-right text-sm font-bold leading-relaxed text-warning">
          {TERM_RESET_IMPACT}
        </div>
        <div className="flex justify-end border-t border-line p-5">
          <ButtonLink
            to="/academic/terms/reset/confirm"
            icon={RotateCcw}
            variant="danger"
          >
            تصفير الترم
          </ButtonLink>
        </div>
      </Card>

      {/* previous-resets — node 26:266 */}
      <Card className="w-full shrink-0 overflow-hidden">
        <CardHeader title="عمليات التصفير السابقة" />
        <DataTable
          columns={LOG_COLUMNS}
          rows={TERM_RESET_LOG}
          rowKey={(r) => r.id}
          className="min-w-[700px]"
        />
      </Card>
    </Page>
  )
}
