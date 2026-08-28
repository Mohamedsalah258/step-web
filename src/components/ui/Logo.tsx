import logoIcon from '@/assets/logo-icon.png'
import { cn } from '@/lib/cn'

/** علامة STEP (الشريط الأزرق) — بديل أيقونة GraduationCap القديمة. */
export function Logo({ className }: { className?: string }) {
  return <img src={logoIcon} alt="STEP" className={cn('object-contain', className)} />
}
