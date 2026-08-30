import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ArrowLeft, Plus, Settings } from 'lucide-react'
import { ButtonLink, IconButton } from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/Badge'
import { RowActions, type Column } from '@/components/ui/Table'
import { EmptyState, ErrorState, TableSkeleton } from '@/components/ui/States'
import { useAsync } from '@/lib/useAsync'
import { formatArabicCount } from '@/lib/format'
import { listColleges, type ApiCollegeRow } from '@/api/academic'
import {
  AcademicListScreen,
  NameLink,
  NumCell,
  academicPath,
  type Crumb,
} from './AcademicTable'

const CRUMBS: Crumb[] = [
  { label: 'الهيكل الأكاديمي', to: '/academic/universities' },
  { label: 'الكليات' },
]

/** ⚠️ أول عمود في المصفوفة = أول عمود من اليمين (فيجما node 29:519) */
function buildColumns(universityId: string | undefined): Column<ApiCollegeRow>[] {
  return [
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
      <NameLink to={academicPath('/academic/specializations', { parentId: r.id, universityId })}>
        {r.name}
      </NameLink>
    ),
  },
  {
    key: 'departments',
    header: 'عدد الأقسام',
    width: 150,
    render: (r) => <NumCell>{formatArabicCount(r.departments, 'قسم', 'أقسام')}</NumCell>,
  },
  {
    key: 'courses',
    header: 'عدد الكورسات',
    width: 150,
    render: (r) => <NumCell>{formatArabicCount(r.courses, 'كورس', 'كورسات')}</NumCell>,
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
    render: (r) => (
      <RowActions>
        <IconButton
          icon={Settings}
          label="إعدادات الكلية"
          tone="brand"
          to={`/academic/colleges/${r.id}/edit`}
        />
      </RowActions>
    ),
  },
  ]
}

/** فيجما frame: v3-academic-colleges (node 29:490) */
export default function Colleges() {
  const [params] = useSearchParams()
  const universityId = params.get('parentId') ?? undefined
  const [refreshKey, setRefreshKey] = useState(0)
  const { data, loading, error, reload } = useAsync(
    () => listColleges({ parentId: universityId }),
    [universityId, refreshKey],
  )

  return (
    <AcademicListScreen
      pageTitle="إدارة كليات الجامعة"
      heading={universityId ? 'كليات الجامعة المختارة' : 'كل الكليات'}
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
      outletContext={{ onDataChanged: () => setRefreshKey((k) => k + 1) }}
      columns={buildColumns(universityId)}
      rows={error || (!data && loading) ? [] : (data?.data ?? [])}
      rowKey={(r) => r.id}
      tableClassName="min-w-[800px]"
      empty={
        error ? (
          <ErrorState description={error} onRetry={reload} />
        ) : !data && loading ? (
          <TableSkeleton rows={4} cols={5} />
        ) : (
          <EmptyState title="لا يوجد كليات مضافة بعد" description="ابدأ بإضافة أول كلية." />
        )
      }
    />
  )
}
