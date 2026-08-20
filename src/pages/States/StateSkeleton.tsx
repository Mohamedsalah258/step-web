import { Page } from '@/components/layout/Page'
import { Card } from '@/components/ui/Card'
import { DataTable, type Column } from '@/components/ui/Table'
import { STATE_SKELETON } from '@/data/content'

type SkeletonRow = { id: string; i: number }

const ROWS: SkeletonRow[] = Array.from({ length: 6 }, (_, i) => ({
  id: `sk-${i}`,
  i,
}))

/** ⚠️ أول عمود = أول عمود من اليمين (فيجما node 29:1625) */
const COLUMNS: Column<SkeletonRow>[] = STATE_SKELETON.columns.map((c) => ({
  key: c.key,
  header: c.header,
  width: c.width,
  flex: c.key === 'name',
  render: (r: SkeletonRow) => (
    <span
      className="skeleton block h-4 rounded"
      style={{ width: c.bars[r.i % c.bars.length] }}
    />
  ),
}))

/** فيجما frame: v3-state-skeleton (node 29:1603) */
export default function StateSkeleton() {
  return (
    <Page title={STATE_SKELETON.pageTitle}>
      {/* stats-skeleton-row — node 29:1617 (أول عنصر = يمين) */}
      <div className="flex w-full shrink-0 flex-wrap items-center gap-4">
        {STATE_SKELETON.statsWidths.map((w, i) => (
          <div
            key={i}
            className="flex h-10 w-40 shrink-0 items-center justify-start px-6"
          >
            <span className="skeleton block h-4 rounded" style={{ width: w }} />
          </div>
        ))}
      </div>

      {/* data-table-card — node 29:1624 */}
      <Card className="w-full shrink-0 overflow-hidden">
        <DataTable
          columns={COLUMNS}
          rows={ROWS}
          rowKey={(r) => r.id}
          className="min-w-[700px]"
        />
      </Card>
    </Page>
  )
}
