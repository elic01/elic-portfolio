import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Emmanuel Leon Isheanesu Chinjekure — Full-Stack Developer & Systems Administrator'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          backgroundColor: '#0d1117',
          padding: '60px',
          fontFamily: 'sans-serif',
          color: '#e6edf3',
          border: '2px solid #30363d',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '14px',
              height: '14px',
              borderRadius: '50%',
              backgroundColor: '#00c9a7',
            }}
          />
          <span style={{ fontSize: '24px', fontFamily: 'monospace', color: '#00c9a7' }}>
            ~/elic01
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h1
            style={{
              fontSize: '48px',
              fontWeight: 800,
              lineHeight: 1.1,
              margin: 0,
              color: '#ffffff',
            }}
          >
            Emmanuel Leon Isheanesu Chinjekure
          </h1>
          <p
            style={{
              fontSize: '28px',
              color: '#8b949e',
              margin: 0,
            }}
          >
            Full-Stack Developer · Systems Administrator · Cybersecurity Enthusiast
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            fontSize: '18px',
            fontFamily: 'monospace',
            color: '#8b949e',
          }}
        >
          <div
            style={{
              padding: '8px 16px',
              backgroundColor: '#161b22',
              borderRadius: '8px',
              border: '1px solid #30363d',
              color: '#00c9a7',
            }}
          >
            Next.js 16
          </div>
          <div
            style={{
              padding: '8px 16px',
              backgroundColor: '#161b22',
              borderRadius: '8px',
              border: '1px solid #30363d',
              color: '#9d5ce6',
            }}
          >
            Proxmox VE & Docker
          </div>
          <div
            style={{
              padding: '8px 16px',
              backgroundColor: '#161b22',
              borderRadius: '8px',
              border: '1px solid #30363d',
              color: '#39d353',
            }}
          >
            Cybersecurity & IaC
          </div>
          <div
            style={{
              padding: '8px 16px',
              backgroundColor: '#161b22',
              borderRadius: '8px',
              border: '1px solid #30363d',
              color: '#ffb703',
            }}
          >
            Harare, Zimbabwe
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    },
  )
}
