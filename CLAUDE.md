# Reda Yahyani Portfolio

Personal portfolio site. Next.js App Router, Tailwind CSS, MDX for articles and project case studies. Built on the Tailwind UI "Spotlight" template.

## Writing rules

### Never use em dashes or en dashes

This applies to all prose: site copy, article and case study text, commit messages, PR descriptions, and documentation. No exceptions.

Restructure the sentence instead. Use a comma, a colon, parentheses, or split it into two sentences.

```
Bad:   I lead engineering — search, matching, and ingestion.
Good:  I lead engineering: search, matching, and ingestion.

Bad:   Built offline-first — the users can't rely on connectivity.
Good:  Built offline-first, because the users can't rely on connectivity.

Bad:   2024 — present
Good:  2024 to present
```

Hyphens inside compound words are fine, since those are spelling rather than punctuation: "offline-first", "long-form", "first-person".

Dash-heavy prose is one of the most recognizable signatures of generated text. On a site whose entire purpose is to demonstrate a person's ability, that reads as a liability.

To check before committing:

```bash
grep -rn "—\|–" src/ docs/ README.md
```

CLAUDE.md is excluded because its examples above show the bad pattern on purpose. LICENSE.md is excluded because it is third-party text.

### General voice

- Write in first person. This is a personal site, not a company page.
- Say what was built and what it took, not what the product category is. "A rental marketplace for students in Morocco. I lead engineering: listing ingestion, search, and matching" beats "A web app whose purpose is to help students find homes."
- No filler definitions. Never describe a tool by what its marketing page says it is. Say why it gets used here.
- Avoid hedges: "helping to build out", "I'm passionate about", "a range of services".

## Conventions

- Marketing pages live in the `src/app/(site)/` route group, which owns the site chrome (`Layout` with `Header` and `Footer`). The root layout is only html, body, and `Providers`, so `/portal` can render its own dashboard shell. Route groups do not change URLs.
- Project descriptions live in the `projects` array in `src/app/(site)/projects/page.tsx`.
- Articles are MDX at `src/app/(site)/articles/<slug>/page.mdx`, discovered by glob in `src/lib/articles.ts`. That glob path and the `require.context` in `src/app/feed.xml/route.ts` are hardcoded, so moving the articles directory means updating both. A wrong glob path fails silently by returning no articles, so after any move confirm `/articles` still lists every article rather than trusting a green build.
- Project case studies are MDX at `src/app/(site)/projects/<slug>/page.mdx` and linked from a project's `caseStudy` field.
- Card primitives (`Card.Eyebrow`, `Card.Description`, `Card.Link`) live in `src/components/Card.tsx`. Reuse them rather than restyling.
- `Card.Link` renders a `z-20` overlay across the whole card. Any interactive or visible child must sit at `relative z-10` or it will be covered.
- The client portal design record lives in `docs/portal-concept.md`. Treat it as fixed requirements and update it when a design decision changes. Firestore rules plus their test suite landed in phase 1 (`firestore.rules`, `tests/rules/`); the portal UI lives under `src/app/portal/` with components in `src/components/portal/` and helpers in `src/lib/firebase/` and `src/lib/portal/`. The portal is a standalone dashboard shell (sidebar plus top bar, `src/components/portal/shell/`), not the site chrome: every section is its own route, `src/components/portal/shell/nav.ts` is the single source of truth for the route shapes, and `PortalDataProvider` plus `ProjectProvider` own the shared listeners. The admin surface is at `/portal/admin`, gated by the `admin` custom claim. Client accounts are created through `POST /api/admin/clients`, the only server-side write surface; every other write goes through the client SDK under the rules. Messages carry a denormalized `senderName`. Everything runs against the Firebase emulators only; no real Firebase project exists yet.

## Commands

```bash
npm run dev         # dev server
npm run build       # production build, catches MDX compile errors
npm run lint        # next lint
npm run emulators   # Firebase emulators (Firestore, Auth, UI on port 4000)
npm run seed        # seed the running emulators with portal sample data
npm run test:rules  # Firestore rules test suite (boots its own emulator)
```

Two emulator footguns worth knowing:

- The rules suite calls `clearFirestore()` between tests. `npm run test:rules` boots its own emulator, so it is safe, but pointing vitest at an already-running dev emulator (for example when port 8080 is taken) wipes your dev data. Reseed with `npm run seed` after that.
- Running `npm run build` while `npm run dev` is running clobbers `.next` and the dev server starts throwing "Cannot find module" errors. Restart the dev server after a build.
