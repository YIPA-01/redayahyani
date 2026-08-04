// Canonical origin for metadata, share links, sitemap, and the OG image route.
// Falls back to localhost so a missing env var degrades to broken previews in
// development rather than a crash at import time.
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export function absoluteUrl(path: string) {
  return new URL(path, siteUrl).toString()
}

/**
 * Points at the OG card renderer in src/app/og/route.tsx. Returned relative so
 * Next resolves it against metadataBase, which keeps preview deployments from
 * advertising the production origin.
 *
 * Dimensions are declared explicitly: LinkedIn in particular will refuse to
 * build a preview card for an image whose size it cannot determine up front.
 */
export function ogImageUrl({
  title,
  eyebrow,
}: {
  title: string
  eyebrow?: string
}) {
  const params = new URLSearchParams({ title })
  if (eyebrow) params.set('eyebrow', eyebrow)
  return {
    url: `/og?${params.toString()}`,
    width: 1200,
    height: 630,
    type: 'image/png',
    alt: title,
  }
}
