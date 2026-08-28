import { useMemo, useState } from 'react'
import { Page } from '@/components/layout/Page'
import { Card } from '@/components/ui/Card'
import { DataTable } from '@/components/ui/Table'
import { SearchField, FilterSelect } from '@/components/ui/Field'
import { Tabs } from '@/components/ui/Tabs'
import { Pagination } from '@/components/ui/Misc'
import { EmptyState, ErrorState, TableSkeleton } from '@/components/ui/States'
import { useAsync } from '@/lib/useAsync'
import { useDebouncedValue } from '@/lib/useDebouncedValue'
import { listStudents } from '@/api/students'
import {
  STUDENT_FILTERS,
  STUDENTS_TITLE,
  STUDENT_TABS_META,
  buildStudentTabs,
  type StudentRow,
  type StudentsTab,
} from '@/data/students'
import { StudentDrawer, studentColumns } from './students-parts'

const PAGE_SIZE = 8

/** الشِل المشترك بين فريمي v3-students-devices (7:920 و35:6810) */
export function StudentsListShell() {
  const [openId, setOpenId] = useState<string | null>(null)
  const [tabIndex, setTabIndex] = useState(0)
  const [searchInput, setSearchInput] = useState('')
  const [course, setCourse] = useState('')
  const [page, setPage] = useState(1)

  const debouncedSearch = useDebouncedValue(searchInput, 400)
  const tab: StudentsTab = STUDENT_TABS_META[tabIndex]?.key ?? 'all'

  const { data, loading, error, reload } = useAsync(
    () => listStudents({ q: debouncedSearch, tab, course, page, pageSize: PAGE_SIZE }),
    [debouncedSearch, tab, course, page],
  )

  const tabs = useMemo(
    () => buildStudentTabs(data?.tabs ?? { all: 0, active: 0, banned: 0 }),
    [data?.tabs],
  )

  return (
    <Page title={STUDENTS_TITLE}>
      {/* filter-row — node 7:991: التابس يمين ثم البحث ثم ترتيب الكورس شمال */}
      <div className="flex w-full shrink-0 flex-col gap-3 md:flex-row md:items-center md:gap-4">
        <Tabs
          items={tabs}
          value={tabIndex}
          onChange={(i) => {
            setTabIndex(i)
            setPage(1)
          }}
          className="w-full md:w-auto"
        />
        <div className="flex w-full min-w-0 flex-1 flex-col gap-3 md:flex-row md:items-center">
          <SearchField
            placeholder={STUDENT_FILTERS.searchPlaceholder}
            width={520}
            value={searchInput}
            onChange={(v) => {
              setSearchInput(v)
              setPage(1)
            }}
          />
          <FilterSelect
            label={STUDENT_FILTERS.courseSortLabel}
            options={[...STUDENT_FILTERS.courseSortOptions]}
            width={171}
            value={course}
            onChange={(v) => {
              setCourse(v)
              setPage(1)
            }}
          />
        </div>
      </div>

      {/* data-table-card — node 7:1015 */}
      <Card className="w-full shrink-0 overflow-hidden">
        {error ? (
          <ErrorState description={error} onRetry={reload} />
        ) : !data && loading ? (
          <TableSkeleton rows={PAGE_SIZE} cols={7} />
        ) : (
          <>
            <DataTable
              columns={studentColumns((row) => setOpenId(row.id))}
              rows={data?.items ?? []}
              rowKey={(r: StudentRow) => r.id}
              empty={
                <EmptyState
                  title="لا يوجد طلاب مطابقين للبحث"
                  description="جرّب تغيير كلمة البحث أو الفلاتر المختارة."
                />
              }
              className="min-w-[900px]"
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

      {openId ? (
        <StudentDrawer
          studentId={openId}
          onClose={() => setOpenId(null)}
          onChanged={reload}
        />
      ) : null}
    </Page>
  )
}

/** فيجما frame: v3-students-devices (node 7:920) — الدروار بيفتح بالضغط بس */
export default function StudentsList() {
  return <StudentsListShell />
}
