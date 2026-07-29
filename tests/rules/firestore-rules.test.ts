// Executable proof of firestore.rules. Four actors: unauthenticated,
// member (client-user, in project-a), outsider (other-client, in project-b
// only), admin (custom claim simulated in the token, no Cloud Function
// needed). Every security-critical cell of the actor x verb matrix is
// asserted here.

import { readFileSync } from 'node:fs'
import { afterAll, beforeAll, beforeEach, describe, it } from 'vitest'
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from '@firebase/rules-unit-testing'
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  Timestamp,
  type Firestore,
} from 'firebase/firestore'

const emulatorHost = process.env.FIRESTORE_EMULATOR_HOST ?? '127.0.0.1:8080'
const [host, portString] = emulatorHost.split(':')
const port = Number(portString)

let testEnv: RulesTestEnvironment

// The rules-unit-testing contexts return a compat-typed Firestore. The
// modular helpers unwrap compat instances at runtime, so a single cast
// here keeps the rest of the file on the modular API.
function db(context: 'unauth' | 'member' | 'outsider' | 'admin'): Firestore {
  const ctx =
    context === 'unauth'
      ? testEnv.unauthenticatedContext()
      : context === 'member'
        ? testEnv.authenticatedContext('client-user')
        : context === 'outsider'
          ? testEnv.authenticatedContext('other-client')
          : testEnv.authenticatedContext('admin-user', { admin: true })
  return ctx.firestore() as unknown as Firestore
}

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: 'demo-portal',
    firestore: {
      rules: readFileSync('firestore.rules', 'utf8'),
      host,
      port,
    },
  })
})

afterAll(async () => {
  await testEnv.cleanup()
})

beforeEach(async () => {
  await testEnv.clearFirestore()
  await testEnv.withSecurityRulesDisabled(async (context) => {
    const fixture = context.firestore() as unknown as Firestore
    const now = Timestamp.now()

    await setDoc(doc(fixture, 'users/client-user'), {
      email: 'client@example.com',
      displayName: 'Client User',
      role: 'client',
      createdAt: now,
    })
    await setDoc(doc(fixture, 'users/admin-user'), {
      email: 'reda@example.com',
      displayName: 'Reda Yahyani',
      role: 'admin',
      createdAt: now,
    })

    await setDoc(doc(fixture, 'projects/project-a'), {
      name: 'Project A',
      memberUids: ['client-user'],
      status: 'active',
      createdAt: now,
    })
    await setDoc(doc(fixture, 'projects/project-a/public/profile'), {
      slug: 'project-a',
      title: 'Project A',
      summary: 'Public summary.',
      phase: 'Build',
    })
    await setDoc(doc(fixture, 'projects/project-a/publicUpdates/update-1'), {
      title: 'First public update',
      body: 'Body.',
      images: [],
      publishedAt: now,
    })
    await setDoc(doc(fixture, 'projects/project-a/milestones/milestone-1'), {
      label: 'Week 1',
      title: 'Discovery',
      description: 'Desc.',
      dueDate: now,
      status: 'done',
    })
    await setDoc(doc(fixture, 'projects/project-a/progressUpdates/progress-1'), {
      authorId: 'admin-user',
      body: 'Progress.',
      createdAt: now,
    })
    await setDoc(doc(fixture, 'projects/project-a/documents/document-1'), {
      title: 'Contract',
      storagePath: 'projects/project-a/documents/document-1/contract.pdf',
      uploadedBy: 'admin-user',
      uploadedAt: now,
    })
    await setDoc(doc(fixture, 'projects/project-a/messages/message-1'), {
      senderId: 'admin-user',
      body: 'Hello.',
      createdAt: now,
    })
    await setDoc(doc(fixture, 'projects/project-a/requirementRequests/req-1'), {
      type: 'api_key',
      title: 'Stripe test key',
      status: 'open',
      deliveryMethod: 'password manager share',
      fulfilledAt: null,
    })
    await setDoc(doc(fixture, 'projects/project-a/requirementRequests/req-2'), {
      type: 'access',
      title: 'Repo access',
      status: 'fulfilled',
      deliveryMethod: 'github invite',
      fulfilledAt: now,
    })

    await setDoc(doc(fixture, 'projects/project-b'), {
      name: 'Project B',
      memberUids: ['other-client'],
      status: 'active',
      createdAt: now,
    })
    await setDoc(doc(fixture, 'projects/project-b/messages/message-b1'), {
      senderId: 'other-client',
      body: 'Other project message.',
      createdAt: now,
    })
  })
})

