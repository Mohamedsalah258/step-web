import { useEffect, useState } from 'react'
import { useNavigate, useOutletContext, useParams } from 'react-router-dom'
import {
  ConfirmDeleteModal,
  Modal,
  ModalButton,
  ModalDangerZone,
  ModalField,
  ModalSelect,
  ModalTextArea,
} from '@/components/ui/Modal'
import { CardSkeleton, ErrorState } from '@/components/ui/States'
import { useAsync } from '@/lib/useAsync'
import {
  listUniversities,
  listColleges,
  listSpecializations,
  listStages,
  listTerms,
} from '@/api/academic'
import { deleteCourse, getCourseDetail, updateCourse } from '@/api/courses'
import { uploadFile, uploadUrl } from '@/api/uploads'
import { EDIT_COURSE_MODAL as M } from '@/data/courses'
import { UploadDrop } from './courses-parts'

const STATUS_MAP = { منشور: 'PUBLISHED', مسوّدة: 'DRAFT', مسحوب: 'WITHDRAWN' } as const
const STATUS_MAP_REVERSE: Record<string, keyof typeof STATUS_MAP> = {
  PUBLISHED: 'منشور',
  DRAFT: 'مسوّدة',
  WITHDRAWN: 'مسحوب',
}

type CourseOutletContext = { onDataChanged: () => void }

