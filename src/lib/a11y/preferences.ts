// Display preferences: the visitor's own settings for motion, text size,
// typeface, contrast, and link underlines. They live in localStorage and are
// applied as data-* attributes on <html>, which the CSS in
// src/styles/tailwind.css and the motion components read. An inline script in
// src/app/layout.tsx applies them before first paint, so a visitor who needs
// large text or no motion never sees a flash of the defaults first.

export type MotionPreference = 'system' | 'reduced' | 'off'
export type TextSize = '100' | '115' | '130'
export type TypePreference = 'default' | 'readable'
export type ContrastPreference = 'standard' | 'high'

export interface Preferences {
  motion: MotionPreference
  text: TextSize
  type: TypePreference
  contrast: ContrastPreference
  underline: boolean
}

export const DEFAULT_PREFERENCES: Preferences = {
  motion: 'system',
  text: '100',
  type: 'default',
  contrast: 'standard',
  underline: false,
}

export const PREFERENCES_KEY = 'display-preferences'

function attributes(preferences: Preferences) {
  return {
    'data-motion': preferences.motion,
    'data-text': preferences.text,
    'data-type': preferences.type,
    'data-contrast': preferences.contrast,
    'data-underline': String(preferences.underline),
  }
}

export function readPreferences(): Preferences {
  try {
    let stored = JSON.parse(localStorage.getItem(PREFERENCES_KEY) ?? '{}')
    return { ...DEFAULT_PREFERENCES, ...stored }
  } catch {
    return DEFAULT_PREFERENCES
  }
}

export function applyPreferences(preferences: Preferences) {
  let root = document.documentElement
  for (let [name, value] of Object.entries(attributes(preferences))) {
    root.setAttribute(name, value)
  }
}

export function savePreferences(preferences: Preferences) {
  applyPreferences(preferences)
  try {
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences))
  } catch {
    // Private windows and blocked storage: the setting still applies to this
    // page view, it just will not persist.
  }
}

// Runs inline in <head>, before the page paints. Kept dependency free and
// tolerant of bad or missing storage.
export const preferencesScript = `(function(){try{var d=${JSON.stringify(
  DEFAULT_PREFERENCES,
)},s=JSON.parse(localStorage.getItem(${JSON.stringify(
  PREFERENCES_KEY,
)})||'{}'),p={},k;for(k in d)p[k]=k in s?s[k]:d[k];var r=document.documentElement;r.setAttribute('data-motion',p.motion);r.setAttribute('data-text',p.text);r.setAttribute('data-type',p.type);r.setAttribute('data-contrast',p.contrast);r.setAttribute('data-underline',String(p.underline))}catch(e){}})()`

// How much motion is allowed right now, combining the operating system
// setting with the visitor's choice on this site:
//   full     everything, including things that move on their own
//   reduced  nothing moves on its own; hover and pointer feedback stay
//   off      nothing moves at all
// The operating system's reduce-motion request counts as `off`, the most
// careful reading of it.
export type MotionLevel = 'full' | 'reduced' | 'off'

export function motionLevel(): MotionLevel {
  let site = document.documentElement.getAttribute('data-motion')
  if (site === 'off') return 'off'
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return 'off'
  }
  if (site === 'reduced') return 'reduced'
  return 'full'
}

export function readableType() {
  return document.documentElement.getAttribute('data-type') === 'readable'
}
