import { useState } from 'react'
import { Page } from '@/components/layout/Page'
import { Card } from '@/components/ui/Card'
import { DataTable } from '@/components/ui/Table'
import { SearchField, FilterSelect } from '@/components/ui/Field'
import { Tabs } from '@/components/ui/Tabs'
import { Pagination } from '@/components/ui/Misc'
import { EmptyState } from '@/components/ui/States'
import {
  STUDENTS,
  STUDENTS_PAGES,
  STUDENTS_TOTAL,
  STUDENT_FILTERS,
  STUDENT_TABS,
  STUDENTS_TITLE,
  type StudentRow,
} from '@/data/students'
import { StudentDrawer, studentColumns } from './students-parts'

/** الشِل المشترك بين فريمي v3-students-devices (7:920 و35:6810) */
export function StudentsListShell({ initialOpen }: { initialOpen?: boolean }) {
  const [open, setOpen] = useState(Boolean(initialOpen))

  return (
    <Page title={STUDENTS_TITLE}>
      {/* filter-row — node 7:991: التابس يمين ثم البحث ثم ترتيب الكورس شمال */}
      <div className="flex w-full shrink-0 items-center gap-4">
        <Tabs items={STUDENT_TABS} />
        <SearchField
          placeholder={STUDENT_FILTERS.searchPlaceholder}
          width={520}
        />
        <FilterSelect
          label={STUDENT_FILTERS.courseSortLabel}
          options={[...STUDENT_FILTERS.courseSortOptions]}
          width={171}
        />
      </div>

      {/* data-table-card — node 7:1015 */}
      <Card className="w-full shrink-0 overflow-hidden">
        <DataTable
          columns={studentColumns(() => setOpen(true))}
          rows={STUDENTS}
          rowKey={(r: StudentRow) => r.id}
          empty={
            <EmptyState
              title="لا يوجد طلاب مطابقين للبحث"
              description="جرّب تغيير كلمة البحث أو الفلاتر المختارة."
            />
          }
        />
        <Pagination page={1} pages={STUDENTS_PAGES} total={STUDENTS_TOTAL} />
      </Card>

      {open ? <StudentDrawer onClose={() => setOpen(false)} /> : null}
    </Page>
  )
}

/** فيجما frame: v3-students-devices مع detail-drawer مفتوح (node 7:920) */
export default function StudentsList() {
  return <StudentsListShell initialOpen />
}
