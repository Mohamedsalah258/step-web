import { Page } from '@/components/layout/Page'
import { Card } from '@/components/ui/Card'
import { ErrorState } from '@/components/ui/States'
import { STATE_ERROR } from '@/data/content'

/** فيجما frame: v3-state-error (node 29:1768) */
export default function StateError() {
  return (
    <Page title={STATE_ERROR.pageTitle}>
      {/* data-table-card — node 29:1782: حالة الخطأ في منتصف الكارت */}
      <Card className="flex w-full flex-1 flex-col items-center justify-center overflow-hidden">
        <ErrorState
          title={STATE_ERROR.title}
          description={STATE_ERROR.description}
          className="pb-4"
        />
        <p className="mono pb-16 text-2xs text-muted">{STATE_ERROR.code}</p>
      </Card>
    </Page>
  )
}
