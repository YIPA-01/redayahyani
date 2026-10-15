// Server-only reads of the portal's public face. Guests never touch Firestore
// directly (docs/portal-concept.md), so this goes through the Admin SDK, which
// bypasses the rules. The client-SDK counterpart is src/lib/portal/firestore.ts.

import type { QueryDocumentSnapshot, Timestamp } from 'firebase-admin/firestore'

import { adminDb } from '@/lib/firebase/admin'
import type { PublicProfileDoc, PublicUpdateDoc } from '@/lib/portal/types'

export interface PublicProject extends PublicProfileDoc {
  projectId: string
}

export interface PublicJournalEntry
  extends Omit<PublicUpdateDoc, 'publishedAt'> {
  id: string
  // Serialized here rather than passed as a Timestamp, because the value
  // crosses into a rendered page and Timestamps are not plain objects.
  publishedAt: string
}

// adminApp() throws when neither the emulator nor real credentials are
// configured, and .env.development is only loaded by `next dev`. Without this
// guard a production build would fail the moment /work rendered. Returning
// empty instead means the site ships with its static case studies and no live
// client entries, which is the intended degradation while no real Firebase
// project exists. This is not a swallowed error.
function adminConfigured() {
  return Boolean(
    process.env.FIRESTORE_EMULATOR_HOST ||
      process.env.GOOGLE_APPLICATION_CREDENTIALS,
  )
}

function toProject(doc: QueryDocumentSnapshot): PublicProject | null {
  const data = doc.data() as Partial<PublicProfileDoc>
  const projectId = doc.ref.parent.parent?.id
  if (!projectId || !data.slug || !data.title) return null
  return {
    projectId,
    slug: data.slug,
    title: data.title,
    summary: data.summary ?? '',
    phase: data.phase ?? 'Discovery',
  }
}

// The Admin SDK retries an unreachable backend for about 45s before giving
// up, which would hold the whole page hostage. Live projects are an extra on
// top of the static case studies, so they get a short budget.
const LIVE_PROJECTS_TIMEOUT_MS = 4000

function withTimeout<T>(promise: Promise<T>, ms: number) {
  let timer: ReturnType<typeof setTimeout>
  let timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(`timed out after ${ms}ms`)), ms)
  })
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer))
}

export async function listPublicProjects(): Promise<Array<PublicProject>> {
  if (!adminConfigured()) return []
  // Configured but unreachable (the dev emulator is not running, or a real
  // outage): /work and the sitemap still render their static projects. This
  // is logged loudly rather than swallowed, so the gap shows in server logs.
  try {
    const snapshot = await withTimeout(
      adminDb().collectionGroup('public').get(),
      LIVE_PROJECTS_TIMEOUT_MS,
    )
    return snapshot.docs
      .filter((doc) => doc.id === 'profile')
      .map(toProject)
      .filter((project): project is PublicProject => project !== null)
  } catch (error) {
    console.error(
      process.env.FIRESTORE_EMULATOR_HOST
        ? `Live projects unavailable: is the Firestore emulator running at ${process.env.FIRESTORE_EMULATOR_HOST}? Start it with \`npm run emulators\`.`
        : 'Live projects unavailable; rendering static work only.',
      error,
    )
    return []
  }
}

export async function getPublicProject(slug: string) {
  if (!adminConfigured()) return null
  const snapshot = await adminDb()
    .collectionGroup('public')
    .where('slug', '==', slug)
    .limit(1)
    .get()

  const doc = snapshot.docs.find((candidate) => candidate.id === 'profile')
  if (!doc) return null

  const project = toProject(doc)
  if (!project) return null

  const updates = await adminDb()
    .collection(`projects/${project.projectId}/publicUpdates`)
    .orderBy('publishedAt', 'desc')
    .get()

  const journal: Array<PublicJournalEntry> = updates.docs.map((entry) => {
    const data = entry.data() as PublicUpdateDoc<Timestamp>
    return {
      id: entry.id,
      title: data.title,
      body: data.body,
      images: data.images ?? [],
      publishedAt: data.publishedAt.toDate().toISOString(),
    }
  })

  return { project, journal }
}
