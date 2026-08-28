import { useNavigate, useOutletContext, useParams } from 'react-router-dom'
import { DeviceResetModalContent, type StudentDetailOutletContext } from './students-parts'

/**
 * Route wrapper لصفحة تفاصيل الطالب — من غير `onClose` بيقفل بـ navigate(-1)
 * (شوف `DeviceResetModalContent` في students-parts.tsx للمحتوى الفعلي).
 */
export default function DeviceResetModal() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { onDataChanged } = useOutletContext<StudentDetailOutletContext>()
  if (!id) return null
  return (
    <DeviceResetModalContent
      studentId={id}
      onClose={() => navigate(-1)}
      onConfirmed={onDataChanged}
    />
  )
}