describe('/users', () => {
  it('denies unauthenticated read of a user doc', async () => {
    await assertFails(getDoc(doc(db('unauth'), 'users/client-user')))
  })
  it('lets a user read their own doc', async () => {
    await assertSucceeds(getDoc(doc(db('member'), 'users/client-user')))
  })
  it('denies reading someone else\'s user doc', async () => {
    await assertFails(getDoc(doc(db('member'), 'users/admin-user')))
  })
  it('denies self role escalation', async () => {
    await assertFails(
      updateDoc(doc(db('member'), 'users/client-user'), { role: 'admin' }),
    )
  })
  it('denies client creating a user doc', async () => {
    await assertFails(
      setDoc(doc(db('member'), 'users/new-uid'), {
        email: 'x@example.com',
        displayName: 'X',
        role: 'client',
        createdAt: Timestamp.now(),
      }),
    )
  })
  it('lets admin read any user doc', async () => {
    await assertSucceeds(getDoc(doc(db('admin'), 'users/client-user')))
  })
  it('lets admin create a user doc', async () => {
    await assertSucceeds(
      setDoc(doc(db('admin'), 'users/new-client'), {
        email: 'new@example.com',
        displayName: 'New Client',
        role: 'client',
        createdAt: Timestamp.now(),
      }),
    )
  })
})

describe('/projects/{id}', () => {
  it('denies unauthenticated project read', async () => {
    await assertFails(getDoc(doc(db('unauth'), 'projects/project-a')))
  })
  it('lets a member read their project', async () => {
    await assertSucceeds(getDoc(doc(db('member'), 'projects/project-a')))
  })
  it('denies an outsider reading another project', async () => {
    await assertFails(getDoc(doc(db('outsider'), 'projects/project-a')))
  })
  it('denies member escalating memberUids', async () => {
    await assertFails(
      updateDoc(doc(db('member'), 'projects/project-a'), {
        memberUids: ['client-user', 'other-client'],
      }),
    )
  })
  it('denies member writing any project field', async () => {
    await assertFails(
      updateDoc(doc(db('member'), 'projects/project-a'), {
        status: 'completed',
      }),
    )
  })
  it('denies client creating a project with self as member', async () => {
    await assertFails(
      setDoc(doc(db('member'), 'projects/rogue'), {
        name: 'Rogue',
        memberUids: ['client-user'],
        status: 'active',
        createdAt: Timestamp.now(),
      }),
    )
  })
  it('lets admin update a project', async () => {
    await assertSucceeds(
      updateDoc(doc(db('admin'), 'projects/project-a'), { status: 'paused' }),
    )
  })
  it('lets admin create a project', async () => {
    await assertSucceeds(
      setDoc(doc(db('admin'), 'projects/new-project'), {
        name: 'New',
        memberUids: [],
        status: 'active',
        createdAt: Timestamp.now(),
      }),
    )
  })
  it('lets admin delete a project', async () => {
    await assertSucceeds(deleteDoc(doc(db('admin'), 'projects/project-a')))
  })
})

