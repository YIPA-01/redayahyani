import {
  Diagram,
  Fragment,
  Lifeline,
  Message,
} from '@/components/case-study/Diagram'

// RoomRequestService, ConversationService, BookingService, and the broadcast
// events in the Roomee repo.
const TENANT = 70
const API = 240
const WS = 410
const LANDLORD = 580

export function RequestToContract() {
  return (
    <Diagram
      id="rm-request"
      viewBox="0 0 660 470"
      minWidth={600}
      title="Sequence diagram from request to contract. The tenant posts a room request to the API, which allows one request per listing. The API broadcasts RoomRequestReceived through Reverb, and the landlord gets it live and by push. The landlord accepts; the API opens the conversation and broadcasts RoomRequestResponded, which reaches the tenant live and by push. In the chat, the landlord offers visit slots, the tenant picks one, the landlord sends the contract, and both sign, which completes the booking and closes the listing."
      caption="One request, end to end. Every step after acceptance happens inside the conversation as a booking card, so the tenant and the landlord never leave the thread to arrange a visit. Each event reaches the other person live if the app is open and by push if it is not."
    >
      {(m) => (
        <>
          <Lifeline x={TENANT} top={14} bottom={456} label="Tenant" w={110} />
          <Lifeline x={API} top={14} bottom={456} label="Laravel API" />
          <Lifeline x={WS} top={14} bottom={456} label="Reverb" w={110} />
          <Lifeline x={LANDLORD} top={14} bottom={456} label="Landlord" w={120} />

          <Message
            from={TENANT}
            to={API}
            y={82}
            label="POST room-requests"
            markers={m}
          />
          <Message
            from={API}
            to={API}
            y={92}
            label="one per listing"
            markers={m}
            accent
          />
          <Message
            from={API}
            to={WS}
            y={140}
            label="RoomRequestReceived"
            markers={m}
          />
          <Message
            from={WS}
            to={LANDLORD}
            y={166}
            label="live, and push"
            markers={m}
          />
          <Message from={LANDLORD} to={API} y={204} label="accept" markers={m} />
          <Message
            from={API}
            to={API}
            y={214}
            label="open the chat"
            markers={m}
            accent
          />
          <Message
            from={API}
            to={WS}
            y={262}
            label="RoomRequestResponded"
            markers={m}
          />
          <Message
            from={WS}
            to={TENANT}
            y={288}
            label="live, and push"
            markers={m}
          />

          <Fragment x={24} y={306} w={612} h={146} label="in the chat" />
          <Message
            from={LANDLORD}
            to={API}
            y={342}
            label="offer visit slots"
            markers={m}
          />
          <Message
            from={TENANT}
            to={API}
            y={370}
            label="pick a slot"
            markers={m}
          />
          <Message
            from={LANDLORD}
            to={API}
            y={398}
            label="send the contract"
            markers={m}
          />
          <Message from={TENANT} to={API} y={426} label="sign" markers={m} />
          <Message
            from={API}
            to={API}
            y={430}
            label="both signed"
            markers={m}
            accent
          />
        </>
      )}
    </Diagram>
  )
}
