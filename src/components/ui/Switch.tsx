import { cn } from '@/lib/cn'

/**
 * سويتش — track 44x24، knob 16px.
 * RTL: المقبض يبدأ على اليمين ويتحرك لليسار عند التشغيل.
 * (بنستخدم right/translateX الفيزيائية عشان الاتجاه يبقى مضبوط.)
 */
export function Switch({
  on,
  defaultOn,
  onChange,
  disabled,
}: {
  /**
   * لو اتمرر، السويتش بيبقى controlled بالكامل — القيمة المعروضة دايمًا
   * `on` مهما كانت الحالة الداخلية، وده اللي محتاجينه لما القيمة الابتدائية
   * بتوصل متأخر (بعد fetch مثلاً): من غير كده الـ checkbox بيفتكر أول
   * `defaultOn` بس وميتابعش أي تغيير تاني في الـ prop.
   */
  on?: boolean
  defaultOn?: boolean
  onChange?: (on: boolean) => void
  disabled?: boolean
}) {
  return (
    <label
      className={cn(
        'relative inline-flex h-6 w-11 shrink-0 items-center',
        disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
      )}
    >
      <input
        type="checkbox"
        disabled={disabled}
        {...(on === undefined ? { defaultChecked: defaultOn } : { checked: on })}
        onChange={(e) => onChange?.(e.target.checked)}
        className="peer sr-only"
      />
      <span className="absolute inset-0 rounded-full bg-line transition-colors peer-checked:bg-brand" />
      <span className="absolute right-1 size-4 rounded-full bg-white shadow-sm transition-transform peer-checked:-translate-x-5" />
    </label>
  )
}
