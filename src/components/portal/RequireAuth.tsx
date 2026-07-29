'use client'

// Client-side gate for the protected portal segment. UX only: the real
// security boundary is firestore.rules. Children never mount before the
// auth state resolves to signed-in, so protected content cannot flash.

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { Container } from '@/components/Container'
import { usePortalAuth } from '@/components/portal/PortalAuthProvider'

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { status } = usePortalAuth()
  const router = useRouter()

  useEffect(() => {
    if (status === 'signed-out') {
      router.replace('/portal/sign-in')
    }
  }, [status, router])

  if (status !== 'signed-in') {
    return (
      <Container className="mt-16 sm:mt-32">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {status === 'loading'
            ? 'Checking your session...'
            : 'Taking you to sign in...'}
        </p>
      </Container>
    )
  }

  return <>{children}</>
}
