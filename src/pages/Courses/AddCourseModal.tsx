import {
  Modal,
  ModalButton,
  ModalField,
  ModalSelect,
  ModalTextArea,
} from '@/components/ui/Modal'
import { ADD_COURSE_MODAL as M } from '@/data/courses'
import { UploadDrop } from './courses-parts'

/** فيجما frame: v3-add-course-modal (node 29:1119) — modal node 29:1206، عرض 560 */
export default function AddCourseModal() {
  return (
    <Modal
      title={M.title}
      width={560}
      actions={
        <>
          <ModalButton variant="cancel">{M.cancel}</ModalButton>
          <ModalButton>{M.submit}</ModalButton>
        </>
      }
    >
      {/* الهيكل الأكاديمي — 5 دروب داونز */}
      <div className="grid grid-cols-2 gap-4">
        <ModalSelect label="الجامعة" options={M.universities} />
        <ModalSelect label="الكلية" options={M.colleges} />
        <ModalSelect label="التخصص" options={M.majors} />
        <ModalSelect label="المرحلة" options={M.stages} />
        <ModalSelect label="الترم" options={M.terms} />
      </div>

      <ModalField label={M.nameLabel} placeholder={M.namePlaceholder} />
      <ModalTextArea
        label={M.descLabel}
        placeholder={M.descPlaceholder}
        rows={3}
      />

      <div className="grid grid-cols-2 gap-4">
        <ModalField label={M.priceLabel} value={M.priceValue} mono />
        <ModalSelect label={M.typeLabel} options={M.typeOptions} />
      </div>

      <div className="flex w-full flex-col items-end gap-1.5">
        <span className="text-sm font-bold text-ink">{M.coverLabel}</span>
        <UploadDrop title={M.coverLabel} hint={M.coverHint} height={110} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <ModalField
          label={M.orderLabel}
          placeholder={M.orderPlaceholder}
          type="number"
          mono
        />
        <ModalSelect label={M.statusLabel} options={M.statusOptions} />
      </div>
    </Modal>
  )
}
