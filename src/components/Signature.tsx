import clsx from 'clsx'

// Traced from Reda's handwritten signature and smoothed. The R is one heavy
// pen stroke; the Y is a hairline that cuts across it. See docs/brand.md.
export const R_PATH =
  'M35 700C73 607 110 509 150 420C188 336 225 242 268 178C301 129 333 85 372 60C406 39 450 23 485 28C519 33 559 58 580 86C603 116 613 165 614 206C615 248 604 298 584 336C563 374 525 408 490 434C458 458 415 477 384 488C361 496 337 506 322 500C310 495 298 478 296 466C294 454 303 434 312 428C320 422 336 421 346 426C357 431 364 448 372 462C382 480 387 504 400 525C415 550 435 578 458 600C481 622 513 640 540 655C565 669 590 678 615 690'

export const variants = {
  // Full Y tail below the line. For large placements: hero, OG card, lockups.
  drawn: { viewBox: '0 0 720 960', y: 'M355 665 668 445 305 925' },
  // Y tail stops where the R ends, so the mark is nearly square. For the
  // header, footer, avatar, and favicon.
  compact: { viewBox: '0 0 720 740', y: 'M355 665 668 445 468 709' },
}

// The as-drawn pen weights vanish below about 32px, so small renders use
// heavier strokes. Same idea as optical sizes in type.
const weights = {
  regular: { r: 22, y: 7 },
  small: { r: 54, y: 30 },
}

export function Signature({
  variant = 'compact',
  optical = 'regular',
  title = 'Reda Yahyani',
  className,
  ...props
}: {
  variant?: keyof typeof variants
  optical?: keyof typeof weights
  title?: string | null
} & Omit<React.ComponentPropsWithoutRef<'svg'>, 'viewBox'>) {
  let { viewBox, y } = variants[variant]
  let weight = weights[optical]

  return (
    <svg
      viewBox={viewBox}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      className={clsx('overflow-visible', className)}
      {...props}
    >
      {title && <title>{title}</title>}
      <path d={R_PATH} strokeWidth={weight.r} />
      <path d={y} strokeWidth={weight.y} />
    </svg>
  )
}
