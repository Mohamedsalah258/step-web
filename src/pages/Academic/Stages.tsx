import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ArrowLeft, Plus } from 'lucide-react'
import { ButtonLink } from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/Badge'
import { type Column } from '@/components/ui/Table'
import { EmptyState, ErrorState, TableSkeleton } from '@/components/ui/States'
import { useAsync } from '@/lib/useAsync'
import { formatArabicCount } from '@/lib/format'
import { listStages, type ApiStageRow } from '@/api/academic'
import {
  AcademicListScreen,
  EditDeletePills,
  NameLink,
  NumCell,
  academicPath,
  type Crumb,
} from './AcademicTable'

/** ⚠️ أول عمود في المصفوفة = أول عمود من اليمين (فيجما node 29:810) */
function buildColumns(
  specializationId: string | undefined,
  collegeId: string | undefined,
  universityId: string | undefined,
): Column<ApiStageRow>[] {
  return [
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
    render: (r) => (
      <NameLink
        to={academicPath('/academic/terms', {
          parentId: r.id,
          specializationId,
          collegeId,
          universityId,
        })}
      >
        {r.name}
      </NameLink>
    ),
  },
  {
    key: 'terms',
    header: 'عدد الترمات',
    width: 150,
    render: (r) => <NumCell>{formatArabicCount(r.terms, 'ترم', 'ترمات')}</NumCell>,
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
    width: 120,
    align: 'center',
    render: (r) => (
      <EditDeletePills
        editTo={`/academic/stages/${r.id}/edit`}
        deleteTo={`/academic/stages/${r.id}/delete`}
      />
    ),
  },
  ]
}

/** فيجما frame: v3-academic-stages (node 29:772) */
export default function Stages() {
  const [params] = useSearchParams()
  const specializationId = params.get('parentId') ?? undefined
  const collegeId = params.get('collegeId') ?? undefined
  const universityId = params.get('universityId') ?? undefined
  const [refreshKey, setRefreshKey] = useState(0)
  const { data, loading, error, reload } = useAsync(
    () => listStages({ parentId: specializationId }),
    [specializationId, refreshKey],
  )
  const specializationsBackTo = academicPath('/academic/specializations', {
    parentId: collegeId,
    universityId,
  })
  const crumbs: Crumb[] = [
    { label: 'الهيكل الأكاديمي', to: '/academic/universities' },
    { label: 'التخصصات', to: specializationsBackTo },
    { label: 'المراحل' },
  ]

  return (
    <AcademicListScreen
      pageTitle="إدارة المراحل الدراسية"
      heading={specializationId ? 'مراحل التخصص المختار' : 'كل المراحل'}
      breadcrumb={crumbs}
      actions={
        <>
          <ButtonLink
            to={specializationsBackTo}
            variant="secondary"
            icon={ArrowLeft}
          >
            العودة للتخصصات
          </ButtonLink>
          <ButtonLink to="/academic/stages/add" icon={Plus}>
            إضافة مرحلة
          </ButtonLink>
        </>
      }
      outletContext={{ onDataChanged: () => setRefreshKey((k) => k + 1) }}
      columns={buildColumns(specializationId, collegeId, universityId)}
      rows={error || (!data && loading) ? [] : (data?.data ?? [])}
      rowKey={(r) => r.id}
      tableClassName="min-w-[850px]"
      empty={
        error ? (
          <ErrorState description={error} onRetry={reload} />
        ) : !data && loading ? (
          <TableSkeleton rows={4} cols={5} />
        ) : (
          <EmptyState title="لا يوجد مراحل مضافة بعد" description="ابدأ بإضافة أول مرحلة." />
        )
      }
    />
  )
}
