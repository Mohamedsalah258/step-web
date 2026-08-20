import { useState } from 'react'
import { ShieldAlert } from 'lucide-react'
import { Page } from '@/components/layout/Page'
import { IconBubble } from '@/components/ui/Misc'
import { Modal, ModalButton, ModalNotice } from '@/components/ui/Modal'
import { BAN_MODAL, STUDENTS_TITLE } from '@/data/students'
import { SpecPlate, StudentDetailBody } from './students-parts'

/** الشِل المشترك بين v3-student-detail (28:750) ونسخته بدون مودال (35:7124) */
export function StudentDetailShell() {
  const [ban, setBan] = useState(false)

  return (
    <Page title={STUDENTS_TITLE}>
      <StudentDetailBody onBan={() => setBan(true)} />

      {/* modal-overlay — node 28:946 */}
      {ban ? (
        <Modal
          title={BAN_MODAL.title}
          width={480}
          onClose={() => setBan(false)}
          actions={
            <>
              <ModalButton variant="cancel" onClick={() => setBan(false)}>
                {BAN_MODAL.cancel}
              </ModalButton>
              <ModalButton tone="danger" onClick={() => setBan(false)}>
                {BAN_MODAL.confirm}
              </ModalButton>
            </>
          }
        >
          {/* icon-alert — node 28:949 */}
          <div className="flex w-full justify-center">
            <IconBubble tone="danger" size={56}>
              <ShieldAlert className="size-7" strokeWidth={2} />
            </IconBubble>
          </div>
          <ModalNotice tone="danger">
            <span className="mb-2 block text-base font-extrabold">
              {BAN_MODAL.noticeTitle}
            </span>
            {BAN_MODAL.noticeBody}
          </ModalNotice>
          <SpecPlate rows={[...BAN_MODAL.specs]} />
        </Modal>
      ) : null}
    </Page>
  )
}

/** فيجما frame: v3-student-detail (node 28:750) — مودال الحظر بيفتح بالضغط بس */
export default function StudentDetail() {
  return <StudentDetailShell />
}
