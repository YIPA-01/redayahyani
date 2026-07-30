'use client'

import { orderBy, query } from 'firebase/firestore'

import { MessageThread } from '@/components/portal/MessageThread'
import { useProject } from '@/components/portal/ProjectProvider'
import { PageHeader } from '@/components/portal/shell/PageHeader'
import { PortalPage } from '@/components/portal/shell/PortalPage'
import { PortalLoading } from '@/components/portal/shell/PortalStatus'
import { messagesCol } from '@/lib/portal/firestore'
import { useColSnapshot } from '@/lib/portal/hooks'

export default function ProjectMessagesPage() {
  const { projectId } = useProject()

  const { data: messages } = useColSnapshot(
    () => query(messagesCol(projectId), orderBy('createdAt', 'asc')),
    [projectId],
  )

  return (
    <PortalPage width="prose">
      <PageHeader
        title="Messages"
        description="A direct line to me, kept with the project rather than lost in email."
      />
      {messages === null ? (
        <PortalLoading />
      ) : (
        <MessageThread projectId={projectId} messages={messages} />
      )}
    </PortalPage>
  )
}
