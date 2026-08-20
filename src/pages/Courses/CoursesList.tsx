import { Plus, Pencil, Eye, Power } from 'lucide-react'
import { Page } from '@/components/layout/Page'
import { Card } from '@/components/ui/Card'
import { ButtonLink, IconButton } from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/Badge'
import { DataTable, RowActions, Truncate, type Column } from '@/components/ui/Table'
import { SearchField, FilterSelect } from '@/components/ui/Field'
import { Tabs } from '@/components/ui/Tabs'
import { FilterRow, Pagination } from '@/components/ui/Misc'
import { EmptyState } from '@/components/ui/States'
import {
  COURSES,
  COURSES_EMPTY,
  COURSES_LIST_TABS,
  COURSES_PAGINATION,
  COURSE_COLLEGE_FILTER,
  COURSE_STATUS_FILTER,
  type Course,
} from '@/data/courses'

/** ⚠️ أول عمود = أول عمود من اليمين (فيجما node 13:45) */
export const COURSE_COLUMNS: Column<Course>[] = [
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
    width: 90,
    render: (r) => <span className="mono font-bold text-ink">{r.price}</span>,
  },
  {
    key: 'videos',
    header: 'الفيديوهات',
    width: 100,
    render: (r) => <span className="mono text-muted">{r.videos}</span>,
  },
  {
    key: 'students',
    header: 'الطلاب',
    width: 100,
    render: (r) => <span className="mono text-muted">{r.students}</span>,
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
    width: 120,
    align: 'center',
    render: (r) => (
      <RowActions>
        <IconButton
          icon={Eye}
          label="عرض المحتوى"
          tone="brand"
          to={`/courses/${r.id}/content`}
        />
        <IconButton icon={Pencil} label="تعديل" to={`/courses/${r.id}/edit`} />
        <IconButton icon={Power} label="تعطيل" tone="danger" />
      </RowActions>
    ),
  },
]

/** الشِل المشترك بين قائمة الكورسات وحالتها الفارغة */
export function CoursesListShell({
  tabs,
  rows,
  empty,
}: {
  tabs: Array<{ label: string; count: number }>
  rows: Course[]
  empty?: boolean
}) {
  return (
    <Page title="إدارة الكورسات">
      {/* filter-row — فيجما node 13:18: الزرار شمال والفلاتر يمين */}
      <FilterRow
        action={
          <ButtonLink to="/courses/add" icon={Plus}>
            إضافة كورس جديد
          </ButtonLink>
        }
      >
        <SearchField placeholder="بحث بالاسم أو الكود..." width={260} />
        <FilterSelect
          label="تصفية بحسب الكلية"
          options={COURSE_COLLEGE_FILTER}
          width={163}
        />
        <FilterSelect
          label="تصفية بالحالة"
          options={COURSE_STATUS_FILTER}
          width={128}
        />
      </FilterRow>

      {/* tabs-stack-row — فيجما node 13:32 */}
      <Tabs items={tabs} />

      <Card className="w-full shrink-0 overflow-hidden">
        <DataTable
          columns={COURSE_COLUMNS}
          rows={rows}
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
        />
        {empty ? null : (
          <Pagination
            page={COURSES_PAGINATION.page}
            pages={COURSES_PAGINATION.pages}
            total={COURSES_PAGINATION.total}
          />
        )}
      </Card>
    </Page>
  )
}

/** فيجما frame: v3-courses-list (node 13:4) */
export default function CoursesList() {
  return <CoursesListShell tabs={COURSES_LIST_TABS} rows={COURSES} />
}
