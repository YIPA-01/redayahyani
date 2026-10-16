import {
  Diagram,
  Fragment,
  Lifeline,
  Message,
} from '@/components/case-study/Diagram'

// functions/src/ai/chat.ts (controller), service.ts (runAgentTurn) and
// repository.ts (saveChatPair) in the backend repo.
const APP = 70
const FN = 250
const DB = 440
const LLM = 630

export function AgentTurn() {
  return (
    <Diagram
      id="aac-agent"
      viewBox="0 0 720 540"
      minWidth={600}
      title="Sequence diagram of one assistant turn. The app calls the aiChat callable in streaming mode with the user's message. The function verifies the token and the plan, counts today's assistant replies in Firestore against the plan's limit, and loads nine context sources in parallel. It sends the conversation and six tool schemas to the model. If the model asks for a tool, the function runs it against Firestore and sends the result back, at most twice. The model's text arrives in deltas, which the function forwards to the app as chunks. Finally the function writes the user message and the reply to chat_messages in one batch and returns the full reply with the tools it used."
      caption="One message in, one answer out, never an open loop. The function, not the app, writes both sides of the exchange in one batch, which is what makes the daily limit impossible to inflate from a phone."
    >
      {(m) => (
        <>
          <Lifeline x={APP} top={14} bottom={526} label="Flutter app" w={110} />
          <Lifeline x={FN} top={14} bottom={526} label="aiChat callable" />
          <Lifeline x={DB} top={14} bottom={526} label="Firestore" />
          <Lifeline x={LLM} top={14} bottom={526} label="Gemini or GPT-4.1" w={150} />

          <Message
            from={APP}
            to={FN}
            y={84}
            label=".stream({ message })"
            markers={m}
          />
          <Message
            from={FN}
            to={FN}
            y={96}
            label="token, plan gate"
            markers={m}
          />
          <Message
            from={FN}
            to={DB}
            y={150}
            label="count today’s replies"
            markers={m}
          />
          <Message
            from={DB}
            to={FN}
            y={176}
            label="under ai_rate_limit"
            markers={m}
            reply
          />
          <Message
            from={FN}
            to={DB}
            y={210}
            label="9 context sources, in parallel"
            markers={m}
          />
          <Message
            from={DB}
            to={FN}
            y={236}
            label="car, equity, quiz, history…"
            markers={m}
            reply
          />

          <Fragment x={160} y={256} w={540} h={130} label="loop, at most 2 tool calls" />
          <Message
            from={FN}
            to={LLM}
            y={292}
            label="messages + 6 tool schemas"
            markers={m}
          />
          <Message from={LLM} to={FN} y={318} label="tool call" markers={m} reply />
          <Message from={FN} to={DB} y={346} label="run the tool" markers={m} />
          <Message from={DB} to={FN} y={372} label="result" markers={m} reply />

          <Message from={LLM} to={FN} y={418} label="text deltas" markers={m} reply />
          <Message
            from={FN}
            to={APP}
            y={444}
            label="sendChunk({ textDelta })"
            markers={m}
            accent
          />
          <Message
            from={FN}
            to={DB}
            y={474}
            label="one batch: message + reply"
            markers={m}
            accent
          />
          <Message
            from={FN}
            to={APP}
            y={506}
            label="{ reply, toolsUsed }"
            markers={m}
            reply
          />
        </>
      )}
    </Diagram>
  )
}
