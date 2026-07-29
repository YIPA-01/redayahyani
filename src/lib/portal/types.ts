// Domain types for the client portal. Design record: docs/portal-concept.md.
// Interfaces are generic over the timestamp type because the client SDK and
// the Admin SDK ship distinct Timestamp classes. App code uses the default;
// the seed script instantiates with the admin Timestamp.

import type { Timestamp } from 'firebase/firestore'

export type UserRole = 'admin' | 'client'
export type ProjectStatus = 'active' | 'paused' | 'completed'
export type PublicPhase = 'Discovery' | 'Build' | 'QA & Launch' | 'Completed'
export type MilestoneStatus = 'planned' | 'in_progress' | 'done'
export type RequirementStatus = 'open' | 'fulfilled'

export interface UserDoc<T = Timestamp> {
  email: string
  displayName: string
  role: UserRole
  createdAt: T
}

export interface ProjectDoc<T = Timestamp> {
  name: string
  memberUids: string[]
  status: ProjectStatus
  createdAt: T
}

export interface PublicProfileDoc {
  slug: string
  title: string
  summary: string
  phase: PublicPhase
}

export interface PublicUpdateDoc<T = Timestamp> {
  title: string
  body: string
  images: string[]
  publishedAt: T
}

export interface MilestoneDoc<T = Timestamp> {
  label: string
  title: string
  description: string
  dueDate: T
  status: MilestoneStatus
}

export interface ProgressUpdateDoc<T = Timestamp> {
  authorId: string
  body: string
  createdAt: T
}

export interface DocumentDoc<T = Timestamp> {
  title: string
  storagePath: string
  uploadedBy: string
  uploadedAt: T
}

export interface MessageDoc<T = Timestamp> {
  senderId: string
  body: string
  createdAt: T
}

// Never stores a secret value. It tracks only what is needed and whether it
// arrived through an out-of-band channel. Hard constraint from the design
// record: no value field, ever.
export interface RequirementRequestDoc<T = Timestamp> {
  type: string
  title: string
  status: RequirementStatus
  deliveryMethod: string
  fulfilledAt: T | null
}
