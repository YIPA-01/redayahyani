'use client'

// Client-side gate for the admin segment. UX only, same as RequireAuth: the
// real security boundary is firestore.rules plus the API route's own token
// check. Renders nothing admin-shaped until the claim resolves to true. A
// non-admin gets a clean dead end rather than a redirect: there is nothing
// to flash and nowhere better to send them than the link offered.

import { Button } from '@/components/Button'
import { Container } from '@/components/Container'
import { usePortalAuth } from '@/components/portal/PortalAuthProvider'

export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { status, isAdmin } = usePortalAuth()

  // RequireAuth wraps this gate, so status is signed-in by the time children
  // matter; the null check covers the async claim resolution window.
  if (status !== 'signed-in' || isAdmin === null) {
    return (
      <Container className="mt-16 sm:mt-32">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Checking your access...
        </p>
      </Container>
    )
  }

  if (!isAdmin) {
    return (
      <Container className="mt-16 sm:mt-32">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100">
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
      </Container>
    )
  }

  return <>{children}</>
}
