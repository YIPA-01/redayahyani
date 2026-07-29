# Client portal: conceptual design (v2, post-review)

**Status: concept only, no implementation yet.** This lives in the same repo as the existing portfolio (Next.js), extended with Firebase (Auth, Firestore, Storage, Cloud Functions) as new dependencies, not a separate app/repo. This document is the design record to follow when implementation starts; it is not itself an implementation plan.

## Context

The portfolio site is used to win freelance engineering work. The goal is a second layer on top of it: a way to show the real, ongoing experience of working with a client (the actual collaboration and progress), beyond a static case study, while guaranteeing that nothing private about a project or client ever leaks to the public.

Traditional proposals (scope/timeline/pricing sent to a prospect before signing) stay outside this system entirely, handled the way they are today. This system starts only once a client has signed.

## Actors

- **Guest**: any anonymous visitor, sees only what has been deliberately published
- **Client**: a signed client, authenticated, sees the full private record of their own project(s); a project can have several client members (co-founders, a client-side PM)
- **Admin** (Reda): manages all clients, projects, and public/private content

## Use cases

**Guest**
- Browse a project's public page: title, one-line summary, generalized phase indicator, and the public journal (a running narrative of what has been shared about that project)

**Client**
- View their project dashboard and status
- View milestones and the private progress log
- View and download documents
- Message the admin, scoped to their project
- See open requirement requests (what is needed from them) and fulfill them
- Receive an email notification when the admin messages them or opens a requirement request
- Implicitly can also see everything a Guest can see about their own project

**Admin**
- Create clients and projects, manage project members
- Update milestones, post private progress updates, upload documents
- Create requirement requests, message clients
- Receive an email notification when a client sends a message or fulfills a requirement
- Write public journal entries, set the project's public phase label, create or remove a project's public profile
- Cross-project overview dashboard

## Core design principles

### Public content is opt-in by construction

Private project data and public content are **separate documents**, not one dataset with a visibility flag. A flag defaults to "forgot to mark it private" as a failure mode; separate, deliberately-authored public documents mean nothing is exposed unless the admin took the explicit action of creating it. A project has no public face at all until its public profile document exists. There is no shared "toggle visibility" mechanism anywhere in the system.

### Public data is served only through the server

Guest pages are rendered by Next.js on the server using the Firebase Admin SDK. Firestore itself stays **fully closed to unauthenticated access**: there are no `allow read: if true` rules anywhere. Benefits: the database is never exposed to direct anonymous traffic, and public journal pages are server-rendered HTML with proper SEO, which matters for a portfolio whose public pages exist to be found. The client portal, by contrast, uses the client SDK (realtime updates for messages and progress); guests need no realtime.

### No secrets in the database, ever

`RequirementRequest` never stores an actual secret value (API key, credential). It only tracks what is needed and whether it has been provided through a separate, out-of-band channel. Hard constraint, unchanged from the first draft.

### Consent is deferred, deliberately

There is no client-consent workflow for public content in this version. The admin is responsible for publishing responsibly. Known risk accepted for now: NDA-bound clients require checking the contract before creating a public profile for their project. If this ever becomes a friction point, the natural upgrade path is an in-portal approval flow (entries drafted, client approves before publish), which the two-document design already accommodates without restructuring.

## Domain model

```mermaid
classDiagram
    class User {
        +string uid
        +string email
        +string displayName
        +string role
    }
    class Project {
        +string id
        +string name
        +string[] memberUids
        +string status
        +datetime createdAt
    }
    class PublicProfile {
        +string slug
        +string title
        +string summary
        +string phase
    }
    class PublicUpdate {
        +string id
        +string title
        +string body
        +string[] images
        +datetime publishedAt
    }
    class Milestone {
        +string id
        +string label
        +string title
        +string description
        +date dueDate
        +string status
    }
    class ProgressUpdate {
        +string id
        +string authorId
        +string body
        +datetime createdAt
    }
    class Document {
        +string id
        +string title
        +string storagePath
        +string uploadedBy
        +datetime uploadedAt
    }
    class Message {
        +string id
        +string senderId
        +string body
        +datetime createdAt
    }
    class RequirementRequest {
        +string id
        +string type
        +string title
        +string status
        +string deliveryMethod
        +datetime fulfilledAt
    }

    User "many" --> "many" Project : member of
    Project "1" --> "0..1" PublicProfile : public face, admin-created
    Project "1" --> "many" PublicUpdate : guest-visible via server
    Project "1" --> "many" Milestone : private
    Project "1" --> "many" ProgressUpdate : private
    Project "1" --> "many" Document : private
    Project "1" --> "many" Message : private
    Project "1" --> "many" RequirementRequest : private
```

