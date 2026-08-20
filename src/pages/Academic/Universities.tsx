import { Plus, Settings } from 'lucide-react'
import { ButtonLink, IconButton } from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/Badge'
import { RowActions, type Column } from '@/components/ui/Table'
import { UNIVERSITIES, type University } from '@/data/academic'
import {
  AcademicListScreen,
  NameLink,
  NumCell,
  type Crumb,
} from './AcademicTable'

const CRUMBS: Crumb[] = [
  { label: 'الهيكل الأكاديمي', to: '/academic/universities' },
  { label: 'الجامعات' },
]

/** ⚠️ أول عمود في المصفوفة = أول عمود من اليمين (فيجما node 29:389) */
const COLUMNS: Column<University>[] = [
  {
    key: 'index',
    header: '#',
    width: 50,
    render: (r) => <NumCell tone="muted">{r.index}</NumCell>,
  },
  {
    key: 'name',
    header: 'اسم الجامعة',
    flex: true,
    render: (r) => <NameLink to="/academic/colleges">{r.name}</NameLink>,
  },
  {
    key: 'colleges',
    header: 'عدد الكليات',
    width: 120,
    render: (r) => <NumCell>{r.colleges}</NumCell>,
  },
  {
    key: 'courses',
    header: 'عدد الكورسات',
    width: 120,
    render: (r) => <NumCell>{r.courses}</NumCell>,
  },
  {
    key: 'status',
    header: 'الحالة',
    width: 100,
    render: (r) => <StatusBadge status={r.status} />,
  },
  {
    key: 'date',
    header: 'تاريخ الإضافة',
    width: 130,
    render: (r) => <NumCell tone="muted">{r.date}</NumCell>,
  },
  {
    key: 'actions',
    header: 'إجراءات',
    width: 80,
    align: 'center',
    render: () => (
      <RowActions>
        <IconButton icon={Settings} label="إعدادات الجامعة" tone="brand" />
      </RowActions>
    ),
  },
]

/** فيجما frame: v3-academic-universities (node 29:365) */
export default function Universities() {
  return (
    <AcademicListScreen
      pageTitle="الجامعات الأكاديمية"
      heading="إدارة الجامعات الشريكة"
      breadcrumb={CRUMBS}
      actions={
        <ButtonLink to="/academic/universities/add" icon={Plus}>
          إضافة جامعة
        </ButtonLink>
      }
      columns={COLUMNS}
      rows={UNIVERSITIES}
      rowKey={(r) => r.id}
      tableClassName="min-w-[900px]"
    />
  )
}
