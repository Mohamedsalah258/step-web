import { useState } from 'react'
import { Plus, Settings } from 'lucide-react'
import { ButtonLink, IconButton } from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/Badge'
import { RowActions, type Column } from '@/components/ui/Table'
import { EmptyState, ErrorState, TableSkeleton } from '@/components/ui/States'
import { useAsync } from '@/lib/useAsync'
import { formatArabicCount, formatDate } from '@/lib/format'
import { listUniversities, type ApiUniversityRow } from '@/api/academic'
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
const COLUMNS: Column<ApiUniversityRow>[] = [
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
    render: (r) => <NameLink to={`/academic/colleges?parentId=${r.id}`}>{r.name}</NameLink>,
  },
  {
    key: 'colleges',
    header: 'عدد الكليات',
    width: 120,
    render: (r) => <NumCell>{formatArabicCount(r.colleges, 'كلية', 'كليات')}</NumCell>,
  },
  {
    key: 'courses',
    header: 'عدد الكورسات',
    width: 120,
    render: (r) => <NumCell>{formatArabicCount(r.courses, 'كورس', 'كورسات')}</NumCell>,
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
    render: (r) => <NumCell tone="muted">{formatDate(r.date)}</NumCell>,
  },
  {
    key: 'actions',
    header: 'إجراءات',
    width: 80,
    align: 'center',
    render: (r) => (
      <RowActions>
        <IconButton
          icon={Settings}
          label="إعدادات الجامعة"
          tone="brand"
          to={`/academic/universities/${r.id}/edit`}
        />
      </RowActions>
    ),
  },
]

/** فيجما frame: v3-academic-universities (node 29:365) */
export default function Universities() {
  const [refreshKey, setRefreshKey] = useState(0)
  const { data, loading, error, reload } = useAsync(
    () => listUniversities(),
    [refreshKey],
  )

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
      outletContext={{ onDataChanged: () => setRefreshKey((k) => k + 1) }}
      columns={COLUMNS}
      rows={error || (!data && loading) ? [] : (data?.data ?? [])}
      rowKey={(r) => r.id}
      tableClassName="min-w-[900px]"
      empty={
        error ? (
          <ErrorState description={error} onRetry={reload} />
        ) : !data && loading ? (
          <TableSkeleton rows={4} cols={6} />
        ) : (
          <EmptyState title="لا يوجد جامعات مضافة بعد" description="ابدأ بإضافة أول جامعة." />
        )
      }
    />
  )
}
