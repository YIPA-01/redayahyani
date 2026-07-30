import { type Metadata } from 'next'

import { Providers } from '@/app/providers'

import '@/styles/tailwind.css'

export const metadata: Metadata = {
  title: {
    template: '%s - Reda Yahyani',
    default:
      'Reda Yahyani - Software engineer, and passionate writer',
  },
  description:
    'I’m Reda, a software engineer, co-founder, and passionate writer. I currently build software at Exploda, where I focus on engineering the product, and I write about the things I learn along the way.',
  alternates: {
    types: {
      'application/rss+xml': `${process.env.NEXT_PUBLIC_SITE_URL}/feed.xml`,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="flex h-full bg-zinc-50 dark:bg-black">
        {/* No chrome here on purpose: the (site) group owns the header and
            footer, and the portal renders its own dashboard shell. Providers
            stays global so theme and previousPathname span both trees. */}
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
