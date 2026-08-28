import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ArrowLeft, Plus, RotateCcw } from 'lucide-react'
import { Card, CardHeader } from '@/components/ui/Card'
import { ButtonLink } from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/Badge'
import { DataTable, type Column } from '@/components/ui/Table'
import { EmptyState, ErrorState, TableSkeleton } from '@/components/ui/States'
import { useAsync } from '@/lib/useAsync'
import { formatArabicCount } from '@/lib/format'
import { listTerms, type ApiTermRow } from '@/api/academic'
import { listCourses, type ApiCourseListItem } from '@/api/courses'
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
const COLUMNS: Column<ApiTermRow>[] = [
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
    render: (r) => <NumCell>{formatArabicCount(r.courses, 'كورس', 'كورسات')}</NumCell>,
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
    render: (r) => (
      <EditDeletePills
        editTo={`/academic/terms/${r.id}/edit`}
        deleteTo={`/academic/terms/${r.id}/delete`}
      />
    ),
  },
]

/** linked-courses-section — فيجما node 29:1031 */
const LINKED_COLUMNS: Column<ApiCourseListItem>[] = [
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
    render: (r) => <NumCell>{r.isFree ? 'مجاني' : `${r.price} ج.م`}</NumCell>,
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
  const [params] = useSearchParams()
  const stageId = params.get('parentId') ?? undefined
  const [refreshKey, setRefreshKey] = useState(0)
  const { data, loading, error, reload } = useAsync(
    () => listTerms({ parentId: stageId }),
    [stageId, refreshKey],
  )
  const {
    data: coursesData,
    loading: coursesLoading,
    error: coursesError,
    reload: reloadCourses,
  } = useAsync(() => listCourses({ limit: 10 }), [refreshKey])

  return (
    <AcademicListScreen
      pageTitle="الترمات الدراسية"
      heading={stageId ? 'ترمات المرحلة المختارة' : 'كل الترمات'}
      breadcrumb={CRUMBS}
      actions={
        <>
          <ButtonLink
            to="/academic/stages"
            variant="secondary"
            icon={ArrowLeft}
          >
            العودة للمراحل
          </ButtonLink>
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
      outletContext={{ onDataChanged: () => setRefreshKey((k) => k + 1) }}
      columns={COLUMNS}
      rows={error || (!data && loading) ? [] : (data?.data ?? [])}
      rowKey={(r) => r.id}
      tableClassName="min-w-[700px]"
      empty={
        error ? (
          <ErrorState description={error} onRetry={reload} />
        ) : !data && loading ? (
          <TableSkeleton rows={4} cols={4} />
        ) : (
          <EmptyState title="لا يوجد ترمات مضافة بعد" description="ابدأ بإضافة أول ترم." />
        )
      }
    >
      <Card className="w-full shrink-0 overflow-hidden">
        <CardHeader title="الكورسات المرتبطة بالترمات" />
        {coursesError ? (
          <ErrorState description={coursesError} onRetry={reloadCourses} />
        ) : !coursesData && coursesLoading ? (
          <TableSkeleton rows={4} cols={4} />
        ) : (
          <DataTable
            columns={LINKED_COLUMNS}
            rows={coursesData?.data ?? []}
            rowKey={(r) => r.id}
            className="min-w-[650px]"
            empty={
              <EmptyState title="لا يوجد كورسات مضافة بعد" description="ابدأ بإضافة أول كورس." />
            }
          />
        )}
      </Card>
    </AcademicListScreen>
  )
}
