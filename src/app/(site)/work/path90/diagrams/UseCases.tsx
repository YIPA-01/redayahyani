import {
  Actor,
  Diagram,
  Edge,
  Label,
  UseCase,
} from '@/components/case-study/Diagram'

// The 27 use cases in the project's UML/useCase.yaml, grouped. Accent marks
// the two that still work with no connection.
const ROW = 52
const TOP = 62
const y = (row: number) => TOP + row * ROW

const participant = [
  { label: 'Register and onboard', uc: 'UC-01 to 03' },
  { label: "See today's plan, Day X of 90", uc: 'UC-06' },
  { label: 'Complete tasks and steps', uc: 'UC-07', accent: true },
  { label: 'Spend, save, invest', uc: 'UC-10 to 12' },
  { label: 'Track appointments, navigate', uc: 'UC-14, 15' },
  { label: 'Browse resources, track jobs', uc: 'UC-19' },
  { label: 'Install and use offline', uc: 'UC-26, 27', accent: true },
  { label: 'Get reminders, 24 h and 1 h', uc: 'UC-16' },
]

const manager = [
  { label: 'Watch caseload status', row: 0 },
  { label: 'Assign tasks, publish roadmap', row: 1 },
  { label: 'Schedule, mark appointments', row: 2 },
  { label: 'Manage resources and tips', row: 3 },
  { label: 'Export outcome report', row: 4 },
  { label: 'Invite admins, deactivate', row: 5 },
  { label: 'Get inactivity alerts', row: 7 },
]

const LEFT = 265
const RIGHT = 500
const RX = 106

export function UseCases() {
  return (
    <Diagram
      id="p90-uc"
      viewBox="0 0 760 540"
      minWidth={600}
      title="Use case diagram. The participant registers, sees today's plan, completes tasks and steps, manages money, tracks appointments, browses resources and jobs, installs the app and uses it offline, and gets reminders. The case manager watches caseload status, assigns tasks and publishes the roadmap, schedules appointments, manages resources, exports the outcome report, invites admins, and gets inactivity alerts. A scheduler sends the reminders and the inactivity alerts."
      caption="The project's 27 use cases, grouped. The two coral cases are the ones that keep working with no signal. Both reminder flows start from a scheduler, not from a person."
    >
      {(m) => (
        <>
          <rect
            x="152"
            y="18"
            width="462"
            height="440"
            rx="14"
            fill="none"
            className="stroke-ink"
            strokeWidth="1.25"
          />
          <Label x={168} y={36} tone="ink">
            PATH90
          </Label>

          {participant.map((item, row) => (
            <g key={item.label}>
              <Edge d={`M92,212 L${LEFT - RX},${y(row)}`} />
              <UseCase
                cx={LEFT}
                cy={y(row)}
                rx={RX}
                label={item.label}
                accent={item.accent}
              />
            </g>
          ))}
          {manager.map((item) => (
            <g key={item.label}>
              <Edge d={`M676,${TOP + 2.5 * ROW} L${RIGHT + RX},${y(item.row)}`} />
              <UseCase cx={RIGHT} cy={y(item.row)} rx={RX} label={item.label} />
            </g>
          ))}

          <Actor x={70} y={212} label="Participant" />
          <Actor x={700} y={TOP + 2.5 * ROW} label="Case manager" />

          <rect
            x="322"
            y="482"
            width="120"
            height="44"
            rx="8"
            className="fill-surface stroke-ink"
            strokeWidth="1.25"
          />
          <Label x={382} y={499} anchor="middle">
            «system»
          </Label>
          <text
            x="382"
            y="516"
            textAnchor="middle"
            className="fill-ink font-sans text-[12.5px] font-medium"
          >
            Scheduler
          </text>
          <Edge d={`M370,482 L${LEFT + 30},${y(7) + 19}`} end={m.arrow} />
          <Edge d={`M394,482 L${RIGHT - 30},${y(7) + 19}`} end={m.arrow} />
        </>
      )}
    </Diagram>
  )
}