describe('/public/profile', () => {
  it('denies unauthenticated read (closed by default; guests go through the server)', async () => {
    await assertFails(
      getDoc(doc(db('unauth'), 'projects/project-a/public/profile')),
    )
  })
  it('lets a member read their project\'s public profile', async () => {
    await assertSucceeds(
      getDoc(doc(db('member'), 'projects/project-a/public/profile')),
    )
  })
  it('denies an outsider reading it', async () => {
    await assertFails(
      getDoc(doc(db('outsider'), 'projects/project-a/public/profile')),
    )
  })
  it('denies member writing the public profile', async () => {
    await assertFails(
      updateDoc(doc(db('member'), 'projects/project-a/public/profile'), {
        phase: 'Completed',
      }),
    )
  })
  it('lets admin create and update public profiles', async () => {
    await assertSucceeds(
      setDoc(doc(db('admin'), 'projects/project-b/public/profile'), {
        slug: 'project-b',
        title: 'Project B',
        summary: 'Summary.',
        phase: 'Discovery',
      }),
    )
    await assertSucceeds(
      updateDoc(doc(db('admin'), 'projects/project-a/public/profile'), {
        phase: 'QA & Launch',
      }),
    )
  })
})

describe('/publicUpdates', () => {
  it('denies unauthenticated read', async () => {
    await assertFails(
      getDoc(doc(db('unauth'), 'projects/project-a/publicUpdates/update-1')),
    )
  })
  it('lets a member read', async () => {
    await assertSucceeds(
      getDoc(doc(db('member'), 'projects/project-a/publicUpdates/update-1')),
    )
  })
  it('denies an outsider read', async () => {
    await assertFails(
      getDoc(doc(db('outsider'), 'projects/project-a/publicUpdates/update-1')),
    )
  })
  it('denies member creating a public update', async () => {
    await assertFails(
      setDoc(doc(db('member'), 'projects/project-a/publicUpdates/rogue'), {
        title: 'Rogue',
        body: 'Body.',
        images: [],
        publishedAt: Timestamp.now(),
      }),
    )
  })
  it('lets admin create, update, delete public updates', async () => {
    await assertSucceeds(
      setDoc(doc(db('admin'), 'projects/project-a/publicUpdates/update-2'), {
        title: 'Second',
        body: 'Body.',
        images: [],
        publishedAt: Timestamp.now(),
      }),
    )
    await assertSucceeds(
      updateDoc(doc(db('admin'), 'projects/project-a/publicUpdates/update-1'), {
        title: 'Edited',
      }),
    )
    await assertSucceeds(
      deleteDoc(doc(db('admin'), 'projects/project-a/publicUpdates/update-1')),
    )
  })
})

describe('/milestones (full verb matrix)', () => {
  it('denies unauthenticated read', async () => {
    await assertFails(
      getDoc(doc(db('unauth'), 'projects/project-a/milestones/milestone-1')),
    )
  })
  it('lets a member read', async () => {
    await assertSucceeds(
      getDoc(doc(db('member'), 'projects/project-a/milestones/milestone-1')),
    )
  })
  it('denies an outsider read', async () => {
    await assertFails(
      getDoc(doc(db('outsider'), 'projects/project-a/milestones/milestone-1')),
    )
  })
  it('denies member create', async () => {
    await assertFails(
      setDoc(doc(db('member'), 'projects/project-a/milestones/rogue'), {
        label: 'X',
        title: 'X',
        description: 'X',
        dueDate: Timestamp.now(),
        status: 'planned',
      }),
    )
  })
  it('denies member update', async () => {
    await assertFails(
      updateDoc(doc(db('member'), 'projects/project-a/milestones/milestone-1'), {
        status: 'in_progress',
      }),
    )
  })
  it('denies member delete', async () => {
    await assertFails(
      deleteDoc(doc(db('member'), 'projects/project-a/milestones/milestone-1')),
    )
  })
  it('lets admin create, update, delete', async () => {
    await assertSucceeds(
      setDoc(doc(db('admin'), 'projects/project-a/milestones/milestone-2'), {
        label: 'Week 2',
        title: 'Build',
        description: 'Desc.',
        dueDate: Timestamp.now(),
        status: 'planned',
      }),
    )
    await assertSucceeds(
      updateDoc(doc(db('admin'), 'projects/project-a/milestones/milestone-1'), {
        status: 'in_progress',
      }),
    )
    await assertSucceeds(
      deleteDoc(doc(db('admin'), 'projects/project-a/milestones/milestone-1')),
    )
  })
})

