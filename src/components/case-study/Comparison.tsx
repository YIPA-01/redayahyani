import Image, { type ImageProps } from 'next/image'

interface Shot {
  src: ImageProps['src']
  alt: string
  label: string
}

function Panel({ shot, accent }: { shot: Shot; accent?: boolean }) {
  // A portrait capture (a dialog, a phone screen) at full column width would
  // run taller than the screen, so it is capped and centred. A near-square
  // one gets a wider cap.
  let { width, height } =
    typeof shot.src === 'object' && 'width' in shot.src
      ? shot.src
      : { width: 1, height: 0 }
  let cap =
    height > width ? 'max-w-sm' : height > width * 0.8 ? 'max-w-md' : ''

  return (
    <figure
      className={
        cap ? `mx-auto flex w-full ${cap} flex-col gap-2` : 'flex flex-col gap-2'
      }
    >
      <figcaption
        className={
          accent
            ? 'font-mono text-xs uppercase tracking-[0.08em] text-coral-text'
            : 'font-mono text-xs uppercase tracking-[0.08em] text-muted'
        }
      >
        {shot.label}
      </figcaption>
      <div className="overflow-hidden rounded-xl ring-1 ring-line">
        <Image
          src={shot.src}
          alt={shot.alt}
          sizes="(min-width: 640px) 42rem, 100vw"
          className="h-auto w-full"
        />
      </div>
    </figure>
  )
}

// A design reference next to the Roomee component it shaped (section 4 of
// docs/case-study.md). "Kept" is the pattern adopted; "Changed" is where
// Roomee departs from it and why.
export function Comparison({
  title,
  reference,
  ours,
  kept,
  changed,
}: {
  title: string
  reference: Shot
  ours: Shot
  kept: React.ReactNode
  changed: React.ReactNode
}) {
  return (
    <section className="not-prose my-10 flex flex-col gap-5 border-t border-line pt-6">
      <h4 className="text-lg font-medium leading-snug text-ink">{title}</h4>
      <Panel shot={reference} />
      <Panel shot={ours} accent />
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <p className="font-mono text-xs uppercase tracking-[0.08em] text-muted">
            Kept
          </p>
          <div className="text-[15px] leading-relaxed text-ink">{kept}</div>
        </div>
        <div className="flex flex-col gap-1.5">
          <p className="font-mono text-xs uppercase tracking-[0.08em] text-muted">
            Changed
          </p>
          <div className="text-[15px] leading-relaxed text-ink">{changed}</div>
        </div>
      </div>
    </section>
  )
}
