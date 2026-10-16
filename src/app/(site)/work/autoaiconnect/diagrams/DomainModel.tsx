import {
  ClassBox,
  Diagram,
  Edge,
  Label,
  classHeight,
} from '@/components/case-study/Diagram'

// The core of auto-ai-connect-firestore-schema.yaml in the backend repo.
// Coral attributes are the ones the server stamps and the client can never
// write.
const W = 175
const col = (i: number) => 10 + i * 205
const ROW1 = 20
const ROW2 = 240

const user = ['uid', 'role', 'subscription_tier', 'finance_profile', 'location.zip']
const subscription = [
  'plan',
  'status',
  'provider',
  { name: 'ai_rate_limit', accent: true },
]
const carProfile = [
  'car_id',
  'make, model, year, trim',
  'mileage, mileage_as_of',
  'condition',
  'payoff_balance',
  'remaining_term',
  'terms_as_of',
  'created_at',
]
const snapshot = [
  'car_id',
  { name: 'trade_value', accent: true },
  { name: 'equity', accent: true },
  { name: 'readiness_badge', accent: true },
  'determinable',
  'depreciation_curve_used',
  'value_source',
  'disclaimer',
]
const chat = ['role', 'content', { name: 'tools_called', accent: true }, 'equity_at_time']
const favorite = ['id uid__catalog_car_id', 'created_at']
const catalog = [
  'make, model, year',
  'market_tier',
  'body_style',
  'powertrains',
  'package_family_tags',
  'available',
]
const configuration = [
  'vehicle_id',
  'trim',
  'msrp',
  'msrp_basis',
  'record_status',
]

export function DomainModel() {
  let userBottom = ROW1 + classHeight(user.length)
  let carBottom = ROW1 + classHeight(carProfile.length)
  let mid = (i: number) => col(i) + W / 2

  return (
    <Diagram
      id="aac-domain"
      viewBox="0 0 810 420"
      minWidth={640}
      title="Domain model. A user has one subscription, many car profiles, many chat messages, and many favorites. A car profile is versioned: each edit appends a new document, and versions are grouped by car_id. Each car profile has many equity snapshots, which are append-only and written only by the server. A favorite points at one catalog model. A catalog model is composed of many trim configurations, each with a permanent vehicle_id. A car profile is matched to a catalog model by make, model, and year, not by a key."
      caption="Two classes never change once written. A car profile edit appends a new version under the same car_id, and an equity snapshot is never updated, so the history of a car’s value is its documents. Coral fields are stamped by the server. The dashed line is the weak spot: a user’s car meets the catalog by name, not by id."
    >
      {(m) => (
        <>
          {/* Row 1: the user and their cars */}
          <Edge d={`M${col(0) + W},60 H${col(1)}`} />
          <Label x={col(0) + W + 6} y={54}>
            1
          </Label>
          <Label x={col(1) - 6} y={54} anchor="end">
            1
          </Label>

          <Edge d={`M${col(1) + W},60 H${col(2)}`} />
          <Label x={col(1) + W + 6} y={54}>
            1
          </Label>
          <Label x={col(2) - 6} y={54} anchor="end">
            *
          </Label>

          <Edge d={`M${col(2) + W},60 H${col(3)}`} />
          <Label x={col(2) + W + 6} y={54}>
            1
          </Label>
          <Label x={col(3) - 6} y={54} anchor="end">
            *
          </Label>

          {/* User to chat messages and favorites */}
          <Edge d={`M${col(1) + 20},${userBottom} L${mid(0)},${ROW2}`} />
          <Label x={mid(0) + 8} y={ROW2 - 8}>
            *
          </Label>
          <Edge d={`M${mid(1)},${userBottom} V${ROW2}`} />
          <Label x={mid(1) + 8} y={ROW2 - 8}>
            *
          </Label>

          {/* Favorite to catalog model */}
          <Edge d={`M${col(1) + W},${ROW2 + 40} H${col(2)}`} end={m.arrow} />
          <Label x={col(2) - 6} y={ROW2 + 34} anchor="end">
            1
          </Label>

          {/* Car profile to catalog model: a name match, not a key */}
          <Edge d={`M${mid(2)},${carBottom} V${ROW2}`} end={m.arrow} dashed />
          <Label x={mid(2) + 8} y={carBottom + 20}>
            by make, model, year
          </Label>

          {/* Catalog model composed of trim configurations */}
          <Edge d={`M${col(2) + W},${ROW2 + 40} H${col(3)}`} start={m.diamond} />
          <Label x={col(3) - 6} y={ROW2 + 34} anchor="end">
            1..*
          </Label>

          <ClassBox x={col(0)} y={ROW1} w={W} name="Subscription" attrs={subscription} />
          <ClassBox x={col(1)} y={ROW1} w={W} name="User" attrs={user} />
          <ClassBox
            x={col(2)}
            y={ROW1}
            w={W}
            name="CarProfile"
            attrs={carProfile}
            tag="versioned"
          />
          <ClassBox
            x={col(3)}
            y={ROW1}
            w={W}
            name="EquitySnapshot"
            attrs={snapshot}
          />

          <ClassBox x={col(0)} y={ROW2} w={W} name="ChatMessage" attrs={chat} />
          <ClassBox x={col(1)} y={ROW2} w={W} name="Favorite" attrs={favorite} />
          <ClassBox x={col(2)} y={ROW2} w={W} name="CatalogCar" attrs={catalog} />
          <ClassBox
            x={col(3)}
            y={ROW2}
            w={W}
            name="Configuration"
            attrs={configuration}
            tag="per trim"
          />
        </>
      )}
    </Diagram>
  )
}
