/**
 * سويتش — track 44x24، knob 16px.
 * RTL: المقبض يبدأ على اليمين ويتحرك لليسار عند التشغيل.
 * (بنستخدم right/translateX الفيزيائية عشان الاتجاه يبقى مضبوط.)
 */
export function Switch({
  defaultOn,
  onChange,
}: {
  defaultOn?: boolean
  onChange?: (on: boolean) => void
}) {
  return (
    <label className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center">
      <input
        type="checkbox"
        defaultChecked={defaultOn}
        onChange={(e) => onChange?.(e.target.checked)}
        className="peer sr-only"
      />
      <span className="absolute inset-0 rounded-full bg-line transition-colors peer-checked:bg-brand" />
      <span className="absolute right-1 size-4 rounded-full bg-white shadow-sm transition-transform peer-checked:-translate-x-5" />
    </label>
  )
}
