// A product walkthrough. It never plays on its own (docs/brand.md: anything
// that moves on its own needs a pause control, and the Motion preference can
// be stricter than the OS), so the reader starts it, with native controls.
// Files live in public/ because next/image does not handle video.
export function Video({
  src,
  poster,
  width,
  height,
  label,
  caption,
}: {
  src: string
  poster: string
  width: number
  height: number
  // What the video shows, for screen readers.
  label: string
  caption?: React.ReactNode
}) {
  return (
    <figure className="not-prose my-10 flex flex-col gap-3">
      <div className="overflow-hidden rounded-2xl bg-panel ring-1 ring-line">
        <video
          controls
          muted
          playsInline
          preload="none"
          poster={poster}
          width={width}
          height={height}
          aria-label={label}
          className="block h-auto w-full"
        >
          <source src={src} type="video/mp4" />
        </video>
      </div>
      {caption && (
        <figcaption className="text-sm leading-normal text-muted">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
