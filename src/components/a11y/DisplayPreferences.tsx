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
      viewBox="0 0 100 100"
      fill="currentColor"
      fillRule="evenodd"
      clipRule="evenodd"
      aria-hidden="true"
      {...props}
    >
      <path d="M50,5c-24.836,-0 -45,20.164 -45,45c0,24.836 20.164,45 45,45c24.836,0 45,-20.164 45,-45c0,-24.836 -20.164,-45 -45,-45Zm0,7.963c20.442,-0 37.038,16.595 37.038,37.037c-0,20.442 -16.596,37.037 -37.038,37.037c-20.441,0 -37.037,-16.595 -37.037,-37.037c-0,-20.442 16.596,-37.037 37.037,-37.037Z" />
      <path d="M43.425,47.761c-0.777,8.925 -2.824,17.581 -6.015,25.997c-0.779,2.055 0.257,4.355 2.311,5.134c2.055,0.779 4.355,-0.256 5.134,-2.311c2.259,-5.958 3.986,-12.027 5.145,-18.215c1.159,6.188 2.886,12.257 5.145,18.215c0.779,2.055 3.079,3.09 5.134,2.311c2.055,-0.779 3.09,-3.079 2.311,-5.134c-3.189,-8.411 -5.235,-17.063 -6.013,-25.98c4.769,-0.234 9.54,-0.734 14.311,-1.509c2.169,-0.353 3.644,-2.4 3.291,-4.569c-0.352,-2.168 -2.399,-3.643 -4.568,-3.291c-13.082,2.126 -26.163,2.042 -39.245,-0.004c-2.171,-0.339 -4.209,1.148 -4.549,3.319c-0.339,2.171 1.148,4.209 3.319,4.548c4.762,0.745 9.525,1.245 14.289,1.489Z" />
      <circle cx="50" cy="29.474" r="7.186" />
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
