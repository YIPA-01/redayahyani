# Brand

**Status: positioning and voice settled, visual direction open.** This is the reference for every page, card, and case study on the site. Treat it like `docs/portal-concept.md`: fixed until a decision changes, then update it here first.

## Positioning

**Product engineer, UX-led.** I design and build web products end to end, and every technical decision is justified by what it does for the person using the product. The backend work (ingestion, matching, sync, data models) stays visible, but it is always framed by the user outcome it serves.

**One-liner:**

> I'm Reda, a product engineer who starts from the user. I design and build web products end to end, from the first flow sketch to the database underneath it.

**Headline:** I build products from the user inward.

## Audiences

Freelance clients come first, hiring managers second. The site has to work for both without splitting into two sites.

| | Freelance client | Hiring manager |
|---|---|---|
| Question they arrive with | Can this person take my product from idea to launch, and will I know what is going on? | Can this person own a product surface across design and code? |
| What convinces them | Outcomes for real users, a clear process, the client portal as a working sample | Range and depth in case studies, the decisions and tradeoffs, the CV |
| Primary action | Start a project (email) | Download CV, read a case study |

## Proof points

Every claim on the site should trace back to one of these. They come from `src/lib/work/projects.ts` and the case studies.

- **Path90:** a 90-day reentry app for people coming home from prison, plus a case manager dashboard. Built from the client's design as an installable PWA; today's tasks still load and complete with no signal and sync on reconnect.
- **Roomee:** students and young professionals in Morocco find a room, a trusted landlord, or a compatible flatmate. Designed and built end to end: map search, explainable compatibility matching, request-gated chat, visits and contracts, in French, Arabic (RTL), and English.
- **The client portal:** every client gets a private dashboard with milestones, documents, messages, and open requests. It is product work in its own right and a sample of how I run projects.

## Voice

Extends the writing rules in `CLAUDE.md` (no em or en dashes, first person, no hedges).

- **Lead with the person, then the mechanism.** "People in their first weeks home can still tick off today's tasks with no signal. I built the queue that syncs them later" beats "A PWA with offline mutation support."
- **Name the decision and why.** Case studies are about choices and tradeoffs, not feature lists.
- **Plain words.** Write it the way you would say it to a client across a table. No "passionate", no "seamless", no "leveraging".
- **Writing is a supporting trait.** Articles are framed as notes on the craft. Poetry stays in the footer and on About and is never part of the headline.

## Messaging hierarchy

### Home
1. Headline and one-liner (above).
2. Primary action: **Start a project**. Secondary: **Download CV**.
3. Selected work: four cards, each written outcome first.
4. One case study excerpt that shows how I think (Path90, designing for no signal).
5. How I work: the four-step process, ending on the portal.
6. Notes on the craft: latest articles.
7. Footer: contact, socials, a quiet link to poetry.

### Work card pattern
`Name` / `role · years` / one sentence on what changed for the user, then one sentence on what I did / stack / link.

| Project | Role | Card copy |
|---|---|---|
| Roomee | Personal project · 2024 to present | Students and young professionals in Morocco find a room, or a flatmate, they can trust. I designed and built it end to end: search, matching, requests, and realtime chat. |
| Path90 | Freelance, with Exploda · 2026 | People coming home from prison follow a 90-day plan, and their case managers see who is falling behind. I built the app and the dashboard from the client's design. |
| AutoAiConnect | Freelance, with Exploda | A mobile client for conversing with AI agents. Currently unreleased. |
| GenZ | Solo project | Students map their subjects and interests onto real academic and career paths. |

### Case study structure
Seven sections: Overview / Business requirements / Understanding the user / Designing / Refining / Engineering (conception, then implementation) / Outcome. The full definition, diagrams, and components live in `docs/case-study.md`.

### How I work
This is a real sequence, so it is numbered.

1. **Meet the people.** Before any code, I learn who uses the product and what a bad day looks like for them.
2. **Prototype the flow.** I sketch and click through the critical path until it feels obvious, then build it.
3. **Ship to production.** I own the whole stack: interface, data model, sync, and deploys.
4. **Keep you in the loop.** Every client gets a private portal with milestones, documents, messages, and the things I need from them.

Steps 1 to 3 describe the intended process and need Reda's confirmation before going live.

## Visual principles

### Signature

The mark is Reda's handwritten signature, traced and smoothed: a heavy R drawn in one pen stroke, with a knot before the leg, and a hairline Y that cuts across it. It lives in `src/components/Signature.tsx` and always draws in `currentColor`.

