import { Page } from '@/components/layout/Page'
import { CardSkeleton, ErrorState } from '@/components/ui/States'
import { useAsync } from '@/lib/useAsync'
import { getPolicy, updatePolicy } from '@/api/policies'
import { POLICIES_PAGE_TITLE } from '@/data/content'
import { PolicyEditor, PolicyTabs } from './content-parts'

/** فيجما frame: v3-policy-terms (node 45:137) */
export default function PolicyTerms() {
  const { data: doc, loading, error, reload } = useAsync(() => getPolicy('terms'), [])

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
            await updatePolicy('terms', { heading, content })
            reload()
          }}
        />
      )}
    </Page>
  )
}
