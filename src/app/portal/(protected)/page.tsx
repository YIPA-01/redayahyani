'use client'

import { Card } from '@/components/Card'
import { Badge } from '@/components/portal/Badge'
import { usePortalData } from '@/components/portal/PortalDataProvider'
import { PageHeader } from '@/components/portal/shell/PageHeader'
import { PortalPage } from '@/components/portal/shell/PortalPage'
import { PortalEmpty, PortalLoading } from '@/components/portal/shell/PortalStatus'
import { projectStatusLabels } from '@/lib/portal/labels'

export default function PortalHomePage() {
  const { myProjects: projects, myProjectsError: error } = usePortalData()

  return (
    <PortalPage>
      <PageHeader
        title="Your projects"
        description="The live record of what I am building for you: status, milestones, documents, and a direct line to me."
      />

      {error ? (
        <PortalEmpty>Your projects failed to load.</PortalEmpty>
      ) : projects === null ? (
        <PortalLoading />
      ) : projects.length === 0 ? (
        <PortalEmpty>
          I have not added you to a project yet. If that seems wrong, get in
          touch.
        </PortalEmpty>
      ) : (
        <ul className="grid grid-cols-1 gap-x-10 gap-y-12 sm:grid-cols-2">
          {projects.map((project) => (
            <Card as="li" key={project.id}>
              <Card.Eyebrow>
                <span className="relative z-10">
                  <Badge tone={project.status === 'active' ? 'teal' : 'zinc'}>
                    {projectStatusLabels[project.status]}
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
    </PortalPage>
  )
}
