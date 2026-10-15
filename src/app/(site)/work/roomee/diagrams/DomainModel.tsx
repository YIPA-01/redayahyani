import {
  ClassBox,
  Diagram,
  Edge,
  Label,
  classHeight,
} from '@/components/case-study/Diagram'

// From the Eloquent models and migrations in the Roomee repo. Coral fields are
// the inputs the compatibility scorer reads.
const W = 165
const col = (i: number) => 10 + i * 205
const mid = (i: number) => col(i) + W / 2
const ROW1 = 20
const ROW2 = 270
const ROW3 = 440

const profile = [
  'gender',
  'age',
  { name: 'budget_max', accent: true },
  { name: 'preferred_city', accent: true },
  { name: 'move_in_date', accent: true },
  { name: 'work_schedule', accent: true },
  { name: 'guests_frequency', accent: true },
  { name: 'is_smoker', accent: true },
  { name: 'has_pets', accent: true },
]
const listing = [
  'type: rental | coliving',
  'status',
  { name: 'rent', accent: true },
  { name: 'city, area', accent: true },
  'latitude, longitude',
  { name: 'preferred_gender', accent: true },
  { name: 'smokers_ok', accent: true },
  { name: 'pets_ok', accent: true },
]
const user = ['role', 'locale', 'profile_score', 'email_verified_at']
const booking = [
  'status',
  'visit_at',
  'landlord_signed_at',
  'tenant_signed_at',
  'contract_pdf_path',
]

export function DomainModel() {
  let userBottom = ROW1 + classHeight(user.length)
  let listingBottom = ROW1 + classHeight(listing.length)
  let bookingBottom = ROW2 + classHeight(booking.length)

  return (
    <Diagram
      id="rm-domain"
      viewBox="0 0 800 510"
      minWidth={620}
      title="Domain model. A user has one profile and hosts many listings; a listing has many images. A user sends many room requests, and a listing receives many. An accepted request opens at most one conversation, which has two participants and many messages. A request can lead to bookings, and a booking has many visit slots."
      caption="The domain as the code has it. A conversation belongs to two users and a listing, and can exist before any request, because a host can write to a seeker first. Coral fields feed the compatibility scorer; everything else is plumbing."
    >
      {(m) => (
        <>
          {/* Row 1 */}
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

          <Edge d={`M${col(2) + W},60 H${col(3)}`} start={m.diamond} />
          <Label x={col(3) - 6} y={54} anchor="end">
            *
          </Label>

          {/* Listing receives requests */}
          <Edge d={`M${mid(2) + 30},${listingBottom} V${ROW2}`} />
          <Label x={mid(2) + 36} y={listingBottom + 14}>
            1
          </Label>
          <Label x={mid(2) + 36} y={ROW2 - 6}>
            *
          </Label>

          {/* User sends requests */}
          <Edge
            d={`M${mid(1) + 40},${userBottom} V244 H${mid(2) - 30} V${ROW2}`}
          />
          <Label x={mid(1) + 46} y={userBottom + 14}>
            1
          </Label>
          <Label x={mid(2) - 24} y={ROW2 - 6}>
            *
          </Label>
          <Label x={(mid(1) + mid(2)) / 2 + 5} y={238} anchor="middle">
            requests
          </Label>

          {/* User takes part in conversations */}
          <Edge d={`M${mid(1) - 20},${userBottom} V${ROW2}`} />
          <Label x={mid(1) - 14} y={userBottom + 14}>
            2
          </Label>
          <Label x={mid(1) - 14} y={ROW2 - 6}>
            *
          </Label>

          {/* Row 2 */}
          <Edge d={`M${col(1)},300 H${col(0) + W}`} start={m.diamond} />
          <Label x={col(0) + W + 6} y={294}>
            *
          </Label>

          <Edge d={`M${col(2)},300 H${col(1) + W}`} dashed />
          <Label x={col(2) - 6} y={294} anchor="end">
            1
          </Label>
          <Label x={col(1) + W + 6} y={318}>
            0..1
          </Label>

          <Edge d={`M${col(2) + W},300 H${col(3)}`} />
          <Label x={col(2) + W + 6} y={294}>
            1
          </Label>
          <Label x={col(3) - 6} y={294} anchor="end">
            *
          </Label>

          <Edge d={`M${mid(3)},${bookingBottom} V${ROW3}`} start={m.diamond} />
          <Label x={mid(3) + 6} y={ROW3 - 6}>
            *
          </Label>

          <ClassBox x={col(0)} y={ROW1} w={W} name="Profile" attrs={profile} />
          <ClassBox x={col(1)} y={ROW1} w={W} name="User" attrs={user} />
          <ClassBox x={col(2)} y={ROW1} w={W} name="Listing" attrs={listing} />
          <ClassBox
            x={col(3)}
            y={ROW1}
            w={W}
            name="ListingImage"
            attrs={['path', 'is_cover', 'sort_order']}
          />
          <ClassBox
            x={col(0)}
            y={ROW2}
            w={W}
            name="Message"
            attrs={['type', 'body', 'meta', 'read_at']}
          />
          <ClassBox
            x={col(1)}
            y={ROW2}
            w={W}
            name="Conversation"
            attrs={['host_id', 'requester_id', 'listing_id']}
          />
          <ClassBox
            x={col(2)}
            y={ROW2}
            w={W}
            name="RoomRequest"
            attrs={['status', 'message', 'cancelled_at']}
          />
          <ClassBox x={col(3)} y={ROW2} w={W} name="Booking" attrs={booking} />
          <ClassBox
            x={col(3)}
            y={ROW3}
            w={W}
            name="BookingSlot"
            attrs={['slot_at']}
          />
        </>
      )}
    </Diagram>
  )
}
