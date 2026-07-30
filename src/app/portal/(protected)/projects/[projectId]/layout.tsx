import { ProjectProvider } from '@/components/portal/ProjectProvider'

// Server layout: params arrive without a hook, and this instance survives
// navigation between sections, which is what keeps the project listener
// alive across the whole subtree.
export default function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { projectId: string }
}) {
  return (
    <ProjectProvider
      projectId={params.projectId}
      deniedTitle="You do not have access to this project."
      backHref="/portal"
      backLabel="Back to your portal"
    >
      {children}
    </ProjectProvider>
  )
}
