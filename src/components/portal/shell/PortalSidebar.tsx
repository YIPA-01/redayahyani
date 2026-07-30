'use client'

import Link from 'next/link'

import { PortalNavLink } from '@/components/portal/shell/PortalNavLink'
import type { PortalNav } from '@/components/portal/shell/nav'

function ArrowLeftIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
      <path
        d="M7.25 11.25 3.75 8m0 0 3.5-3.25M3.75 8h8.5"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function PortalSidebar({ nav }: { nav: PortalNav }) {
  return (
    <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col overflow-y-auto border-r border-zinc-200 px-3 py-4 md:flex dark:border-zinc-800">
      <Link
        href="/portal"
        className="px-3 text-sm font-semibold text-zinc-800 dark:text-zinc-100"
      >
        Project portal
      </Link>

      {nav.backLink && (
        <Link
          href={nav.backLink.href}
          className="mt-4 flex items-center gap-1.5 px-3 text-xs text-zinc-500 transition hover:text-teal-500 dark:text-zinc-400 dark:hover:text-teal-400"
        >
          <ArrowLeftIcon className="h-3.5 w-3.5 stroke-current" />
          {nav.backLink.label}
        </Link>
      )}

      <p className="mt-6 px-3 text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
        {nav.groupLabel}
      </p>
      <nav aria-label={nav.groupLabel} className="mt-2">
        <ul className="space-y-0.5">
          {nav.items.map((item) => (
            <PortalNavLink key={item.href} item={item} />
          ))}
        </ul>
      </nav>

      <div className="mt-auto px-3 pt-6">
        <Link
          href="/"
          className="text-xs text-zinc-400 transition hover:text-teal-500 dark:text-zinc-500 dark:hover:text-teal-400"
        >
          Back to the site
        </Link>
      </div>
    </aside>
  )
}
