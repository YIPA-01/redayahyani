// What I take on, as a row of line icons. The icons are drawn for this site
// on a 48 unit grid with the same stroke as the rest of the line work.

const disciplines = [
  {
    label: 'Product Design',
    icon: (
      <>
        <path d="M24 7 42 16.5 24 26 6 16.5Z" />
        <path d="M6 24 24 33.5 42 24" />
        <path d="M6 31.5 24 41 42 31.5" />
      </>
    ),
  },
  {
    label: 'UX Design',
    icon: (
      <>
        <circle cx="10" cy="12" r="4.5" />
        <path d="M14.5 12H22q6 0 6 6v12q0 5 5 5h1.5" />
        <path d="M31.5 31.5 35 35l-3.5 3.5" />
        <rect x="36" y="29.5" width="9" height="11" rx="2" />
        <path d="M10 16.5V27q0 4 4 4h6" />
      </>
    ),
  },
  {
    label: 'Prototyping',
    icon: (
      <>
        <path d="M15 12v24l6-5.5 4.5 9.5 4-2-4.5-9.5H33Z" />
        <path d="M30 10l3-3.5" />
        <path d="M35 16h4.5" />
        <path d="M24 8V3.5" />
      </>
    ),
  },
  {
    label: 'Development',
    icon: (
      <>
        <path d="M16 14 6 24l10 10" />
        <path d="M32 14l10 10-10 10" />
        <path d="M27.5 9 20.5 39" />
      </>
    ),
  },
  {
    label: 'Engineering Lead',
    icon: (
      <>
        <path d="M12 43V5" />
        <path d="M12 8h24l-5 7 5 7H12" />
      </>
    ),
  },
]

export function Disciplines() {
  return (
    <ul
      role="list"
      className="flex flex-wrap justify-center gap-x-[clamp(1.5rem,5vw,4.5rem)] gap-y-10 py-6 sm:py-12"
    >
      {disciplines.map((discipline) => (
        <li
          key={discipline.label}
          className="group grid w-[8.5rem] justify-items-center gap-[1.125rem] text-center"
        >
          <svg
            viewBox="0 0 48 48"
            aria-hidden="true"
            className="h-[3.25rem] w-[3.25rem] fill-none stroke-ink stroke-[1.6] transition duration-300 [stroke-linecap:round] [stroke-linejoin:round] group-hover:-translate-y-1 group-hover:stroke-coral"
          >
            {discipline.icon}
          </svg>
          <span className="text-sm font-semibold tracking-[0.1em]">
            {discipline.label}
          </span>
        </li>
      ))}
    </ul>
  )
}
