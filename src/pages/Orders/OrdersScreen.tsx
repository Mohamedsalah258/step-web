import { useState } from 'react'
import { Page } from '@/components/layout/Page'
import { Card } from '@/components/ui/Card'
import { Tabs, type TabItem } from '@/components/ui/Tabs'
import { DataTable } from '@/components/ui/Table'
import { SearchField, FilterSelect, DateField } from '@/components/ui/Field'
import { Pagination } from '@/components/ui/Misc'
import {
  ORDER_FILTERS,
  ORDERS_PAGES,
  ORDERS_TOTAL,
  ORDERS_PAGE_TITLE,
  type PurchaseOrder,
} from '@/data/orders'
import { orderColumns } from './orders-parts'

/**
 * الشِل المشترك لشاشات طلبات الشراء — فيجما node 7:257:
 * tabs-row (node 7:271) + filters-row (node 7:288) + data-table-card (node 7:301).
 */
export function OrdersScreen({
  tabs,
  activeTab,
  rows,
  drawer,
  onOpen,
  page = 1,
}: {
  tabs: TabItem[]
  activeTab: number
  rows: PurchaseOrder[]
  /** الدروار اللي بيظهر فوق الشاشة (لو الفريم فيه واحد) */
  drawer?: React.ReactNode
  onOpen?: (row: PurchaseOrder) => void
  page?: number
}) {
  const [tab, setTab] = useState(activeTab)

  return (
    <Page title={ORDERS_PAGE_TITLE}>
      <Tabs items={tabs} value={tab} onChange={setTab} />

      {/* filters-row — RTL: البحث يمين ثم التاريخ ثم الكورسات */}
      <div className="flex w-full shrink-0 items-center gap-4">
        <SearchField placeholder={ORDER_FILTERS.searchPlaceholder} />
        <DateField label={ORDER_FILTERS.dateLabel} width={220} />
        <FilterSelect
          label={ORDER_FILTERS.courseLabel}
          options={[...ORDER_FILTERS.courseOptions]}
          width={220}
        />
      </div>

      <Card className="w-full shrink-0 overflow-hidden">
        <DataTable
          columns={orderColumns(onOpen ?? (() => {}))}
          rows={rows}
          rowKey={(r) => r.id}
        />
        <Pagination page={page} pages={ORDERS_PAGES} total={ORDERS_TOTAL} />
      </Card>

      {drawer}
    </Page>
  )
}
