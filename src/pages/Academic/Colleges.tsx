import { ArrowLeft, Plus, Settings } from 'lucide-react'
import { ButtonLink, IconButton } from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/Badge'
import { RowActions, type Column } from '@/components/ui/Table'
import { COLLEGES, type College } from '@/data/academic'
import {
  AcademicListScreen,
  NameLink,
  NumCell,
  type Crumb,
} from './AcademicTable'

const CRUMBS: Crumb[] = [
  { label: 'الهيكل الأكاديمي', to: '/academic/universities' },
  { label: 'جامعة القاهرة', to: '/academic/universities' },
  { label: 'كليات جامعة القاهرة' },
]

/** ⚠️ أول عمود في المصفوفة = أول عمود من اليمين (فيجما node 29:519) */
const COLUMNS: Column<College>[] = [
  {
    key: 'index',
    header: '#',
    width: 50,
    render: (r) => <NumCell tone="muted">{r.index}</NumCell>,
  },
  {
    key: 'name',
    header: 'اسم الكلية',
    flex: true,
    render: (r) => (
      <NameLink to="/academic/specializations">{r.name}</NameLink>
    ),
  },
  {
    key: 'departments',
    header: 'عدد الأقسام',
    width: 150,
    render: (r) => <NumCell>{r.departments}</NumCell>,
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
    width: 80,
    align: 'center',
    render: () => (
      <RowActions>
        <IconButton icon={Settings} label="إعدادات الكلية" tone="brand" />
      </RowActions>
    ),
  },
]

/** فيجما frame: v3-academic-colleges (node 29:490) */
export default function Colleges() {
  return (
    <AcademicListScreen
      pageTitle="إدارة كليات الجامعة"
      heading="كليات جامعة القاهرة"
      breadcrumb={CRUMBS}
      actions={
        /* action-group — فيجما: زرار الإضافة أقصى الشمال والعودة يمينه،
           فالـ DOM في RTL يبدأ بزرار العودة */
        <>
          <ButtonLink
            to="/academic/universities"
            variant="secondary"
            icon={ArrowLeft}
          >
            عودة للجامعات
          </ButtonLink>
          <ButtonLink to="/academic/colleges/add" icon={Plus}>
            إضافة كلية جديدة
          </ButtonLink>
        </>
      }
      columns={COLUMNS}
      rows={COLLEGES}
      rowKey={(r) => r.id}
    />
  )
}
