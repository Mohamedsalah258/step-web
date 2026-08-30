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
import { listCourses } from '@/api/courses'
import { listColleges, listSpecializations, listUniversities } from '@/api/academic'
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
  const [universityId, setUniversityId] = useState('')
  const [collegeId, setCollegeId] = useState('')
  const [specializationId, setSpecializationId] = useState('')
  const [page, setPage] = useState(1)

  const debouncedSearch = useDebouncedValue(searchInput, 400)
  const tab: StudentsTab = STUDENT_TABS_META[tabIndex]?.key ?? 'all'

  const { data, loading, error, reload } = useAsync(
    () => listStudents({ q: debouncedSearch, tab, course, universityId, collegeId, specializationId, page, limit: PAGE_SIZE }),
    [debouncedSearch, tab, course, universityId, collegeId, specializationId, page],
  )
  const { data: coursesData } = useAsync(() => listCourses({ limit: 100 }), [])
  /** ⚠️ الباك اند بيفلتر `/students?course=` بمطابقة نصية (ILIKE) على اسم الكورس،
   * مش بمعرّف — لازم القيمة المتبعتة تكون اسم الكورس نفسه، مش الـ id. */
  const courseOptions = (coursesData?.data ?? []).map((c) => c.name)

  /** تسلسل جامعة→كلية→تخصص — نفس منطق الكاسكيد في Notifications.tsx */
  const { data: universitiesData } = useAsync(() => listUniversities({ limit: 100 }), [])
  const universities = universitiesData?.data ?? []

  const { data: collegesData } = useAsync(
    () => listColleges({ parentId: universityId || undefined, limit: 100 }),
    [universityId],
  )
  const colleges = universityId ? (collegesData?.data ?? []) : []

  const { data: specializationsData } = useAsync(
    () => listSpecializations({ parentId: collegeId || undefined, limit: 100 }),
    [collegeId],
  )
  const specializations = collegeId ? (specializationsData?.data ?? []) : []

  const tabs = useMemo(
    () => buildStudentTabs(data?.meta?.tabs ?? { all: 0, active: 0, banned: 0 }),
    [data?.meta?.tabs],
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
            options={courseOptions}
            width={171}
            value={course}
            onChange={(v) => {
              setCourse(v)
              setPage(1)
            }}
          />
        </div>
      </div>

      {/* فلاتر الهيكل الأكاديمي — جامعة→كلية→تخصص، نفس الكاسكيد المستخدم في Notifications */}
      <div className="flex w-full shrink-0 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
        <FilterSelect
          label={STUDENT_FILTERS.universityLabel}
          options={universities.map((u) => ({ value: u.id, label: u.name }))}
          width={180}
          value={universityId}
          onChange={(v) => {
            setUniversityId(v)
            setCollegeId('')
            setSpecializationId('')
            setPage(1)
          }}
        />
        <FilterSelect
          label={STUDENT_FILTERS.collegeLabel}
          options={colleges.map((c) => ({ value: c.id, label: c.name }))}
          width={180}
          value={collegeId}
          onChange={(v) => {
            setCollegeId(v)
            setSpecializationId('')
            setPage(1)
          }}
        />
        <FilterSelect
          label={STUDENT_FILTERS.specializationLabel}
          options={specializations.map((s) => ({ value: s.id, label: s.name }))}
          width={180}
          value={specializationId}
          onChange={(v) => {
            setSpecializationId(v)
            setPage(1)
          }}
        />
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
              rows={data?.data ?? []}
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
              page={data?.meta?.page ?? 1}
              pages={data?.meta?.totalPages ?? 1}
              total={data?.meta?.total}
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