describe('/progressUpdates and /documents (spot checks, same rule shape as milestones)', () => {
  it('lets a member read each', async () => {
    await assertSucceeds(
      getDoc(doc(db('member'), 'projects/project-a/progressUpdates/progress-1')),
    )
    await assertSucceeds(
      getDoc(doc(db('member'), 'projects/project-a/documents/document-1')),
    )
  })
  it('denies an outsider reading each', async () => {
    await assertFails(
      getDoc(doc(db('outsider'), 'projects/project-a/progressUpdates/progress-1')),
    )
    await assertFails(
      getDoc(doc(db('outsider'), 'projects/project-a/documents/document-1')),
    )
  })
  it('denies member creating in each', async () => {
    await assertFails(
      setDoc(doc(db('member'), 'projects/project-a/progressUpdates/rogue'), {
        authorId: 'client-user',
        body: 'X',
        createdAt: Timestamp.now(),
      }),
    )
    await assertFails(
      setDoc(doc(db('member'), 'projects/project-a/documents/rogue'), {
        title: 'X',
        storagePath: 'x',
        uploadedBy: 'client-user',
        uploadedAt: Timestamp.now(),
      }),
    )
  })
  it('lets admin create in each', async () => {
    await assertSucceeds(
      setDoc(doc(db('admin'), 'projects/project-a/progressUpdates/progress-2'), {
        authorId: 'admin-user',
        body: 'More progress.',
        createdAt: Timestamp.now(),
      }),
    )
    await assertSucceeds(
      setDoc(doc(db('admin'), 'projects/project-a/documents/document-2'), {
        title: 'Spec',
        storagePath: 'projects/project-a/documents/document-2/spec.pdf',
        uploadedBy: 'admin-user',
        uploadedAt: Timestamp.now(),
      }),
    )
  })
})

describe('/messages', () => {
  it('denies unauthenticated read', async () => {
    await assertFails(
      getDoc(doc(db('unauth'), 'projects/project-a/messages/message-1')),
    )
  })
  it('lets a member list project messages', async () => {
    await assertSucceeds(
      getDocs(collection(db('member'), 'projects/project-a/messages')),
    )
  })
  it('denies an outsider reading or listing another project\'s messages', async () => {
    await assertFails(
      getDoc(doc(db('outsider'), 'projects/project-a/messages/message-1')),
    )
    await assertFails(
      getDocs(collection(db('outsider'), 'projects/project-a/messages')),
    )
  })
  it('lets a member create a message as themselves', async () => {
    await assertSucceeds(
      setDoc(doc(db('member'), 'projects/project-a/messages/message-2'), {
        senderId: 'client-user',
        body: 'From the client.',
        createdAt: Timestamp.now(),
      }),
    )
  })
  it('denies a member spoofing senderId', async () => {
    await assertFails(
      setDoc(doc(db('member'), 'projects/project-a/messages/message-3'), {
        senderId: 'admin-user',
        body: 'Spoofed.',
        createdAt: Timestamp.now(),
      }),
    )
  })
  it('denies an outsider posting into another project even as themselves', async () => {
    await assertFails(
      setDoc(doc(db('outsider'), 'projects/project-a/messages/message-4'), {
        senderId: 'other-client',
        body: 'Not my project.',
        createdAt: Timestamp.now(),
      }),
    )
  })
  it('denies member editing or deleting messages', async () => {
    await assertFails(
      updateDoc(doc(db('member'), 'projects/project-a/messages/message-1'), {
        body: 'Edited.',
      }),
    )
    await assertFails(
      deleteDoc(doc(db('member'), 'projects/project-a/messages/message-1')),
    )
  })
  it('lets admin create as themselves', async () => {
    await assertSucceeds(
      setDoc(doc(db('admin'), 'projects/project-a/messages/message-5'), {
        senderId: 'admin-user',
        body: 'From admin.',
        createdAt: Timestamp.now(),
      }),
    )
  })
  it('denies even admin spoofing senderId on create', async () => {
    await assertFails(
      setDoc(doc(db('admin'), 'projects/project-a/messages/message-6'), {
        senderId: 'client-user',
        body: 'Spoofed by admin.',
        createdAt: Timestamp.now(),
      }),
    )
  })
  it('lets admin update and delete messages', async () => {
    await assertSucceeds(
      updateDoc(doc(db('admin'), 'projects/project-a/messages/message-1'), {
        body: 'Moderated.',
      }),
    )
    await assertSucceeds(
      deleteDoc(doc(db('admin'), 'projects/project-a/messages/message-1')),
    )
  })
})