| Variant | Use it for | Notes |
|---|---|---|
| `drawn` | Home hero, OG card, lockups with the name, anything 96px tall or more | The Y tail drops below the line, so the mark is tall (3:4). |
| `compact` | Header, footer, avatar, favicon | The Y tail stops where the R ends, so the mark is nearly square. |

- **Optical size:** pass `optical="small"` at 32px and below. The as-drawn weights (R 22, Y 7 on the trace grid) vanish at icon size, so small renders use R 54 and Y 30.
- **Favicon:** `src/app/icon.svg` is the compact variant at small weights, ink on light and white on dark.
- **Color:** ink or white. Coral is reserved for the site's single accent and does not go on the mark.
- **Motion:** where the mark animates, the R is written first in one stroke, then the Y slashes across. It plays once and not at all under reduced motion. The one exception is the phone menu trigger (below), where the Y re-signs itself every 3 s.

### Type

Loaded in `src/app/layout.tsx` (`next/font/google`, plus `next/font/local` for Bitwise) and mapped in `tailwind.config.ts`.

| Role | Face | Tailwind | Used for |
|---|---|---|---|
| Everything | Jost | `font-sans` | Body, headings, nav, labels. Light weight (300) for the big "Part designer" headings. |
| Statements | Instrument Serif, italic | `font-serif italic` | The home statement card. One statement per page at most. |
| Labels | DM Mono | `font-mono` | Uppercase eyebrows, the marquee, small meta. Always tracked (0.08em). |
| Engineering | Bitwise (pixel) | `font-pixel` | Only inside the statement morph and the project card wireframe annotation. Never for reading text. Freeware; its license must stay next to the file in `src/fonts/bitwise/`. |

### Color

Tokens live in `src/styles/tailwind.css` as RGB channels (light on `:root`, dark under `.dark`) and are exposed as Tailwind colors, so `bg-coral/20` works.

| Token | Tailwind | Light | Dark | Role |
|---|---|---|---|---|
| `--bg` | `canvas` | #fafafa | #131215 | Page background |
| `--panel` | `panel` | #f0eef1 | #1c1a1f | Cards, the contact band |
| `--surface` | `surface` | #ffffff | #232026 | Raised items: pills, menus |
| `--ink` | `ink` | #1d1b20 | #f2eff4 | Text, outlines, the signature |
| `--muted` | `muted` | #69656e | #a5a0ab | Secondary text |
| `--line` | `line` | #d9d5dc | #34303a | Hairlines and borders |
| `--coral` | `coral` | #f0543f | #ff6f5a | The one accent: links on hover, emphasis, the hatch fill |
| `--pink` | `blush` | #f29aa5 | #b8566a | The Articles card in the phone menu |

- The Tailwind name for pink is `blush`, because `pink` would replace Tailwind's own pink scale, which the code highlighting in `src/styles/prism.css` uses.
- `accent-*` is a static coral scale (50 to 700) that replaced teal in the pages that kept their Spotlight layout. New work should use `coral`.
- The portal keeps zinc and teal on purpose. Tokens are extended, never replacing the defaults.

### Blueprint grid

The statement card is a drafting surface (`src/components/sections/BlueprintGrid.tsx`, grid CSS in `.blueprint-grid`):

- **Grid:** 24px cells with a heavier line every 4 cells (96px), in `line`. It fades out behind the centre, so the statement sits on a calm area: ink in light mode, white in dark.
- **Shapes:** coral hairlines (1.25px) snapped to the grid, in the top and bottom bands only, never under the text: a circle with its labelled radius, a 90° arc, a square with a corner tick, a crosshair, a triangle, a dimension line labelled with its real length, a rounded rectangle. Labels are DM Mono. Cards narrower than 640px get four corner fragments only.
- **Cursor:** with a fine pointer, shapes within 220px turn (up to 25°) and lean (up to 6px) toward the pointer, easing like a spring, and a snap guide outlines the cell under the pointer with its column and row. Touch and reduced motion get the static drawing.
- The card itself is transparent, with a thin coral border.
- The OG card (`src/app/og/route.tsx`) does not use the grid. It is solid black with the `drawn` signature in white, the name, and "Product engineer". Page cards put their title on top and that lockup at the bottom. The route loads Jost and DM Mono from `src/fonts/` because `next/font` does not reach `ImageResponse`.

### Motion

Motion exists to show the two sides of the work: design (serif, redlines, wireframes) and engineering (pixel and mono type, stacks, drawn systems). Components live in `src/components/motion/`.

