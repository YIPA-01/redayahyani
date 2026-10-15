'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import {
  Popover,
  PopoverButton,
  PopoverOverlay,
  PopoverPanel,
  Transition,
  TransitionChild,
} from '@headlessui/react'

import { Container } from '@/components/Container'
import { FillButton } from '@/components/FillButton'
import { Marquee } from '@/components/sections/Marquee'
import { Signature } from '@/components/Signature'

// Freelance first: Services sits right after Work. On desktop this list
// scrolls in the header marquee; on phones it is the Menu popover. /lab joins
// once it has a first experiment (docs/sitemap.md).
const navigation = [
  { href: '/work', label: 'Work' },
  { href: '/services', label: 'Services' },
  { href: '/articles', label: 'Articles' },
  { href: '/about', label: 'About' },
]

function CloseIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        d="m17.25 6.75-10.5 10.5M6.75 6.75l10.5 10.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ChevronDownIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 8 6" aria-hidden="true" {...props}>
      <path
        d="M1.75 1.75 4 4.25l2.25-2.5"
        fill="none"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

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

function MobileNavigation(
  props: React.ComponentPropsWithoutRef<typeof Popover>,
) {
  return (
    <Popover {...props}>
      <PopoverButton className="group flex items-center rounded-full border border-line px-4 py-2 text-sm font-medium text-ink transition hover:border-ink/40">
        Menu
        <ChevronDownIcon className="ml-3 h-auto w-2 stroke-muted group-hover:stroke-ink" />
      </PopoverButton>
      <Transition>
        <TransitionChild
          enter="duration-150 ease-out"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="duration-150 ease-in"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <PopoverOverlay className="fixed inset-0 z-50 bg-ink/30 backdrop-blur-sm dark:bg-black/70" />
        </TransitionChild>
        <TransitionChild
          enter="duration-150 ease-out"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="duration-150 ease-in"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <PopoverPanel
            focus
            className="fixed inset-x-4 top-8 z-50 origin-top rounded-3xl bg-surface p-8 ring-1 ring-line"
          >
            <div className="flex flex-row-reverse items-center justify-between">
              <PopoverButton aria-label="Close menu" className="-m-1 p-1">
                <CloseIcon className="h-6 w-6 text-muted" />
              </PopoverButton>
              <h2 className="text-sm font-medium text-muted">Navigation</h2>
            </div>
            <nav className="mt-6">
              <ul className="-my-2 divide-y divide-line text-base text-ink">
                {navigation.map((item) => (
                  <li key={item.href}>
                    <PopoverButton
                      as={Link}
                      href={item.href}
                      className="block py-2"
                    >
                      {item.label}
                    </PopoverButton>
                  </li>
                ))}
                <li>
                  <PopoverButton
                    as={Link}
                    href="/services#contact"
                    className="block py-2 font-medium text-coral"
                  >
                    Start a project
                  </PopoverButton>
                </li>
              </ul>
            </nav>
          </PopoverPanel>
        </TransitionChild>
      </Transition>
    </Popover>
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

export function Header() {
  let pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 border-b border-line/60 bg-canvas/85 backdrop-blur">
      <Container>
        <div className="flex h-16 items-center gap-4">
          <Link
            href="/"
            aria-label="Reda Yahyani, home"
            className="flex items-center gap-2.5 font-medium tracking-wide"
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
          <Marquee
            items={navigation}
            label="Primary"
            current={pathname}
            compact
            className="mx-auto hidden w-full max-w-md md:block"
          />
          <div className="ml-auto flex items-center gap-2 md:ml-0">
            <ThemeToggle />
            <FillButton
              href="/services#contact"
              className="hidden px-4 py-1.5 text-sm sm:inline-flex"
            >
              Start a project
            </FillButton>
            <MobileNavigation className="md:hidden" />
          </div>
        </div>
      </Container>
    </header>
  )
}
