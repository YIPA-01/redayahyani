'use client'

import { orderBy, query } from 'firebase/firestore'

import { PortalSection } from '@/components/portal/PortalSection'
import { useProject } from '@/components/portal/ProjectProvider'
import { PublicProfileForm } from '@/components/portal/admin/PublicProfileForm'
import { PublicUpdateForm } from '@/components/portal/admin/PublicUpdateForm'
import { PageHeader } from '@/components/portal/shell/PageHeader'
import { PortalPage } from '@/components/portal/shell/PortalPage'
import { publicUpdatesCol } from '@/lib/portal/firestore'
import { useColSnapshot } from '@/lib/portal/hooks'

export default function AdminProjectPublicPage() {
  const { projectId, profile } = useProject()

  const { data: updates } = useColSnapshot(
    () => query(publicUpdatesCol(projectId), orderBy('publishedAt', 'desc')),
    [projectId],
  )

  return (
    <PortalPage>
      <PageHeader
        title="Public face"
        description="The only part of this project anyone outside it can ever see. Nothing here is private, so keep client specifics out."
      />
      <PortalSection title="Profile">
        <PublicProfileForm projectId={projectId} profile={profile} />
      </PortalSection>
      <div className="mt-10">
        <PortalSection title="Journal">
          <PublicUpdateForm projectId={projectId} updates={updates ?? []} />
        </PortalSection>
      </div>
    </PortalPage>
  )
}
