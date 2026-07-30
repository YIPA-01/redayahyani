'use client'

import { orderBy, query } from 'firebase/firestore'

import { MilestoneList } from '@/components/portal/MilestoneList'
import { useProject } from '@/components/portal/ProjectProvider'
import { PageHeader } from '@/components/portal/shell/PageHeader'
import { PortalPage } from '@/components/portal/shell/PortalPage'
import { PortalLoading } from '@/components/portal/shell/PortalStatus'
import { milestonesCol } from '@/lib/portal/firestore'
import { useColSnapshot } from '@/lib/portal/hooks'

export default function ProjectMilestonesPage() {
  // The project doc is already loaded by the layout, so there is no ready
  // flag and no access check to repeat here.
  const { projectId } = useProject()

  const { data: milestones } = useColSnapshot(
    () => query(milestonesCol(projectId), orderBy('dueDate', 'asc')),
    [projectId],
  )

  return (
    <PortalPage>
      <PageHeader
        title="Milestones"
        description="What I am delivering and when. I keep this current as the work moves."
      />
      {milestones === null ? (
        <PortalLoading />
      ) : (
        <MilestoneList milestones={milestones} />
      )}
    </PortalPage>
  )
}
