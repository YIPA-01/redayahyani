import { type Metadata } from 'next'
import Link from 'next/link'

import { Container } from '@/components/Container'
import { contact } from '@/lib/cv'
import { ogImageUrl } from '@/lib/siteUrl'

const title = 'Accessibility'
const intro =
  'I design for the people a product is most likely to leave out, then build outward. This site is held to the same standard: here is what it does, what you can change, and where it still falls short.'

export const metadata: Metadata = {
  title,
  description: intro,
  openGraph: {
    title,
    description: intro,
    type: 'website',
    images: [ogImageUrl({ title: 'Accessibility', eyebrow: 'Reda Yahyani' })],
  },
}

const preferences = [
  {
    name: 'Motion',
    body: 'Reduced stops everything that moves on its own: the scrolling menu, the changing typefaces, the looping diagram. Off stops all movement, hovers included. If your device already asks for reduced motion, the site treats that as Off.',
  },
  {
    name: 'Text size',
    body: '115% or 130%. The whole layout scales with it, so nothing gets cut off or overlaps.',
  },
  {
    name: 'Typeface',
    body: 'Readable swaps every decorative face for Atkinson Hyperlegible, a typeface the Braille Institute designed for low-vision readers. Text also stops changing shape. The font only downloads if you choose it, so nobody else pays for it on a slow connection.',
  },
  {
    name: 'Contrast',
    body: 'High darkens secondary text, lines, and accent colors well beyond the minimum.',
  },
  {
    name: 'Underline links',
    body: 'So you never have to tell a link apart by color alone.',
  },
]

const defaults = [
  'Every page works with a keyboard alone. A “Skip to content” link is the first thing you reach, and focus is always visible.',
  'Text meets WCAG 2.2 AA contrast (4.5:1) in light and dark mode. The coral accent has a darker version used only for text, because the bright one is too light to read.',
  'Anything that moves on its own for more than five seconds has a visible pause button, and nothing flashes.',
  'Decorative drawings are hidden from screen readers. Charts and diagrams that carry meaning, like the designer and engineer split and the process diagram, are described in words.',
  'Pages are rendered on the server, so the content is there before any script runs. Animation is a layer on top, never the way in.',
]

function Section({
  heading,
  children,
}: {
  heading: string
  children: React.ReactNode
}) {
  return (
    <section className="grid gap-4 border-t border-line pt-10 md:grid-cols-[14rem_1fr] md:gap-10">
      <h2 className="text-lg font-medium">{heading}</h2>
      <div className="min-w-0 space-y-4 text-muted">{children}</div>
    </section>
  )
}

export default function Accessibility() {
  return (
    <Container className="mt-16 sm:mt-24">
      <header className="max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-[0.08em] text-muted">
          Accessibility
        </p>
        <h1 className="mt-3 text-balance text-4xl font-medium leading-tight sm:text-5xl">
          Built for the edges first.
        </h1>
        <p className="mt-6 text-lg text-muted">{intro}</p>
      </header>

      <div className="mt-16 grid gap-12">
        <Section heading="Change it to suit you">
          <p>
            The accessibility button in the header opens Display preferences.
            Your choices are saved on your device and applied before the page
            draws, so it never flashes the defaults first.
          </p>
          <dl className="grid gap-4">
            {preferences.map((preference) => (
              <div key={preference.name}>
                <dt className="font-medium text-ink">{preference.name}</dt>
                <dd className="mt-1">{preference.body}</dd>
              </div>
            ))}
          </dl>
        </Section>

        <Section heading="What it does by default">
          <ul className="list-disc space-y-3 pl-5">
            {defaults.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Section>

        <Section heading="Standard and testing">
          <p>
            I aim for WCAG 2.2 level AA. I check pages with automated tests
            (axe), by using them with a keyboard alone, and by measuring the
            contrast of every text color in every mode.
          </p>
        </Section>

        <Section heading="Where it falls short">
          <ul className="list-disc space-y-3 pl-5">
            <li>
              Project cover images are treated as decoration, so they are not
              described in detail. Each project is described in text instead.
            </li>
            <li>
              The preview images shown when a page is shared are pictures of
              text.
            </li>
            <li>
              The private client portal has not been through this review yet.
            </li>
          </ul>
        </Section>

        <Section heading="Found a barrier?">
          {/* TODO(Reda): confirm the reply promise before launch. */}
          <p>
            Tell me what you were trying to do and what got in the way, and I
            will fix it. Email{' '}
            <a
              href={`mailto:${contact.email}?subject=${encodeURIComponent(
                'Accessibility barrier',
              )}`}
              className="font-medium text-ink underline decoration-line underline-offset-4 transition hover:text-coral-text hover:decoration-current"
            >
              {contact.email}
            </a>
            , or use the message box on the{' '}
            <Link
              href="/services#contact"
              className="font-medium text-ink underline decoration-line underline-offset-4 transition hover:text-coral-text hover:decoration-current"
            >
              contact form
            </Link>
            .
          </p>
        </Section>
      </div>
    </Container>
  )
}
