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

- Project descriptions live in the `projects` array in `src/app/projects/page.tsx`.
- Articles are MDX at `src/app/articles/<slug>/page.mdx`, discovered by glob in `src/lib/articles.ts`.
- Project case studies are MDX at `src/app/projects/<slug>/page.mdx` and linked from a project's `caseStudy` field.
- Card primitives (`Card.Eyebrow`, `Card.Description`, `Card.Link`) live in `src/components/Card.tsx`. Reuse them rather than restyling.
- `Card.Link` renders a `z-20` overlay across the whole card. Any interactive or visible child must sit at `relative z-10` or it will be covered.
- The client portal design record lives in `docs/portal-concept.md`. Concept only, nothing is implemented yet. Treat it as fixed requirements when portal work starts, and update it when a design decision changes.

## Commands

```bash
npm run dev     # dev server
npm run build   # production build, catches MDX compile errors
npm run lint    # next lint
```
