import type { MetadataRoute } from 'next'

import { absoluteUrl } from '@/lib/siteUrl'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // The portal is authenticated and has nothing to offer a crawler.
      // /og must stay allowed: LinkedIn, X, and Slack respect robots.txt when
      // fetching a preview image, so disallowing it breaks every link card.
      disallow: ['/portal', '/api'],
    },
    sitemap: absoluteUrl('/sitemap.xml'),
  }
}
