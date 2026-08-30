import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ArrowLeft, Plus } from 'lucide-react'
import { ButtonLink } from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/Badge'
import { type Column } from '@/components/ui/Table'
import { EmptyState, ErrorState, TableSkeleton } from '@/components/ui/States'
import { useAsync } from '@/lib/useAsync'
import { formatArabicCount } from '@/lib/format'
import { listSpecializations, type ApiSpecializationRow } from '@/api/academic'
import {
  AcademicListScreen,
  EditDeletePills,
  NameLink,
  NumCell,
  academicPath,
  type Crumb,
} from './AcademicTable'

/** ⚠️ أول عمود في المصفوفة = أول عمود من اليمين (فيجما node 29:666) */
function buildColumns(
  collegeId: string | undefined,
  universityId: string | undefined,
): Column<ApiSpecializationRow>[] {
  return [
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
    render: (r) => (
      <NameLink
        to={academicPath('/academic/stages', { parentId: r.id, collegeId, universityId })}
      >
        {r.name}
      </NameLink>
    ),
  },
  {
    key: 'stages',
    header: 'عدد المراحل',
    width: 150,
    render: (r) => <NumCell>{formatArabicCount(r.stages, 'مرحلة', 'مراحل')}</NumCell>,
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
        editTo={`/academic/specializations/${r.id}/edit`}
        deleteTo={`/academic/specializations/${r.id}/delete`}
      />
    ),
  },
  ]
}

/** فيجما frame: v3-academic-specializations (node 29:631) */
export default function Specializations() {
  const [params] = useSearchParams()
  const collegeId = params.get('parentId') ?? undefined
  const universityId = params.get('universityId') ?? undefined
  const [refreshKey, setRefreshKey] = useState(0)
  const { data, loading, error, reload } = useAsync(
    () => listSpecializations({ parentId: collegeId }),
    [collegeId, refreshKey],
  )
  const collegesBackTo = academicPath('/academic/colleges', { parentId: universityId })
  const crumbs: Crumb[] = [
    { label: 'الهيكل الأكاديمي', to: '/academic/universities' },
    { label: 'الكليات', to: collegesBackTo },
    { label: 'التخصصات' },
  ]

  return (
    <AcademicListScreen
      pageTitle="إدارة التخصصات"
      heading={collegeId ? 'تخصصات الكلية المختارة' : 'كل التخصصات'}
      breadcrumb={crumbs}
      actions={
        <>
          <ButtonLink
            to={collegesBackTo}
            variant="secondary"
            icon={ArrowLeft}
          >
            العودة للكليات
          </ButtonLink>
          <ButtonLink
            to={academicPath('/academic/specializations/add', {
              parentId: collegeId,
              universityId,
            })}
            icon={Plus}
          >
            إضافة تخصص
          </ButtonLink>
        </>
      }
      outletContext={{ onDataChanged: () => setRefreshKey((k) => k + 1) }}
      columns={buildColumns(collegeId, universityId)}
      rows={error || (!data && loading) ? [] : (data?.data ?? [])}
      rowKey={(r) => r.id}
      tableClassName="min-w-[850px]"
      empty={
        error ? (
          <ErrorState description={error} onRetry={reload} />
        ) : !data && loading ? (
          <TableSkeleton rows={4} cols={5} />
        ) : (
          <EmptyState title="لا يوجد تخصصات مضافة بعد" description="ابدأ بإضافة أول تخصص." />
        )
      }
    />
  )
}
