import { Page } from '@/components/layout/Page'
import { POLICIES_PAGE_TITLE, POLICY_REFUND } from '@/data/content'
import { PolicyEditor, PolicyTabs } from './content-parts'

/** فيجما frame: v3-policy-refund (node 45:5) */
export default function PolicyRefund() {
  return (
    <Page title={POLICIES_PAGE_TITLE}>
      <PolicyTabs />
      <PolicyEditor doc={POLICY_REFUND} />
    </Page>
  )
}
