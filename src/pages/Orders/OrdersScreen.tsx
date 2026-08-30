import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Page } from '@/components/layout/Page'
import { Card } from '@/components/ui/Card'
import { Tabs } from '@/components/ui/Tabs'
import { DataTable } from '@/components/ui/Table'
import { SearchField, FilterSelect, DateField } from '@/components/ui/Field'
import { Pagination } from '@/components/ui/Misc'
import { EmptyState, ErrorState, TableSkeleton } from '@/components/ui/States'
import { useAsync } from '@/lib/useAsync'
import { useDebouncedValue } from '@/lib/useDebouncedValue'
import { listOrders } from '@/api/orders'
import { listCourses } from '@/api/courses'
import { ORDER_FILTERS, ORDERS_PAGE_TITLE } from '@/data/orders'
import { orderColumns, OrderDetailDrawer } from './orders-parts'

const PAGE_SIZE = 8

type OrdersTab = 'all' | 'pending' | 'approved' | 'rejected'

const TAB_META: { key: OrdersTab; label: string }[] = [
  { key: 'all', label: 'الكل' },
  { key: 'pending', label: 'قيد المراجعة' },
  { key: 'approved', label: 'مقبول' },
  { key: 'rejected', label: 'مرفوض' },
]

/**
 * الشِل المشترك لشاشات طلبات الشراء — فيجما node 7:257: tabs-row + filters-row
 * + data-table-card، ودروار تفاصيل حقيقي بيتكيّف مع حالة الطلب (قيد المراجعة/
 * مقبول/مرفوض) بدل التنقل لصفحة منفصلة لكل حالة — فتح التفاصيل بيبقى overlay
 * فوق نفس الصفحة الحالية دايمًا، مهما كانت حالة الطلب.
 * `autoOpenId` بيفتح دروار طلب محدد أول ما الصفحة تحمّل (لينك مباشر لطلب
 * معيّن — شاشات v3-order-approved / v3-order-rejected).
 */
export function OrdersShell({
  initialTab = 'all',
  autoOpenId,
}: {
  initialTab?: OrdersTab
  autoOpenId?: string
}) {
  const navigate = useNavigate()
  const [tabIndex, setTabIndex] = useState(() =>
    Math.max(0, TAB_META.findIndex((t) => t.key === initialTab)),
  )
  const [searchInput, setSearchInput] = useState('')
  const [date, setDate] = useState('')
  const [courseId, setCourseId] = useState('')
  const [page, setPage] = useState(1)
  const [openId, setOpenId] = useState<string | null>(autoOpenId ?? null)

  const debouncedSearch = useDebouncedValue(searchInput, 400)
  const tab = TAB_META[tabIndex]?.key ?? 'all'

  const { data, loading, error, reload } = useAsync(
    () => listOrders({ q: debouncedSearch, tab, date, courseId, page, limit: PAGE_SIZE }),
    [debouncedSearch, tab, date, courseId, page],
  )

  const { data: coursesData } = useAsync(() => listCourses({ limit: 100 }), [])
  const courses = coursesData?.data ?? []

  const tabs = useMemo(() => {
    const counts = data?.meta?.tabs ?? { all: 0, pending: 0, approved: 0, rejected: 0 }
    return TAB_META.map((m) => ({ label: m.label, count: counts[m.key] }))
  }, [data?.meta?.tabs])

  /** إغلاق ورجوع الصفحة الأصلية لو الدروار كان مفتوح من لينك مباشر (autoOpenId) */
  const handleCloseDrawer = () => {
    setOpenId(null)
    if (autoOpenId) navigate('/orders')
  }

  /** بعد نجاح الموافقة/الرفض — يقفل الدروار ويحدّث القايمة، من غير أي تنقل لصفحة تانية */
  const handleDataChanged = () => {
    reload()
    setOpenId(null)
  }

  return (
    <Page title={ORDERS_PAGE_TITLE} outletContext={{ onDataChanged: handleDataChanged }}>
      <Tabs
        items={tabs}
        value={tabIndex}
        onChange={(i) => {
          setTabIndex(i)
          setPage(1)
        }}
      />

      {/* filters-row — RTL: البحث يمين ثم التاريخ ثم الكورسات */}
      <div className="flex w-full shrink-0 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
        <SearchField
          placeholder={ORDER_FILTERS.searchPlaceholder}
          value={searchInput}
          onChange={(v) => {
            setSearchInput(v)
            setPage(1)
          }}
        />
        <DateField
          label={ORDER_FILTERS.dateLabel}
          width={220}
          value={date}
          onChange={(v) => {
            setDate(v)
            setPage(1)
          }}
        />
        <FilterSelect
          label={ORDER_FILTERS.courseLabel}
          options={courses.map((c) => c.name)}
          width={220}
          value={courses.find((c) => c.id === courseId)?.name ?? ''}
          onChange={(name) => {
            setCourseId(courses.find((c) => c.name === name)?.id ?? '')
            setPage(1)
          }}
        />
      </div>

      <Card className="w-full shrink-0 overflow-hidden">
        {error ? (
          <ErrorState description={error} onRetry={reload} />
        ) : !data && loading ? (
          <TableSkeleton rows={PAGE_SIZE} cols={8} />
        ) : (
          <>
            <DataTable
              columns={orderColumns((row) => setOpenId(row.id))}
              rows={data?.data ?? []}
              rowKey={(r) => r.id}
              className="min-w-[1000px]"
              empty={
                <EmptyState
                  title="لا يوجد طلبات مطابقة"
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

      {openId ? <OrderDetailDrawer orderId={openId} onClose={handleCloseDrawer} /> : null}
    </Page>
  )
}
