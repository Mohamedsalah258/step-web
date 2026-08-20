import { ArrowLeft, Plus } from 'lucide-react'
import { ButtonLink } from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/Badge'
import { type Column } from '@/components/ui/Table'
import { SPECIALIZATIONS, type Specialization } from '@/data/academic'
import {
  AcademicListScreen,
  EditDeletePills,
  NameLink,
  NumCell,
  type Crumb,
} from './AcademicTable'

const CRUMBS: Crumb[] = [
  { label: 'الهيكل الأكاديمي', to: '/academic/universities' },
  { label: 'جامعة القاهرة', to: '/academic/universities' },
  { label: 'كلية الطب', to: '/academic/colleges' },
  { label: 'التخصصات' },
]

/** ⚠️ أول عمود في المصفوفة = أول عمود من اليمين (فيجما node 29:666) */
const COLUMNS: Column<Specialization>[] = [
  {
    key: 'index',
    header: '#',
    width: 50,
    render: (r) => <NumCell tone="muted">{r.index}</NumCell>,
  },
  {
    key: 'name',
    header: 'اسم التخصص',
    flex: true,
    render: (r) => <NameLink to="/academic/stages">{r.name}</NameLink>,
  },
  {
    key: 'stages',
    header: 'عدد المراحل',
    width: 150,
    render: (r) => <NumCell>{r.stages}</NumCell>,
  },
  {
    key: 'courses',
    header: 'عدد الكورسات',
    width: 150,
    render: (r) => <NumCell>{r.courses}</NumCell>,
  },
  {
    key: 'status',
    header: 'الحالة',
    width: 120,
    render: (r) => <StatusBadge status={r.status} />,
  },
  {
    key: 'actions',
    header: 'إجراءات',
    width: 120,
    align: 'center',
    render: () => <EditDeletePills />,
  },
]

/** فيجما frame: v3-academic-specializations (node 29:631) */
export default function Specializations() {
  return (
    <AcademicListScreen
      pageTitle="إدارة التخصصات - كلية الطب"
      heading="تخصصات كلية الطب"
      breadcrumb={CRUMBS}
      actions={
        <>
          <ButtonLink
            to="/academic/colleges"
            variant="secondary"
            icon={ArrowLeft}
          >
            العودة لكليات جامعة القاهرة
          </ButtonLink>
          <ButtonLink to="/academic/specializations/add" icon={Plus}>
            إضافة تخصص
          </ButtonLink>
        </>
      }
      columns={COLUMNS}
      rows={SPECIALIZATIONS}
      rowKey={(r) => r.id}
      tableClassName="min-w-[850px]"
    />
  )
}
