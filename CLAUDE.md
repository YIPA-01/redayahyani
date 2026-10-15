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

- Positioning (product engineer, UX-led), audiences, proof points, and the messaging hierarchy live in `docs/brand.md`. New copy follows it; update it first when the positioning changes. The page structure, navigation, and each page's purpose live in `docs/sitemap.md`.
- Write in first person. This is a personal site, not a company page.
- Say what was built and what it took, not what the product category is. "A rental marketplace for students in Morocco. I lead engineering: listing ingestion, search, and matching" beats "A web app whose purpose is to help students find homes."
- No filler definitions. Never describe a tool by what its marketing page says it is. Say why it gets used here.
- Avoid hedges: "helping to build out", "I'm passionate about", "a range of services".

## Conventions

- Marketing pages live in the `src/app/(site)/` route group, which owns the site chrome (`Layout` with `Header` and `Footer`). The root layout is only html, body, and `Providers`, so `/portal` can render its own dashboard shell. Route groups do not change URLs.
- Guest nav is About, Work, Articles. `/writing` (poetry) is deliberately kept out of the header and reachable from the footer and About instead. `/uses` was deleted.
- Project descriptions live in the `workProjects` array in `src/lib/work/projects.ts`, not in a page, because the `/work` index and `src/app/sitemap.ts` both read them.
- Articles are MDX at `src/app/(site)/articles/<slug>/page.mdx`, discovered by glob in `src/lib/articles.ts`. That glob path and the `require.context` in `src/app/feed.xml/route.ts` are hardcoded, so moving the articles directory means updating both. A wrong glob path fails silently by returning no articles, so after any move confirm `/articles` still lists every article rather than trusting a green build.
- Each article's `article` export declares its own `slug`, because an MDX module cannot see its own path and canonical URLs, share links, and prev/next all need it at module scope. `importArticle` throws when it does not match the directory name.
- `/work/<slug>` serves two different things. Static MDX segments (`src/app/(site)/work/<slug>/page.mdx`, flagged `caseStudy: true` in `src/lib/work/projects.ts`) are hand-written case studies. Everything else falls through to `src/app/(site)/work/[slug]/page.tsx`, which serves live client projects from Firestore. Next gives static segments priority, so the two never collide.
- Cover art goes at `src/images/work/<slug>/cover.jpg` and gets imported into the project's `cover` field. Until one exists, `src/components/work/CoverImage.tsx` draws a slug-seeded placeholder, so the layout is already final.
- Page metadata is centralized: `articleMetadata()` in `src/lib/articles.ts` and `caseStudyMetadata()` in `src/lib/work/metadata.ts`. Both build the OG card URL through `ogImageUrl()` in `src/lib/siteUrl.ts`, which points at `src/app/og/route.tsx`. Do not hand-write a `metadata` export on those pages.
- In development Next always resolves `og:image` against localhost regardless of `metadataBase` (`next/dist/lib/metadata/resolvers/resolve-url.js`). Seeing localhost there in `npm run dev` is expected, not a bug. Check a production build to confirm the real origin.
- All long-form content renders through `Prose` (`src/components/Prose.tsx`), which is nothing but `prose dark:prose-invert`. Every margin between MDX paragraphs, headings, and lists comes from `typography.ts`, and Tailwind's preflight zeroes element margins, so if the `prose` rules go missing the page collapses into one solid block with no spacing. When MDX looks unspaced, the MDX source is never the thing to fix. Check the stylesheet: `npx tailwindcss -i src/styles/tailwind.css | grep -c prose` should print a number in the hundreds, not 0.
- The `NODE_OPTIONS=--no-experimental-strip-types` in the `dev` and `build` scripts is load-bearing, not leftover debugging. Node 23.6 and later strip types by default, so Tailwind's config loader `require`s `tailwind.config.ts` natively instead of falling back to jiti, and the `@tailwindcss/typography` import inside it then resolves to an empty object through a circular require back into `tailwindcss`. Tailwind drops a plugin that is not a function without warning, so the failure is silent: the build stays green, `npm run lint` passes, and every prose rule disappears. Removing the flag brings the bug straight back.
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
