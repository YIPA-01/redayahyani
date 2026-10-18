import Link from 'next/link'

import { Container } from '@/components/Container'
import { FillButton } from '@/components/FillButton'
import { ProjectCards } from '@/components/sections/ProjectCards'
import { RoleSplit } from '@/components/sections/RoleSplit'
import { StatementCard } from '@/components/sections/StatementCard'
import { contact } from '@/lib/cv'
import { type WorkProject, workProjects } from '@/lib/work/projects'

// Home's project row shows the projects that have real covers or a
// placeholder worth showing, in this order. GenZ stays on /work.
const featured = ['path90', 'roomee', 'autoaiconnect']

export default function Home() {
  let projects = featured
    .map((slug) => workProjects.find((project) => project.slug === slug))
    .filter((project): project is WorkProject => project !== undefined)

  return (
    <>
      <Container className="mt-8 sm:mt-12">
        <h1 className="sr-only">Reda Yahyani, product engineer</h1>
        <StatementCard text="Designing and building web products from the first flow sketch to the database underneath it." />
        <div className="mt-5 flex flex-wrap justify-center gap-x-8 gap-y-3 text-[0.9375rem]">
          <Link
            href="/services#contact"
            className="font-medium transition hover:text-coral-text"
          >
            Start a project →
          </Link>
          <a
            href={contact.resume}
            download="Reda-Yahyani-Resume.pdf"
            className="transition hover:text-coral-text"
          >
            Download CV ↓
          </a>
        </div>
      </Container>

      <Container className="mt-10 sm:mt-20">
        <ProjectCards projects={projects} />
      </Container>

      <Container className="mt-14 sm:mt-28">
        <RoleSplit />
      </Container>

      <Container className="mt-14 sm:mt-28">
        <div className="flex flex-col items-start justify-between gap-6 rounded-[28px] bg-panel p-6 sm:flex-row sm:items-center sm:p-10">
          <p className="max-w-md text-balance text-2xl font-medium leading-snug">
            Have a product that needs building?
          </p>
          <FillButton href="/services#contact" className="px-5 py-2.5 text-sm">
            Start a project
          </FillButton>
        </div>
      </Container>
    </>
  )
}
