import { useState } from 'react'
import { AlertTriangle, RotateCcw } from 'lucide-react'
import { Page } from '@/components/layout/Page'
import { Card, CardHeader } from '@/components/ui/Card'
import { Button, ButtonLink } from '@/components/ui/Button'
import { SelectField } from '@/components/ui/Field'
import { DataTable, type Column } from '@/components/ui/Table'
import { EmptyState, ErrorState, TableSkeleton } from '@/components/ui/States'
import { useAsync } from '@/lib/useAsync'
import { formatDate } from '@/lib/format'
import {
  listUniversities,
  listColleges,
  listSpecializations,
  listStages,
  listTerms,
  getTermResetImpact,
} from '@/api/academic'
import { listActivityLog, type ApiActivityRow } from '@/api/activity-log'
import { TERM_RESET_WARNING } from '@/data/academic'
import { AcademicHeader, NumCell, type Crumb } from './AcademicTable'

const CRUMBS: Crumb[] = [
  { label: 'الهيكل الأكاديمي', to: '/academic/universities' },
  { label: 'الترمات', to: '/academic/terms' },
  { label: 'تصفير الترم' },
]

/** سجل عمليات التصفير السابقة — بيانات حقيقية من activity_logs (actionType=term_reset) */
const LOG_COLUMNS: Column<ApiActivityRow>[] = [
  {
    key: 'date',
    header: 'التاريخ',
    width: 140,
    render: (r) => <NumCell tone="muted">{formatDate(r.datetime)}</NumCell>,
  },
  {
    key: 'scope',
    header: 'الترم',
    flex: true,
    render: (r) => <span className="font-semibold">{r.target}</span>,
  },
  {
    key: 'details',
    header: 'التأثير',
    width: 220,
    render: (r) => <span className="text-muted">{r.details ?? '—'}</span>,
  },
  {
    key: 'by',
    header: 'بواسطة',
    width: 140,
    render: (r) => <span className="text-muted">{r.admin}</span>,
  },
]

/** فيجما frame: v3-term-reset (node 26:246) */
export default function TermReset() {
  const [universityName, setUniversityName] = useState('')
  const [collegeName, setCollegeName] = useState('')
  const [specializationName, setSpecializationName] = useState('')
  const [stageName, setStageName] = useState('')
  const [termName, setTermName] = useState('')

  const { data: unisData } = useAsync(() => listUniversities({ limit: 200 }), [])
  const universities = unisData?.data ?? []
  const university = universities.find((u) => u.name === universityName)

  const { data: collegesData } = useAsync(
    () => listColleges({ parentId: university?.id, limit: 200 }),
    [university?.id],
  )
  const colleges = university ? (collegesData?.data ?? []) : []
  const college = colleges.find((c) => c.name === collegeName)

  const { data: specsData } = useAsync(
    () => listSpecializations({ parentId: college?.id, limit: 200 }),
    [college?.id],
  )
  const specializations = college ? (specsData?.data ?? []) : []
  const specialization = specializations.find((s) => s.name === specializationName)

  const { data: stagesData } = useAsync(
    () => listStages({ parentId: specialization?.id, limit: 200 }),
    [specialization?.id],
  )
  const stages = specialization ? (stagesData?.data ?? []) : []
  const stage = stages.find((s) => s.name === stageName)

  const { data: termsData } = useAsync(
    () => listTerms({ parentId: stage?.id, limit: 200 }),
    [stage?.id],
  )
  const terms = stage ? (termsData?.data ?? []) : []
  const term = terms.find((t) => t.name === termName)

  const { data: impact, loading: impactLoading } = useAsync(
    () => (term ? getTermResetImpact(term.id) : Promise.resolve(null)),
    [term?.id],
  )

  const {
    data: logData,
    loading: logLoading,
    error: logError,
    reload: reloadLog,
  } = useAsync(() => listActivityLog({ actionType: 'term_reset', limit: 5 }), [])

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
        <CardHeader title="اختر الترم المطلوب تصفيره" />
        <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 lg:grid-cols-3">
          <SelectField
            label="الجامعة"
            options={universities.map((u) => u.name)}
            value={universityName}
            onChange={(v) => {
              setUniversityName(v)
              setCollegeName('')
              setSpecializationName('')
              setStageName('')
              setTermName('')
            }}
          />
          <SelectField
            label="الكلية"
            options={colleges.map((c) => c.name)}
            value={collegeName}
            onChange={(v) => {
              setCollegeName(v)
              setSpecializationName('')
              setStageName('')
              setTermName('')
            }}
          />
          <SelectField
            label="التخصص"
            options={specializations.map((s) => s.name)}
            value={specializationName}
            onChange={(v) => {
              setSpecializationName(v)
              setStageName('')
              setTermName('')
            }}
          />
          <SelectField
            label="المرحلة"
            options={stages.map((s) => s.name)}
            value={stageName}
            onChange={(v) => {
              setStageName(v)
              setTermName('')
            }}
          />
          <SelectField
            label="الترم"
            options={terms.map((t) => t.name)}
            value={termName}
            onChange={setTermName}
          />
        </div>
        {/* impact-line — node 26:315 */}
        <div className="border-t border-line bg-warning-bg px-5 py-4 text-right text-sm font-bold leading-relaxed text-warning">
          {!term
            ? 'اختر الترم عشان تشوف التأثير المتوقع'
            : impactLoading || !impact
              ? '...جاري الحساب'
              : `⚠ الكورسات المتأثرة: ${impact.coursesCount} كورس · الطلاب المتأثرون: ${impact.studentsCount} طالب · الاشتراكات المتأثرة: ${impact.subscriptionsCount} اشتراك`}
        </div>
        <div className="flex justify-end border-t border-line p-5">
          {term && impact && impact.subscriptionsCount > 0 ? (
            <ButtonLink
              to={`/academic/terms/reset/confirm?termId=${term.id}`}
              icon={RotateCcw}
              variant="danger"
            >
              تصفير الترم
            </ButtonLink>
          ) : (
            <Button icon={RotateCcw} variant="danger" disabled>
              تصفير الترم
            </Button>
          )}
        </div>
      </Card>

      {/* previous-resets — node 26:266 */}
      <Card className="w-full shrink-0 overflow-hidden">
        <CardHeader title="عمليات التصفير السابقة" />
        {logError ? (
          <ErrorState description={logError} onRetry={reloadLog} />
        ) : !logData && logLoading ? (
          <TableSkeleton rows={3} cols={4} />
        ) : (
          <DataTable
            columns={LOG_COLUMNS}
            rows={logData?.data ?? []}
            rowKey={(r) => r.id}
            className="min-w-[700px]"
            empty={
              <EmptyState
                title="مفيش عمليات تصفير سابقة"
                description="لسه ماتصفرش أي ترم لحد دلوقتي."
              />
            }
          />
        )}
      </Card>
    </Page>
  )
}
