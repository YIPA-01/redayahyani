// Admin SDK singleton, server only. Exposed as a function rather than a
// top-level instance so importing this module can never throw during
// next build.

import { getApps, initializeApp, type App } from 'firebase-admin/app'
import { getFirestore, type Firestore } from 'firebase-admin/firestore'

function adminApp(): App {
  const existing = getApps()[0]
  if (existing) return existing
  const projectId =
    process.env.FIREBASE_PROJECT_ID ??
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ??
    'demo-portal'
  // Fail fast when neither the emulator nor real credentials are configured,
  // so a misconfigured server can never silently hit production.
  if (
    !process.env.FIRESTORE_EMULATOR_HOST &&
    !process.env.GOOGLE_APPLICATION_CREDENTIALS
  ) {
    throw new Error(
      'Admin SDK needs FIRESTORE_EMULATOR_HOST (local) or GOOGLE_APPLICATION_CREDENTIALS (deployed).',
    )
  }
  return initializeApp({ projectId })
}

export function adminDb(): Firestore {
  return getFirestore(adminApp())
}
