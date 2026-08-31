import { useMemo, useState } from 'react'
import { Settings2 } from 'lucide-react'
import { Page } from '@/components/layout/Page'
import { Card } from '@/components/ui/Card'
import { Tabs } from '@/components/ui/Tabs'
import { DataTable } from '@/components/ui/Table'
import { SearchField, FilterSelect } from '@/components/ui/Field'
import { Button } from '@/components/ui/Button'
import { Pagination } from '@/components/ui/Misc'
import { EmptyState, ErrorState, TableSkeleton } from '@/components/ui/States'
import { useAsync } from '@/lib/useAsync'
import { useDebouncedValue } from '@/lib/useDebouncedValue'
import {
  listTickets,
  listTicketCategories,
  type ApiTicketListItem,
  type TicketPriority,
  type TicketsTab,
} from '@/api/tickets'
import { PRIORITY_AR, TICKET_FILTERS, TICKETS_PAGE_TITLE } from '@/data/tickets'
import { ticketColumns, GuestContactReplyModal, TicketCategoriesModal } from './tickets-parts'

const PAGE_SIZE = 10

const TAB_META: { key: TicketsTab; label: string }[] = [
  { key: 'all', label: 'الكل' },
  { key: 'open', label: 'مفتوحة' },
  { key: 'in_progress', label: 'قيد المعالجة' },
  { key: 'resolved', label: 'تم الحل' },
  { key: 'closed', label: 'مغلقة' },
  { key: 'cancelled', label: 'ملغاة' },
]

const PRIORITY_OPTIONS = Object.entries(PRIORITY_AR).map(([value, label]) => ({ value, label }))

/** الشِل المشترك لشاشة تذاكر الدعم — تابس بالحالة + فلاتر أولوية/تصنيف + جدول + صفحات. */
export function TicketsShell() {
  const [tabIndex, setTabIndex] = useState(0)
  const [searchInput, setSearchInput] = useState('')
  const [priority, setPriority] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [page, setPage] = useState(1)
  const [manageOpen, setManageOpen] = useState(false)
  const [replyRow, setReplyRow] = useState<ApiTicketListItem | null>(null)

  const debouncedSearch = useDebouncedValue(searchInput, 400)
  const tab = TAB_META[tabIndex]?.key ?? 'all'

  const { data, loading, error, reload } = useAsync(
    () =>
      listTickets({
        q: debouncedSearch,
        tab,
        priority: (priority || undefined) as TicketPriority | undefined,
        categoryId: categoryId || undefined,
        page,
        limit: PAGE_SIZE,
      }),
    [debouncedSearch, tab, priority, categoryId, page],
  )

  const { data: categories, reload: reloadCategories } = useAsync(() => listTicketCategories(), [])

  const tabs = useMemo(() => {
    const counts = data?.meta?.tabs ?? {
      all: 0,
      open: 0,
      inProgress: 0,
      resolved: 0,
      closed: 0,
      cancelled: 0,
    }
    const countFor: Record<TicketsTab, number> = {
      all: counts.all,
      open: counts.open,
      in_progress: counts.inProgress,
      resolved: counts.resolved,
      closed: counts.closed,
      cancelled: counts.cancelled,
    }
    return TAB_META.map((m) => ({ label: m.label, count: countFor[m.key] }))
  }, [data?.meta?.tabs])

  const priorityOptionLabels = PRIORITY_OPTIONS.map((o) => o.label)
  const categoryOptionLabels = (categories ?? []).map((c) => c.name)

  return (
    <Page
      title={TICKETS_PAGE_TITLE}
      actions={
        <Button variant="secondary" icon={Settings2} size="sm" onClick={() => setManageOpen(true)}>
          {TICKET_FILTERS.manageCategories}
        </Button>
      }
      outletContext={{ onDataChanged: reload }}
    >
      <Tabs
        items={tabs}
        value={tabIndex}
        onChange={(i) => {
          setTabIndex(i)
          setPage(1)
        }}
      />

      <div className="flex w-full shrink-0 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
        <SearchField
          placeholder={TICKET_FILTERS.searchPlaceholder}
          value={searchInput}
          onChange={(v) => {
            setSearchInput(v)
            setPage(1)
          }}
        />
        <FilterSelect
          label={TICKET_FILTERS.priorityLabel}
          options={priorityOptionLabels}
          width={180}
          value={PRIORITY_OPTIONS.find((o) => o.value === priority)?.label ?? ''}
          onChange={(label) => {
            setPriority(PRIORITY_OPTIONS.find((o) => o.label === label)?.value ?? '')
            setPage(1)
          }}
        />
        <FilterSelect
          label={TICKET_FILTERS.categoryLabel}
          options={categoryOptionLabels}
          width={200}
          value={(categories ?? []).find((c) => c.id === categoryId)?.name ?? ''}
          onChange={(name) => {
            setCategoryId((categories ?? []).find((c) => c.name === name)?.id ?? '')
            setPage(1)
          }}
        />
      </div>

      <Card className="w-full shrink-0 overflow-hidden">
        {error ? (
          <ErrorState description={error} onRetry={reload} />
        ) : !data && loading ? (
          <TableSkeleton rows={PAGE_SIZE} cols={7} />
        ) : (
          <>
            <DataTable
              columns={ticketColumns({
                page: data?.meta?.page ?? 1,
                limit: PAGE_SIZE,
                onReplyGuest: setReplyRow,
              })}
              rows={data?.data ?? []}
              rowKey={(r) => r.id}
              className="min-w-[1000px]"
              empty={
                <EmptyState
                  title="لا يوجد تذاكر مطابقة"
                  description="جرّب تغيير الفلاتر أو كلمة البحث."
                />
              }
            />
            <Pagination
              page={data?.meta?.page ?? 1}
              pages={data?.meta?.totalPages ?? 1}
              total={data?.meta?.total}
              onPageChange={setPage}
            />
          </>
        )}
      </Card>

      {manageOpen ? (
        <TicketCategoriesModal
          onClose={() => setManageOpen(false)}
          onChanged={() => {
            reload()
            reloadCategories()
          }}
        />
      ) : null}

      {replyRow ? (
        <GuestContactReplyModal row={replyRow} onClose={() => setReplyRow(null)} onSent={reload} />
      ) : null}
    </Page>
  )
}
