import {
  Actor,
  Box,
  Diagram,
  Edge,
  Label,
  UseCase,
} from '@/components/case-study/Diagram'

// From the callables and direct Firestore streams in CLAUDE.md of the
// autoaiconnect-backend repo. Accent marks the two flows no screen starts:
// the assistant's answer and the daily alert.
const ROW = 52
const TOP = 62
const y = (row: number) => TOP + row * ROW

const owner = [
  { label: 'Add and edit cars' },
  { label: 'See equity and readiness' },
  { label: 'Take the preference quiz' },
  { label: 'Browse the catalog, save cars' },
  { label: 'Compare payments on a new car' },
  { label: 'Ask the assistant', accent: true },
  { label: 'Subscribe or change plan' },
  { label: 'Get upgrade alerts', accent: true },
]

const admin = [
  'Upload the trim spreadsheet',
  'Browse catalog and users',
  'Change a plan by hand',
  'Run the sweep by hand',
]

const LEFT = 265
const RIGHT = 500
const RX = 106

export function UseCases() {
  return (
    <Diagram
      id="aac-uc"
      viewBox="0 0 760 480"
      minWidth={600}
      title="Use case diagram. The car owner adds and edits cars, sees their equity and readiness badge, takes the preference quiz, browses the catalog and saves cars, compares payments on a new car, asks the assistant, subscribes or changes plan, and gets upgrade alerts. The admin uploads the trim spreadsheet, browses the catalog and users, changes a plan by hand, and runs the monitoring sweep by hand. Stripe syncs the plan after a checkout, and a daily scheduler runs the sweep that files upgrade alerts."
      caption="What the backend serves. Every owner case is one callable or one direct Firestore stream. The two coral cases are where the backend talks first: the assistant streams its answer, and the daily sweep decides on its own when a car is worth an alert."
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
            AUTOAICONNECT BACKEND
          </Label>

          {owner.map((item, row) => (
            <g key={item.label}>
              <Edge d={`M92,${y(3.5)} L${LEFT - RX},${y(row)}`} />
              <UseCase
                cx={LEFT}
                cy={y(row)}
                rx={RX}
                label={item.label}
                accent={item.accent}
              />
            </g>
          ))}
          {admin.map((label, row) => (
            <g key={label}>
              <Edge d={`M676,${y(1.5)} L${RIGHT + RX},${y(row)}`} />
              <UseCase cx={RIGHT} cy={y(row)} rx={RX} label={label} />
            </g>
          ))}

          <Actor x={70} y={y(3.5)} label="Car owner" />
          <Actor x={700} y={y(1.5)} label="Admin" />

          <Edge d={`M636,${y(6)} H${LEFT + RX}`} end={m.arrow} dashed />
          <Label x={390} y={y(6) - 8}>
            webhook
          </Label>
          <Edge d={`M636,${y(7)} H${LEFT + RX}`} end={m.arrow} dashed />
          <Label x={390} y={y(7) - 8}>
            daily, 15:00 UTC
          </Label>

          <Box x={636} y={y(6) - 20} w={116} h={40} variant="dashed" title="Stripe" />
          <Box
            x={636}
            y={y(7) - 20}
            w={116}
            h={40}
            variant="dashed"
            title="Scheduler"
          />
        </>
      )}
    </Diagram>
  )
}
