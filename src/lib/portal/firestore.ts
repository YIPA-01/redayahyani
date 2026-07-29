// Typed Firestore access for the portal. Read paths go through converted
// refs; the two write functions below are the only client-side writes the
// security rules allow, and their exact shapes are covered by
// tests/rules/firestore-rules.test.ts.

import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
  type DocumentData,
  type FirestoreDataConverter,
} from 'firebase/firestore'

import { db } from '@/lib/firebase/client'
import type {
  DocumentDoc,
  MessageDoc,
  MilestoneDoc,
  ProgressUpdateDoc,
  ProjectDoc,
  PublicProfileDoc,
  RequirementRequestDoc,
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

export function sendMessage(projectId: string, senderId: string, body: string) {
  return addDoc(collection(db, 'projects', projectId, 'messages'), {
    senderId,
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
