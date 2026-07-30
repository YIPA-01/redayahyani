'use client'

import { orderBy, query } from 'firebase/firestore'

import { DocumentList } from '@/components/portal/DocumentList'
import { useProject } from '@/components/portal/ProjectProvider'
import { PageHeader } from '@/components/portal/shell/PageHeader'
import { PortalPage } from '@/components/portal/shell/PortalPage'
import { PortalLoading } from '@/components/portal/shell/PortalStatus'
import { documentsCol } from '@/lib/portal/firestore'
import { useColSnapshot } from '@/lib/portal/hooks'

export default function AdminProjectDocumentsPage() {
  const { projectId } = useProject()

  const { data: documents } = useColSnapshot(
    () => query(documentsCol(projectId), orderBy('uploadedAt', 'desc')),
    [projectId],
  )

  return (
    <PortalPage>
      <PageHeader
        title="Documents"
        description="What is on the record for this project. Uploads arrive in a later phase."
      />
      {documents === null ? (
        <PortalLoading />
      ) : (
        <DocumentList documents={documents} />
      )}
    </PortalPage>
  )
}
