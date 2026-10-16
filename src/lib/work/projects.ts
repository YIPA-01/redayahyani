import type { ImageProps } from 'next/image'

import logoAutoAiConnect from '@/images/logos/autoaiconnect.png'
import logoExploda from '@/images/logos/exploda.jpeg'
import logoGenZ from '@/images/logos/genz.svg'
import logoPath90 from '@/images/logos/path90.png'
import logoRoomee from '@/images/logos/roomee.png'
import coverAutoAiConnect from '@/images/work/autoaiconnect/cover.jpg'
import coverPath90 from '@/images/work/path90/cover.jpg'
import coverRoomee from '@/images/work/roomee/cover.jpg'

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
  // Optional moving cover for the case study hero only: a muted walkthrough
  // in public/work/<slug>/. Cards keep using `cover`, which is also the
  // fallback.
  coverVideo?: { src: string; poster: string }
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
    // TODO: confirm the start year; the current version's history starts March 2026.
    year: '2024 to present',
    description:
      'Students and young professionals in Morocco find a room, a landlord they can trust, or a flatmate who fits. I designed and built it end to end: search and maps, compatibility matching, requests, visits, and realtime chat, in French, Arabic, and English.',
    tagline: 'A room, or a flatmate, you can trust',
    stack: ['Next.js', 'TypeScript', 'Laravel', 'MySQL'],
    cover: coverRoomee,
    coverVideo: {
      src: '/work/roomee/overview.mp4',
      poster: '/work/roomee/overview-poster.jpg',
    },
    link: { href: 'https://roomee.ma', label: 'roomee.ma' },
    logo: logoRoomee,
    caseStudy: true,
  },
  {
    slug: 'path90',
    name: 'Path90',
    role: 'Freelance engineer, with Exploda',
    year: '2026',
    description:
      'People coming home from prison get a 90-day plan on their phone: daily tasks, appointments, and money tools, with their case manager able to see who is falling behind. I built the participant app and the case manager dashboard from the client’s design.',
    tagline: 'The first 90 days home, one day at a time',
    stack: ['Next.js', 'TypeScript', 'Supabase', 'PWA'],
    cover: coverPath90,
    link: { href: 'https://path90app.com', label: 'path90app.com' },
    builtWith: { name: 'Exploda', logo: logoExploda },
    logo: logoPath90,
    caseStudy: true,
  },
  {
    slug: 'autoaiconnect',
    name: 'AutoAiConnect',
    role: 'Freelance backend engineer, with Exploda',
    year: '2026',
    description:
      'Car owners see what their car is worth against what they still owe, and get told when it is a good time to trade up. I built the backend behind the mobile app and the admin portal: the equity engine, payment estimates, a car-aware AI assistant, subscriptions, and daily alerts. Unreleased.',
    tagline: 'Know when your car is ready to trade',
    stack: ['Firebase', 'Cloud Functions', 'TypeScript', 'Stripe', 'Next.js'],
    cover: coverAutoAiConnect,
    builtWith: { name: 'Exploda', logo: logoExploda },
    logo: logoAutoAiConnect,
    caseStudy: true,
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
