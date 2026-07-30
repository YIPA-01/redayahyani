'use client'

// The one place that knows the portal's route shapes. Everything the shell
// renders (sidebar items, breadcrumb, project switcher targets) comes from
// here, so adding a section means editing one list.

import { usePathname } from 'next/navigation'

import { usePortalAuth } from '@/components/portal/PortalAuthProvider'

export type NavItem = { href: string; label: string; exact?: boolean }

export type PortalArea = 'portal' | 'admin' | 'project' | 'admin-project'

export type PortalNav = {
  area: PortalArea
  projectId: string | null
  // Path suffix after the project id, empty on the overview. The project
  // switcher uses it to land on the same section in another project.
  section: string
  groupLabel: string
  items: NavItem[]
  backLink: NavItem | null
  // Breadcrumb tail. Empty when the switcher already names the page, so the
  // top bar does not render "Projects / Projects".
  title: string
}

const clientSections = [
  { path: '', label: 'Overview' },
  { path: 'milestones', label: 'Milestones' },
  { path: 'progress', label: 'Progress' },
  { path: 'documents', label: 'Documents' },
  { path: 'requirements', label: 'Requirements' },
  { path: 'messages', label: 'Messages' },
]

const adminSections = [
  { path: '', label: 'Overview' },
  { path: 'milestones', label: 'Milestones' },
  { path: 'progress', label: 'Progress' },
  { path: 'documents', label: 'Documents' },
  { path: 'requirements', label: 'Requirements' },
  { path: 'messages', label: 'Messages' },
  { path: 'public', label: 'Public face' },
  { path: 'members', label: 'Members' },
]

function projectNav(
  base: string,
  sections: { path: string; label: string }[],
  section: string,
) {
  return {
    items: sections.map((s) => ({
      href: s.path ? `${base}/${s.path}` : base,
      label: s.label,
      exact: s.path === '',
    })),
    title: sections.find((s) => s.path === section)?.label ?? 'Overview',
  }
}

export function buildPortalNav(pathname: string, isAdmin: boolean): PortalNav {
  // Order matters: the admin project path also starts with /portal/admin, so
  // it has to be matched before the plain admin case.
  const adminProject = /^\/portal\/admin\/projects\/([^/]+)(?:\/(.*))?$/.exec(
    pathname,
  )
  if (adminProject) {
    const projectId = adminProject[1]
    const section = adminProject[2] ?? ''
    const base = `/portal/admin/projects/${projectId}`
    return {
      area: 'admin-project',
      projectId,
      section,
      groupLabel: 'Project',
      backLink: { href: '/portal/admin', label: 'All projects' },
      ...projectNav(base, adminSections, section),
    }
  }

  const clientProject = /^\/portal\/projects\/([^/]+)(?:\/(.*))?$/.exec(
    pathname,
  )
  if (clientProject) {
    const projectId = clientProject[1]
    const section = clientProject[2] ?? ''
    const base = `/portal/projects/${projectId}`
    return {
      area: 'project',
      projectId,
      section,
      groupLabel: 'Project',
      backLink: { href: '/portal', label: 'Your projects' },
      ...projectNav(base, clientSections, section),
    }
  }

  if (pathname.startsWith('/portal/admin')) {
    return {
      area: 'admin',
      projectId: null,
      section: '',
      groupLabel: 'Admin',
      items: [
        { href: '/portal/admin', label: 'Projects', exact: true },
        { href: '/portal/admin/clients', label: 'Clients' },
      ],
      backLink: { href: '/portal', label: 'Your portal' },
      title: pathname.startsWith('/portal/admin/clients')
        ? 'Clients'
        : 'Projects',
    }
  }

  return {
    area: 'portal',
    projectId: null,
    section: '',
    groupLabel: 'Portal',
    items: [
      { href: '/portal', label: 'Projects', exact: true },
      ...(isAdmin ? [{ href: '/portal/admin', label: 'Admin' }] : []),
    ],
    backLink: null,
    // The switcher renders "Projects" here already.
    title: '',
  }
}

export function usePortalNav(): PortalNav {
  const pathname = usePathname()
  const { isAdmin } = usePortalAuth()
  return buildPortalNav(pathname, isAdmin === true)
}
