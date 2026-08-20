import { Page } from '@/components/layout/Page'
import { POLICIES_PAGE_TITLE, POLICY_TERMS } from '@/data/content'
import { PolicyEditor, PolicyTabs } from './content-parts'

/** فيجما frame: v3-policy-terms (node 45:137) */
export default function PolicyTerms() {
  return (
    <Page title={POLICIES_PAGE_TITLE}>
      <PolicyTabs />
      <PolicyEditor doc={POLICY_TERMS} />
    </Page>
  )
}
