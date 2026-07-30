'use client'

import { orderBy, query } from 'firebase/firestore'

import { PortalSection } from '@/components/portal/PortalSection'
import { useProject } from '@/components/portal/ProjectProvider'
import { AdminMilestoneList } from '@/components/portal/admin/AdminMilestoneList'
import { MilestoneForm } from '@/components/portal/admin/MilestoneForm'
import { PageHeader } from '@/components/portal/shell/PageHeader'
import { PortalPage } from '@/components/portal/shell/PortalPage'
import { PortalLoading } from '@/components/portal/shell/PortalStatus'
import { milestonesCol } from '@/lib/portal/firestore'
import { useColSnapshot } from '@/lib/portal/hooks'

export default function AdminProjectMilestonesPage() {
  const { projectId } = useProject()

  const { data: milestones } = useColSnapshot(
    () => query(milestonesCol(projectId), orderBy('dueDate', 'asc')),
    [projectId],
  )

  return (
    <PortalPage>
      <PageHeader
        title="Milestones"
        description="The plan the client sees. Changing a status here updates their view immediately."
      />
      {milestones === null ? (
        <PortalLoading />
      ) : (
        <AdminMilestoneList projectId={projectId} milestones={milestones} />
      )}
      <div className="mt-10">
        <PortalSection title="Add a milestone">
          <MilestoneForm projectId={projectId} />
        </PortalSection>
      </div>
    </PortalPage>
  )
}
