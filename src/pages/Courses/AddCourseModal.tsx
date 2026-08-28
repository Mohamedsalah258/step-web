import { useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import {
  Modal,
  ModalButton,
  ModalField,
  ModalSelect,
  ModalTextArea,
} from '@/components/ui/Modal'
import { useAsync } from '@/lib/useAsync'
import {
  listUniversities,
  listColleges,
  listSpecializations,
  listStages,
  listTerms,
} from '@/api/academic'
import { createCourse } from '@/api/courses'
import { uploadFile } from '@/api/uploads'
import { ADD_COURSE_MODAL as M } from '@/data/courses'
import { UploadDrop } from './courses-parts'

/** فيجما frame: v3-add-course-modal (node 29:1119) — modal node 29:1206، عرض 560 */
export default function AddCourseModal() {
  const navigate = useNavigate()
  const { onDataChanged } = useOutletContext<{ onDataChanged: () => void }>()

  const [universityName, setUniversityName] = useState('')
  const [collegeName, setCollegeName] = useState('')
  const [specializationName, setSpecializationName] = useState('')
  const [stageName, setStageName] = useState('')
  const [termName, setTermName] = useState('')

  const { data: unisData } = useAsync(() => listUniversities({ limit: 200 }), [])
  const universities = unisData?.data ?? []
  const university = universities.find((u) => u.name === universityName)

  const { data: collegesData } = useAsync(
    () => listColleges({ parentId: university?.id, limit: 200 }),
    [university?.id],
  )
  const colleges = university ? (collegesData?.data ?? []) : []
  const college = colleges.find((c) => c.name === collegeName)

  const { data: specsData } = useAsync(
    () => listSpecializations({ parentId: college?.id, limit: 200 }),
    [college?.id],
  )
  const specializations = college ? (specsData?.data ?? []) : []
  const specialization = specializations.find((s) => s.name === specializationName)

  const { data: stagesData } = useAsync(
    () => listStages({ parentId: specialization?.id, limit: 200 }),
    [specialization?.id],
  )
  const stages = specialization ? (stagesData?.data ?? []) : []
  const stage = stages.find((s) => s.name === stageName)

  const { data: termsData } = useAsync(
    () => listTerms({ parentId: stage?.id, limit: 200 }),
    [stage?.id],
  )
  const terms = stage ? (termsData?.data ?? []) : []
  const term = terms.find((t) => t.name === termName)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [isFree, setIsFree] = useState(false)
  const [order, setOrder] = useState('')
  const [status, setStatus] = useState<'منشور' | 'مسوّدة'>('مسوّدة')
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const canSubmit = name.trim() && university && college && specialization && stage && term

  const handleConfirm = async () => {
    if (!canSubmit || !university || !college || !specialization || !stage || !term) return
    setSubmitting(true)
    setSubmitError(null)
    try {
      let coverFileId: string | undefined
      if (coverFile) {
        const uploaded = await uploadFile(coverFile)
        coverFileId = uploaded.fileId
      }
      await createCourse({
        name,
        description: description || undefined,
        universityId: university.id,
        collegeId: college.id,
        specializationId: specialization.id,
        stageId: stage.id,
        termId: term.id,
        price: isFree ? 0 : Number(price) || 0,
        isFree,
        coverFileId,
        order: Number(order) || 0,
        status: status === 'منشور' ? 'PUBLISHED' : 'DRAFT',
      })
      onDataChanged()
      navigate(-1)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'حدث خطأ، حاول مرة أخرى')
      setSubmitting(false)
    }
  }

  return (
    <Modal
      title={M.title}
      width={560}
      actions={
        <>
          <ModalButton variant="cancel">{M.cancel}</ModalButton>
          <ModalButton onClick={handleConfirm} disabled={submitting || !canSubmit}>
            {submitting ? '...جاري الإضافة' : M.submit}
          </ModalButton>
        </>
      }
    >
      {/* الهيكل الأكاديمي — 5 دروب داونز متتابعة، كل واحد بيصفّي اللي بعده */}
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

      <ModalField
        label={M.nameLabel}
        placeholder={M.namePlaceholder}
        value={name}
        onChange={setName}
      />
      <ModalTextArea
        label={M.descLabel}
        placeholder={M.descPlaceholder}
        rows={3}
        value={description}
        onChange={setDescription}
      />

      <div className="grid grid-cols-2 gap-4">
        <ModalField
          label={M.priceLabel}
          placeholder="0"
          type="number"
          mono
          value={price}
          onChange={setPrice}
        />
        <ModalSelect
          label={M.typeLabel}
          options={M.typeOptions}
          value={isFree ? 'مجاني' : 'مدفوع'}
          onChange={(v) => setIsFree(v === 'مجاني')}
        />
      </div>

      <div className="flex w-full flex-col items-start gap-1.5">
        <span className="text-sm font-bold text-ink">{M.coverLabel}</span>
        <label className="w-full cursor-pointer">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)}
          />
          <UploadDrop
            title={coverFile ? coverFile.name : M.coverLabel}
            hint={M.coverHint}
            height={110}
          />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <ModalField
          label={M.orderLabel}
          placeholder={M.orderPlaceholder}
          type="number"
          mono
          value={order}
          onChange={setOrder}
        />
        <ModalSelect
          label={M.statusLabel}
          options={M.statusOptions}
          value={status}
          onChange={(v) => setStatus(v as 'منشور' | 'مسوّدة')}
        />
      </div>
      {submitError ? <p className="text-sm font-bold text-danger">{submitError}</p> : null}
    </Modal>
  )
}
