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
  academicPath,
  type Crumb,
} from './AcademicTable'

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
  const specializationId = params.get('specializationId') ?? undefined
  const collegeId = params.get('collegeId') ?? undefined
  const universityId = params.get('universityId') ?? undefined
  const [refreshKey, setRefreshKey] = useState(0)
  const { data, loading, error, reload } = useAsync(
    () => listTerms({ parentId: stageId }),
    [stageId, refreshKey],
  )
  /**
   * /courses مش بيقبل فلترة بـ termId (اتأكدنا من Swagger: q/collegeId/tab/page/limit بس)،
   * فبنجيب كورسات الكلية دي بس ونفلتر على اسم الترم (يطابق ترمات المرحلة الحالية)
   * على مستوى الفرونت. لو مفيش collegeId في الرابط أصلاً (عرض غير مفلتر)، نرجع
   * لعرض عيّنة عامة زي الأول.
   */
  const termNames = new Set((data?.data ?? []).map((t) => t.name))
  const termNamesKey = [...termNames].sort().join(',')
  const {
    data: coursesData,
    loading: coursesLoading,
    error: coursesError,
    reload: reloadCourses,
  } = useAsync(async () => {
    if (!collegeId) return listCourses({ limit: 10 })
    if (termNames.size === 0) return { data: [] as ApiCourseListItem[] }
    const result = await listCourses({ collegeId, limit: 100 })
    return { data: result.data.filter((c) => termNames.has(c.term)) }
  }, [collegeId, termNamesKey, refreshKey])
  const stagesBackTo = academicPath('/academic/stages', {
    parentId: specializationId,
    collegeId,
    universityId,
  })
  const crumbs: Crumb[] = [
    { label: 'الهيكل الأكاديمي', to: '/academic/universities' },
    { label: 'المراحل', to: stagesBackTo },
    { label: 'الترمات' },
  ]

  return (
    <AcademicListScreen
      pageTitle="الترمات الدراسية"
      heading={stageId ? 'ترمات المرحلة المختارة' : 'كل الترمات'}
      breadcrumb={crumbs}
      actions={
        <>
          <ButtonLink
            to={stagesBackTo}
            variant="secondary"
            icon={ArrowLeft}
          >
            العودة للمراحل
          </ButtonLink>
          <ButtonLink
            to={academicPath('/academic/terms/add', {
              parentId: stageId,
              specializationId,
              collegeId,
              universityId,
            })}
            icon={Plus}
          >
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
