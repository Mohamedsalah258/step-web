import { Page } from '@/components/layout/Page'
import { CardSkeleton, ErrorState } from '@/components/ui/States'
import { useAsync } from '@/lib/useAsync'
import { getPolicy, updatePolicy } from '@/api/policies'
import { POLICIES_PAGE_TITLE } from '@/data/content'
import { PolicyEditor, PolicyTabs } from './content-parts'

export default function PolicyDeletion() {
  const { data: doc, loading, error, reload } = useAsync(() => getPolicy('deletion'), [])

  return (
    <Page title={POLICIES_PAGE_TITLE}>
      <PolicyTabs />
      {loading && !doc ? (
        <CardSkeleton />
      ) : error || !doc ? (
        <ErrorState description={error ?? 'تعذر تحميل الصفحة'} onRetry={reload} />
      ) : (
        <PolicyEditor
          doc={doc}
          onSave={async (heading, content) => {
            await updatePolicy('deletion', { heading, content })
            reload()
          }}
        />
      )}
    </Page>
  )
}
