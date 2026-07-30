'use client'

import { PortalSidebar } from '@/components/portal/shell/PortalSidebar'
import { PortalTopBar } from '@/components/portal/shell/PortalTopBar'
import { usePortalNav } from '@/components/portal/shell/nav'

// The dashboard frame. It mounts in the (protected) layout, so navigating
// between sections, projects, or into the admin area never remounts the
// sidebar or the listeners above it.
export function PortalShell({ children }: { children: React.ReactNode }) {
  const nav = usePortalNav()

  return (
    <div className="flex min-h-screen w-full">
      <PortalSidebar nav={nav} />
      <div className="flex min-w-0 flex-1 flex-col bg-white dark:bg-zinc-900">
        <PortalTopBar nav={nav} />
        <main className="flex-auto px-4 py-8 sm:px-8">{children}</main>
      </div>
    </div>
  )
}
