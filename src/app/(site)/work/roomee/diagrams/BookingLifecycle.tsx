import {
  Diagram,
  Edge,
  Fragment,
  InitialState,
  Label,
  State,
} from '@/components/case-study/Diagram'

// RoomRequestService::respond and BookingService in the Roomee repo.
export function BookingLifecycle() {
  return (
    <Diagram
      id="rm-booking"
      viewBox="0 0 700 480"
      minWidth={580}
      title="State diagram from request to contract. A request starts pending. The landlord declines it, or accepts it, which opens the chat. The landlord then offers visit slots. The tenant picks one, which schedules the visit, or asks for new times, which returns to slots proposed. The landlord can decline before a slot is picked. After the visit the landlord sends the contract, and when both sides have signed the booking is completed and the listing closes. Either side can cancel an open booking."
      caption="From the first message to a signed contract. Each arrow is one method in RoomRequestService or BookingService. Completing a booking closes the listing, so a signed room stops appearing in search. A pending request can also be withdrawn by the tenant."
    >
      {(m) => (
        <>
          <InitialState x={24} y={66} />
          <Edge d="M32,66 H58" end={m.arrow} />

          <Edge d="M192,66 H298" end={m.arrow} />
          <Label x={198} y={58}>
            landlord accepts
          </Label>

          <Edge d="M125,92 V168" end={m.arrow} />
          <Label x={131} y={134}>
            landlord declines
          </Label>

          <Edge d="M360,92 V168" end={m.arrow} />
          <Label x={366} y={128}>
            landlord offers
          </Label>
          <Label x={366} y={141}>
            visit slots
          </Label>

          <Fragment x={285} y={150} w={390} h={216} label="booking" />

          <Edge d="M420,186 H538" end={m.arrow} />
          <Label x={479} y={180} anchor="middle">
            tenant picks
          </Label>
          <Edge d="M540,208 H422" end={m.arrow} />
          <Label x={481} y={222} anchor="middle">
            new times
          </Label>

          <Edge d="M300,196 H192" end={m.arrow} />
          <Label x={196} y={190}>
            declines
          </Label>

          <Edge d="M600,222 V288" end={m.arrow} />
          <Label x={594} y={252} anchor="end">
            landlord sends
          </Label>
          <Label x={594} y={265} anchor="end">
            the contract
          </Label>

          <Edge d="M600,342 V408" end={m.arrow} />
          <Label x={606} y={384}>
            both sign
          </Label>

          <Edge d="M285,316 H192" end={m.arrow} />
          <Label x={196} y={310}>
            cancel
          </Label>

          <State x={60} y={40} w={132} label="Request" sub="pending" />
          <State x={300} y={40} w={120} label="Accepted" sub="chat opens" />
          <State x={40} y={170} w={150} label="Declined" final />
          <State x={300} y={170} w={120} label="Slots" sub="slot_proposed" />
          <State x={540} y={170} w={120} label="Visit" sub="visit_scheduled" />
          <State
            x={540}
            y={290}
            w={120}
            label="Contract"
            sub="contract_pending"
          />
          <State x={40} y={290} w={150} label="Cancelled" final />
          <State
            x={540}
            y={410}
            w={120}
            label="Completed"
            sub="listing closed"
            final
          />
        </>
      )}
    </Diagram>
  )
}
