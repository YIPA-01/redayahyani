import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

import { ImageResponse } from 'next/og'
import { type NextRequest } from 'next/server'

import { R_PATH, variants } from '@/components/Signature'

// Renders the card that LinkedIn, X, and Slack show for a shared link. With no
// title it is the default card (signature, name, role) that Home and anything
// without its own card inherits. Fonts are vendored in src/fonts/ rather than
// fetched: the route has to work offline and during a build with no network,
// and next/font does not reach ImageResponse.

export const runtime = 'nodejs'

const size = { width: 1200, height: 630 }

const ink = '#fafafa'
const muted = '#a5a0ab'

const fonts = Promise.all([
  readFile(join(process.cwd(), 'src/fonts/jost/Jost-400.woff')),
  readFile(join(process.cwd(), 'src/fonts/jost/Jost-700.woff')),
  readFile(join(process.cwd(), 'src/fonts/dm-mono/DMMono-400.woff')),
]).then(([jost400, jost700, mono400]) => [
  {
    name: 'Jost',
    data: jost400,
    weight: 400 as const,
    style: 'normal' as const,
  },
  {
    name: 'Jost',
    data: jost700,
    weight: 700 as const,
    style: 'normal' as const,
  },
  {
    name: 'DM Mono',
    data: mono400,
    weight: 400 as const,
    style: 'normal' as const,
  },
])

function Mark({ height, r, y }: { height: number; r: number; y: number }) {
  return (
    <svg
      width={(height * 3) / 4}
      height={height}
      viewBox={variants.drawn.viewBox}
      fill="none"
      stroke={ink}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={R_PATH} strokeWidth={r} />
      <path d={variants.drawn.y} strokeWidth={y} />
    </svg>
  )
}

function DefaultCard() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 64,
        backgroundColor: '#000000',
        fontFamily: 'Jost',
      }}
    >
      <Mark height={300} r={26} y={9} />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            fontSize: 84,
            fontWeight: 700,
            color: ink,
            letterSpacing: '-0.02em',
            lineHeight: 1.05,
          }}
        >
          Reda Yahyani
        </div>
        <div style={{ fontSize: 40, color: muted, marginTop: 12 }}>
          Product engineer
        </div>
      </div>
    </div>
  )
}

function PageCard({ title, eyebrow }: { title: string; eyebrow?: string }) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '80px',
        backgroundColor: '#000000',
        fontFamily: 'Jost',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {eyebrow && (
          <div
            style={{
              fontFamily: 'DM Mono',
              fontSize: 24,
              color: muted,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: 28,
            }}
          >
            {eyebrow}
          </div>
        )}
        <div
          style={{
            fontSize: title.length > 70 ? 64 : 76,
            fontWeight: 700,
            color: ink,
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
          }}
        >
          {title}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
        <Mark height={88} r={44} y={18} />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 30, fontWeight: 700, color: ink }}>
            Reda Yahyani
          </div>
          <div style={{ fontSize: 24, color: muted }}>Product engineer</div>
        </div>
      </div>
    </div>
  )
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams
  const title = params.get('title')?.slice(0, 120)
  const eyebrow = params.get('eyebrow')?.slice(0, 60)

  return new ImageResponse(
    title ? <PageCard title={title} eyebrow={eyebrow} /> : <DefaultCard />,
    { ...size, fonts: await fonts },
  )
}
