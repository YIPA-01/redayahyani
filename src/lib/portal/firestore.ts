// Typed Firestore access for the portal. Read paths go through converted
// refs; the write functions below own every client-side write shape in the
// app, member and admin, and the rules that allow them are covered by
// tests/rules/firestore-rules.test.ts. Admin writes require the admin
// custom claim; the rules deny them for everyone else.

import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
  setDoc,
  updateDoc,
  type DocumentData,
  type FirestoreDataConverter,
  type Timestamp,
} from 'firebase/firestore'

import { db } from '@/lib/firebase/client'
import type {
  DocumentDoc,
  MessageDoc,
  MilestoneDoc,
  MilestoneStatus,
  ProgressUpdateDoc,
  ProjectDoc,
  ProjectStatus,
  PublicProfileDoc,
  PublicUpdateDoc,
  RequirementRequestDoc,
  UserDoc,
} from '@/lib/portal/types'

export type WithId<T> = T & { id: string }

// Read-oriented converter: attaches the doc id and forwards SnapshotOptions
// so serverTimestamps: 'estimate' reaches snap.data(). Writes never go
// through converted refs; sendMessage and fulfilRequirement own the write
// shapes.
function converter<T extends DocumentData>(): FirestoreDataConverter<
  WithId<T>
> {
  return {
    toFirestore(value) {
      const { id, ...data } = value as WithId<T>
      return data
    },
    fromFirestore(snap, options) {
      return { id: snap.id, ...(snap.data(options) as T) }
    },
  }
}

export function projectsCol() {
  return collection(db, 'projects').withConverter(converter<ProjectDoc>())
}

export function projectRef(projectId: string) {
  return doc(db, 'projects', projectId).withConverter(converter<ProjectDoc>())
}

export function publicProfileRef(projectId: string) {
  return doc(db, 'projects', projectId, 'public', 'profile').withConverter(
    converter<PublicProfileDoc>(),
  )
}

export function milestonesCol(projectId: string) {
  return collection(db, 'projects', projectId, 'milestones').withConverter(
    converter<MilestoneDoc>(),
  )
}

export function progressUpdatesCol(projectId: string) {
  return collection(
    db,
    'projects',
    projectId,
    'progressUpdates',
  ).withConverter(converter<ProgressUpdateDoc>())
}

export function documentsCol(projectId: string) {
  return collection(db, 'projects', projectId, 'documents').withConverter(
    converter<DocumentDoc>(),
  )
}

export function messagesCol(projectId: string) {
  return collection(db, 'projects', projectId, 'messages').withConverter(
    converter<MessageDoc>(),
  )
}

export function requirementRequestsCol(projectId: string) {
  return collection(
    db,
    'projects',
    projectId,
    'requirementRequests',
  ).withConverter(converter<RequirementRequestDoc>())
}

export function usersCol() {
  return collection(db, 'users').withConverter(converter<UserDoc>())
}

export function publicUpdatesCol(projectId: string) {
  return collection(db, 'projects', projectId, 'publicUpdates').withConverter(
    converter<PublicUpdateDoc>(),
  )
}

// Member writes: the only two the rules allow for clients.

export function sendMessage(
  projectId: string,
  senderId: string,
  senderName: string,
  body: string,
) {
  return addDoc(collection(db, 'projects', projectId, 'messages'), {
    senderId,
    senderName,
    body,
    createdAt: serverTimestamp(),
  })
}

export function fulfilRequirement(projectId: string, reqId: string) {
  return updateDoc(
    doc(db, 'projects', projectId, 'requirementRequests', reqId),
    {
      status: 'fulfilled',
      fulfilledAt: serverTimestamp(),
    },
  )
}

// Admin writes: every shape below falls under the rules' admin-only allow.

export function createProject(
  name: string,
  status: ProjectStatus,
  memberUids: string[],
) {
  return addDoc(collection(db, 'projects'), {
    name,
    memberUids,
    status,
    createdAt: serverTimestamp(),
  })
}

export function updateProjectStatus(projectId: string, status: ProjectStatus) {
  return updateDoc(doc(db, 'projects', projectId), { status })
}

export function addProjectMember(projectId: string, uid: string) {
  return updateDoc(doc(db, 'projects', projectId), {
    memberUids: arrayUnion(uid),
  })
}

export function removeProjectMember(projectId: string, uid: string) {
  return updateDoc(doc(db, 'projects', projectId), {
    memberUids: arrayRemove(uid),
  })
}

// setDoc on purpose: creating and updating the public face are the same
// deliberate act of publishing.
export function setPublicProfile(projectId: string, profile: PublicProfileDoc) {
  return setDoc(doc(db, 'projects', projectId, 'public', 'profile'), profile)
}

export function addPublicUpdate(projectId: string, title: string, body: string) {
  return addDoc(collection(db, 'projects', projectId, 'publicUpdates'), {
    title,
    body,
    images: [],
    publishedAt: serverTimestamp(),
  })
}

export function addMilestone(
  projectId: string,
  input: {
    label: string
    title: string
    description: string
    dueDate: Timestamp
    status: MilestoneStatus
  },
) {
  return addDoc(collection(db, 'projects', projectId, 'milestones'), input)
}

export function updateMilestoneStatus(
  projectId: string,
  milestoneId: string,
  status: MilestoneStatus,
) {
  return updateDoc(doc(db, 'projects', projectId, 'milestones', milestoneId), {
    status,
  })
}

export function addProgressUpdate(
  projectId: string,
  authorId: string,
  body: string,
) {
  return addDoc(collection(db, 'projects', projectId, 'progressUpdates'), {
    authorId,
    body,
    createdAt: serverTimestamp(),
  })
}

export function addRequirement(
  projectId: string,
  input: { type: string; title: string; deliveryMethod: string },
) {
  return addDoc(collection(db, 'projects', projectId, 'requirementRequests'), {
    ...input,
    status: 'open',
    fulfilledAt: null,
  })
}

export function deleteRequirement(projectId: string, reqId: string) {
  return deleteDoc(
    doc(db, 'projects', projectId, 'requirementRequests', reqId),
  )
}
