'use client'

// Portal-scoped auth state. Lives under /portal rather than in the global
// Providers so the rest of the site never imports the Firebase client SDK.
// Three states so gated pages can tell "still resolving" from "signed out"
// and never flash protected content. isAdmin resolves asynchronously from
// the token claims after sign-in: null while resolving, then a boolean.

import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged, type User } from 'firebase/auth'

import { auth } from '@/lib/firebase/client'

type PortalAuth =
  | { status: 'loading'; user: null; isAdmin: false }
  | { status: 'signed-out'; user: null; isAdmin: false }
  | { status: 'signed-in'; user: User; isAdmin: boolean | null }

const PortalAuthContext = createContext<PortalAuth>({
  status: 'loading',
  user: null,
  isAdmin: false,
})

export function usePortalAuth() {
  return useContext(PortalAuthContext)
}

export function PortalAuthProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [state, setState] = useState<PortalAuth>({
    status: 'loading',
    user: null,
    isAdmin: false,
  })

  useEffect(() => {
    let cancelled = false
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setState({ status: 'signed-out', user: null, isAdmin: false })
        return
      }
      // Publish signed-in immediately so RequireAuth never blocks on the
      // claim lookup; isAdmin: null means still resolving.
      setState({ status: 'signed-in', user, isAdmin: null })
      user.getIdTokenResult().then((result) => {
        // Guard the race: sign-out or a user switch may land before the
        // claims resolve.
        if (cancelled || auth.currentUser?.uid !== user.uid) return
        setState({
          status: 'signed-in',
          user,
          isAdmin: result.claims.admin === true,
        })
      })
    })
    return () => {
      cancelled = true
      unsubscribe()
    }
  }, [])

  return (
    <PortalAuthContext.Provider value={state}>
      {children}
    </PortalAuthContext.Provider>
  )
}
