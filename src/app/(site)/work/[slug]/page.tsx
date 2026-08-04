import { type Metadata } from 'next'
import { notFound } from 'next/navigation'

import { BackButton } from '@/components/BackButton'
import { Container } from '@/components/Container'
import { formatDate } from '@/lib/formatDate'
import { ogImageUrl } from '@/lib/siteUrl'
import { getPublicProject } from '@/lib/work/publicProjects'

// Static segments such as /work/roomee take routing priority over this
// dynamic one, so case studies are unaffected. This route serves only the
// live client projects that have a public profile in Firestore.
export const revalidate = 300

// Slugs are admin-authored free text, so one may contain characters that
// arrive percent-encoded. Decoding is guarded because a malformed sequence
// throws rather than returning the original string.
function decodeParam(slug: string) {
  try {
    return decodeURIComponent(slug)
  } catch {
    return slug
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const result = await getPublicProject(decodeParam(params.slug))
  if (!result) return {}

  const { project } = result
  const url = `/work/${project.slug}`

  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: url },
    openGraph: {
      title: project.title,
      description: project.summary,
      type: 'article',
      url,
      images: [
        ogImageUrl({ title: project.title, eyebrow: `In progress, ${project.phase}` }),
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: project.title,
      description: project.summary,
    },
  }
}

export default async function PublicProjectPage({
  params,
}: {
  params: { slug: string }
}) {
  const result = await getPublicProject(decodeParam(params.slug))
  if (!result) notFound()

  const { project, journal } = result

  return (
    <Container className="mt-16 lg:mt-32">
      <div className="xl:relative">
        <div className="mx-auto max-w-2xl">
          <BackButton label="Go back to work" />

          <header className="flex flex-col">
            <div className="order-first flex items-center gap-2">
              <span className="flex items-center gap-1.5 rounded-full bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-700 dark:bg-teal-500/10 dark:text-teal-400">
                <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                In progress
              </span>
              <span className="text-sm text-zinc-400 dark:text-zinc-500">
                {project.phase}
              </span>
            </div>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100">
              {project.title}
            </h1>
            <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
              {project.summary}
            </p>
          </header>

          <section className="mt-16">
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Public journal
            </h2>
            {journal.length === 0 ? (
              <p className="mt-6 text-sm text-zinc-500 dark:text-zinc-400">
                Nothing published yet. Updates land here as the work moves.
              </p>
            ) : (
              <ol className="mt-8 space-y-12 border-l border-zinc-100 pl-6 dark:border-zinc-700/40">
                {journal.map((entry) => (
                  <li key={entry.id} className="relative">
                    <span
                      aria-hidden="true"
                      className="absolute -left-[1.8125rem] top-1.5 h-2.5 w-2.5 rounded-full bg-zinc-200 ring-4 ring-zinc-50 dark:bg-zinc-600 dark:ring-black"
                    />
                    <time
                      dateTime={entry.publishedAt}
                      className="text-sm text-zinc-400 dark:text-zinc-500"
                    >
                      {formatDate(entry.publishedAt)}
                    </time>
                    <h3 className="mt-2 text-base font-semibold text-zinc-800 dark:text-zinc-100">
                      {entry.title}
                    </h3>
                    <p className="mt-2 whitespace-pre-line text-sm text-zinc-600 dark:text-zinc-400">
                      {entry.body}
                    </p>
                  </li>
                ))}
              </ol>
            )}
          </section>
        </div>
      </div>
    </Container>
  )
}
