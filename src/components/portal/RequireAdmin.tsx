'use client'

// Client-side gate for the admin segment. UX only, same as RequireAuth: the
// real boundaries are firestore.rules and the API route's own token check.
// A non-admin gets a clean dead end rather than a redirect, since there is
// nothing to flash and nowhere better to send them than the link offered.
//
// This renders inside the shell, so it is ordinary page content.

import { Button } from '@/components/Button'
import { usePortalAuth } from '@/components/portal/PortalAuthProvider'
import { PortalLoading } from '@/components/portal/shell/PortalStatus'

export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { status, isAdmin } = usePortalAuth()

  // RequireAuth wraps this gate, so status is signed-in by the time children
  // matter; the null check covers the async claim resolution window.
  if (status !== 'signed-in' || isAdmin === null) {
    return <PortalLoading label="Checking your access..." />
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto w-full max-w-3xl">
        <h1 className="text-xl font-semibold tracking-tight text-zinc-800 dark:text-zinc-100">
          This area is not yours.
        </h1>
        <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
          The admin area is where I run the projects. Your portal has
          everything that concerns you.
        </p>
        <div className="mt-6">
          <Button href="/portal" variant="secondary">
            Back to your portal
          </Button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
