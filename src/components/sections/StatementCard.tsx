import clsx from 'clsx'

import { MorphPauseButton } from '@/components/motion/MorphPauseButton'
import { MorphText } from '@/components/motion/MorphText'
import { BlueprintGrid } from '@/components/sections/BlueprintGrid'

// The home hero. A transparent card drawn as a drafting surface
// (BlueprintGrid): graph paper and coral construction shapes that turn toward
// the cursor, with the centre left clear so the statement reads on the plain
// canvas: ink in light mode, white in dark. The statement itself morphs
// between the design and engineering faces (MorphText), pausing while the
// pointer rests on the card.
export function StatementCard({
  text,
  className,
}: {
  text: string
  className?: string
}) {
  return (
    <div
      data-morph-card
      className={clsx(
        'relative isolate overflow-hidden rounded-[clamp(24px,4vw,40px)] border border-coral/60 px-5 py-12 sm:px-16 sm:py-28 lg:px-24 lg:py-36',
        className,
      )}
    >
      <BlueprintGrid />
      <p className="mx-auto max-w-[26ch] text-balance text-start font-serif text-[clamp(1.75rem,4.6vw,3.5rem)] italic leading-[1.15] tracking-[-0.01em] text-ink dark:text-white">
        <MorphText text={text} />
      </p>
      <MorphPauseButton />
    </div>
  )
}
