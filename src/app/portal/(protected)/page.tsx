'use client'

import { query, where } from 'firebase/firestore'

import { Card } from '@/components/Card'
import { SimpleLayout } from '@/components/SimpleLayout'
import { Badge } from '@/components/portal/Badge'
import { usePortalAuth } from '@/components/portal/PortalAuthProvider'
import { projectsCol } from '@/lib/portal/firestore'
import { useColSnapshot } from '@/lib/portal/hooks'
import type { ProjectStatus } from '@/lib/portal/types'

const statusLabels: Record<ProjectStatus, string> = {
  active: 'Active',
  paused: 'Paused',
  completed: 'Completed',
}

export default function PortalHomePage() {
  const { user } = usePortalAuth()

  // array-contains on memberUids is required for the list rules to accept
  // this query.
  const { data: projects, error } = useColSnapshot(
    () =>
      user
        ? query(projectsCol(), where('memberUids', 'array-contains', user.uid))
        : null,
    [user?.uid],
  )

  return (
    <SimpleLayout
      title="Your project portal."
      intro="The live record of what I am building for you: status, milestones, documents, and a direct line to me."
    >
      {error ? (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Your projects failed to load.
        </p>
      ) : projects === null ? (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Loading...</p>
      ) : projects.length === 0 ? (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          I have not added you to a project yet. If that seems wrong, get in
          touch.
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-x-12 gap-y-16 sm:grid-cols-2">
          {projects.map((project) => (
            <Card as="li" key={project.id}>
              <Card.Eyebrow>
                <span className="relative z-10">
                  <Badge tone={project.status === 'active' ? 'teal' : 'zinc'}>
                    {statusLabels[project.status]}
                  </Badge>
                </span>
              </Card.Eyebrow>
              <Card.Title href={`/portal/projects/${project.id}`}>
                {project.name}
              </Card.Title>
              <Card.Description>
                Milestones, progress, documents, and messages for{' '}
                {project.name}.
              </Card.Description>
              <Card.Cta>Open project</Card.Cta>
            </Card>
          ))}
        </ul>
      )}
    </SimpleLayout>
  )
}
