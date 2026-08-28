import { useState } from 'react'
import { ShieldAlert } from 'lucide-react'
import { useParams } from 'react-router-dom'
import { Page } from '@/components/layout/Page'
import { IconBubble } from '@/components/ui/Misc'
import { Modal, ModalButton, ModalNotice } from '@/components/ui/Modal'
import { useAsync } from '@/lib/useAsync'
import { banStudent, getStudentDetail } from '@/api/students'
import { BAN_MODAL_TEXT, STUDENTS_TITLE } from '@/data/students'
import { SpecPlate, StudentDetailBody, type StudentDetailOutletContext } from './students-parts'

/** الشِل المشترك بين v3-student-detail (28:750) ونسخته بدون مودال (35:7124) */
export function StudentDetailShell() {
  const { id } = useParams<{ id: string }>()
  const [ban, setBan] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  // ⚠️ ده fetch منفصل عن اللي جوّه StudentDetailBody (مفيش cache مشترك
  // زي react-query دلوقتي) — بس محتاجينه هنا عشان specs مودال الحظر.
  // تحسين مستقبلي معقول: نقل الـ fetch لمستوى واحد أعلى ونمرر الداتا لتحت.
  const { data: student, reload } = useAsync(() => getStudentDetail(id!), [id])
  // بيتزوّد كل ما مودال متفرّع (device-reset/cancel-sub/open-course/unban)
  // ينجح — بيتبعت لـ StudentDetailBody كـ dependency لإعادة جلب هادية
  // (من غير remount بالـ key زي قبل كده، وده كان بيسبب فلاش واضح للمستخدم).
  const [refreshKey, setRefreshKey] = useState(0)
  const outletContext: StudentDetailOutletContext = {
    onDataChanged: () => setRefreshKey((k) => k + 1),
  }

  if (!id) return null

  const handleConfirmBan = async () => {
    setSubmitting(true)
    setSubmitError(null)
    try {
      await banStudent(id)
      setBan(false)
      reload()
      outletContext.onDataChanged()
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'حدث خطأ، حاول مرة أخرى')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Page title={STUDENTS_TITLE} outletContext={outletContext}>
      <StudentDetailBody studentId={id} onBan={() => setBan(true)} refreshKey={refreshKey} />

      {/* modal-overlay — node 28:946 */}
      {ban ? (
        <Modal
          title={BAN_MODAL_TEXT.title}
          width={480}
          onClose={() => setBan(false)}
          actions={
            <>
              <ModalButton variant="cancel" onClick={() => setBan(false)}>
                {BAN_MODAL_TEXT.cancel}
              </ModalButton>
              <ModalButton tone="danger" onClick={handleConfirmBan} disabled={submitting}>
                {submitting ? '...جاري التنفيذ' : BAN_MODAL_TEXT.confirm}
              </ModalButton>
            </>
          }
        >
          <div className="flex w-full justify-center">
            <IconBubble tone="danger" size={56}>
              <ShieldAlert className="size-7" strokeWidth={2} />
            </IconBubble>
          </div>
          <ModalNotice tone="danger">
            <span className="mb-2 block text-base font-extrabold">
              {BAN_MODAL_TEXT.noticeTitle}
            </span>
            {BAN_MODAL_TEXT.noticeBody}
          </ModalNotice>
          {student ? (
            <SpecPlate
              rows={[
                { label: 'الطالب المستهدف:', value: student.name },
                { label: 'البريد الإلكتروني:', value: student.email, num: true },
                { label: 'الجهاز المحظور:', value: student.device?.model ?? 'لا يوجد جهاز' },
              ]}
            />
          ) : null}
          {submitError ? <p className="text-sm font-bold text-danger">{submitError}</p> : null}
        </Modal>
      ) : null}
    </Page>
  )
}

/** فيجما frame: v3-student-detail (node 28:750) — مودال الحظر بيفتح بالضغط بس */
export default function StudentDetail() {
  return <StudentDetailShell />
}
