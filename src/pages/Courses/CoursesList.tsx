import { useMemo, useState } from 'react'
import { Plus, Pencil, Eye, Power, BarChart3 } from 'lucide-react'
import { Page } from '@/components/layout/Page'
import { Card } from '@/components/ui/Card'
import { ButtonLink, IconButton } from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/Badge'
import { DataTable, RowActions, Truncate, type Column } from '@/components/ui/Table'
import { SearchField, FilterSelect } from '@/components/ui/Field'
import { Tabs } from '@/components/ui/Tabs'
import { Pagination } from '@/components/ui/Misc'
import { EmptyState, ErrorState, TableSkeleton } from '@/components/ui/States'
import { useAsync } from '@/lib/useAsync'
import { useDebouncedValue } from '@/lib/useDebouncedValue'
import { formatArabicCount, formatEGP } from '@/lib/format'
import { listCourses, toggleCourse, type ApiCourseListItem } from '@/api/courses'
import { listColleges } from '@/api/academic'
import { COURSES_EMPTY } from '@/data/courses'

const PAGE_SIZE = 10

const TABS_META = [
  { key: 'all', label: 'كل الكورسات' },
  { key: 'active', label: 'مفعّل' },
  { key: 'inactive', label: 'معطّل' },
] as const

function courseColumns(
  onToggle: (row: ApiCourseListItem) => void,
): Column<ApiCourseListItem>[] {
  return [
    {
      key: 'index',
      header: '#',
      width: 40,
      render: (r) => <span className="num text-muted">{r.index}</span>,
    },
    {
      key: 'name',
      header: 'اسم الكورس',
      flex: true,
      render: (r) => (
        <Truncate>
          <span className="font-bold text-brand">{r.name}</span>
        </Truncate>
      ),
    },
    {
      key: 'college',
      header: 'الكلية',
      width: 150,
      render: (r) => <Truncate>{r.college}</Truncate>,
    },
    {
      key: 'term',
      header: 'الترم',
      width: 110,
      render: (r) => <span className="text-muted">{r.term}</span>,
    },
    {
      key: 'price',
      header: 'السعر',
      width: 100,
      render: (r) => (
        <span className="mono font-bold text-ink">{r.isFree ? 'مجاني' : formatEGP(r.price)}</span>
      ),
    },
    {
      key: 'videos',
      header: 'الفيديوهات',
      width: 100,
      render: (r) => <span className="mono text-muted">{formatArabicCount(r.videos, 'فيديو', 'فيديو')}</span>,
    },
    {
      key: 'students',
      header: 'الطلاب',
      width: 100,
      render: (r) => <span className="mono text-muted">{formatArabicCount(r.students, 'طالب', 'طالب')}</span>,
    },
    {
      key: 'status',
      header: 'الحالة',
      width: 90,
      render: (r) => <StatusBadge status={r.status} />,
    },
    {
      key: 'actions',
      header: 'إجراءات',
      width: 150,
      align: 'center',
      render: (r) => (
        <RowActions>
          <IconButton icon={Eye} label="عرض المحتوى" tone="brand" to={`/courses/${r.id}/content`} />
          <IconButton icon={BarChart3} label="إحصائيات" to={`/courses/${r.id}/stats`} />
          <IconButton icon={Pencil} label="تعديل" to={`/courses/${r.id}/edit`} />
          <IconButton icon={Power} label="تفعيل/تعطيل" tone="danger" onClick={() => onToggle(r)} />
        </RowActions>
      ),
    },
  ]
}

/** فيجما frame: v3-courses-list (node 13:4) */
export default function CoursesList() {
  const [tabIndex, setTabIndex] = useState(0)
  const [searchInput, setSearchInput] = useState('')
  const [collegeName, setCollegeName] = useState('')
  const [page, setPage] = useState(1)
  const [refreshKey, setRefreshKey] = useState(0)
  const debouncedSearch = useDebouncedValue(searchInput, 400)
  const tab = TABS_META[tabIndex]?.key ?? 'all'

  const { data: collegesData } = useAsync(() => listColleges({ limit: 100 }), [])
  const colleges = collegesData?.data ?? []
  const collegeId = colleges.find((c) => c.name === collegeName)?.id

  const { data, loading, error, reload } = useAsync(
    () => listCourses({ q: debouncedSearch, collegeId, tab, page, limit: PAGE_SIZE }),
    [debouncedSearch, collegeId, tab, page, refreshKey],
  )

  const tabs = useMemo(() => {
    const counts = data?.meta?.tabs ?? { all: 0, active: 0, inactive: 0 }
    return TABS_META.map((t) => ({ label: t.label, count: counts[t.key] }))
  }, [data?.meta?.tabs])

  const handleToggle = async (row: ApiCourseListItem) => {
    await toggleCourse(row.id)
    reload()
  }

  return (
    <Page title="إدارة الكورسات" outletContext={{ onDataChanged: () => setRefreshKey((k) => k + 1) }}>
      <div className="flex w-full shrink-0 flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-4">
        <ButtonLink to="/courses/add" icon={Plus}>
          إضافة كورس جديد
        </ButtonLink>
        <div className="flex w-full min-w-0 flex-1 flex-col gap-3 md:flex-row md:items-center md:justify-end">
          <SearchField
            placeholder="بحث بالاسم أو الكود..."
            width={260}
            value={searchInput}
            onChange={(v) => {
              setSearchInput(v)
              setPage(1)
            }}
          />
          <FilterSelect
            label="تصفية بحسب الكلية"
            options={['', ...colleges.map((c) => c.name)]}
            width={163}
            value={collegeName}
            onChange={(v) => {
              setCollegeName(v)
              setPage(1)
            }}
          />
        </div>
      </div>

      <Tabs
        items={tabs}
        value={tabIndex}
        onChange={(i) => {
          setTabIndex(i)
          setPage(1)
        }}
      />

      <Card className="w-full shrink-0 overflow-hidden">
        {error ? (
          <ErrorState description={error} onRetry={reload} />
        ) : !data && loading ? (
          <TableSkeleton rows={PAGE_SIZE} cols={8} />
        ) : (
          <>
            <DataTable
              columns={courseColumns(handleToggle)}
              rows={data?.data ?? []}
              rowKey={(r) => r.id}
              empty={
                <EmptyState
                  title={COURSES_EMPTY.title}
                  description={COURSES_EMPTY.description}
                  action={
                    <ButtonLink to="/courses/add" icon={Plus}>
                      إضافة كورس جديد
                    </ButtonLink>
                  }
                />
              }
              className="min-w-[1000px]"
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
    </Page>
  )
}
