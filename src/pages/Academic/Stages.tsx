import { ArrowLeft, Plus } from 'lucide-react'
import { ButtonLink } from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/Badge'
import { type Column } from '@/components/ui/Table'
import { STAGES, type Stage } from '@/data/academic'
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
  { label: 'الطب العام', to: '/academic/specializations' },
  { label: 'المراحل' },
]

/** ⚠️ أول عمود في المصفوفة = أول عمود من اليمين (فيجما node 29:810) */
const COLUMNS: Column<Stage>[] = [
  {
    key: 'index',
    header: '#',
    width: 50,
    render: (r) => <NumCell tone="muted">{r.index}</NumCell>,
  },
  {
    key: 'name',
    header: 'اسم المرحلة',
    flex: true,
    render: (r) => <NameLink to="/academic/terms">{r.name}</NameLink>,
  },
  {
    key: 'terms',
    header: 'عدد الترمات',
    width: 150,
    render: (r) => <NumCell>{r.terms}</NumCell>,
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

/** فيجما frame: v3-academic-stages (node 29:772) */
export default function Stages() {
  return (
    <AcademicListScreen
      pageTitle="إدارة المراحل الدراسية"
      heading="مراحل الطب العام"
      breadcrumb={CRUMBS}
      actions={
        <>
          <ButtonLink
            to="/academic/specializations"
            variant="secondary"
            icon={ArrowLeft}
          >
            العودة لتخصصات كلية الطب
          </ButtonLink>
          <ButtonLink to="/academic/stages/add" icon={Plus}>
            إضافة مرحلة
          </ButtonLink>
        </>
      }
      columns={COLUMNS}
      rows={STAGES}
      rowKey={(r) => r.id}
    />
  )
}
