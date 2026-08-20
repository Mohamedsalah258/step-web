import { cn } from '@/lib/cn'

/* ============================================================
   شارتس مرسومة بـ SVG/CSS مطابقة للديزاين (بدون مكتبات خارجية)
   مصدر الأبعاد: فيجما nodes 7:76 / 7:102 / 7:130
   ============================================================ */

/** لاين شارت — 4 خطوط شبكة أفقية، خط أزرق سماكة 3، نقاط 6px */
export function LineChart({
  points,
  labels,
  height = 130,
  className,
}: {
  /** قيم من 0 لـ 100 (0 = أسفل) */
  points: number[]
  labels: string[]
  height?: number
  className?: string
}) {
  const w = 300
  const pad = 8
  const coords = points.map((p, i) => {
    const x = pad + (i * (w - pad * 2)) / Math.max(points.length - 1, 1)
    const y = height - pad - (p / 100) * (height - pad * 2)
    return [x, y] as const
  })
  const path = coords
    .map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`)
    .join(' ')

  return (
    <div className={cn('flex min-h-0 flex-1 flex-col justify-between', className)}>
      <svg
        viewBox={`0 0 ${w} ${height}`}
        preserveAspectRatio="none"
        className="w-full"
        style={{ height }}
        role="img"
        aria-label="مخطط خطي"
      >
        {[0, 1, 2, 3].map((i) => (
          <line
            key={i}
            x1={0}
            x2={w}
            y1={(i * (height - 10)) / 3}
            y2={(i * (height - 10)) / 3}
            stroke="#e5e9f2"
            strokeWidth={1}
          />
        ))}
        <path
          d={path}
          fill="none"
          stroke="#2347e8"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
        {coords.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={3} fill="#2347e8" />
        ))}
      </svg>
      {/* x-axis — dir=ltr عشان ترتيب المصفوفة = الترتيب البصري من الشمال لليمين
          (زي ما هو في فيجما node 7:93، ومطابق لإحداثيات الـ SVG) */}
      <div
        dir="ltr"
        className="flex w-full items-start justify-between whitespace-nowrap text-2xs font-normal text-muted"
      >
        {labels.map((l) => (
          <span key={l}>{l}</span>
        ))}
      </div>
    </div>
  )
}

/** أعمدة أفقية — track #f5f7fb h8 radius4، fill #2347e8 (فيجما 7:103) */
export function HBarChart({
  items,
  className,
}: {
  items: Array<{ label: string; value: number }>
  className?: string
}) {
  const max = Math.max(...items.map((i) => i.value), 1)
  return (
    <div className={cn('flex min-h-0 flex-1 flex-col gap-2.5', className)}>
      {/* RTL: العنوان يمين، ثم الشريط، ثم الرقم على الشمال (فيجما node 7:103) */}
      {items.map((it) => (
        <div key={it.label} className="flex w-full items-center gap-2">
          <p className="w-[90px] shrink-0 overflow-hidden text-ellipsis whitespace-nowrap text-right text-2xs font-normal text-ink">
            {it.label}
          </p>
          <div className="flex h-2 min-w-0 flex-1 overflow-hidden rounded bg-surface">
            <div
              className="h-full rounded bg-brand"
              style={{ width: `${(it.value / max) * 100}%` }}
            />
          </div>
          <p className="num w-[30px] shrink-0 text-2xs font-normal text-muted">
            {it.value}
          </p>
        </div>
      ))}
    </div>
  )
}

/** أعمدة رأسية — عرض 16، radius أعلى 4، gap16 (فيجما 7:130) */
export function VBarChart({
  items,
  className,
  maxHeight = 130,
}: {
  items: Array<{ label: string; value: number }>
  className?: string
  maxHeight?: number
}) {
  const max = Math.max(...items.map((i) => i.value), 1)
  return (
    <div
      dir="ltr"
      className={cn(
        'flex min-h-0 flex-1 items-end justify-center gap-4',
        className,
      )}
    >
      {items.map((it) => (
        <div
          key={it.label}
          className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2"
        >
          <div
            className="w-4 shrink-0 rounded-t bg-brand"
            style={{ height: Math.max((it.value / max) * maxHeight, 4) }}
          />
          <p className="whitespace-nowrap text-2xs font-normal text-muted">
            {it.label}
          </p>
        </div>
      ))}
    </div>
  )
}

/** دونات بسيطة للتقارير */
export function DonutChart({
  segments,
  size = 160,
  thickness = 22,
  centerLabel,
  centerValue,
}: {
  segments: Array<{ label: string; value: number; color: string }>
  size?: number
  thickness?: number
  centerLabel?: string
  centerValue?: string
}) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1
  const r = (size - thickness) / 2
  const c = 2 * Math.PI * r
  let offset = 0

  return (
    <div className="flex items-center gap-6">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="#f5f7fb"
            strokeWidth={thickness}
          />
          {segments.map((s) => {
            const len = (s.value / total) * c
            const el = (
              <circle
                key={s.label}
                cx={size / 2}
                cy={size / 2}
                r={r}
                fill="none"
                stroke={s.color}
                strokeWidth={thickness}
                strokeDasharray={`${len} ${c - len}`}
                strokeDashoffset={-offset}
                strokeLinecap="butt"
              />
            )
            offset += len
            return el
          })}
        </svg>
        {centerValue ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="num text-xl font-extrabold text-ink">
              {centerValue}
            </span>
            {centerLabel ? (
              <span className="text-2xs text-muted">{centerLabel}</span>
            ) : null}
          </div>
        ) : null}
      </div>
      <div className="flex flex-col gap-2.5">
        {segments.map((s) => (
          <div key={s.label} className="flex items-center gap-2">
            <span className="num text-sm font-bold text-ink">{s.value}</span>
            <span className="text-sm text-muted">{s.label}</span>
            <span
              className="size-2.5 shrink-0 rounded-sm"
              style={{ background: s.color }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
