import { Outlet } from 'react-router-dom'
import { TopBar } from './TopBar'
import { cn } from '@/lib/cn'

type Props = {
  title: string
  actions?: React.ReactNode
  children: React.ReactNode
  /** بدون padding داخلي لو الصفحة عايزة تتحكم بنفسها */
  bare?: boolean
  className?: string
}

/**
 * غلاف موحّد: top-bar + content-body (p24, gap24) — فيجما node 7:19.
 *
 * الـ <Outlet /> في الآخر هو اللي بيرسم المودالز المتفرّعة من مسار الصفحة
 * (كل مودال في فيجما = فريم فوق شاشته الأصلية = child route هنا).
 */
export function Page({ title, actions, children, bare, className }: Props) {
  return (
    <>
      <TopBar title={title} actions={actions} />
      <div
        className={cn(
          'flex min-h-0 flex-1 flex-col',
          !bare && 'gap-4 p-3 sm:p-4 md:gap-5 md:p-5 lg:gap-6 lg:p-6',
          className,
        )}
      >
        {children}
      </div>
      <Outlet />
    </>
  )
}
