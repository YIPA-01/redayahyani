'use client'

// Portal-scoped auth state. Lives under /portal rather than in the global
// Providers so the rest of the site never imports the Firebase client SDK.
// Three states so gated pages can tell "still resolving" from "signed out"
// and never flash protected content.

import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged, type User } from 'firebase/auth'

import { auth } from '@/lib/firebase/client'

type PortalAuth =
  | { status: 'loading'; user: null }
  | { status: 'signed-out'; user: null }
  | { status: 'signed-in'; user: User }

const PortalAuthContext = createContext<PortalAuth>({
  status: 'loading',
  user: null,
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
  })

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      setState(
        user
          ? { status: 'signed-in', user }
          : { status: 'signed-out', user: null },
      )
    })
  }, [])

  return (
    <PortalAuthContext.Provider value={state}>
      {children}
    </PortalAuthContext.Provider>
  )
}
