'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'

import { DisplayPreferences } from '@/components/a11y/DisplayPreferences'
import { Container } from '@/components/Container'
import { FillButton } from '@/components/FillButton'
import { type MenuCounts, MobileMenu } from '@/components/MobileMenu'
import { Marquee } from '@/components/sections/Marquee'
import { Signature } from '@/components/Signature'

// Freelance first: Services sits right after Work. On desktop this list
// scrolls in the header marquee; on phones the signature opens MobileMenu. /lab joins
// once it has a first experiment (docs/sitemap.md).
const navigation = [
  { href: '/work', label: 'Work' },
  { href: '/services', label: 'Services' },
  { href: '/articles', label: 'Articles' },
  { href: '/about', label: 'About' },
]

function SunIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M8 12.25A4.25 4.25 0 0 1 12.25 8v0a4.25 4.25 0 0 1 4.25 4.25v0a4.25 4.25 0 0 1-4.25 4.25v0A4.25 4.25 0 0 1 8 12.25v0Z" />
      <path
        d="M12.25 3v1.5M21.5 12.25H20M18.791 18.791l-1.06-1.06M18.791 5.709l-1.06 1.06M12.25 20v1.5M4.5 12.25H3M6.77 6.77 5.709 5.709M6.77 17.73l-1.061 1.061"
        fill="none"
      />
    </svg>
  )
}

function MoonIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        d="M17.25 16.22a6.937 6.937 0 0 1-9.47-9.47 7.451 7.451 0 1 0 9.47 9.47ZM12.75 7C17 7 17 2.75 17 2.75S17 7 21.25 7C17 7 17 11.25 17 11.25S17 7 12.75 7Z"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ThemeToggle() {
  let { resolvedTheme, setTheme } = useTheme()
  let otherTheme = resolvedTheme === 'dark' ? 'light' : 'dark'
  let [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <button
      type="button"
      aria-label={mounted ? `Switch to ${otherTheme} theme` : 'Toggle theme'}
      className="group rounded-full p-2 transition hover:bg-panel"
      onClick={() => setTheme(otherTheme)}
    >
      <SunIcon className="h-6 w-6 fill-transparent stroke-muted transition group-hover:stroke-ink dark:hidden" />
      <MoonIcon className="hidden h-6 w-6 fill-transparent stroke-muted transition group-hover:stroke-ink dark:block" />
    </button>
  )
}

function PauseIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" {...props}>
      <path d="M5 3.5v9M11 3.5v9" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function PlayIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" {...props}>
      <path d="M5 3.5v9l7-4.5z" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  )
}

const MARQUEE_PAUSED_KEY = 'marquee-paused'

export function Header({ menuCounts }: { menuCounts: MenuCounts }) {
  let pathname = usePathname()
  // The menu scrolls on its own, so it gets a visible pause control
  // (WCAG 2.2.2), remembered for the visit.
  let [paused, setPaused] = useState(false)
  useEffect(() => {
    try {
      setPaused(sessionStorage.getItem(MARQUEE_PAUSED_KEY) === 'true')
    } catch {}
  }, [])
  function togglePaused() {
    let next = !paused
    setPaused(next)
    try {
      sessionStorage.setItem(MARQUEE_PAUSED_KEY, String(next))
    } catch {}
  }

  return (
    <header className="sticky top-0 z-50 border-b border-line/60 bg-canvas/85 backdrop-blur [[data-menu-open]_&]:border-transparent [[data-menu-open]_&]:bg-white [[data-menu-open]_&]:backdrop-blur-none dark:[[data-menu-open]_&]:bg-black">
      <Container>
        <div className="flex h-16 items-center gap-4">
          {/* On phones the signature is the menu; from md it links home. */}
          <MobileMenu counts={menuCounts} className="md:hidden" />
          <Link
            href="/"
            aria-label="Reda Yahyani, home"
            className="hidden items-center gap-2.5 font-medium tracking-wide md:flex"
          >
            <Signature
              variant="compact"
              optical="small"
              title={null}
              className="h-8 w-8"
            />
          </Link>
          {/* The navigation itself scrolls, on screens wide enough for it;
              phones keep the Menu button. */}
          <div className="mx-auto hidden w-full max-w-md items-center gap-1.5 md:flex">
            <Marquee
              items={navigation}
              label="Primary"
              current={pathname}
              compact
              paused={paused}
              className="min-w-0 flex-1"
            />
            {/* Hidden when the visitor's motion settings already stop it. */}
            <button
              type="button"
              onClick={togglePaused}
              aria-pressed={paused}
              aria-label="Pause the menu animation"
              className="marquee-pause flex h-7 w-7 flex-none items-center justify-center rounded-full border border-line fill-muted stroke-muted text-muted transition hover:border-ink hover:fill-ink hover:stroke-ink motion-reduce:hidden"
            >
              {paused ? (
                <PlayIcon className="h-3 w-3" />
              ) : (
                <PauseIcon className="h-3 w-3" />
              )}
            </button>
          </div>
          {/* Above the open mobile menu, so theme and display stay usable. */}
          <div className="relative z-50 ml-auto flex items-center gap-1 md:ml-0">
            <DisplayPreferences />
            <ThemeToggle />
            <FillButton
              href="/services#contact"
              className="hidden px-4 py-1.5 text-sm sm:inline-flex"
            >
              Start a project
            </FillButton>
          </div>
        </div>
      </Container>
    </header>
  )
}
