# Case study structure

**Status: settled. Path90 is the first real case study; the components it needed are built, the rest are planned.** This is the reference for every case study at `/work/<slug>`. It merges the Google UX Design Certificate case study deck with business requirements and a full engineering section, because the positioning in `docs/brand.md` is product engineer, UX-led: the design process and the engineering both have to be visible, and each has to trace back to the user.

The worked example is the fictional Roomee test page (private artifact, https://claude.ai/artifact/QDHhVxDHg818Wmy13swQT5). Its structure is the reference; its content is invented, does not describe the real Roomee (which has no deduplication or commute times), and must never be copied into a real case study. The real Roomee case study is `src/app/(site)/work/roomee/page.mdx`.

## Rules

- **No invented material.** Research, personas, numbers, quotes, and diagrams come from the project's own directory (brief, Figma, test notes, repo). When something is missing, leave an MDX comment `{/* TODO: ... */}` saying what is needed. Never write placeholder prose.
- **Everything traces back.** Requirements are numbered (`R1`, `R2`...). Pain points, wireframe annotations, decisions, and the traceability table cite those IDs. Decisions are numbered `D1`, `D2`...
- **Show misses.** Outcomes are reported against the targets set in section 2, including the ones that were missed. A missed target usually becomes a next step.
- **Voice.** First person, no em or en dashes, lead with the person and then the mechanism, name the decision and the option rejected (`CLAUDE.md`, `docs/brand.md`).
- **Diagrams are real.** Draw the system that exists, at the level it actually works at. A small true diagram beats a big generic one.

## Sections

Seven sections, each an H2, in this order. The order is a real sequence (from the business inward to the code and back out to results), so the numbering is shown on the page.

| # | Section | Required | Source in the project directory |
|---|---|---|---|
| 1 | Overview | Yes | Brief, contract, repo history |
| 2 | Business requirements | Yes | Client brief, kickoff notes, analytics targets |
| 3 | Understanding the user | Yes | Interview notes, surveys, client knowledge of users |
| 4 | Designing | Shorten if little material | Figma, sketches, test sessions |
| 5 | Refining | Shorten if little material | Figma versions, test findings |
| 6 | Engineering | Yes | Repo, schema, infra, tests |
| 7 | Outcome | Yes | Analytics, client feedback, launch notes |

### 1. Overview

What the reader needs before anything else.

- **The product:** what it is and who uses it, in two or three sentences.
- **The problem:** one or two sentences, from the user's side.
- **The goal:** one sentence a user could say. This is the page's one serif statement (Instrument Serif italic).
- **Duration:** month and year to month and year.
- **My role** and **responsibilities** (research, wireframes, testing, UI, architecture, deploys...).
- **Team:** who else was involved, for example the client or Exploda.

Role, year, stack, and link come from `src/lib/work/projects.ts` through `CaseStudyLayout`; do not repeat them in the MDX.

Component: `Overview`.

### 2. Business requirements

What the business needed, written before the research.

- **Goals:** two to four business goals.
- **Stakeholders:** everyone with a stake, including people who are not users (parents, funders, agencies).
- **Success metrics:** a table of metric, target, and why it matters. These are the yardstick for section 7.
- **Constraints:** devices, connectivity, languages, budget, team size, law and compliance, data sources.
- **Scope:** in and out.
- **Requirements:** numbered `R1...Rn`, each with a MoSCoW priority (Must, Should, Could) and, where it comes from research, the pain point it answers.

Components: `FactList`, `Metrics` (targets), `Requirements`.

### 3. Understanding the user

- **Research summary:** methods and sample sizes, the assumptions going in, and what changed after.
- **Pain points:** three or four. Each has a title, a real quote, how it guides the design, and the requirement IDs it produced.
- **Personas:** one or two. Name and age, one-line context, a quote, goals, frustrations, and the problem statement: "[Name] is a [user characteristics] who needs [user need] because [insight]."
- **Journey map:** stages as columns; actions, feeling (1 to 5), pain points, and opportunities as rows.

Components: `PainPoints`, `Persona`, `JourneyMap`.

### 4. Designing

- **User flow:** the critical path as steps, plus secondary flows.
- **Paper wireframes:** the variants explored and the refined one, with the reason the others lost.
- **Digital wireframes:** one or two screens, each with numbered annotations that cite a requirement or pain point.
- **Low-fidelity prototype:** link and the flow it covers.
- **Usability studies:** one block per round with method, participants, and findings, each finding with a count ("4 of 5").

Components: `Flow`, `Figure`, `AnnotatedFigure`, `StudyRound`.

### 5. Refining

- **Before and after:** each pair names the usability finding that caused the change.
- **Final mockups:** the main screens. These also feed the hero cover.
- **High-fidelity prototype:** link.
- **Accessibility considerations:** two or three concrete ones, each saying what was done, not what was intended.

Components: `BeforeAfter`, `Figure`, `Considerations`.

### 6. Engineering

Two halves: conception first (models), then implementation (how the models became code). Open with one paragraph naming the promises the design makes that the data and code have to keep.

#### 6a. Conception

Model from the outside in. The domain model is required; pick the behaviour diagrams that fit the project's hardest problem.

| Diagram | Required | Shows | Use it when |
|---|---|---|---|
| Use case | Yes | Actors, the system boundary, use cases, include and extend | Always: it is the bridge from personas to the system |
| Domain (class) | Yes | Entities, attributes, key operations, relations with multiplicities | Always: the conceptual model the tables come from |
| State | Pick 1 or 2 | The lifecycle of the core entity and what triggers each transition | An entity has a status users care about (listing availability, participant status) |
| Sequence | Pick 1 or 2 | One critical interaction between parts over time, including alternatives | Sync, background jobs, third-party APIs, auth |
| Activity | Optional | A process with branches and parallel work | Ingestion pipelines, onboarding flows |

Each diagram gets a one-line intro saying why it is there and a caption pointing out the one thing worth noticing.

#### 6b. Implementation

- **Architecture:** a diagram of the running parts and how data moves between them, plus a caption.
- **Key decisions:** two to four ADR blocks (`D1...`), each with context, the options considered with the rejected ones visible, the decision, consequences, and the requirement IDs it serves.
- **Physical data model:** the schema derived from the domain model, with a sentence on what changed between the two (a method becoming a generated column, a state becoming an enum).
- **Deep dive:** the one hard problem, in a few paragraphs with code or pseudo-code, ending on the numbers that justify the approach.
- **Quality attributes:** performance, reliability, privacy and security, accessibility in code. Concrete targets only.
- **Testing and delivery:** test strategy, CI, deploys, monitoring.
- **Traceability:** a table of requirement, design, implementation, and how it was verified.

Components: `Diagram` (kinds: `use-case`, `class`, `state`, `sequence`, `activity`, `architecture`), `Decision`, `Code`, `FactList`, `Traceability`.

### 7. Outcome

- **Impact:** the section 2 metrics with their results, each marked met or missed. When there are no numbers yet, a real quote from a user or the client.
- **Retrospective:** two short paragraphs: one on the product or research, one on the engineering.
- **Next steps:** up to three, each with why. Missed targets and unbuilt Could requirements usually land here.

Components: `Metrics` (results), `NextSteps`.

### Variant: the client supplied the design

When the client hands over a finished design (Path90 is the first example), the research, design, and refining belong to them. Sections 3 to 5 then collapse into one section, **The design I was given**:

- A `Callout` that says plainly what was the client's and what was mine.
- What the design is built around, in a paragraph, with one figure of the real screens.
- Where building it meant deciding something the design did not say: offline and error states, platform gaps, accessibility, changes made during the build. Each needs confirming as mine before it ships.

No personas, research, or usability rounds are written for a design I did not research. The other sections stay required, and the engineering section usually carries more of the page.

Dropped from the deck: the "Let's connect" and "Thank you" slides, because `CaseStudyLayout` already ends with prev/next and the contact band.

## Components

Planned for `src/components/case-study/`, exported from one `index.ts`, and imported explicitly in each MDX file (the same pattern as `CaseStudyLayout`), so `mdx-components.tsx` and articles are untouched.

- Every block renders inside `Prose`, so each one wraps itself in `not-prose` and takes its spacing from flex or grid `gap`.
- Colors use the brand tokens (`canvas`, `panel`, `surface`, `ink`, `muted`, `line`, `coral`, `coral-text`). Coral marks graphics; text uses `coral-text`.
- Labels use `font-mono` uppercase, tracked 0.08em. The goal statement is the only `font-serif italic` on the page.
- Wide content (journey map, traceability, diagrams) scrolls inside its own box; the page never scrolls sideways at 375px.
- Diagrams are SVG with a `title` that describes the whole diagram in words, and every color comes from a token so they work in both themes.

| Component | Section |
|---|---|
| `Overview` | 1 |
| `FactList`, `Requirements`, `Metrics` | 2 |
| `PainPoints`, `Persona`, `JourneyMap` | 3 |
| `Flow`, `Figure`, `AnnotatedFigure`, `StudyRound` | 4 |
| `BeforeAfter`, `Considerations` | 5 |
| `Diagram`, `Decision`, `Code`, `Traceability` | 6 |
| `Metrics`, `NextSteps` | 7 |

Navigation is automatic: `CaseStudyLayout` renders a contents list from the page's h2 and h3 headings (`src/components/case-study/TableOfContents.tsx`), as a sticky rail from `xl` and a collapsible "On this page" below that. Heading ids come from `rehype-slug`, so section titles double as deep links (`/work/path90#engineering`). Keep h2 and h3 titles short, since they are the menu; use h4 for anything that should stay out of it.

Built so far (with Path90 and Roomee): `Overview` (with `OverviewRow` and `Goal`), `Requirements`, `FactList`, `Decision`, `Traceability`, `Figure`, `Callout`, `Diagram`, `PainPoints`, `Comparison` (a design reference next to the component it shaped, with what was kept and what changed), and `Video` (a walkthrough with a poster; it never autoplays, and files live in `public/work/<slug>/`). Still planned, to build with the first case study that has the material: `Persona`, `JourneyMap`, `Flow`, `AnnotatedFigure`, `StudyRound`, `BeforeAfter`, `Considerations`, `Metrics`, `NextSteps`. Until then, plain Markdown (tables, lists) covers metrics and next steps.

Diagrams are hand-drawn SVG, one TSX file each, next to the case study in `src/app/(site)/work/<slug>/diagrams/`. They compose the primitives in `src/components/case-study/Diagram.tsx` (`Box`, `Edge`, `Label`, `Actor`, `UseCase`, `ClassBox`, `State`, `Lifeline`, `Message`, `Fragment`). `Diagram` takes a unique `id` (it prefixes the arrow markers, since SVG ids are global to the page) and a `title` that describes the whole diagram in words for screen readers. Mermaid is deliberately not used: it would add a heavy client-side dependency and does not follow the brand tokens.

## Checklist before publishing a case study

- Every section 2 requirement is cited at least once later on the page.
- Every section 2 metric appears in section 7 as met or missed.
- No invented material; remaining gaps are TODO comments, not prose.
- The dash check from `CLAUDE.md` returns nothing.
- `npm run build` passes, and the page reads correctly in both themes at 375px.