describe('/requirementRequests', () => {
  it('denies unauthenticated read', async () => {
    await assertFails(
      getDoc(doc(db('unauth'), 'projects/project-a/requirementRequests/req-1')),
    )
  })
  it('lets a member read', async () => {
    await assertSucceeds(
      getDoc(doc(db('member'), 'projects/project-a/requirementRequests/req-1')),
    )
  })
  it('denies an outsider read', async () => {
    await assertFails(
      getDoc(doc(db('outsider'), 'projects/project-a/requirementRequests/req-1')),
    )
  })
  it('denies member creating a requirement', async () => {
    await assertFails(
      setDoc(doc(db('member'), 'projects/project-a/requirementRequests/rogue'), {
        type: 'api_key',
        title: 'Rogue',
        status: 'open',
        deliveryMethod: 'x',
        fulfilledAt: null,
      }),
    )
  })
  it('denies member deleting a requirement', async () => {
    await assertFails(
      deleteDoc(doc(db('member'), 'projects/project-a/requirementRequests/req-1')),
    )
  })
  it('lets a member fulfil a requirement (status and fulfilledAt only)', async () => {
    await assertSucceeds(
      updateDoc(doc(db('member'), 'projects/project-a/requirementRequests/req-1'), {
        status: 'fulfilled',
        fulfilledAt: Timestamp.now(),
      }),
    )
  })
  it('denies fulfilment that touches a disallowed key', async () => {
    await assertFails(
      updateDoc(doc(db('member'), 'projects/project-a/requirementRequests/req-1'), {
        status: 'fulfilled',
        fulfilledAt: Timestamp.now(),
        title: 'Renamed',
      }),
    )
  })
  it('denies un-fulfilling a fulfilled requirement', async () => {
    await assertFails(
      updateDoc(doc(db('member'), 'projects/project-a/requirementRequests/req-2'), {
        status: 'open',
      }),
    )
  })
  it('denies smuggling a secret value into a fulfilment', async () => {
    await assertFails(
      updateDoc(doc(db('member'), 'projects/project-a/requirementRequests/req-1'), {
        status: 'fulfilled',
        fulfilledAt: Timestamp.now(),
        value: 'sk_live_secret',
      }),
    )
  })
  it('denies an outsider fulfilling another project\'s requirement', async () => {
    await assertFails(
      updateDoc(doc(db('outsider'), 'projects/project-a/requirementRequests/req-1'), {
        status: 'fulfilled',
        fulfilledAt: Timestamp.now(),
      }),
    )
  })
  it('lets admin create, update, delete requirements', async () => {
    await assertSucceeds(
      setDoc(doc(db('admin'), 'projects/project-a/requirementRequests/req-3'), {
        type: 'asset',
        title: 'Brand kit',
        status: 'open',
        deliveryMethod: 'drive share',
        fulfilledAt: null,
      }),
    )
    await assertSucceeds(
      updateDoc(doc(db('admin'), 'projects/project-a/requirementRequests/req-1'), {
        title: 'Stripe live key',
      }),
    )
    await assertSucceeds(
      deleteDoc(doc(db('admin'), 'projects/project-a/requirementRequests/req-2')),
    )
  })
})

describe('default deny for unmatched paths', () => {
  it('denies member read and write on a random top-level collection', async () => {
    await assertFails(getDoc(doc(db('member'), 'random/doc')))
    await assertFails(setDoc(doc(db('member'), 'random/doc'), { x: 1 }))
  })
  it('denies admin write on a random top-level collection (no rule matches)', async () => {
    await assertFails(setDoc(doc(db('admin'), 'random/doc'), { x: 1 }))
  })
})