/** فيجما frame: v3-edit-course-modal (node 2007:4301) — modal node 2007:4377، عرض 560 */
export default function EditCourseModal() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { onDataChanged } = useOutletContext<CourseOutletContext>()
  const { data: course, loading, error } = useAsync(() => getCourseDetail(id!), [id])

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [isFree, setIsFree] = useState(false)
  const [order, setOrder] = useState('')
  const [status, setStatus] = useState<keyof typeof STATUS_MAP>('مسوّدة')
  const [coverFile, setCoverFile] = useState<File | null>(null)

  // الهيكل الأكاديمي — نفس منطق AddCourseModal الكاسكيدي، بس بيتزرع من قيم الكورس الحالية
  const [universityName, setUniversityName] = useState('')
  const [collegeName, setCollegeName] = useState('')
  const [specializationName, setSpecializationName] = useState('')
  const [stageName, setStageName] = useState('')
  const [termName, setTermName] = useState('')

  const { data: unisData } = useAsync(() => listUniversities({ limit: 100 }), [])
  const universities = unisData?.data ?? []
  const university = universities.find((u) => u.name === universityName)

  const { data: collegesData } = useAsync(
    () => listColleges({ parentId: university?.id, limit: 100 }),
    [university?.id],
  )
  const colleges = university ? (collegesData?.data ?? []) : []
  const college = colleges.find((c) => c.name === collegeName)

  const { data: specsData } = useAsync(
    () => listSpecializations({ parentId: college?.id, limit: 100 }),
    [college?.id],
  )
  const specializations = college ? (specsData?.data ?? []) : []
  const specialization = specializations.find((s) => s.name === specializationName)

  const { data: stagesData } = useAsync(
    () => listStages({ parentId: specialization?.id, limit: 100 }),
    [specialization?.id],
  )
  const stages = specialization ? (stagesData?.data ?? []) : []
  const stage = stages.find((s) => s.name === stageName)

  const { data: termsData } = useAsync(
    () => listTerms({ parentId: stage?.id, limit: 100 }),
    [stage?.id],
  )
  const terms = stage ? (termsData?.data ?? []) : []
  const term = terms.find((t) => t.name === termName)

  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  // تعبئة أولية من بيانات الكورس — مرة واحدة بس أول ما تتحمّل، وبعدين تتبع
  // نتيجة كل مستوى في السلسلة (مش الكورس نفسه) عشان الأسماء تظهر صح.
  useEffect(() => {
    if (course) {
      setName(course.name)
      setDescription(course.description ?? '')
      setPrice(String(course.price))
      setIsFree(course.isFree)
      setOrder(String(course.order))
      setStatus(STATUS_MAP_REVERSE[course.statusRaw])
    }
  }, [course])

  useEffect(() => {
    if (course && universities.length > 0 && !universityName) {
      const u = universities.find((x) => x.id === course.universityId)
      if (u) setUniversityName(u.name)
    }
  }, [course, universities, universityName])

  useEffect(() => {
    if (course && colleges.length > 0 && !collegeName) {
      const c = colleges.find((x) => x.id === course.collegeId)
      if (c) setCollegeName(c.name)
    }
  }, [course, colleges, collegeName])

  useEffect(() => {
    if (course && specializations.length > 0 && !specializationName) {
      const s = specializations.find((x) => x.id === course.specializationId)
      if (s) setSpecializationName(s.name)
    }
  }, [course, specializations, specializationName])

  useEffect(() => {
    if (course && stages.length > 0 && !stageName) {
      const s = stages.find((x) => x.id === course.stageId)
      if (s) setStageName(s.name)
    }
  }, [course, stages, stageName])

  useEffect(() => {
    if (course && terms.length > 0 && !termName) {
      const t = terms.find((x) => x.id === course.termId)
      if (t) setTermName(t.name)
    }
  }, [course, terms, termName])

  if (!id) return null

  const academicComplete = university && college && specialization && stage && term

  const handleConfirm = async () => {
    if (!academicComplete) return
    setSubmitting(true)
    setSubmitError(null)
    try {
      let coverFileId = course?.coverFileId ?? undefined
      if (coverFile) {
        coverFileId = (await uploadFile(coverFile)).fileId
      }
      await updateCourse(id, {
        name,
        description,
        price: Number(price) || 0,
        isFree,
        order: Number(order) || 0,
        coverFileId,
        status: STATUS_MAP[status],
        universityId: university!.id,
        collegeId: college!.id,
        specializationId: specialization!.id,
        stageId: stage!.id,
        termId: term!.id,
      })
      onDataChanged()
      navigate(-1)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'حدث خطأ، حاول مرة أخرى')
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await deleteCourse(id)
      onDataChanged()
      navigate('/courses')
    } catch (err) {
      setConfirmingDelete(false)
      setDeleting(false)
      setSubmitError(err instanceof Error ? err.message : 'حدث خطأ أثناء الحذف')
    }
  }

  return (
    <>
    <Modal
      title={M.title}
      width={560}
      actions={
        <>
          <ModalButton variant="cancel">{M.cancel}</ModalButton>
          <ModalButton
            onClick={handleConfirm}
            disabled={submitting || !name.trim() || !course || !academicComplete}
          >
            {submitting ? '...جاري الحفظ' : M.submit}
          </ModalButton>
        </>
      }
    >
      {loading ? (
        <CardSkeleton />
      ) : error || !course ? (
        <ErrorState description={error ?? 'تعذر العثور على الكورس'} />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4">
            <ModalSelect
              label="الجامعة"
              options={universities.map((u) => u.name)}
              value={universityName}
              onChange={(v) => {
                setUniversityName(v)
                setCollegeName('')
                setSpecializationName('')
                setStageName('')
                setTermName('')
              }}
            />
            <ModalSelect
              label="الكلية"
              options={colleges.map((c) => c.name)}
              value={collegeName}
              onChange={(v) => {
                setCollegeName(v)
                setSpecializationName('')
                setStageName('')
                setTermName('')
              }}
            />
            <ModalSelect
              label="التخصص"
              options={specializations.map((s) => s.name)}
              value={specializationName}
              onChange={(v) => {
                setSpecializationName(v)
                setStageName('')
                setTermName('')
              }}
            />
            <ModalSelect
              label="المرحلة"
              options={stages.map((s) => s.name)}
              value={stageName}
              onChange={(v) => {
                setStageName(v)
                setTermName('')
              }}
            />
            <ModalSelect
              label="الترم"
              options={terms.map((t) => t.name)}
              value={termName}
              onChange={setTermName}
            />
          </div>

          <ModalField label="اسم الكورس" value={name} onChange={setName} />
          <ModalTextArea
            label="وصف الكورس"
            value={description}
            onChange={setDescription}
            rows={3}
          />

          <div className="grid grid-cols-2 gap-4">
            <ModalField
              label="السعر"
              value={price}
              onChange={setPrice}
              type="number"
              mono
            />
            <ModalSelect
              label="نوع الكورس"
              options={['مدفوع', 'مجاني']}
              value={isFree ? 'مجاني' : 'مدفوع'}
              onChange={(v) => setIsFree(v === 'مجاني')}
            />
          </div>

          <div className="flex w-full flex-col items-start gap-1.5">
            <span className="text-sm font-bold text-ink">صورة الكورس</span>
            {course.coverFileId && !coverFile ? (
              <div className="flex w-full items-center gap-3 rounded-ctl border border-line bg-surface p-2">
                <img
                  src={uploadUrl(course.coverFileId)}
                  alt={course.name}
                  className="size-16 shrink-0 rounded-ctl object-cover"
                />
                <span className="text-2xs text-muted">الصورة الحالية — اختر ملف جديد لاستبدالها</span>
              </div>
            ) : null}
            <label className="w-full cursor-pointer">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)}
              />
              <UploadDrop
                title={coverFile ? coverFile.name : 'اسحب صورة جديدة أو تصفح الملفات'}
                hint="اسحب الصورة أو تصفح الملفات"
                height={90}
              />
            </label>
          </div>

          <ModalField
            label="ترتيب الكورس"
            value={order}
            onChange={setOrder}
            type="number"
            mono
          />

          <ModalSelect
            label={M.statusLabel}
            options={[...M.statusOptions]}
            value={status}
            onChange={(v) => setStatus(v as keyof typeof STATUS_MAP)}
          />

          <ModalDangerZone label="حذف الكورس" onClick={() => setConfirmingDelete(true)} />
          {submitError ? <p className="text-sm font-bold text-danger">{submitError}</p> : null}
        </>
      )}
    </Modal>
    {confirmingDelete ? (
      <ConfirmDeleteModal
        message="هل أنت متأكد من حذف هذا الكورس؟ العملية لا يمكن التراجع عنها."
        submitting={deleting}
        onClose={() => setConfirmingDelete(false)}
        onConfirm={handleDelete}
      />
    ) : null}
    </>
  )
}
