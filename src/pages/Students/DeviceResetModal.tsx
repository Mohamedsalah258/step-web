import { DeviceResetModalContent } from './students-parts'

/**
 * Route wrapper لصفحة تفاصيل الطالب — من غير `onClose` بيقفل بـ navigate(-1)
 * (شوف `DeviceResetModalContent` في students-parts.tsx للمحتوى الفعلي).
 */
export default function DeviceResetModal() {
  return <DeviceResetModalContent />
}
