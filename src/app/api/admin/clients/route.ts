// The one thing the browser cannot do: create a Firebase Auth user. This
// route verifies the caller's ID token, requires the admin claim, creates
// the auth user, and writes the /users doc with the Admin SDK (bypasses
// rules, same posture as the seed script). In dev,
// FIREBASE_AUTH_EMULATOR_HOST (from .env.development) points firebase-admin
// auth at the emulator, where ID tokens are unsigned and verifyIdToken
// skips signature checks.

import { NextResponse } from 'next/server'
import { FieldValue } from 'firebase-admin/firestore'

import { adminAuth, adminDb } from '@/lib/firebase/admin'
import type { UserDoc } from '@/lib/portal/types'

export const dynamic = 'force-dynamic'

type Body = { email?: unknown; password?: unknown; displayName?: unknown }

export async function POST(request: Request) {
  const header = request.headers.get('authorization') ?? ''
  const idToken = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!idToken) {
    return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })
  }

  let decoded
  try {
    decoded = await adminAuth().verifyIdToken(idToken)
  } catch {
    return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })
  }
  if (decoded.admin !== true) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  let body: Body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'invalid-body' }, { status: 400 })
  }
  const { email, password, displayName } = body
  if (
    typeof email !== 'string' ||
    !email.includes('@') ||
    typeof password !== 'string' ||
    password.length < 6 ||
    typeof displayName !== 'string' ||
    displayName.trim().length === 0
  ) {
    return NextResponse.json({ error: 'invalid-body' }, { status: 400 })
  }

  // Role is always client and no custom claim is set: there is exactly one
  // admin and this route never mints another.
  try {
    const record = await adminAuth().createUser({
      email,
      password,
      displayName: displayName.trim(),
    })
    const userDoc: UserDoc<FieldValue> = {
      email,
      displayName: displayName.trim(),
      role: 'client',
      createdAt: FieldValue.serverTimestamp(),
    }
    await adminDb().doc(`users/${record.uid}`).set(userDoc)
    return NextResponse.json({ uid: record.uid }, { status: 201 })
  } catch (error) {
    if (
      (error as { code?: string }).code === 'auth/email-already-exists'
    ) {
      return NextResponse.json({ error: 'email-exists' }, { status: 409 })
    }
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }
}
