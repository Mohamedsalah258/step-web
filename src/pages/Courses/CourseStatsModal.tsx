import { useParams } from 'react-router-dom'
import { GraduationCap, Wallet } from 'lucide-react'
import { Modal, ModalButton } from '@/components/ui/Modal'
import { CardSkeleton, ErrorState } from '@/components/ui/States'
import { useAsync } from '@/lib/useAsync'
import { formatArabicCount, formatEGP } from '@/lib/format'
import { getCourseDetail, getCourseStats } from '@/api/courses'

/** فيجما: زرار "إحصائيات" في صف الكورس — عدد الطلاب المشتركين والدخل الحقيقي من الكورس ده */
export default function CourseStatsModal() {
  const { id = '' } = useParams()
  const { data: course, loading: courseLoading } = useAsync(() => getCourseDetail(id), [id])
  const { data: stats, loading, error } = useAsync(() => getCourseStats(id), [id])

  if (!id) return null

  return (
    <Modal
      title="إحصائيات الكورس"
      width={480}
      actions={<ModalButton variant="cancel">إغلاق</ModalButton>}
    >
      {loading || courseLoading ? (
        <CardSkeleton />
      ) : error || !stats ? (
        <ErrorState description={error ?? 'تعذر جلب الإحصائيات'} />
      ) : (
        <>
          {course ? (
            <p className="text-right text-base font-bold text-ink">{course.name}</p>
          ) : null}

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center gap-2 rounded-ctl border border-line bg-surface p-5">
              <GraduationCap className="size-6 text-brand" strokeWidth={2} />
              <span className="num text-2xl font-extrabold text-ink">{stats.studentsCount}</span>
              <span className="text-sm text-muted">طالب مشترك</span>
            </div>
            <div className="flex flex-col items-center gap-2 rounded-ctl border border-line bg-surface p-5">
              <Wallet className="size-6 text-success" strokeWidth={2} />
              <span className="num text-2xl font-extrabold text-ink">{formatEGP(stats.revenue)}</span>
              <span className="text-sm text-muted">إجمالي الدخل</span>
            </div>
          </div>

          <p className="text-right text-2xs leading-relaxed text-muted">
            {formatArabicCount(stats.studentsCount, 'طالب', 'طالب')} مشترك فعليًا في الكورس ده، بإجمالي دخل{' '}
            {formatEGP(stats.revenue)} من طلبات الشراء المقبولة عليه.
          </p>
        </>
      )}
    </Modal>
  )
}
