import { useNavigate, useParams } from 'react-router-dom'
import { DeviceResetModalContent } from './students-parts'

/**
 * Route wrapper لصفحة تفاصيل الطالب — من غير `onClose` بيقفل بـ navigate(-1)
 * (شوف `DeviceResetModalContent` في students-parts.tsx للمحتوى الفعلي).
 */
export default function DeviceResetModal() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  if (!id) return null
  // ملحوظة: onClose بيتنده تلقائي بعد النجاح جوّه DeviceResetModalContent،
  // فمش محتاجين onConfirmed هنا كمان (كان هيعمل navigate(-1) مرتين).
  return <DeviceResetModalContent studentId={id} onClose={() => navigate(-1)} />

}
