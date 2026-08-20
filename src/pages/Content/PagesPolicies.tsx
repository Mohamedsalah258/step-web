import { Page } from '@/components/layout/Page'
import { POLICIES_PAGE_TITLE, POLICY_PRIVACY } from '@/data/content'
import { PolicyEditor, PolicyTabs } from './content-parts'

/** فيجما frame: v3-pages-policies (node 7:2382) — تاب سياسة الخصوصية */
export default function PagesPolicies() {
  return (
    <Page title={POLICIES_PAGE_TITLE}>
      <PolicyTabs />
      <PolicyEditor doc={POLICY_PRIVACY} />
    </Page>
  )
}
