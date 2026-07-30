'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

import type { NavItem } from '@/components/portal/shell/nav'

export function navLinkClasses(active: boolean) {
  return clsx(
    'relative flex items-center rounded-md px-3 py-1.5 text-sm transition',
    active
      ? 'bg-zinc-100 font-medium text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100'
      : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-100',
  )
}

export function useNavActive(item: NavItem) {
  const pathname = usePathname()
  return item.exact
    ? pathname === item.href
    : pathname === item.href || pathname.startsWith(`${item.href}/`)
}

export function ActiveAccent() {
  return (
    <span
      aria-hidden="true"
      className="absolute inset-y-1.5 left-0 w-0.5 rounded-full bg-teal-500 dark:bg-teal-400"
    />
  )
}

export function PortalNavLink({ item }: { item: NavItem }) {
  const active = useNavActive(item)

  return (
    <li>
      <Link
        href={item.href}
        aria-current={active ? 'page' : undefined}
        className={navLinkClasses(active)}
      >
        {active && <ActiveAccent />}
        {item.label}
      </Link>
    </li>
  )
}