Notes:
- `memberUids` is an array so a client team (two founders, a PM) can share one project without a future migration. Rules check membership with `in`.
- `PublicProfile.phase` is a small fixed vocabulary (Discovery, Build, QA & Launch, Completed), set manually by the admin, never derived from `Milestone` state, so it cannot inherit internal naming or timing specifics.
- `PublicProfile` is optional (0..1): its absence is what "this project is not public" means. No flag.

## Firestore schema

```
/users/{uid}
    email, displayName, role ('admin' | 'client'), createdAt

/projects/{projectId}
    name, memberUids[], status, createdAt          -- private, no public fields here

    /projects/{projectId}/public/profile           -- singleton doc, admin-created
        slug, title, summary, phase                -- read only via Admin SDK (server)

    /projects/{projectId}/publicUpdates/{updateId} -- read only via Admin SDK (server)
        title, body, images[], publishedAt

    /projects/{projectId}/milestones/{milestoneId}      -- private
    /projects/{projectId}/progressUpdates/{updateId}    -- private
    /projects/{projectId}/documents/{documentId}        -- private, metadata only
    /projects/{projectId}/messages/{messageId}          -- private
    /projects/{projectId}/requirementRequests/{reqId}   -- private
```

The public face lives in its own documents (`public/profile`, `publicUpdates`) rather than as fields on the project document. This is required, not stylistic: **Firestore rules cannot grant field-level reads**; document reads are all-or-nothing, so public and private data must never share a document. In this design it is moot for guests (who never touch Firestore directly), but it also keeps client-side reads clean and preserves the option of opening public reads later without leaking `memberUids`.

Storage layout: `/projects/{projectId}/documents/{documentId}/{filename}` for private files, `/projects/{projectId}/publicUpdates/{updateId}/{filename}` for journal images (served via the server or signed URLs, same closed-by-default posture).

### Security rules shape

- No unauthenticated read or write anywhere. Guest traffic never reaches Firestore.
- Private subcollections: ownership lives **only** on the project document; child documents do not denormalize membership. Rules resolve it via lookup:
  `allow read, write: if isAdmin() || request.auth.uid in get(/databases/$(database)/documents/projects/$(projectId)).data.memberUids;`
  (one extra document read per access, fine at this scale).
- `public/profile` and `publicUpdates`: admin-only write; no client-side read rule needed since the server reads them with the Admin SDK, which bypasses rules.
- `isAdmin()` checks a custom auth claim. Claims are set server-side; the first admin claim is bootstrapped once by a local script using the Admin SDK (service account), never through the app.

## Notifications (core concept, not an add-on)

The portal only works as a communication channel if each side learns that something happened. A Cloud Function triggers on writes and sends email through a transactional email provider (pick at implementation time):

- New `Message` by admin → email to project members. New `Message` by client → email to admin.
- New `RequirementRequest` → email to project members. Requirement fulfilled → email to admin.
- New `ProgressUpdate` by admin → email to project members (digest or immediate, decide at implementation).

No in-app notification center in v1; email is the whole mechanism.

## Relationship to the existing portfolio content

Same repo, same Next.js app. The current static project list (`src/app/projects/page.tsx`, hand-maintained per CLAUDE.md conventions) stays exactly as is. This system is additive: new routes for the client portal (e.g. `/portal`) and for server-rendered public journal pages get layered alongside the existing static pages. Which projects get a Firestore-backed record (and therefore a live public journal) versus staying a plain static case study is a per-project decision, not a migration.

Open detail: the guest-facing URL scheme must coexist with the existing static `/projects` routes (candidates: `/projects/{slug}/journal`, or a distinct prefix like `/work/{slug}`). Decide at implementation planning.

## Decisions log

- No proposal entity; proposals stay traditional, outside the system
- Public journal plus generalized phase indicator for guests (not journal-only)
- Same repo as the portfolio
- Public content served server-side only; Firestore closed to anonymous access
- No client-consent workflow for now (accepted risk, upgrade path exists)
- Email notifications are core scope
- `memberUids` array instead of single `clientUid`

## Remaining open items

- Client sign-in mechanism: Firebase email-link (passwordless) proposed, not confirmed
- Admin authoring surface: admin panel inside this app vs something else
- Document constraints: size/type limits, preview vs download-only
- Guest URL scheme (see above)
- Email provider choice and digest-vs-immediate for progress updates

## Next steps

When ready to build, run a separate implementation planning pass covering: Firebase project setup within this repo, Auth flow, the actual rules file, Cloud Functions for claims and notifications, new routes, and initial screens. That pass should treat this document as fixed requirements unless something here proves wrong in practice.
