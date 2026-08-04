import Image from 'next/image'
import Link from 'next/link'

import { BackButton } from '@/components/BackButton'
import { Container } from '@/components/Container'
import { Prose } from '@/components/Prose'
import { ShareLinks } from '@/components/ShareLinks'
import { Tags } from '@/components/Tags'
import avatarImage from '@/images/avatar.jpg'
import { getAllArticles, type ArticleWithSlug } from '@/lib/articles'
import { formatDate } from '@/lib/formatDate'
import { readingTime } from '@/lib/readingTime'
import { absoluteUrl } from '@/lib/siteUrl'

function AdjacentArticle({
  article,
  direction,
}: {
  article: ArticleWithSlug
  direction: 'Previous' | 'Next'
}) {
  return (
    <Link
      href={`/articles/${article.slug}`}
      className="group flex flex-col rounded-2xl border border-zinc-100 p-4 transition hover:border-zinc-200 dark:border-zinc-700/40 dark:hover:border-zinc-700"
    >
      <span className="text-xs font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
        {direction}
      </span>
      <span className="mt-2 text-sm font-semibold text-zinc-800 transition group-hover:text-teal-500 dark:text-zinc-100">
        {article.title}
      </span>
    </Link>
  )
}

// A server component so it can read the full article list for prev/next and
// compute reading time during render. The back button is the only piece that
// needs the client, and it lives in its own module.
export async function ArticleLayout({
  article,
  children,
}: {
  article: ArticleWithSlug
  children: React.ReactNode
}) {
  let articles = await getAllArticles()
  let index = articles.findIndex((entry) => entry.slug === article.slug)
  // Sorted newest first, so the newer neighbour is the lower index.
  let next = index > 0 ? articles[index - 1] : undefined
  let previous =
    index >= 0 && index < articles.length - 1 ? articles[index + 1] : undefined

  let minutes = readingTime(children)
  let url = absoluteUrl(`/articles/${article.slug}`)

  return (
    <Container className="mt-16 lg:mt-32">
      <div className="xl:relative">
        <div className="mx-auto max-w-2xl">
          <BackButton label="Go back to articles" />
          <article>
            <header className="flex flex-col">
              <h1 className="mt-6 text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100">
                {article.title}
              </h1>
              <div className="order-first flex items-center gap-3">
                <Image
                  src={avatarImage}
                  alt=""
                  sizes="2rem"
                  className="h-8 w-8 rounded-full bg-zinc-100 object-cover dark:bg-zinc-800"
                />
                <div className="flex flex-wrap items-center gap-x-2 text-sm text-zinc-500 dark:text-zinc-400">
                  <span className="font-medium text-zinc-700 dark:text-zinc-300">
                    {article.author}
                  </span>
                  <span aria-hidden="true">·</span>
                  <time dateTime={article.date}>{formatDate(article.date)}</time>
                  <span aria-hidden="true">·</span>
                  <span>{minutes} min read</span>
                </div>
              </div>
              {article.tags && article.tags.length > 0 && (
                <div className="mt-6">
                  <Tags tags={article.tags} />
                </div>
              )}
            </header>
            <Prose className="mt-8" data-mdx-content>
              {children}
            </Prose>
          </article>

          <footer className="mt-16 border-t border-zinc-100 pt-8 dark:border-zinc-700/40">
            <ShareLinks url={url} title={article.title} />
            {(previous || next) && (
              <nav
                aria-label="More articles"
                className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2"
              >
                {previous && (
                  <AdjacentArticle article={previous} direction="Previous" />
                )}
                {next && <AdjacentArticle article={next} direction="Next" />}
              </nav>
            )}
          </footer>
        </div>
      </div>
    </Container>
  )
}
