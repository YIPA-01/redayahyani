'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createPortal } from 'react-dom'
import clsx from 'clsx'
import gsap from 'gsap'
import { Flip } from 'gsap/Flip'
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin'

import { R_PATH, variants } from '@/components/Signature'
import { motionLevel } from '@/lib/a11y/preferences'
import { useDisplay } from '@/lib/a11y/useDisplay'

// The phone menu. The trigger starts as the signature, holds for a second so
// the brand reads first, then writes itself off: the R and Y erase in the
// direction they were drawn while two left-aligned menu lines draw in, so the
// mark is recognisable as a menu. After 12 s untouched it writes back into the
// signature, holds, and writes off again. On tap the two lines morph into a
// close mark. The sections arrive as stacked cards that fly out of the mark
// with Flip, on a solid white (or black) page, and the whole menu fades away
// in place on close.
//
// Motion: at full, all of the above. Reduced stops anything that moves on its
// own, so there is no intro or idle return: the mark is the menu icon at once,
// and a tap swaps to the close mark with a short fade. Off swaps instantly,
// and the cards just appear below full.
//
// The strokes all carry pathLength 1 and a "1 2" dash, so a dash offset of 0
// is fully drawn, -1.01 is erased from the pen's start, and 1.01 is not yet
// drawn.
//
// State model: `open` is the single source of truth. It decides the mark's
// shape (one effect drives the morph), the cards' layout, and the labels.
// `shown` only keeps the overlay painted until the closing flight lands.
//
// The overlay renders into <body> through a portal: the header's backdrop
// blur makes it the containing block for fixed children, which would cap a
// fixed overlay at the header's height. While the menu is up, <html> carries
// data-menu-open so the header turns solid to match (see Header.tsx).

export interface MenuCounts {
  work: number
  services: number
  articles: number
}

const Y_PATH = variants.compact.y
// The case study contents icon's two lines, left-aligned and centred in the
// mark's viewBox.
const MENU_TOP = 'M150 290 570 290'
const MENU_BOTTOM = 'M150 450 400 450'
const CLOSE_TOP = 'M200 530C290 440 380 350 520 210'
const CLOSE_BOTTOM = 'M200 210 360 370 520 530'
const DRAWN = 0
const ERASED = -1.01
const UNDRAWN = 1.01
const HOLD = 1
const IDLE_WAIT = 12
const MENU_ID = 'mobile-menu'
const DESKTOP = '(min-width: 768px)'
const CARD_PROPS =
  'transform,translate,rotate,scale,position,top,left,width,height,zIndex'

let registered = false
function register() {
  if (registered) return
  gsap.registerPlugin(Flip, MorphSVGPlugin)
  registered = true
}

type Strokes = Array<SVGPathElement | null>

// Built ahead of time inside timelines, so no tween may paint its starting
// value early.
function dash(
  tl: gsap.core.Timeline,
  targets: Strokes,
  from: number,
  to: number,
  vars: gsap.TweenVars,
  at: number,
) {
  tl.fromTo(
    targets,
    { attr: { 'stroke-dashoffset': from } },
    { attr: { 'stroke-dashoffset': to }, immediateRender: false, ...vars },
    at,
  )
}

function writeOff(
  tl: gsap.core.Timeline,
  [r, y, top, bottom]: Strokes,
  at: number,
) {
  dash(tl, [r], DRAWN, ERASED, { duration: 0.7, ease: 'power2.in' }, at)
  dash(tl, [y], DRAWN, ERASED, { duration: 0.5, ease: 'power2.in' }, at + 0.1)
  dash(
    tl,
    [top],
    UNDRAWN,
    DRAWN,
    { duration: 0.6, ease: 'power3.out' },
    at + 0.42,
  )
  dash(
    tl,
    [bottom],
    UNDRAWN,
    DRAWN,
    { duration: 0.5, ease: 'power3.out' },
    at + 0.55,
  )
}

