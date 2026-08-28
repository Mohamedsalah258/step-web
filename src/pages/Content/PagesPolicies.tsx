import { Page } from '@/components/layout/Page'
import { CardSkeleton, ErrorState } from '@/components/ui/States'
import { useAsync } from '@/lib/useAsync'
import { getPolicy, updatePolicy } from '@/api/policies'
import { POLICIES_PAGE_TITLE } from '@/data/content'
import { PolicyEditor, PolicyTabs } from './content-parts'

/** فيجما frame: v3-pages-policies (node 7:2382) — تاب سياسة الخصوصية */
export default function PagesPolicies() {
  const { data: doc, loading, error, reload } = useAsync(() => getPolicy('privacy'), [])

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
            await updatePolicy('privacy', { heading, content })
            reload()
          }}
        />
      )}
    </Page>
  )
}
