import { Plus, RotateCcw } from 'lucide-react'
import { Card, CardHeader } from '@/components/ui/Card'
import { ButtonLink } from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/Badge'
import { DataTable, type Column } from '@/components/ui/Table'
import {
  TERMS,
  TERM_LINKED_COURSES,
  type Term,
  type LinkedCourse,
} from '@/data/academic'
import {
  AcademicListScreen,
  EditDeletePills,
  NameLink,
  NumCell,
  type Crumb,
} from './AcademicTable'

const CRUMBS: Crumb[] = [
  { label: 'الهيكل الأكاديمي', to: '/academic/universities' },
  { label: 'المراحل', to: '/academic/stages' },
  { label: 'الترمات' },
]

/** ⚠️ أول عمود = أول عمود من اليمين (فيجما node 29:998) */
const COLUMNS: Column<Term>[] = [
  {
    key: 'index',
    header: '#',
    width: 50,
    render: (r) => <NumCell tone="muted">{r.index}</NumCell>,
  },
  {
    key: 'name',
    header: 'اسم الترم',
    flex: true,
    render: (r) => <NameLink to="/courses">{r.name}</NameLink>,
  },
  {
    key: 'courses',
    header: 'عدد الكورسات',
    width: 130,
    render: (r) => <NumCell>{r.courses}</NumCell>,
  },
  {
    key: 'status',
    header: 'الحالة',
    width: 100,
    render: (r) => <StatusBadge status={r.status} />,
  },
  {
    key: 'actions',
    header: 'إجراءات',
    width: 160,
    align: 'center',
    render: () => <EditDeletePills />,
  },
]

/** linked-courses-section — فيجما node 29:1031 */
const LINKED_COLUMNS: Column<LinkedCourse>[] = [
  {
    key: 'name',
    header: 'اسم الكورس',
    flex: true,
    render: (r) => <span className="font-semibold">{r.name}</span>,
  },
  {
    key: 'term',
    header: 'الترم',
    width: 160,
    render: (r) => <span className="text-muted">{r.term}</span>,
  },
  {
    key: 'price',
    header: 'السعر',
    width: 120,
    render: (r) => <NumCell>{r.price}</NumCell>,
  },
  {
    key: 'status',
    header: 'الحالة',
    width: 120,
    render: (r) => <StatusBadge status={r.status} />,
  },
]

/** فيجما frame: v3-academic-terms (node 29:958) */
export default function Terms() {
  return (
    <AcademicListScreen
      pageTitle="الترمات الدراسية"
      heading="إدارة ترمات المرحلة"
      breadcrumb={CRUMBS}
      actions={
        <>
          <ButtonLink to="/academic/terms/add" icon={Plus}>
            إضافة ترم
          </ButtonLink>
          <ButtonLink
            to="/academic/terms/reset"
            icon={RotateCcw}
            variant="secondary"
          >
            تصفير الترم
          </ButtonLink>
        </>
      }
      columns={COLUMNS}
      rows={TERMS}
      rowKey={(r) => r.id}
    >
      <Card className="w-full shrink-0 overflow-hidden">
        <CardHeader title="الكورسات المرتبطة بالترمات" />
        <DataTable
          columns={LINKED_COLUMNS}
          rows={TERM_LINKED_COURSES}
          rowKey={(r) => r.id}
        />
      </Card>
    </AcademicListScreen>
  )
}