function writeBack(
  tl: gsap.core.Timeline,
  [r, y, top, bottom]: Strokes,
  at: number,
) {
  dash(tl, [top], DRAWN, ERASED, { duration: 0.45, ease: 'power2.in' }, at)
  dash(
    tl,
    [bottom],
    DRAWN,
    ERASED,
    { duration: 0.4, ease: 'power2.in' },
    at + 0.05,
  )
  dash(tl, [r], UNDRAWN, DRAWN, { duration: 0.7, ease: 'power3.out' }, at + 0.3)
  dash(tl, [y], UNDRAWN, DRAWN, { duration: 0.5, ease: 'power3.out' }, at + 0.6)
}

// The resting menu icon, whatever the intro or idle return was doing.
function showMenu([r, y, top, bottom]: Strokes) {
  gsap.set([r, y], { attr: { 'stroke-dashoffset': ERASED } })
  gsap.set([top, bottom], { attr: { 'stroke-dashoffset': DRAWN } })
}

function isCurrent(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function MobileMenu({
  counts,
  className,
}: {
  counts: MenuCounts
  className?: string
}) {
  let pathname = usePathname()
  let display = useDisplay()
  let animate = display.motion === 'full'

  let [open, setOpen] = useState(false)
  let [shown, setShown] = useState(false)
  // Hovered or focused: the idle stays still while the mark is about to be
  // pressed.
  let [held, setHeld] = useState(false)
  // The intro has finished (or was skipped), so the idle return may start.
  let [settled, setSettled] = useState(false)
  // The portal needs document.body, so the overlay mounts after hydration.
  let [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  let button = useRef<HTMLButtonElement>(null)
  let mark = useRef<SVGSVGElement>(null)
  let rPath = useRef<SVGPathElement>(null)
  let yPath = useRef<SVGPathElement>(null)
  let topPath = useRef<SVGPathElement>(null)
  let bottomPath = useRef<SVGPathElement>(null)
  let intro = useRef<gsap.core.Timeline | null>(null)
  let overlay = useRef<HTMLDivElement>(null)
  let backdrop = useRef<HTMLDivElement>(null)
  let who = useRef<HTMLDivElement>(null)
  let cardRefs = useRef<Array<HTMLAnchorElement | null>>([])
  let flipState = useRef<Flip.FlipState | null>(null)
  let flight = useRef<gsap.core.Animation | null>(null)
  let morph = useRef<gsap.core.Timeline | null>(null)

  let cards = [
    {
      href: '/work',
      title: 'Work',
      sub: 'Case studies',
      value: counts.work,
      tone: 'bg-coral text-ink dark:text-canvas',
    },
    {
      href: '/services',
      title: 'Services',
      sub: 'Ways to work together',
      value: counts.services,
      tone: 'bg-surface text-ink ring-1 ring-inset ring-line',
    },
    {
      href: '/articles',
      title: 'Articles',
      sub: 'Notes on the craft',
      value: counts.articles,
      tone: 'bg-blush text-ink',
    },
    {
      href: '/about',
      title: 'About',
      sub: 'Product engineer, Morocco',
      value: null,
      tone: 'bg-ink text-canvas',
    },
  ]

  function cardElements() {
    return cardRefs.current.filter(Boolean) as Array<HTMLAnchorElement>
  }

  function strokes(): Strokes {
    return [rPath.current, yPath.current, topPath.current, bottomPath.current]
  }

  // Where the folded cards sit: on the mark itself.
  function placePile() {
    let svg = mark.current?.getBoundingClientRect()
    let host = overlay.current
    if (!svg || !host) return
    host.style.setProperty('--pile-x', `${svg.left}px`)
    host.style.setProperty('--pile-y', `${svg.top}px`)
    host.style.setProperty('--pile-size', `${svg.width}px`)
  }

  // Interrupted flights leave inline styles behind; start every move clean.
  function settle() {
    flight.current?.kill()
    flight.current = null
    let elements = cardElements()
    gsap.killTweensOf(elements)
    gsap.set(elements, { clearProps: CARD_PROPS })
    if (overlay.current) gsap.set(overlay.current, { clearProps: 'opacity' })
  }

  // Handlers only change state. The effects below do the drawing.
  function openMenu() {
    if (open) return
    register()
    placePile()
    // Opening mid-intro jumps it to the menu icon first.
    intro.current?.progress(1)
    if (animate) {
      settle()
      flipState.current = Flip.getState(cardElements())
    }
    setShown(true)
    setOpen(true)
  }

  function closeMenu() {
    if (!open) return
    if (animate) {
      settle()
      setOpen(false)
    } else {
      setOpen(false)
      setShown(false)
    }
  }

  // No flight: navigation, a wider screen, or anything else that should
  // simply put the menu away.
  function closeNow() {
    flipState.current = null
    settle()
    setOpen(false)
    setShown(false)
  }

  // The mark follows `open`, and nothing else touches the morph.
  useEffect(() => {
    let top = topPath.current
    let bottom = bottomPath.current
    if (!top || !bottom) return
    register()
    if (!morph.current) {
      morph.current = gsap
        .timeline({
          paused: true,
          defaults: { duration: 0.5, ease: 'power3.inOut' },
        })
        .to(top, { morphSVG: CLOSE_TOP }, 0)
        .to(bottom, { morphSVG: CLOSE_BOTTOM }, 0)
    }
    let target = open ? 1 : 0
    let timeline = morph.current
    if (timeline.progress() === target && !timeline.isActive()) return
    if (animate) {
      if (open) timeline.timeScale(1).play()
      else timeline.timeScale(1.2).reverse()
    } else if (display.motion === 'reduced') {
      // A tap still gets a quick fade; nothing travels.
      gsap
        .timeline()
        .to(mark.current, { opacity: 0, duration: 0.075, ease: 'none' })
        .call(() => void timeline.progress(target))
        .to(mark.current, { opacity: 1, duration: 0.075, ease: 'none' })
    } else {
      timeline.progress(target)
    }
  }, [open, animate, display.motion])

  // The intro, once per page load (the header stays mounted across client
  // navigations). It reads the motion level directly, since `useDisplay`
  // reports `off` until it has mounted.
  useEffect(() => {
    register()
    if (motionLevel() !== 'full') {
      showMenu(strokes())
      setSettled(true)
      return
    }
    let timeline = gsap.timeline({
      delay: HOLD,
      onComplete: () => {
        intro.current = null
        setSettled(true)
      },
    })
    writeOff(timeline, strokes(), 0)
    intro.current = timeline
    return () => {
      timeline.kill()
      intro.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Motion turned down mid-intro: finish it where it was heading. Reads the
  // level directly, because `animate` is false on the first render too.
  useEffect(() => {
    if (motionLevel() !== 'full') intro.current?.progress(1)
  }, [animate])

  // Idle return: after 12 s untouched, the menu icon writes back into the
  // signature, holds for 1.5 s, and writes off again. Only at full motion,
  // while the menu is fully closed and the mark is not being pointed at.
  useEffect(() => {
    if (!animate || !settled || open || shown || held) return
    let marks = strokes()
    let idle = gsap.timeline({
      repeat: -1,
      repeatDelay: IDLE_WAIT,
      delay: IDLE_WAIT,
    })
    writeBack(idle, marks, 0)
    writeOff(idle, marks, 2.6)
    return () => {
      idle.kill()
      showMenu(marks)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animate, settled, open, shown, held])

  // Opening: the cards' flight, once React has rendered the new layout.
  // Closing: the cards stay put (they keep their layout while `shown`) and
  // the whole menu fades out.
  useLayoutEffect(() => {
    let state = flipState.current
    flipState.current = null
    let elements = cardElements()
    let inners = elements.map((element) => element.firstElementChild)

    if (open) {
      if (!state) return
      gsap.fromTo(
        backdrop.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3 },
      )
      gsap.fromTo(
        who.current,
        { y: 12, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, delay: 0.15, ease: 'power3.out' },
      )
      gsap.fromTo(
        inners,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, delay: 0.35, stagger: 0.06 },
      )
      flight.current = Flip.from(state, {
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.06,
        absolute: true,
        zIndex: 3,
        onComplete: () => {
          flight.current = null
          gsap.set(elements, { clearProps: CARD_PROPS })
        },
      })
    } else if (shown && animate && overlay.current) {
      flight.current = gsap.to(overlay.current, {
        opacity: 0,
        duration: 0.2,
        ease: 'power1.out',
        onComplete: () => {
          flight.current = null
          setShown(false)
        },
      })
    }
    // Only a change of `open` starts a flight or a fade.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  // A closed menu is out of the tab order and the accessibility tree
  // (React 18 has no `inert` prop), and its faded parts reset.
  // Runs again once the portal has mounted, since the refs are empty before.
  useEffect(() => {
    overlay.current?.toggleAttribute('inert', !shown)
    let parts = [overlay.current, backdrop.current, who.current].filter(Boolean)
    if (!shown && parts.length > 0) {
      gsap.set(parts, { clearProps: 'opacity,transform' })
    }
  }, [shown, mounted])

  // The page behind does not scroll while the menu is up, and the header
  // goes solid to match the menu.
  useEffect(() => {
    if (!shown) return
    let root = document.documentElement
    let previous = root.style.overflow
    root.style.overflow = 'hidden'
    root.dataset.menuOpen = ''
    return () => {
      root.style.overflow = previous
      delete root.dataset.menuOpen
    }
  }, [shown])

  // Focus moves into the menu on open and back to the mark on close.
  let wasOpen = useRef(false)
  useEffect(() => {
    if (open) cardRefs.current[0]?.focus({ preventScroll: true })
    else if (wasOpen.current) button.current?.focus({ preventScroll: true })
    wasOpen.current = open
  }, [open])

  // Escape closes; Tab cycles between the mark and the menu's links.
  useEffect(() => {
    if (!open) return
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        closeMenu()
        return
      }
      if (event.key !== 'Tab' || !overlay.current || !button.current) return
      let focusable = [
        button.current,
        ...overlay.current.querySelectorAll<HTMLElement>('a[href]'),
      ]
      let index = focusable.indexOf(document.activeElement as HTMLElement)
      let next = event.shiftKey ? index - 1 : index + 1
      if (index === -1 || next < 0 || next >= focusable.length) {
        event.preventDefault()
        focusable[(next + focusable.length) % focusable.length]?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
    // closeMenu reads `open`, which is this effect's only dependency.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  // Navigating puts the menu away; the new page is the feedback.
  let lastPath = useRef(pathname)
  useEffect(() => {
    if (lastPath.current === pathname) return
    lastPath.current = pathname
    closeNow()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  // The menu only exists on phones: widening the window closes it.
  useEffect(() => {
    let query = window.matchMedia(DESKTOP)
    let onChange = () => {
      if (query.matches) closeNow()
    }
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className={className}>
      <button
        ref={button}
        type="button"
        aria-expanded={open}
        aria-controls={MENU_ID}
        aria-label={open ? 'Close menu' : 'Open menu'}
        onClick={() => (open ? closeMenu() : openMenu())}
        onPointerEnter={() => setHeld(true)}
        onPointerLeave={() => setHeld(false)}
        onFocus={() => setHeld(true)}
        onBlur={() => setHeld(false)}
        className="relative z-50 -m-1.5 flex h-11 w-11 items-center justify-center rounded-xl text-ink"
      >
        <svg
          ref={mark}
          viewBox={variants.compact.viewBox}
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="1 2"
          aria-hidden="true"
          className="h-8 w-8 overflow-visible"
        >
          <path
            ref={rPath}
            d={R_PATH}
            pathLength={1}
            strokeWidth={54}
            strokeDashoffset={DRAWN}
          />
          <path
            ref={yPath}
            d={Y_PATH}
            pathLength={1}
            strokeWidth={30}
            strokeDashoffset={DRAWN}
          />
          <path
            ref={topPath}
            d={MENU_TOP}
            pathLength={1}
            strokeWidth={46}
            strokeDashoffset={UNDRAWN}
          />
          <path
            ref={bottomPath}
            d={MENU_BOTTOM}
            pathLength={1}
            strokeWidth={46}
            strokeDashoffset={UNDRAWN}
          />
        </svg>
      </button>

      {mounted &&
        createPortal(
          <div
            ref={overlay}
            id={MENU_ID}
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className={clsx(
              'fixed inset-0 z-40 flex flex-col px-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] pt-[calc(4.5rem+env(safe-area-inset-top))] md:hidden',
              !shown && 'invisible',
            )}
          >
            <div
              ref={backdrop}
              aria-hidden="true"
              className="absolute inset-0 bg-white dark:bg-black"
            />

            <div ref={who} className="relative px-2.5">
              <Link
                href="/"
                className="block text-[1.875rem] font-semibold leading-[1.04] tracking-tight text-ink"
              >
                Reda
                <br />
                Yahyani
                <span className="block text-muted/70">Product engineer</span>
              </Link>
              <Link
                href="/services#contact"
                className="mt-4 inline-flex rounded-full bg-ink px-4 py-2 text-sm font-medium text-canvas"
              >
                Start a project
              </Link>
            </div>

            <nav aria-label="Primary" className="mt-auto flex flex-col">
              {cards.map((card, index) => {
                let current = isCurrent(pathname, card.href)
                let last = index === cards.length - 1
                return (
                  <Link
                    key={card.href}
                    ref={(element) => {
                      cardRefs.current[index] = element
                    }}
                    href={card.href}
                    aria-current={current ? 'page' : undefined}
                    onClick={() => {
                      if (current) closeMenu()
                    }}
                    className={clsx(
                      'block overflow-hidden',
                      card.tone,
                      shown
                        ? clsx(
                            'relative h-28 rounded-[18px]',
                            index > 0 && '-mt-4',
                          )
                        : 'absolute left-[var(--pile-x)] top-[var(--pile-y)] h-[var(--pile-size)] w-[var(--pile-size)] rounded-[10px]',
                    )}
                  >
                    <span
                      className={clsx(
                        'absolute inset-0 block px-4 py-3.5',
                        !shown && 'opacity-0',
                      )}
                    >
                      <span className="block text-[17px] font-semibold leading-tight">
                        {card.title}
                      </span>
                      {current && (
                        <span className="absolute right-3.5 top-3.5 flex items-center gap-1.5 font-mono text-[10px] uppercase leading-none tracking-[0.08em]">
                          <span className="h-1.5 w-1.5 rounded-full bg-current" />
                          Here
                        </span>
                      )}
                      <span
                        className={clsx(
                          'absolute left-4 text-[13px] opacity-70',
                          last ? 'bottom-3' : 'bottom-[26px]',
                        )}
                      >
                        {card.sub}
                      </span>
                      <span
                        aria-hidden="true"
                        className={clsx(
                          'absolute right-3.5 text-[64px] font-light tabular-nums leading-none tracking-tighter',
                          last ? 'bottom-0.5' : 'bottom-4',
                        )}
                      >
                        {card.value === null ? (
                          <svg
                            viewBox={variants.compact.viewBox}
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mb-2.5 mr-1 h-14 w-[54px] overflow-visible"
                          >
                            <path d={R_PATH} strokeWidth={44} />
                            <path d={Y_PATH} strokeWidth={22} />
                          </svg>
                        ) : (
                          String(card.value).padStart(2, '0')
                        )}
                      </span>
                    </span>
                  </Link>
                )
              })}
            </nav>
          </div>,
          document.body,
        )}
    </div>
  )
}
