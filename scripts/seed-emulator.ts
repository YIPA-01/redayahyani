// Seeds the Firebase emulators with a realistic portal dataset.
// Run with: npm run seed (emulators must already be running).
// Idempotent: fixed ids and set() upserts, safe to run repeatedly.
// Refuses to run without emulator hosts so it can never touch a real
// project.

import { initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore, Timestamp } from 'firebase-admin/firestore'

import type {
  DocumentDoc,
  MessageDoc,
  MilestoneDoc,
  ProgressUpdateDoc,
  ProjectDoc,
  PublicProfileDoc,
  PublicUpdateDoc,
  RequirementRequestDoc,
  UserDoc,
} from '../src/lib/portal/types'

if (
  !process.env.FIRESTORE_EMULATOR_HOST ||
  !process.env.FIREBASE_AUTH_EMULATOR_HOST
) {
  console.error(
    'Refusing to run: FIRESTORE_EMULATOR_HOST and FIREBASE_AUTH_EMULATOR_HOST must both be set. This script only ever seeds emulators.',
  )
  process.exit(1)
}

const app = initializeApp({ projectId: 'demo-portal' })
const db = getFirestore(app)
const auth = getAuth(app)

const ADMIN_UID = 'admin-user'
const CLIENT_UID = 'client-user'
// A second client on no projects, so the admin clients screen and the member
// picker have realistic data.
const CLIENT_UID_2 = 'client-user-2'
const PROJECT_ID = 'atlas-rentals'

async function ensureUser(
  uid: string,
  email: string,
  displayName: string,
  claims?: Record<string, boolean>,
) {
  try {
    await auth.createUser({ uid, email, displayName, password: 'password123' })
  } catch (error: unknown) {
    const code = (error as { code?: string }).code
    if (code !== 'auth/uid-already-exists') throw error
  }
  if (claims) await auth.setCustomUserClaims(uid, claims)
}

async function main() {
  const now = Timestamp.now()

  await ensureUser(ADMIN_UID, 'reda@example.com', 'Reda Yahyani', {
    admin: true,
  })
  await ensureUser(CLIENT_UID, 'client@example.com', 'Atlas Client')
  await ensureUser(CLIENT_UID_2, 'mina@example.com', 'Mina Client')

  const adminUser: UserDoc<Timestamp> = {
    email: 'reda@example.com',
    displayName: 'Reda Yahyani',
    role: 'admin',
    createdAt: now,
  }
  const clientUser: UserDoc<Timestamp> = {
    email: 'client@example.com',
    displayName: 'Atlas Client',
    role: 'client',
    createdAt: now,
  }
  const clientUser2: UserDoc<Timestamp> = {
    email: 'mina@example.com',
    displayName: 'Mina Client',
    role: 'client',
    createdAt: now,
  }
  await db.doc(`users/${ADMIN_UID}`).set(adminUser)
  await db.doc(`users/${CLIENT_UID}`).set(clientUser)
  await db.doc(`users/${CLIENT_UID_2}`).set(clientUser2)

  const project: ProjectDoc<Timestamp> = {
    name: 'Atlas Rentals',
    memberUids: [CLIENT_UID],
    status: 'active',
    createdAt: now,
  }
  await db.doc(`projects/${PROJECT_ID}`).set(project)

  const profile: PublicProfileDoc = {
    slug: 'atlas-rentals',
    title: 'Atlas Rentals',
    summary:
      'A rental marketplace for students in Morocco. I lead engineering: listing ingestion, search, and matching.',
    phase: 'Build',
  }
  await db.doc(`projects/${PROJECT_ID}/public/profile`).set(profile)

  const publicUpdate: PublicUpdateDoc<Timestamp> = {
    title: 'Search is live on staging',
    body: 'The listing search went up on staging this week. Filters cover city, budget, and move-in date.',
    images: [],
    publishedAt: now,
  }
  await db
    .doc(`projects/${PROJECT_ID}/publicUpdates/update-001`)
    .set(publicUpdate)

  const milestone1: MilestoneDoc<Timestamp> = {
    label: 'Week 1-2',
    title: 'Discovery and data model',
    description: 'Domain modeling, listing schema, ingestion plan.',
    dueDate: now,
    status: 'done',
  }
  const milestone2: MilestoneDoc<Timestamp> = {
    label: 'Week 3-6',
    title: 'Search and matching',
    description: 'Indexing pipeline, search API, matching heuristics.',
    dueDate: now,
    status: 'in_progress',
  }
  await db.doc(`projects/${PROJECT_ID}/milestones/milestone-001`).set(milestone1)
  await db.doc(`projects/${PROJECT_ID}/milestones/milestone-002`).set(milestone2)

  const progress: ProgressUpdateDoc<Timestamp> = {
    authorId: ADMIN_UID,
    body: 'Ingestion pipeline handles the first two listing sources. Search index rebuilds nightly.',
    createdAt: now,
  }
  await db
    .doc(`projects/${PROJECT_ID}/progressUpdates/progress-001`)
    .set(progress)

  const contract: DocumentDoc<Timestamp> = {
    title: 'Signed contract',
    storagePath: `projects/${PROJECT_ID}/documents/document-001/contract.pdf`,
    uploadedBy: ADMIN_UID,
    uploadedAt: now,
  }
  await db.doc(`projects/${PROJECT_ID}/documents/document-001`).set(contract)

  const messageFromAdmin: MessageDoc<Timestamp> = {
    senderId: ADMIN_UID,
    senderName: 'Reda Yahyani',
    body: 'Staging is up. Take a look at the search flow when you have a moment.',
    createdAt: now,
  }
  const messageFromClient: MessageDoc<Timestamp> = {
    senderId: CLIENT_UID,
    senderName: 'Atlas Client',
    body: 'Looks great. The budget filter is exactly what we discussed.',
    createdAt: now,
  }
  await db.doc(`projects/${PROJECT_ID}/messages/message-001`).set(messageFromAdmin)
  await db.doc(`projects/${PROJECT_ID}/messages/message-002`).set(messageFromClient)

  const reqOpen: RequirementRequestDoc<Timestamp> = {
    type: 'api_key',
    title: 'Stripe test key',
    status: 'open',
    deliveryMethod: 'password manager share',
    fulfilledAt: null,
  }
  const reqFulfilled: RequirementRequestDoc<Timestamp> = {
    type: 'access',
    title: 'Repository access for the client team',
    status: 'fulfilled',
    deliveryMethod: 'github invite',
    fulfilledAt: now,
  }
  await db
    .doc(`projects/${PROJECT_ID}/requirementRequests/req-001`)
    .set(reqOpen)
  await db
    .doc(`projects/${PROJECT_ID}/requirementRequests/req-002`)
    .set(reqFulfilled)

  console.log('Seed complete.')
  console.log(`Project: /projects/${PROJECT_ID} (public profile, 1 public update, 2 milestones, 1 progress update, 1 document, 2 messages, 2 requirement requests)`)
  console.log('Auth users (password: password123):')
  console.log(`  admin:  reda@example.com  (uid ${ADMIN_UID}, claim admin=true)`)
  console.log(`  client: client@example.com (uid ${CLIENT_UID}, member of ${PROJECT_ID})`)
  console.log(`  client: mina@example.com   (uid ${CLIENT_UID_2}, no projects)`)
}

main().then(
  () => process.exit(0),
  (error) => {
    console.error(error)
    process.exit(1)
  },
)
