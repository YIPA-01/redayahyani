'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import clsx from 'clsx'

import {
  DEFAULT_PREFERENCES,
  type Preferences,
  readPreferences,
  savePreferences,
} from '@/lib/a11y/preferences'

// The visitor's own display settings: motion, text size, typeface, contrast,
// and link underlines. Each group is a native radio set in a fieldset, so it
// works the same with a mouse, a keyboard (arrow keys move within a group), a
// switch device, or a screen reader. Changes apply instantly and persist.

type Choice<K extends keyof Preferences> = {
  value: Preferences[K]
  label: string
}

const groups: {
  [K in Exclude<keyof Preferences, 'underline'>]: {
    legend: string
    hint: string
    choices: Array<Choice<K>>
  }
} = {
  motion: {
    legend: 'Motion',
    hint: 'Reduced stops anything that moves on its own. Off stops all movement.',
    choices: [
      { value: 'system', label: 'System' },
      { value: 'reduced', label: 'Reduced' },
      { value: 'off', label: 'Off' },
    ],
  },
  text: {
    legend: 'Text size',
    hint: 'Scales every page, layout included.',
    choices: [
      { value: '100', label: '100%' },
      { value: '115', label: '115%' },
      { value: '130', label: '130%' },
    ],
  },
  type: {
    legend: 'Typeface',
    hint: 'Readable uses Atkinson Hyperlegible, made for low-vision readers.',
    choices: [
      { value: 'default', label: 'Default' },
      { value: 'readable', label: 'Readable' },
    ],
  },
  contrast: {
    legend: 'Contrast',
    hint: 'High darkens secondary text and lines.',
    choices: [
      { value: 'standard', label: 'Standard' },
      { value: 'high', label: 'High' },
    ],
  },
}

function AccessibilityIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <circle cx="12" cy="12" r="9.25" />
      <circle cx="12" cy="7.25" r="1.25" className="fill-current" />
      <path d="M7.5 10h9M12 10v4m0 0-2.5 4m2.5-4 2.5 4" />
    </svg>
  )
}

function RadioGroup<K extends Exclude<keyof Preferences, 'underline'>>({
  name,
  value,
  onChange,
}: {
  name: K
  value: Preferences[K]
  onChange: (value: Preferences[K]) => void
}) {
  let group = groups[name]
  let hintId = `display-${name}-hint`
  return (
    <fieldset aria-describedby={hintId}>
      <legend className="text-sm font-medium text-ink">{group.legend}</legend>
      <p id={hintId} className="mt-0.5 text-xs text-muted">
        {group.hint}
      </p>
      <div className="mt-2 flex rounded-full border border-line p-1">
        {(group.choices as Array<Choice<K>>).map((choice) => (
          <label key={String(choice.value)} className="relative flex-1">
            <input
              type="radio"
              name={`display-${name}`}
              value={String(choice.value)}
              checked={value === choice.value}
              onChange={() => onChange(choice.value)}
              className="peer sr-only"
            />
            <span className="block cursor-pointer rounded-full px-3 py-1.5 text-center text-sm text-muted transition peer-checked:bg-ink peer-checked:text-canvas peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-coral-text">
              {choice.label}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

export function DisplayPreferences() {
  let [preferences, setPreferences] = useState<Preferences>(DEFAULT_PREFERENCES)

  useEffect(() => {
    setPreferences(readPreferences())
  }, [])

  function update<K extends keyof Preferences>(key: K, value: Preferences[K]) {
    let next = { ...preferences, [key]: value }
    setPreferences(next)
    savePreferences(next)
  }

  let changed =
    JSON.stringify(preferences) !== JSON.stringify(DEFAULT_PREFERENCES)

  return (
    <Popover className="relative">
      <PopoverButton
        aria-label="Display preferences"
        className="group relative rounded-full p-2 text-muted transition hover:bg-panel hover:text-ink"
      >
        <AccessibilityIcon className="h-6 w-6" />
        {changed && (
          <span
            aria-hidden="true"
            className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-coral"
          />
        )}
      </PopoverButton>
      <PopoverPanel
        focus
        className="fixed inset-x-4 top-20 z-50 grid max-h-[calc(100dvh-6rem)] gap-5 overflow-y-auto rounded-3xl bg-surface p-6 shadow-xl ring-1 ring-line sm:absolute sm:inset-x-auto sm:right-0 sm:top-12 sm:w-80"
      >
        <div>
          <h2 className="text-base font-medium text-ink">
            Display preferences
          </h2>
          <p className="mt-1 text-sm text-muted">
            Make this site work the way you need. Saved on this device.
          </p>
        </div>

        <RadioGroup
          name="motion"
          value={preferences.motion}
          onChange={(value) => update('motion', value)}
        />
        <RadioGroup
          name="text"
          value={preferences.text}
          onChange={(value) => update('text', value)}
        />
        <RadioGroup
          name="type"
          value={preferences.type}
          onChange={(value) => update('type', value)}
        />
        <RadioGroup
          name="contrast"
          value={preferences.contrast}
          onChange={(value) => update('contrast', value)}
        />

        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={preferences.underline}
            onChange={(event) => update('underline', event.target.checked)}
            className="mt-0.5 h-5 w-5 flex-none accent-[rgb(var(--coral-text))]"
          />
          <span>
            <span className="block text-sm font-medium text-ink">
              Underline links
            </span>
            <span className="block text-xs text-muted">
              So links never rely on color alone.
            </span>
          </span>
        </label>

        <div className="flex items-center justify-between border-t border-line pt-4 text-sm">
          <button
            type="button"
            onClick={() => {
              setPreferences(DEFAULT_PREFERENCES)
              savePreferences(DEFAULT_PREFERENCES)
            }}
            disabled={!changed}
            className={clsx(
              'rounded-full px-3 py-1.5 transition',
              changed
                ? 'text-ink hover:bg-panel'
                : 'cursor-not-allowed text-muted',
            )}
          >
            Reset
          </button>
          <Link
            href="/accessibility"
            className="text-coral-text hover:underline"
          >
            About accessibility
          </Link>
        </div>
      </PopoverPanel>
    </Popover>
  )
}
