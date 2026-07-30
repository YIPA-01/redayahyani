'use client'

import { orderBy, query } from 'firebase/firestore'

import { PortalSection } from '@/components/portal/PortalSection'
import { ProgressLog } from '@/components/portal/ProgressLog'
import { useProject } from '@/components/portal/ProjectProvider'
import { ProgressUpdateForm } from '@/components/portal/admin/ProgressUpdateForm'
import { PageHeader } from '@/components/portal/shell/PageHeader'
import { PortalPage } from '@/components/portal/shell/PortalPage'
import { PortalLoading } from '@/components/portal/shell/PortalStatus'
import { progressUpdatesCol } from '@/lib/portal/firestore'
import { useColSnapshot } from '@/lib/portal/hooks'

export default function AdminProjectProgressPage() {
  const { projectId } = useProject()

  const { data: updates } = useColSnapshot(
    () => query(progressUpdatesCol(projectId), orderBy('createdAt', 'desc')),
    [projectId],
  )

  return (
    <PortalPage width="prose">
      <PageHeader
        title="Progress"
        description="The private log. Post here as work lands so the client is never guessing."
      />
      {updates === null ? <PortalLoading /> : <ProgressLog updates={updates} />}
      <div className="mt-10">
        <PortalSection title="Post an update">
          <ProgressUpdateForm projectId={projectId} />
        </PortalSection>
      </div>
    </PortalPage>
  )
}
