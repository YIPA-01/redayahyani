'use client'

import Link from 'next/link'
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'

import { usePortalAuth } from '@/components/portal/PortalAuthProvider'
import { SignOutButton } from '@/components/portal/SignOutButton'
import { ProjectSwitcher } from '@/components/portal/shell/ProjectSwitcher'
import { PortalThemeToggle } from '@/components/portal/shell/PortalThemeToggle'
import {
  ActiveAccent,
  navLinkClasses,
  useNavActive,
} from '@/components/portal/shell/PortalNavLink'
import type { NavItem, PortalNav } from '@/components/portal/shell/nav'

function MenuIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
      <path
        d="M2.75 4.75h10.5M2.75 8h10.5M2.75 11.25h10.5"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

// Same link as the sidebar, but wrapped in PopoverButton so the panel closes
// on navigation. Header.tsx uses this pattern for the site's mobile nav.
function MobileNavLink({ item }: { item: NavItem }) {
  const active = useNavActive(item)
  return (
    <li>
      <PopoverButton
        as={Link}
        href={item.href}
        aria-current={active ? 'page' : undefined}
        className={navLinkClasses(active)}
      >
        {active && <ActiveAccent />}
        {item.label}
      </PopoverButton>
    </li>
  )
}

export function PortalTopBar({ nav }: { nav: PortalNav }) {
  const { user, isAdmin } = usePortalAuth()
  const inAdmin = nav.area === 'admin' || nav.area === 'admin-project'

  return (
    <header className="sticky top-0 z-30 flex h-14 flex-none items-center gap-2 border-b border-zinc-200 bg-white/85 px-4 backdrop-blur sm:px-8 dark:border-zinc-800 dark:bg-zinc-900/85">
      <Popover className="md:hidden">
        <PopoverButton className="flex rounded-md p-1.5 text-zinc-600 transition hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800">
          <span className="sr-only">Open portal navigation</span>
          <MenuIcon className="h-5 w-5 stroke-current" />
        </PopoverButton>
        <PopoverPanel className="absolute inset-x-0 top-14 z-40 border-b border-zinc-200 bg-white p-3 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
          {nav.backLink && (
            <PopoverButton
              as={Link}
              href={nav.backLink.href}
              className="mb-2 block px-3 text-xs text-zinc-500 dark:text-zinc-400"
            >
              {nav.backLink.label}
            </PopoverButton>
          )}
          <ul className="space-y-0.5">
            {nav.items.map((item) => (
              <MobileNavLink key={item.href} item={item} />
            ))}
          </ul>
        </PopoverPanel>
      </Popover>

      <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-2">
        <ProjectSwitcher nav={nav} />
        {nav.title && (
          <>
            <span
              aria-hidden="true"
              className="text-zinc-300 dark:text-zinc-600"
            >
              /
            </span>
            <p className="truncate text-sm font-medium text-zinc-800 dark:text-zinc-100">
              {nav.title}
            </p>
          </>
        )}
      </nav>

      <div className="ml-auto flex flex-none items-center gap-2 sm:gap-3">
        {isAdmin === true && !inAdmin && (
          <Link
            href="/portal/admin"
            className="text-sm font-medium text-teal-500 transition hover:text-teal-600 dark:hover:text-teal-400"
          >
            Admin
          </Link>
        )}
        <p className="hidden text-sm text-zinc-500 lg:block dark:text-zinc-400">
          {user?.email}
        </p>
        <PortalThemeToggle />
        <SignOutButton />
      </div>
    </header>
  )
}