- **Statement morph** (`MorphText`): a wave sweeps letter by letter from Instrument Serif italic to Bitwise to DM Mono and back, with a coral pixel front. About 8.5s per loop, and the serif rest (3.5s) is always the longest phase so the sentence stays readable. The serif text stays in flow and is the real text; an `aria-hidden` layer draws the morphing glyphs on its measured positions, so the paragraph never reflows. Pauses on hover and focus, off screen, and in background tabs.
- **Scroll entrances** (`InView`): run once, the first time a section is a quarter visible. Children style only the hidden start with `group-data-[armed=true]/inview:`; the server render, visitors without JS, reduced motion, and anything already on screen at load all get the finished state, so nothing can stay invisible. The process diagram draws its outlines left to right and then a coral dot loops the stages forever; the pie sweeps in, counts up (`CountUp`), and lists its items one by one.
- **Wireframe peel:** hovering a project card wipes a coral blueprint of a screen over the cover, with the stack in Bitwise. It never takes clicks from the card.
- **Fill button** (`FillButton`): every "Start a project" pill (header, home contact band) fills on hover the way gsap.com does: the ink grows as a circle from the exact point the pointer entered and drains back toward where it left, on a long soft ease (700ms) so it pours rather than snaps. The inverted label is clipped to the same circle, so the text is readable at every frame. Keyboard focus fills from the centre; touch taps do not trigger it.
- **Redlines** (`Redline`): hovering a section heading shows its type spec and dimensions, read live from the computed style. Fine pointers only; never on body text.
- **Header marquee:** the desktop navigation is the marquee: Work, Services, Articles, About scroll slowly in a thin pill, the current page in coral, pausing on hover or focus. Only the first copy of each link is reachable by keyboard and screen readers.
- **Phone menu** (`MobileMenu`): on phones the signature is the menu.
  - Idle: while the menu is closed, the Y re-signs itself every 3 s (a 0.9 s stroke redraw). It holds still while the mark is hovered or focused.
  - Open: MorphSVG turns the R into the rising bar of a close mark and the Y into the falling one, and Flip flies the section cards out of the mark into a stack at the bottom of a solid white (dark: black) page. The cards are Work in coral, Services in surface, Articles in blush, and About in ink. Each shows a real count (projects, ways to work together, articles), and About shows the mark.
  - Close: the morph reverses, and the cards fold back into the mark.
  - Under reduced or no motion there is no idle, the mark swaps instantly, and the cards just appear. The site's Motion setting is the pause control for the idle.
- One slow ambient movement per screen at most (the morph, the header marquee, the process dot). The blueprint grid only moves in answer to the cursor.
- Hover feedback is small: a 4 to 6px lift, an arrow nudging 2px, a slice pulling apart.
- Everything that moves on its own stops under `prefers-reduced-motion`.

### Accessibility

The site is held to WCAG 2.2 AA and designed equity first: for the people a design is most likely to leave out (screen reader, keyboard and switch users; people for whom motion is a barrier; low-vision and dyslexic readers; slow connections and old phones). The public account of it is `/accessibility`.

- **Coral for graphics, `coral-text` for words.** Plain coral is 3.3:1 on the light canvas: fine for shapes, borders and fills (3:1), too light for text (4.5:1). Text uses `text-coral-text` (5.2:1 light, 6.8:1 dark). The `accent-500` and `600` shades are the dark, text-safe coral. Secondary text is `muted`, never `zinc-400`.
- **Display preferences** (`src/components/a11y/DisplayPreferences.tsx`, logic in `src/lib/a11y/`): Motion (System, Reduced, Off), Text size (100, 115, 130%), Typeface (Default, Readable: Atkinson Hyperlegible, loaded only on demand), Contrast (Standard, High), Underline links. Stored in localStorage and applied as `data-motion`, `data-text`, `data-type`, `data-contrast`, `data-underline` on `<html>` by an inline script before first paint.
- **Every moving thing obeys Motion, and anything that moves on its own has a pause button** (WCAG 2.2.2): the header marquee and the statement morph have visible pause controls. In code, use `motionLevel()` or `useDisplay()`, never `matchMedia('(prefers-reduced-motion)')` alone: the OS setting counts as Off, and the site setting can be stricter than the OS.
- **Readable type** swaps every display face for Atkinson, sets italics upright and uppercase labels to normal case, and stops the morph.
- **Structure:** a skip link first in the tab order to `<main id="main">`; one coral focus ring for everything; icon buttons always have a visible or accessible name; headings never skip a level.
- **Checked with** axe-core on every main page in both themes (zero violations at the time of writing), keyboard only, and computed contrast for every text token pair in every mode.

### Sections

Reusable pieces live in `src/components/sections/`: `StatementCard`, `Marquee`, `ProjectCards`, `RoleSplit`, `Disciplines`, `ProcessDiagram`. The CV footer reads `src/lib/cv.ts`, which mirrors `public/Resume.pdf`.
