import { type Metadata } from 'next'
import Link from 'next/link'

import { Contact } from '@/components/Contact'
import { Container } from '@/components/Container'
import { Redline } from '@/components/motion/Redline'
import { Disciplines } from '@/components/sections/Disciplines'
import { ProcessDiagram } from '@/components/sections/ProcessDiagram'
import { contact } from '@/lib/cv'
import { ogImageUrl } from '@/lib/siteUrl'
import { getWorkProject, type WorkProject } from '@/lib/work/projects'

const title = 'Services'
const intro =
  'I take products from the first flow sketch to production: research, design, front end, backend, and the deploy. One person across the whole stack, so nothing gets lost between handoffs.'

export const metadata: Metadata = {
  title,
  description: intro,
  openGraph: {
    title,
    description: intro,
    type: 'website',
    images: [ogImageUrl({ title: 'How I work', eyebrow: 'Reda Yahyani' })],
  },
}

const engagements = [
  {
    title: 'New products',
    body: 'From an idea and a rough audience to a product people can use. I learn who it is for, prototype the critical path, then build and ship it.',
  },
  {
    title: 'UX and front-end overhauls',
    body: 'An existing product that works but is hard to use. I find where people get stuck, redesign those flows, and rebuild the front end around them.',
  },
  {
    title: 'Ongoing engineering',
    body: 'A steady pair of hands after launch: new features, fixes, and the slow work of making a product faster and calmer to use.',
  },
]

const portalFeatures = [
  { title: 'Milestones', body: 'Where the project stands, phase by phase.' },
  {
    title: 'Documents',
    body: 'Specs, designs, and handover files in one place.',
  },
  {
    title: 'Messages',
    body: 'Conversation scoped to your project, not lost in email.',
  },
  { title: 'Requests', body: 'What I need from you, and a place to send it.' },
]

// TODO(Reda): confirm these answers match how you actually work before launch.
const faq = [
  {
    question: 'How long does a project take?',
    answer:
      'It depends on scope. After a first conversation I write up the scope and a timeline, and we agree on both before any work starts.',
  },
  {
    question: 'How does pricing work?',
    answer:
      'I quote per project once the scope is clear, so you know the cost before anything is built.',
  },
  {
    question: 'What do you build with?',
    answer:
      'Mostly TypeScript, React, and Next.js on the front end, with Firebase, SQL, or MongoDB behind it, depending on what the product needs.',
  },
  {
    question: 'Do you work remotely?',
    answer: `Yes. I am based in ${contact.location} and work with clients remotely.`,
  },
]

function SectionHeading({
  eyebrow,
  children,
}: {
  eyebrow: string
  children: React.ReactNode
}) {
  return (
    <div className="mb-10">
      <p className="font-mono text-xs uppercase tracking-[0.08em] text-muted">
        {eyebrow}
      </p>
      <Redline className="mt-2">
        <h2 className="text-balance text-[clamp(1.75rem,3.6vw,2.5rem)] font-medium leading-tight">
          {children}
        </h2>
      </Redline>
    </div>
  )
}

export default function Services() {
  let caseStudies = ['path90', 'roomee']
    .map((slug) => getWorkProject(slug))
    .filter((project): project is WorkProject => project !== undefined)

  return (
    <>
      <Container className="mt-16 sm:mt-24">
        <header className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.08em] text-muted">
            Services
          </p>
          <h1 className="mt-3 text-balance text-4xl font-medium leading-tight sm:text-5xl">
            Part designer, part engineer, all the way to production.
          </h1>
          <p className="mt-6 text-lg text-muted">{intro}</p>
        </header>
      </Container>

      <Container className="mt-12 sm:mt-16">
        <Disciplines />
      </Container>

      <Container className="mt-16 sm:mt-24">
        <ProcessDiagram />
      </Container>

      <Container className="mt-24 sm:mt-32">
        <SectionHeading eyebrow="What I take on">
          Three ways to work together
        </SectionHeading>
        <ul role="list" className="grid gap-4 lg:grid-cols-3">
          {engagements.map((engagement) => (
            <li key={engagement.title} className="rounded-[22px] bg-panel p-6">
              <h3 className="text-lg font-medium">{engagement.title}</h3>
              <p className="mt-2 text-muted">{engagement.body}</p>
            </li>
          ))}
        </ul>
      </Container>

      <Container className="mt-24 sm:mt-32">
        <SectionHeading eyebrow="The client portal">
          You always know where your project stands
        </SectionHeading>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-start">
          <div className="space-y-4 text-muted">
            <p>
              Every client gets a private portal for their project. It is the
              same product thinking I bring to your users, pointed at you: one
              place to see progress, find files, and answer what I need.
            </p>
            <Link
              href="/portal/sign-in"
              className="inline-block font-medium text-ink transition hover:text-coral-text"
            >
              Client sign in →
            </Link>
          </div>
          <dl className="grid gap-px overflow-hidden rounded-[22px] border border-line bg-line sm:grid-cols-2">
            {portalFeatures.map((feature) => (
              <div key={feature.title} className="bg-canvas p-5">
                <dt className="font-medium">{feature.title}</dt>
                <dd className="mt-1 text-sm text-muted">{feature.body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Container>

      <Container className="mt-24 sm:mt-32">
        <SectionHeading eyebrow="Outcomes">
          What this looks like in practice
        </SectionHeading>
        <ul role="list" className="grid gap-4 sm:grid-cols-2">
          {caseStudies.map((project) => (
            <li key={project.slug}>
              <Link
                href={`/work/${project.slug}`}
                className="group block h-full rounded-[22px] border border-line p-6 transition hover:border-coral"
              >
                <p className="font-mono text-xs uppercase tracking-[0.08em] text-muted">
                  {project.role}
                </p>
                <h3 className="mt-2 text-xl font-medium">{project.name}</h3>
                <p className="mt-2 text-muted">{project.tagline}</p>
                <p className="mt-4 text-sm font-medium transition group-hover:text-coral-text">
                  Read the case study →
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </Container>

      <Container className="mt-24 sm:mt-32">
        <SectionHeading eyebrow="Questions">Before we start</SectionHeading>
        <dl className="divide-y divide-line border-y border-line">
          {faq.map((item) => (
            <div
              key={item.question}
              className="grid gap-2 py-6 md:grid-cols-[1fr_1.4fr] md:gap-10"
            >
              <dt className="font-medium">{item.question}</dt>
              <dd className="text-muted">{item.answer}</dd>
            </div>
          ))}
        </dl>
      </Container>

      <Container className="mt-24 scroll-mt-24 sm:mt-32" id="contact">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <div>
            <SectionHeading eyebrow="Start a project">
              Tell me who it is for and what a bad day looks like for them.
            </SectionHeading>
            <p className="-mt-4 text-muted">
              Or email me directly at{' '}
              <a
                href={`mailto:${contact.email}`}
                className="font-medium text-ink transition hover:text-coral-text"
              >
                {contact.email}
              </a>
              .
            </p>
          </div>
          <Contact />
        </div>
      </Container>
    </>
  )
}
