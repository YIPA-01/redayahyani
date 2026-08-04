import type { Metadata } from 'next'
import glob from 'fast-glob'

import { ogImageUrl } from '@/lib/siteUrl'

interface Article {
  // Declared in the MDX file rather than derived, because an MDX module cannot
  // see its own path and canonical URLs, share links, and prev/next all need
  // it at module scope. importArticle asserts it matches the directory name.
  slug: string
  title: string
  description: string
  author: string
  date: string
  tags?: Array<string>
}

export interface ArticleWithSlug extends Article {}

async function importArticle(
  articleFilename: string,
): Promise<ArticleWithSlug> {
  let { article } = (await import(
    `../app/(site)/articles/${articleFilename}`
  )) as {
    default: React.ComponentType
    article: Article
  }

  let slugFromPath = articleFilename.replace(/(\/page)?\.mdx$/, '')
  if (article.slug !== slugFromPath) {
    // Loud on purpose. A mismatch would otherwise ship broken canonical URLs
    // and a prev/next chain that silently skips the article.
    throw new Error(
      `Article slug mismatch: ${articleFilename} declares slug "${article.slug}".`,
    )
  }

  return article
}

export async function getAllArticles() {
  let articleFilenames = await glob('*/page.mdx', {
    // Articles live in the (site) route group. A wrong path here fails
    // silently by returning no files, so the articles page and the feed are
    // checked for real content after any move.
    cwd: './src/app/(site)/articles',
  })

  let articles = await Promise.all(articleFilenames.map(importArticle))

  return articles.sort((a, z) => +new Date(z.date) - +new Date(a.date))
}

/**
 * The metadata every article page exports. Centralized so the OG card, the
 * canonical URL, and the Twitter card cannot drift apart across MDX files.
 */
export function articleMetadata(article: Article): Metadata {
  let url = `/articles/${article.slug}`

  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: url },
    openGraph: {
      title: article.title,
      description: article.description,
      type: 'article',
      url,
      publishedTime: article.date,
      authors: [article.author],
      images: [ogImageUrl({ title: article.title, eyebrow: 'Article' })],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description,
    },
  }
}
