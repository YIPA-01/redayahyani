'use client'

import { usePortalData } from '@/components/portal/PortalDataProvider'
import { useProject } from '@/components/portal/ProjectProvider'
import { MemberManager } from '@/components/portal/admin/MemberManager'
import { PageHeader } from '@/components/portal/shell/PageHeader'
import { PortalPage } from '@/components/portal/shell/PortalPage'

export default function AdminProjectMembersPage() {
  const { projectId, project } = useProject()
  const { users } = usePortalData()

  return (
    <PortalPage>
      <PageHeader
        title="Members"
        description="Who can see this project from the client side."
      />
      <MemberManager
        projectId={projectId}
        project={project}
        users={users ?? []}
      />
    </PortalPage>
  )
}
