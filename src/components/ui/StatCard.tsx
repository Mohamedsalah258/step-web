import { ArrowUp, ArrowDown, BarChart3, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/cn'

export type Stat = {
  label: string
  value: string
  note?: string
  noteTone?: 'muted' | 'success' | 'danger' | 'warning'
  trend?: 'up' | 'down'
  icon?: LucideIcon
  /** الأرقام اللي فيها عملة/تاريخ بتستخدم Spline Sans Mono */
  mono?: boolean
}

const NOTE_TONE = {
  muted: 'text-muted',
  success: 'text-success',
  danger: 'text-danger',
  warning: 'text-warning',
} as const

/**
 * كارت KPI — فيجما node 7:21:
 * h140، p16، gap12، radius12، bg أبيض، border #e5e9f2، shadow card.
 * RTL: العنوان يمين والأيقونة شمال، والرقم متراصّ يمين.
 */
export function StatCard({ stat }: { stat: Stat }) {
  const Icon = stat.icon ?? BarChart3
  const Trend = stat.trend === 'down' ? ArrowDown : ArrowUp
  const tone = NOTE_TONE[stat.noteTone ?? 'muted']

  return (
    <div className="flex h-auto min-h-[120px] min-w-[200px] max-w-full flex-1 flex-col gap-3 rounded-card border border-line bg-white p-4 shadow-card">
      <div className="flex items-center justify-between gap-2">
        <p className="truncate text-right text-sm font-normal text-muted">
          {stat.label}
        </p>
        <Icon className="size-4 shrink-0 text-brand" strokeWidth={2} />
      </div>
      <p
        className={cn(
          'w-full text-right text-3xl leading-tight text-ink',
          stat.mono ? 'num font-bold' : 'font-extrabold',
        )}
      >
        {stat.value}
      </p>
      {/* justify-start في RTL = دفع لليمين */}
      <div className="mt-auto flex items-center justify-start gap-1">
        {stat.note ? (
          <p className={cn('whitespace-nowrap text-2xs font-normal', tone)}>
            {stat.note}
          </p>
        ) : null}
        {stat.trend ? (
          <Trend className={cn('size-3 shrink-0', tone)} strokeWidth={2.5} />
        ) : null}
      </div>
    </div>
  )
}

/**
 * صف كروت KPI — gap16 (فيجما node 7:20). أول عنصر = يمين.
 * flex-wrap بدل grid ثابت الأعمدة عشان لو عدد الكروت مش قابل للقسمة
 * على عدد الأعمدة (زي 6 كروت في الداشبورد)، آخر صف يمتلئ بالكامل
 * (كل كارت بياخد نصيبه من المساحة الفاضية) بدل ما يسيب فراغ.
 */
export function StatRow({ stats }: { stats: Stat[] }) {
  return (
    <div className="flex w-full flex-wrap gap-4">
      {stats.map((s) => (
        <StatCard key={s.label} stat={s} />
      ))}
    </div>
  )
}
