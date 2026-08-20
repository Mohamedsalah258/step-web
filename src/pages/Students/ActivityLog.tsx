import { Download } from 'lucide-react'
import { Page } from '@/components/layout/Page'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { DataTable, Truncate, type Column } from '@/components/ui/Table'
import { DateField, FilterSelect, SearchField } from '@/components/ui/Field'
import { Pagination } from '@/components/ui/Misc'
import { EmptyState } from '@/components/ui/States'
import {
  ACTIVITY_FILTERS,
  ACTIVITY_LOG,
  ACTIVITY_PAGES,
  ACTIVITY_STATS,
  ACTIVITY_TITLE,
  ACTIVITY_TOTAL,
  type ActivityRow,
} from '@/data/students'

/** table-header — node 26:76 (⚠️ أول عمود = أول عمود من اليمين) */
const COLUMNS: Column<ActivityRow>[] = [
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
        <span className="text-muted">{r.details}</span>
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
    render: (r) => <span className="num text-muted">{r.datetime}</span>,
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
  return (
    <Page title={ACTIVITY_TITLE}>
      {/* stats-row — node 26:50 */}
      <div className="grid w-full shrink-0 grid-cols-3 gap-4">
        {ACTIVITY_STATS.map((s) => (
          <Card
            key={s.badge}
            variant="card"
            className="flex items-center justify-between gap-3 px-5 py-3.5"
          >
            <span className="min-w-0 truncate text-base font-bold text-ink">
              {s.label}
            </span>
            <Badge tone={s.tone}>{s.badge}</Badge>
          </Card>
        ))}
      </div>

      {/* filter-row — node 26:63: البحث يمين ثم نوع العملية ثم التاريخ ثم التصدير شمال */}
      <Card className="flex w-full shrink-0 items-center gap-4 p-4">
        <SearchField
          placeholder={ACTIVITY_FILTERS.searchPlaceholder}
          width={623}
        />
        <FilterSelect
          label={ACTIVITY_FILTERS.actionLabel}
          options={[...ACTIVITY_FILTERS.actionOptions]}
          width={200}
        />
        <DateField label={ACTIVITY_FILTERS.dateLabel} width={127} />
        <Button variant="secondary" icon={Download}>
          {ACTIVITY_FILTERS.exportLabel}
        </Button>
      </Card>

      {/* activity-table-card — node 26:75 */}
      <Card className="w-full shrink-0 overflow-hidden">
        <DataTable
          columns={COLUMNS}
          rows={ACTIVITY_LOG}
          rowKey={(r) => r.id}
          empty={
            <EmptyState
              title="لا توجد عمليات مسجّلة"
              description="ستظهر كل عمليات الأدمن والنظام هنا بمجرد حدوثها."
            />
          }
        />
        <Pagination page={1} pages={ACTIVITY_PAGES} total={ACTIVITY_TOTAL} />
      </Card>
    </Page>
  )
}
