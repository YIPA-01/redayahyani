// The CV facts the footer and About render. Source of truth is
// public/Resume.pdf; keep the two in step when either changes.

export interface CvEntry {
  title: string
  lines: Array<string>
}

export const education: Array<CvEntry> = [
  {
    title: 'Supmti',
    lines: ['Bachelor’s in Computer Systems Engineering', '2025'],
  },
]

export const experience: Array<CvEntry> = [
  {
    title: 'Exploda',
    lines: ['Software Engineer (Freelance)', '2026 to present', 'Remote'],
  },
  {
    title: 'Self-employed',
    lines: ['Full-stack developer', 'Jan 2024 to Jun 2026'],
  },
  {
    title: 'Foundever, Abbott project',
    lines: ['Customer Service Advisor', '3 months'],
  },
  {
    title: 'Roomee',
    lines: ['Product engineer', '2024 to present'],
  },
]

// Grouped the way the footer shows them: practice, stack, languages.
export const skills: Array<Array<string>> = [
  [
    'User research',
    'Flows and wireframes',
    'UI design',
    'Prototyping',
    'Offline-first and sync',
  ],
  [
    'TypeScript',
    'React, Next.js, Vue.js',
    'Laravel',
    'SQL, MongoDB, Firebase',
    'Python (Pandas, NumPy)',
    'Docker, Kubernetes',
    'Git',
  ],
  ['English', 'French', 'Arabic'],
]

export const certifications: Array<CvEntry> = [
  {
    title: 'Foundations of User Experience (UX) Design',
    lines: ['Google'],
  },
  {
    title: 'Entrepreneurial Innovation',
    lines: ['From Idea to Viable Project'],
  },
  { title: 'TOEFL iBT English', lines: ['B2'] },
]

export const contact = {
  email: 'yahyanireda@gmail.com',
  location: 'Agadir, Morocco',
  resume: '/Resume.pdf',
  github: 'https://github.com/YIPA-01',
  linkedin: 'https://www.linkedin.com/in/reda-yahyani',
  x: 'https://x.com/RYahyani19872',
}
