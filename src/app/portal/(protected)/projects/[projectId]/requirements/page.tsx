'use client'

import { useProject } from '@/components/portal/ProjectProvider'
import { RequirementList } from '@/components/portal/RequirementList'
import { PageHeader } from '@/components/portal/shell/PageHeader'
import { PortalPage } from '@/components/portal/shell/PortalPage'
import { PortalLoading } from '@/components/portal/shell/PortalStatus'
import { requirementRequestsCol } from '@/lib/portal/firestore'
import { useColSnapshot } from '@/lib/portal/hooks'

export default function ProjectRequirementsPage() {
  const { projectId } = useProject()

  const { data: requests } = useColSnapshot(
    () => requirementRequestsCol(projectId),
    [projectId],
  )

  return (
    <PortalPage>
      <PageHeader
        title="What I need from you"
        description="Anything blocking me. Send each one through the channel listed, never through the portal."
      />
      {requests === null ? (
        <PortalLoading />
      ) : (
        <RequirementList projectId={projectId} requests={requests} />
      )}
    </PortalPage>
  )
}
