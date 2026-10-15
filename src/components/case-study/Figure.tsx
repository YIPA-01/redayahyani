import Image, { type ImageProps } from 'next/image'

// An image, or any children, with a caption. Images keep a hairline ring so a
// screenshot on a light background still reads as an object.
export function Figure({
  src,
  alt = '',
  caption,
  children,
}: {
  src?: ImageProps['src']
  alt?: string
  caption?: React.ReactNode
  children?: React.ReactNode
}) {
  return (
    <figure className="not-prose my-10 flex flex-col gap-3">
      {src ? (
        <div className="overflow-hidden rounded-2xl ring-1 ring-line">
          <Image
            src={src}
            alt={alt}
            sizes="(min-width: 640px) 42rem, 100vw"
            className="h-auto w-full"
          />
        </div>
      ) : (
        children
      )}
      {caption && (
        <figcaption className="text-sm leading-normal text-muted">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

// A note set apart from the prose, for things like which decisions were the
// client's and which were mine.
export function Callout({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <aside className="not-prose my-8 flex flex-col gap-2 rounded-xl bg-panel px-5 py-4 text-[15px] leading-relaxed text-ink">
      <p className="font-mono text-xs uppercase tracking-[0.08em] text-muted">
        {label}
      </p>
      <div className="flex flex-col gap-2">{children}</div>
    </aside>
  )
}
