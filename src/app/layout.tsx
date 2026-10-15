import { type Metadata } from 'next'
import { DM_Mono, Instrument_Serif, Jost } from 'next/font/google'
import localFont from 'next/font/local'
import clsx from 'clsx'

import { Providers } from '@/app/providers'
import { siteUrl } from '@/lib/siteUrl'

import '@/styles/tailwind.css'

// Jost for everything, Instrument Serif italic for statements, DM Mono for
// labels. Exposed as CSS variables that tailwind.config.ts maps onto
// font-sans, font-serif, and font-mono. See docs/brand.md.
const sans = Jost({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
})

const serif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-serif',
})

const mono = DM_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-mono',
})

// Bitwise, a freeware pixel face (src/fonts/bitwise/LICENSE.txt). Used only
// where the site shows its engineering side: the statement morph and the
// project card wireframes.
const pixel = localFont({
  src: '../fonts/bitwise/Bitwise.ttf',
  display: 'swap',
  variable: '--font-pixel',
})

export const metadata: Metadata = {
  // Every page's Open Graph image and canonical URL is declared relative and
  // resolved against this, so a preview deployment never advertises the
  // production origin.
  metadataBase: new URL(siteUrl),
  title: {
    template: '%s - Reda Yahyani',
    default: 'Reda Yahyani - Product engineer',
  },
  description:
    'I’m Reda, a product engineer who starts from the user. I design and build web products end to end, from the first flow sketch to the database underneath it.',
  alternates: {
    types: {
      'application/rss+xml': `${siteUrl}/feed.xml`,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={clsx(
        'h-full antialiased',
        sans.variable,
        serif.variable,
        mono.variable,
        pixel.variable,
      )}
      suppressHydrationWarning
    >
      <body className="flex h-full bg-zinc-50 dark:bg-black">
        {/* No chrome here on purpose: the (site) group owns the header and
            footer, and the portal renders its own dashboard shell. Providers
            stays global so theme and previousPathname span both trees. */}
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
