'use client'

// Loads one project for a whole section subtree. Living in the project
// layout means the listener survives navigation between sections, and the
// access and loading states are owned in one place.
//
// Gating children here also preserves the old single-page behaviour of one
// clean permission error instead of one per subcollection: section pages
// never mount until the project document has resolved.

import { createContext, useContext } from 'react'

import { Button } from '@/components/Button'
import { PortalLoading } from '@/components/portal/shell/PortalStatus'
import {
  projectRef,
  publicProfileRef,
  type WithId,
} from '@/lib/portal/firestore'
import { useDocSnapshot } from '@/lib/portal/hooks'
import type { ProjectDoc, PublicProfileDoc } from '@/lib/portal/types'

type ProjectContextValue = {
  projectId: string
  // Non-nullable by construction: children only mount once it resolved.
  project: WithId<ProjectDoc>
  // undefined while loading, null when the project has no public face.
  profile: WithId<PublicProfileDoc> | null | undefined
}

const ProjectContext = createContext<ProjectContextValue | null>(null)

export function useProject() {
  const value = useContext(ProjectContext)
  if (!value) {
    throw new Error('useProject must be used inside a ProjectProvider')
  }
  return value
}

export function ProjectProvider({
  projectId,
  deniedTitle,
  backHref,
  backLabel,
  children,
}: {
  projectId: string
  deniedTitle: string
  backHref: string
  backLabel: string
  children: React.ReactNode
}) {
  const { data: project, error } = useDocSnapshot(
    () => projectRef(projectId),
    [projectId],
  )

  // The phase badge belongs to the header on several sections, so the public
  // profile is loaded here too. Everything else stays on its own page.
  const ready = Boolean(project)
  const { data: profile } = useDocSnapshot(
    () => (ready ? publicProfileRef(projectId) : null),
    [projectId, ready],
  )

  // useDocSnapshot is tri-state: undefined is loading, null is missing or
  // denied. Both null and a permission error mean the same thing here.
  if (error || project === null) {
    return (
      <div className="mx-auto w-full max-w-3xl">
        <h1 className="text-xl font-semibold tracking-tight text-zinc-800 dark:text-zinc-100">
          {deniedTitle}
        </h1>
        <div className="mt-6">
          <Button href={backHref} variant="secondary">
            {backLabel}
          </Button>
        </div>
      </div>
    )
  }

  if (project === undefined) return <PortalLoading />

  return (
    <ProjectContext.Provider value={{ projectId, project, profile }}>
      {children}
    </ProjectContext.Provider>
  )
}
