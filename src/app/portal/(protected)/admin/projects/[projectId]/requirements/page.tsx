'use client'

import { PortalSection } from '@/components/portal/PortalSection'
import { useProject } from '@/components/portal/ProjectProvider'
import { RequirementAdminList } from '@/components/portal/admin/RequirementAdminList'
import { RequirementForm } from '@/components/portal/admin/RequirementForm'
import { PageHeader } from '@/components/portal/shell/PageHeader'
import { PortalPage } from '@/components/portal/shell/PortalPage'
import { PortalLoading } from '@/components/portal/shell/PortalStatus'
import { requirementRequestsCol } from '@/lib/portal/firestore'
import { useColSnapshot } from '@/lib/portal/hooks'

export default function AdminProjectRequirementsPage() {
  const { projectId } = useProject()

  const { data: requests } = useColSnapshot(
    () => requirementRequestsCol(projectId),
    [projectId],
  )

  return (
    <PortalPage>
      <PageHeader
        title="Requirements"
        description="What I am waiting on. The client marks each one sent; the value itself never touches the portal."
      />
      {requests === null ? (
        <PortalLoading />
      ) : (
        <RequirementAdminList projectId={projectId} requests={requests} />
      )}
      <div className="mt-10">
        <PortalSection title="Request something from the client">
          <RequirementForm projectId={projectId} />
        </PortalSection>
      </div>
    </PortalPage>
  )
}
