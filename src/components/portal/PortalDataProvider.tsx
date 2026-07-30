'use client'

// Portal-wide collections, subscribed once for the whole session.
//
// This lives above the shell so the top bar (project switcher) can read the
// same data the pages use. Before this, the member query ran in both the
// shell and the page, and usersCol was subscribed separately by three admin
// screens.
//
// The two admin collections are gated on the claim because the rules deny
// listing all projects or any users to a client, and a denied listener would
// just spam errors.

import { createContext, useContext } from 'react'
import { orderBy, query, where } from 'firebase/firestore'

import { usePortalAuth } from '@/components/portal/PortalAuthProvider'
import { projectsCol, usersCol, type WithId } from '@/lib/portal/firestore'
import { useColSnapshot } from '@/lib/portal/hooks'
import type { ProjectDoc, UserDoc } from '@/lib/portal/types'

type PortalData = {
  // Projects the signed-in user is a member of. Null while loading.
  myProjects: WithId<ProjectDoc>[] | null
  myProjectsError: unknown
  // Every project, admin only. Null while loading or when not an admin.
  allProjects: WithId<ProjectDoc>[] | null
  allProjectsError: unknown
  // Every user doc, admin only.
  users: WithId<UserDoc>[] | null
}

const PortalDataContext = createContext<PortalData>({
  myProjects: null,
  myProjectsError: null,
  allProjects: null,
  allProjectsError: null,
  users: null,
})

export function usePortalData() {
  return useContext(PortalDataContext)
}

export function PortalDataProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isAdmin } = usePortalAuth()

  // Unchanged query shape: array-contains on memberUids is what the list
  // rules require for a client.
  const { data: myProjects, error: myProjectsError } = useColSnapshot(
    () =>
      user
        ? query(projectsCol(), where('memberUids', 'array-contains', user.uid))
        : null,
    [user?.uid],
  )

  const { data: allProjects, error: allProjectsError } = useColSnapshot(
    () => (isAdmin === true ? query(projectsCol(), orderBy('createdAt', 'desc')) : null),
    [isAdmin],
  )

  const { data: users } = useColSnapshot(
    () => (isAdmin === true ? usersCol() : null),
    [isAdmin],
  )

  return (
    <PortalDataContext.Provider
      value={{
        myProjects,
        myProjectsError,
        allProjects,
        allProjectsError,
        users,
      }}
    >
      {children}
    </PortalDataContext.Provider>
  )
}
