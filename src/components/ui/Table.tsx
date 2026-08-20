import { cn } from '@/lib/cn'

export type Column<T> = {
  key: string
  header: string
  /** عرض ثابت بالبكسل — في الديزاين معظم الأعمدة 180px والعمود المرن flex */
  width?: number
  flex?: boolean
  /** right = افتراضي (زي الديزاين) | left | center */
  align?: 'right' | 'left' | 'center'
  render: (row: T, index: number) => React.ReactNode
}

type Props<T> = {
  columns: Column<T>[]
  rows: T[]
  rowKey: (row: T, index: number) => string
  empty?: React.ReactNode
  className?: string
}

const ALIGN_TEXT = {
  right: 'text-right',
  left: 'text-left',
  center: 'text-center',
} as const

const ALIGN_FLEX = {
  right: 'justify-start',
  left: 'justify-end',
  center: 'justify-center',
} as const

/**
 * جدول مبني بـ flex زي الديزاين (مش <table>) —
 * header bg #f5f7fb، صفوف border-b #e5e9f2، px20 py14.
 * ⚠️ RTL: أول عمود في مصفوفة columns هو أول عمود من **اليمين**.
 */
export function DataTable<T>({
  columns,
  rows,
  rowKey,
  empty,
  className,
}: Props<T>) {
  const box = (c: Column<T>) =>
    c.flex ? 'min-w-0 flex-1' : 'shrink-0'
  const style = (c: Column<T>) =>
    c.flex ? undefined : { width: c.width ?? 180 }

  return (
    <div className={cn('flex flex-col', className)}>
      {/* table-header */}
      <div className="flex items-center bg-surface px-5 py-3">
        {columns.map((c) => (
          <div
            key={c.key}
            className={cn(
              'text-sm font-bold text-muted',
              box(c),
              ALIGN_TEXT[c.align ?? 'right'],
            )}
            style={style(c)}
          >
            {c.header}
          </div>
        ))}
      </div>

      {rows.length === 0 ? (
        <div className="w-full">{empty}</div>
      ) : (
        rows.map((row, i) => (
          <div
            key={rowKey(row, i)}
            className="flex items-center border-b border-line px-5 py-3.5 transition-colors last:border-b-0 hover:bg-surface/60"
          >
            {columns.map((c) => (
              <div
                key={c.key}
                className={cn(
                  'flex items-center text-sm text-ink',
                  box(c),
                  ALIGN_FLEX[c.align ?? 'right'],
                  ALIGN_TEXT[c.align ?? 'right'],
                )}
                style={style(c)}
              >
                {c.render(row, i)}
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  )
}

/** خلية نص مقتطع */
export function Truncate({ children }: { children: React.ReactNode }) {
  return (
    <span className="block w-full overflow-hidden text-ellipsis whitespace-nowrap">
      {children}
    </span>
  )
}

/** مجموعة أزرار إجراءات في آخر عمود */
export function RowActions({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center gap-1.5">{children}</div>
}
