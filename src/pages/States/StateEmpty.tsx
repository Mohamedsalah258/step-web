import { Inbox } from 'lucide-react'
import { Page } from '@/components/layout/Page'
import { Card } from '@/components/ui/Card'
import { Tabs } from '@/components/ui/Tabs'
import { SearchField, FilterSelect, DateField } from '@/components/ui/Field'
import { EmptyState } from '@/components/ui/States'
import { STATE_EMPTY } from '@/data/content'

/** فيجما frame: v3-state-empty (node 29:1510) */
export default function StateEmpty() {
  return (
    <Page title={STATE_EMPTY.pageTitle}>
      {/* tabs-row — أول تاب = يمين */}
      <Tabs items={[...STATE_EMPTY.tabs]} />

      {/* filters-row — RTL: البحث يمين ثم التاريخ ثم الكورسات */}
      <div className="flex w-full shrink-0 items-center gap-4">
        <SearchField placeholder={STATE_EMPTY.searchPlaceholder} width={660} />
        <DateField label={STATE_EMPTY.dateLabel} width={220} />
        <FilterSelect label={STATE_EMPTY.courseLabel} width={220} />
      </div>

      {/* data-table-card — الحالة الفارغة فقط */}
      <Card className="w-full shrink-0 overflow-hidden">
        <EmptyState
          icon={Inbox}
          title={STATE_EMPTY.title}
          description={STATE_EMPTY.description}
        />
      </Card>
    </Page>
  )
}
