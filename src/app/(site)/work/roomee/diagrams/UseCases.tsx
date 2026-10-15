import {
  Actor,
  Diagram,
  Edge,
  Label,
  UseCase,
} from '@/components/case-study/Diagram'

// Grouped from backend/routes/api.php and the role layouts in the Roomee repo.
// Accent marks the cases ranked by the compatibility scorer.
const ROW = 50
const TOP = 62
const y = (row: number) => TOP + row * ROW

const LEFT = 265
const RIGHT = 500
const RX = 106

const tenant = [
  { label: 'Browse listings on a map', guest: true },
  { label: 'Browse flatmates by match', guest: true, accent: true },
  { label: 'Save listings' },
  { label: 'Request a room' },
  { label: 'Chat with a host' },
  { label: 'Pick a visit slot' },
  { label: 'Sign the contract' },
  { label: 'Host a flatshare' },
]

const landlord = [
  { label: 'Publish a listing' },
  { label: 'Review applicants by match', accent: true },
  { label: 'Message a seeker' },
  { label: 'Accept or decline' },
  { label: 'Offer visit slots' },
  { label: 'Sign the contract' },
]

const admin = [
  { label: 'Moderate users, listings', row: 6 },
  { label: 'Review flagged messages', row: 7 },
]

const GUEST_Y = 104
const TENANT_Y = 316
const LANDLORD_Y = 186
const ADMIN_Y = 404

export function UseCases() {
  return (
    <Diagram
      id="rm-uc"
      viewBox="0 0 760 480"
      minWidth={600}
      title="Use case diagram. A guest browses listings on a map and browses flatmates ranked by match. A tenant is a guest who can also save listings, request a room, chat with a host, pick a visit slot, sign the contract, and host a flatshare. A landlord publishes a listing, reviews applicants ranked by match, messages a seeker, accepts or declines requests, offers visit slots, and signs the contract. An admin moderates users and listings and reviews flagged messages."
      caption="Who does what. A tenant is a guest with an account, so every guest case is theirs too. The two coral cases are ranked by the compatibility scorer, and a tenant who hosts a flatshare reviews applicants the same way a landlord does."
    >
      {(m) => (
        <>
          <rect
            x="152"
            y="18"
            width="462"
            height="422"
            rx="14"
            fill="none"
            className="stroke-ink"
            strokeWidth="1.25"
          />
          <Label x={168} y={36} tone="ink">
            ROOMEE
          </Label>

          {tenant.map((item, row) => (
            <g key={item.label}>
              <Edge
                d={`M92,${item.guest ? GUEST_Y : TENANT_Y} L${LEFT - RX},${y(row)}`}
              />
              <UseCase
                cx={LEFT}
                cy={y(row)}
                rx={RX}
                label={item.label}
                accent={item.accent}
              />
            </g>
          ))}
          {landlord.map((item, row) => (
            <g key={item.label}>
              <Edge d={`M676,${LANDLORD_Y} L${RIGHT + RX},${y(row)}`} />
              <UseCase
                cx={RIGHT}
                cy={y(row)}
                rx={RX}
                label={item.label}
                accent={item.accent}
              />
            </g>
          ))}
          {admin.map((item) => (
            <g key={item.label}>
              <Edge d={`M676,${ADMIN_Y} L${RIGHT + RX},${y(item.row)}`} />
              <UseCase cx={RIGHT} cy={y(item.row)} rx={RX} label={item.label} />
            </g>
          ))}

          {/* Generalization: a tenant is a guest with an account. */}
          <Edge d={`M70,${TENANT_Y - 42} V${GUEST_Y + 66}`} />
          <path
            d={`M63,${GUEST_Y + 66} L70,${GUEST_Y + 54} L77,${GUEST_Y + 66} z`}
            className="fill-surface stroke-muted"
            strokeWidth="1.25"
          />

          <Actor x={70} y={GUEST_Y} label="Guest" />
          <Actor x={70} y={TENANT_Y} label="Tenant" />
          <Actor x={700} y={LANDLORD_Y} label="Landlord" />
          <Actor x={700} y={ADMIN_Y} label="Admin" />
        </>
      )}
    </Diagram>
  )
}
