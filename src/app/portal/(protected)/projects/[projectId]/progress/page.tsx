'use client'

import { orderBy, query } from 'firebase/firestore'

import { ProgressLog } from '@/components/portal/ProgressLog'
import { useProject } from '@/components/portal/ProjectProvider'
import { PageHeader } from '@/components/portal/shell/PageHeader'
import { PortalPage } from '@/components/portal/shell/PortalPage'
import { PortalLoading } from '@/components/portal/shell/PortalStatus'
import { progressUpdatesCol } from '@/lib/portal/firestore'
import { useColSnapshot } from '@/lib/portal/hooks'

export default function ProjectProgressPage() {
  const { projectId } = useProject()

  const { data: updates } = useColSnapshot(
    () => query(progressUpdatesCol(projectId), orderBy('createdAt', 'desc')),
    [projectId],
  )

  return (
    <PortalPage width="prose">
      <PageHeader
        title="Progress"
        description="What has moved, newest first. I post here as work lands."
      />
      {updates === null ? <PortalLoading /> : <ProgressLog updates={updates} />}
    </PortalPage>
  )
}
