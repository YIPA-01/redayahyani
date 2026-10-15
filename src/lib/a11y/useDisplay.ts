'use client'

import { useEffect, useState } from 'react'

import {
  type MotionLevel,
  motionLevel,
  readableType,
} from '@/lib/a11y/preferences'

// Kept apart from preferences.ts, which the root layout (a server component)
// imports for its pre-paint script and so must not pull in React hooks.

// Live version for components: updates when the OS setting or any display
// preference changes. Starts at `off` until mounted, so the server render
// and the first client render agree and nothing animates before we know.
export function useDisplay() {
  let [state, setState] = useState<{ motion: MotionLevel; readable: boolean }>({
    motion: 'off',
    readable: false,
  })

  useEffect(() => {
    let update = () =>
      setState({ motion: motionLevel(), readable: readableType() })
    update()
    let media = window.matchMedia('(prefers-reduced-motion: reduce)')
    media.addEventListener('change', update)
    let observer = new MutationObserver(update)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-motion', 'data-type'],
    })
    return () => {
      media.removeEventListener('change', update)
      observer.disconnect()
    }
  }, [])

  return state
}
