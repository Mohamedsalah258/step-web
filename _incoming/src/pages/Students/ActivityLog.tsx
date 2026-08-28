import { useState } from 'react'
import { Download } from 'lucide-react'
import { Page } from '@/components/layout/Page'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { DataTable, Truncate, type Column } from '@/components/ui/Table'
import { DateField, FilterSelect, SearchField } from '@/components/ui/Field'
import { Pagination } from '@/components/ui/Misc'
import { EmptyState, ErrorState, TableSkeleton } from '@/components/ui/States'
import { useAsync } from '@/lib/useAsync'
import { useDebouncedValue } from '@/lib/useDebouncedValue'
import { formatDateTime, formatNumber } from '@/lib/format'
import { listActivityLog, exportActivityLogUrl, getActivityLogStats } from '@/api/activity-log'
import { ACTIVITY_ACTION_TYPES, ACTIVITY_FILTERS, ACTIVITY_TITLE } from '@/data/students'
import type { ApiActivityRow } from '@/api/activity-log'

const PAGE_SIZE = 10

const COLUMNS: Column<ApiActivityRow>[] = [
  {
    key: 'index',
    header: '#',
    width: 50,
    render: (r) => <span className="num text-muted">{r.index}</span>,
  },
  {
    key: 'action',
    header: 'الفعل',
    width: 160,
    render: (r) => <Badge tone={r.tone}>{r.action}</Badge>,
  },
  {
    key: 'details',
    header: 'التفاصيل',
    width: 240,
    render: (r) => (
      <Truncate>
        <span className="text-muted">{r.details ?? '—'}</span>
      </Truncate>
    ),
  },
  {
    key: 'target',
    header: 'الطالب/المستند المتأثر',
    flex: true,
    render: (r) => (
      <Truncate>
        <span className="font-semibold text-ink">{r.target}</span>
      </Truncate>
    ),
  },
  {
    key: 'datetime',
    header: 'التاريخ والوقت',
    width: 140,
    render: (r) => <span className="num text-muted">{formatDateTime(r.datetime)}</span>,
  },
  {
    key: 'admin',
    header: 'الأدمن',
    width: 120,
    render: (r) => <span className="text-ink">{r.admin}</span>,
  },
]

/** فيجما frame: v3-activity-log (node 26:36) */
export default function ActivityLog() {
  const [searchInput, setSearchInput] = useState('')
  const [actionType, setActionType] = useState('')
  const [date, setDate] = useState('')
  const [page, setPage] = useState(1)
  const debouncedSearch = useDebouncedValue(searchInput, 400)

  const query = { q: debouncedSearch, actionType, date, page, pageSize: PAGE_SIZE }
  const { data, loading, error, reload } = useAsync(
    () => listActivityLog(query),
    [debouncedSearch, actionType, date, page],
  )
  const stats = useAsync(getActivityLogStats, [])

  return (
    <Page title={ACTIVITY_TITLE}>
      {/* stats-row — node 26:50 */}
      <div className="grid w-full shrink-0 grid-cols-1 gap-4 sm:grid-cols-3">
        <Card variant="card" className="flex items-center justify-between gap-3 px-5 py-3.5">
          <span className="min-w-0 truncate text-base font-bold text-ink">
            هذا الأسبوع: {formatNumber(stats.data?.thisWeek ?? 0)} عملية
          </span>
          <Badge tone="brand">أسبوعي</Badge>
        </Card>
        <Card variant="card" className="flex items-center justify-between gap-3 px-5 py-3.5">
          <span className="min-w-0 truncate text-base font-bold text-ink">
            اليوم: {formatNumber(stats.data?.today ?? 0)} عملية
          </span>
          <Badge tone="success">نشط</Badge>
        </Card>
        <Card variant="card" className="flex items-center justify-between gap-3 px-5 py-3.5">
          <span className="min-w-0 truncate text-base font-bold text-ink">
            كل العمليات: {formatNumber(stats.data?.total ?? 0)}
          </span>
          <Badge tone="neutral">الكل</Badge>
        </Card>
      </div>

      {/* filter-row — node 26:63: البحث يمين ثم نوع العملية ثم التاريخ ثم التصدير شمال */}
      <Card className="flex w-full shrink-0 flex-col items-stretch gap-3 p-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
        <SearchField
          placeholder={ACTIVITY_FILTERS.searchPlaceholder}
          width={623}
          value={searchInput}
          onChange={(v) => {
            setSearchInput(v)
            setPage(1)
          }}
        />
        <FilterSelect
          label={ACTIVITY_FILTERS.actionLabel}
          options={ACTIVITY_ACTION_TYPES.map((a) => a.label)}
          width={200}
          value={ACTIVITY_ACTION_TYPES.find((a) => a.key === actionType)?.label ?? ''}
          onChange={(label) => {
            setActionType(ACTIVITY_ACTION_TYPES.find((a) => a.label === label)?.key ?? '')
            setPage(1)
          }}
        />
        <DateField
          value={date}
          onChange={(v) => {
            setDate(v)
            setPage(1)
          }}
          width={160}
        />
        <Button
          variant="secondary"
          icon={Download}
          className="w-full sm:w-auto"
          onClick={() => window.open(exportActivityLogUrl(query), '_blank')}
        >
          {ACTIVITY_FILTERS.exportLabel}
        </Button>
      </Card>

      {/* activity-table-card — node 26:75 */}
      <Card className="w-full shrink-0 overflow-hidden">
        {error ? (
          <ErrorState description={error} onRetry={reload} />
        ) : !data && loading ? (
          <TableSkeleton rows={PAGE_SIZE} cols={6} />
        ) : (
          <>
            <DataTable
              columns={COLUMNS}
              rows={data?.items ?? []}
              rowKey={(r) => r.id}
              className="min-w-[950px]"
              empty={
                <EmptyState
                  title="لا توجد عمليات مسجّلة"
                  description="ستظهر كل عمليات الأدمن والنظام هنا بمجرد حدوثها."
                />
              }
            />
            <Pagination
              page={data?.page ?? 1}
              pages={data?.pages ?? 1}
              total={data?.total}
              onPageChange={setPage}
            />
          </>
        )}
      </Card>
    </Page>
  )
}
