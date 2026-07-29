// Client SDK init. The placeholder config values are enough for the
// emulator, which accepts any apiKey. Real values arrive via env when a
// production Firebase project is provisioned.

import { getApps, initializeApp } from 'firebase/app'
import { connectAuthEmulator, getAuth } from 'firebase/auth'
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore'

const app =
  getApps()[0] ??
  initializeApp({
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? 'demo-api-key',
    authDomain:
      process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ??
      'demo-portal.firebaseapp.com',
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? 'demo-portal',
  })

export const db = getFirestore(app)
export const auth = getAuth(app)

declare global {
  // eslint-disable-next-line no-var
  var __firebaseEmulatorsConnected: boolean | undefined
}

// connectFirestoreEmulator throws if called twice; module state does not
// survive Fast Refresh, so the guard lives on globalThis.
if (
  process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === 'true' &&
  !globalThis.__firebaseEmulatorsConnected
) {
  connectFirestoreEmulator(db, '127.0.0.1', 8080)
  connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true })
  globalThis.__firebaseEmulatorsConnected = true
}
