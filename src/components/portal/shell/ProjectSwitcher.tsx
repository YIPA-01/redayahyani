'use client'

// Context switcher in the top bar. Switching projects keeps the current
// section, so jumping from one project's milestones lands on the other's
// milestones.

import Link from 'next/link'
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import clsx from 'clsx'

import { usePortalData } from '@/components/portal/PortalDataProvider'
import type { PortalNav } from '@/components/portal/shell/nav'

function ChevronIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 8 6" aria-hidden="true" {...props}>
      <path
        d="M1.75 1.75 4 4.25l2.25-2.5"
        fill="none"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function ProjectSwitcher({ nav }: { nav: PortalNav }) {
  const { myProjects, allProjects } = usePortalData()
  const adminArea = nav.area === 'admin' || nav.area === 'admin-project'

  if (!nav.projectId) {
    return (
      <Link
        href={adminArea ? '/portal/admin' : '/portal'}
        className="truncate rounded-md px-2 py-1 text-sm font-medium text-zinc-800 transition hover:bg-zinc-100 dark:text-zinc-100 dark:hover:bg-zinc-800"
      >
        {adminArea ? 'Admin' : 'Projects'}
      </Link>
    )
  }

  // Admin project routes switch within every project; client routes switch
  // within the ones you are a member of. Falling back to the other list keeps
  // the name correct when an admin opens a client route for a project they do
  // not belong to.
  const list = (adminArea ? allProjects : myProjects) ?? []
  const current =
    list.find((p) => p.id === nav.projectId) ??
    (allProjects ?? myProjects ?? []).find((p) => p.id === nav.projectId)

  const base = adminArea ? '/portal/admin/projects' : '/portal/projects'
  const hrefFor = (id: string) =>
    nav.section ? `${base}/${id}/${nav.section}` : `${base}/${id}`

  return (
    <Popover className="relative">
      <PopoverButton className="flex max-w-[10rem] items-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium text-zinc-800 transition hover:bg-zinc-100 sm:max-w-[14rem] dark:text-zinc-100 dark:hover:bg-zinc-800">
        <span className="truncate">{current?.name ?? 'Project'}</span>
        <ChevronIcon className="h-2 w-2 flex-none stroke-current" />
      </PopoverButton>
      <PopoverPanel className="absolute left-0 z-40 mt-2 w-64 rounded-lg border border-zinc-200 bg-white p-1 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
        {list.length === 0 ? (
          <p className="px-3 py-1.5 text-sm text-zinc-500 dark:text-zinc-400">
            No other projects.
          </p>
        ) : (
          list.map((project) => (
            <PopoverButton
              as={Link}
              key={project.id}
              href={hrefFor(project.id)}
              className={clsx(
                'block truncate rounded-md px-3 py-1.5 text-sm transition',
                project.id === nav.projectId
                  ? 'bg-zinc-100 font-medium text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100'
                  : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-100',
              )}
            >
              {project.name}
            </PopoverButton>
          ))
        )}
      </PopoverPanel>
    </Popover>
  )
}
