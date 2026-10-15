import type { ImageProps } from 'next/image'

import logoAutoAiConnect from '@/images/logos/autoaiconnect.png'
import logoExploda from '@/images/logos/exploda.jpeg'
import logoGenZ from '@/images/logos/genz.svg'
import logoPath90 from '@/images/logos/path90.png'
import logoRoomee from '@/images/logos/roomee.png'
import coverAutoAiConnect from '@/images/work/autoaiconnect/cover.jpg'
import coverPath90 from '@/images/work/path90/cover.jpg'

export interface WorkProject {
  // Drives /work/<slug>. Must match the case study directory name when
  // caseStudy is true.
  slug: string
  name: string
  role: string
  description: string
  // One line under the pill on the home project cards. Outcome first.
  tagline?: string
  stack: Array<string>
  year?: string
  // Cover art for the index card and the case study hero. Optional: the
  // CoverImage component draws a slug-seeded placeholder until a real file
  // lands at src/images/work/<slug>/cover.jpg and gets imported here.
  cover?: ImageProps['src']
  link?: { href: string; label: string }
  logo?: ImageProps['src']
  builtWith?: { name: string; logo: ImageProps['src'] }
  // True when src/app/(site)/work/<slug>/page.mdx exists. Decides whether the
  // card links inward to the case study or outward to the live site.
  caseStudy: boolean
}

export const workProjects: Array<WorkProject> = [
  {
    slug: 'roomee',
    name: 'Roomee',
    role: 'Personal project',
    year: '2024 to present',
    description:
      'A rental marketplace for students and young professionals in Morocco. I build it end to end: listing ingestion, search, and the matching that pairs renters with places they can actually afford.',
    tagline: 'Rooms that students can actually afford',
    // TODO: confirm stack
    stack: ['Next.js', 'TypeScript', 'PostgreSQL', 'Supabase'],
    link: { href: 'https://roomee.ma', label: 'roomee.ma' },
    logo: logoRoomee,
    caseStudy: true,
  },
  {
    slug: 'path90',
    name: 'Path90',
    role: 'Freelance engineer, with Exploda',
    description:
      'A progressive web app that guides people through parole, tracking obligations, appointments, and check-ins so nothing slips. Built offline-first, because the people using it cannot count on a stable connection.',
    // TODO: confirm stack
    tagline: 'Offline-first, for people who can’t count on a signal',
    stack: ['React', 'TypeScript', 'PWA', 'Firestore'],
    cover: coverPath90,
    link: { href: 'https://path90app.com', label: 'path90app.com' },
    builtWith: { name: 'Exploda', logo: logoExploda },
    logo: logoPath90,
    caseStudy: true,
  },
  {
    slug: 'autoaiconnect',
    name: 'AutoAiConnect',
    role: 'Freelance engineer, with Exploda',
    description:
      'A mobile client for conversing with AI agents, built with Exploda. Currently unreleased.',
    // TODO: confirm stack
    tagline: 'A mobile client for talking to AI agents',
    stack: ['React Native', 'TypeScript'],
    cover: coverAutoAiConnect,
    builtWith: { name: 'Exploda', logo: logoExploda },
    logo: logoAutoAiConnect,
    caseStudy: false,
  },
  {
    slug: 'genz',
    name: 'GenZ',
    role: 'Solo project',
    description:
      'A platform for academic orientation and career guidance, helping students map their subjects and interests onto real paths.',
    // TODO: confirm stack
    stack: ['React', 'Node.js', 'MongoDB'],
    link: { href: 'https://github.com/YIPA-01/GenZ-Platform', label: 'GitHub' },
    logo: logoGenZ,
    caseStudy: false,
  },
]

export function getWorkProject(slug: string) {
  return workProjects.find((project) => project.slug === slug)
}
