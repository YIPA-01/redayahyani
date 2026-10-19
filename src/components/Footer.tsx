import Link from 'next/link'

import { Container } from '@/components/Container'
import { GitHubIcon, LinkedInIcon, XIcon } from '@/components/SocialIcons'
import {
  certifications,
  contact,
  education,
  experience,
  skills,
  type CvEntry,
} from '@/lib/cv'

// The CV, quietly, at the bottom of every page. Same facts as
// public/Resume.pdf, so a recruiter never has to open the PDF.

const links = [
  { href: '/work', label: 'Work' },
  { href: '/services', label: 'Services' },
  { href: '/articles', label: 'Articles' },
  { href: '/about', label: 'About' },
  { href: '/writing', label: 'Writing' },
  { href: '/library', label: 'Library' },
  { href: '/accessibility', label: 'Accessibility' },
  { href: '/portal/sign-in', label: 'Client portal' },
]

const socials = [
  { href: contact.github, label: 'GitHub', icon: GitHubIcon },
  { href: contact.linkedin, label: 'LinkedIn', icon: LinkedInIcon },
  { href: contact.x, label: 'X', icon: XIcon },
]

function Column({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div>
      <h2 className="mb-3.5 text-[1.0625rem] font-medium text-ink">{title}</h2>
      <div className="grid gap-[1.125rem] text-[0.9375rem] leading-normal text-muted">
        {children}
      </div>
    </div>
  )
}

function Entries({ entries }: { entries: Array<CvEntry> }) {
  return entries.map((entry) => (
    <div key={entry.title}>
      <div className="text-ink">{entry.title}</div>
      {entry.lines.map((line) => (
        <div key={line}>{line}</div>
      ))}
    </div>
  ))
}

const cv = [
  { title: 'Education', content: <Entries entries={education} /> },
  { title: 'Experience', content: <Entries entries={experience} /> },
  {
    title: 'Skills',
    content: skills.map((group) => (
      <div key={group[0]}>
        {group.map((skill) => (
          <div key={skill}>{skill}</div>
        ))}
      </div>
    )),
  },
  { title: 'Certifications', content: <Entries entries={certifications} /> },
]

function ChevronDownIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
      <path
        d="M4.75 6.75 8 10l3.25-3.25"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function Footer() {
  return (
    <footer className="mt-16 flex-none sm:mt-32">
      <Container>
        {/* Phones get the CV as four closed disclosures so it doesn't add
            two screens to every page; from lg it lies open in four columns. */}
        <div className="border-t border-line lg:hidden">
          {cv.map(({ title, content }) => (
            <details key={title} className="group border-b border-line">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between text-[1.0625rem] font-medium text-ink [&::-webkit-details-marker]:hidden">
                {title}
                <ChevronDownIcon className="h-4 w-4 stroke-muted transition group-open:rotate-180 motion-reduce:transition-none" />
              </summary>
              <div className="grid gap-[1.125rem] pb-6 text-[0.9375rem] leading-normal text-muted">
                {content}
              </div>
            </details>
          ))}
        </div>
        <div className="hidden grid-cols-4 gap-x-8 border-t border-line pt-10 lg:grid">
          {cv.map(({ title, content }) => (
            <Column key={title} title={title}>
              {content}
            </Column>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-x-8 gap-y-5 pb-10 text-sm text-muted lg:mt-14">
          <div className="flex gap-3.5">
            {socials.map(({ href, label, icon: Icon }) => (
              <Link
                key={label}
                href={href}
                aria-label={label}
                className="-m-1.5 fill-muted p-1.5 transition hover:fill-coral"
              >
                <Icon className="h-5 w-5" />
              </Link>
            ))}
          </div>
          <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition hover:text-coral-text"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex flex-wrap gap-x-5 gap-y-1">
            <a
              href={`mailto:${contact.email}`}
              className="text-ink transition hover:text-coral-text"
            >
              {contact.email}
            </a>
            <span>{contact.location}</span>
            <span>&copy; {new Date().getFullYear()}</span>
          </div>
        </div>
      </Container>
    </footer>
  )
}
