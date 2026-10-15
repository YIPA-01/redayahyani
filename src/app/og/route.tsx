import { ImageResponse } from 'next/og'
import { type NextRequest } from 'next/server'

import { R_PATH, variants } from '@/components/Signature'

// Renders the card that LinkedIn, X, and Slack show for a shared link. No
// external font fetching on purpose: the route has to work offline and during
// a build with no network.

export const runtime = 'nodejs'

const size = { width: 1200, height: 630 }

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams
  const title = params.get('title')?.slice(0, 120) ?? 'Reda Yahyani'
  const eyebrow = params.get('eyebrow')?.slice(0, 60)

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '80px',
          backgroundColor: '#131215',
          // The site's organic glow, minus the blur Satori cannot render:
          // uneven pink and coral patches, centre left clear for the title.
          backgroundImage:
            'radial-gradient(ellipse 45% 60% at 4% 30%, rgba(184,86,106,0.55), transparent 70%), radial-gradient(ellipse 40% 65% at 96% 70%, rgba(184,86,106,0.5), transparent 70%), radial-gradient(ellipse 30% 40% at 22% 100%, rgba(255,111,90,0.22), transparent 70%)',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {eyebrow && (
            <div
              style={{
                fontSize: 28,
                color: '#ff6f5a',
                letterSpacing: '0.04em',
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
              color: '#fafafa',
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
            }}
          >
            {title}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(250,250,250,0.14)',
            paddingTop: 32,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <svg
              width="44"
              height="45"
              viewBox="0 0 720 740"
              fill="none"
              stroke="#fafafa"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d={R_PATH} strokeWidth={54} />
              <path d={variants.compact.y} strokeWidth={30} />
            </svg>
            <div style={{ fontSize: 30, color: '#e4e4e7' }}>Reda Yahyani</div>
          </div>
          <div style={{ fontSize: 26, color: '#a1a1aa' }}>Product engineer</div>
        </div>
      </div>
    ),
    size,
  )
}
