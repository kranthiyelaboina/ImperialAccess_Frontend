import React, { useEffect, useState } from 'react'
import { getGuestDashboard } from '../../services/api'

interface Token {
  token_code: string
  redeemed: boolean
  redeemed_at: string | null
}

/**
 * Minimal QR Code component — pure React, no dependencies.
 * Uses the public qrserver.com API to render scannable QR images.
 */
const QRCode: React.FC<{ data: string; size?: number }> = ({ data, size = 120 }) => {
  const url = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(data)}&margin=4`
  return (
    <img
      src={url}
      alt={`QR: ${data}`}
      width={size}
      height={size}
      style={{ borderRadius: 8, background: '#fff', padding: 4 }}
    />
  )
}

const DiningTokens: React.FC = () => {
  const [tokens, setTokens] = useState<Token[]>([])
  const [total, setTotal] = useState(0)
  const [remaining, setRemaining] = useState(0)
  const [redeemed, setRedeemed] = useState(0)
  const [loading, setLoading] = useState(true)
  const [expandedToken, setExpandedToken] = useState<string | null>(null)

  useEffect(() => {
    getGuestDashboard()
      .then(data => {
        const dt = data.dining_tokens
        setTokens(dt.tokens || [])
        setTotal(dt.total)
        setRemaining(dt.remaining)
        setRedeemed(dt.redeemed)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div style={{ color: 'rgba(255,255,255,0.4)', padding: 40 }}>Loading...</div>
  return (
    <>
      {/* Stats */}
      <div className="ea-dash-stats" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="ea-dash-stat-card">
          <div>
            <div className="ea-dash-stat-value">{total}</div>
            <div className="ea-dash-stat-label">Total Tokens</div>
          </div>
        </div>
        <div className="ea-dash-stat-card">
          <div>
            <div className="ea-dash-stat-value" style={{ color: '#2ecc71' }}>{remaining}</div>
            <div className="ea-dash-stat-label">Available</div>
          </div>
        </div>
        <div className="ea-dash-stat-card">
          <div>
            <div className="ea-dash-stat-value" style={{ color: 'rgba(255,255,255,0.4)' }}>{redeemed}</div>
            <div className="ea-dash-stat-label">Redeemed</div>
          </div>
        </div>
      </div>

      {/* Token list with QR codes */}
      <div className="ea-dash-card">
        <h3 className="ea-dash-card-title">Your Dining Tokens</h3>
        {tokens.length === 0 ? (
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>No dining tokens yet.</p>
        ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {tokens.map(t => {
            const isExpanded = expandedToken === t.token_code
            return (
              <div key={t.token_code} style={{
                borderRadius: 10,
                border: `1px solid ${t.redeemed ? 'rgba(255,255,255,0.06)' : 'rgba(197,164,126,0.15)'}`,
                background: t.redeemed ? 'rgba(255,255,255,0.02)' : 'rgba(197,164,126,0.04)',
                overflow: 'hidden',
                transition: 'all 0.25s ease',
              }}>
                {/* Token header row */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '14px 18px',
                    cursor: t.redeemed ? 'default' : 'pointer',
                  }}
                  onClick={() => !t.redeemed && setExpandedToken(isExpanded ? null : t.token_code)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    {/* Small QR icon */}
                    <div style={{
                      width: 40, height: 40, borderRadius: 8,
                      background: t.redeemed ? 'rgba(255,255,255,0.04)' : 'rgba(197,164,126,0.1)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <rect x="2" y="2" width="6" height="6" rx="1" stroke={t.redeemed ? '#555' : '#c5a47e'} strokeWidth="1.5" />
                        <rect x="12" y="2" width="6" height="6" rx="1" stroke={t.redeemed ? '#555' : '#c5a47e'} strokeWidth="1.5" />
                        <rect x="2" y="12" width="6" height="6" rx="1" stroke={t.redeemed ? '#555' : '#c5a47e'} strokeWidth="1.5" />
                        <rect x="13" y="13" width="4" height="4" rx="0.5" fill={t.redeemed ? '#555' : '#c5a47e'} />
                        <rect x="4" y="4" width="2" height="2" rx="0.3" fill={t.redeemed ? '#555' : '#c5a47e'} />
                        <rect x="14" y="4" width="2" height="2" rx="0.3" fill={t.redeemed ? '#555' : '#c5a47e'} />
                        <rect x="4" y="14" width="2" height="2" rx="0.3" fill={t.redeemed ? '#555' : '#c5a47e'} />
                      </svg>
                    </div>
                    <div>
                      <div style={{
                        fontSize: 15, fontWeight: 600,
                        color: t.redeemed ? 'rgba(255,255,255,0.4)' : '#fff',
                        fontFamily: 'monospace',
                      }}>
                        {t.token_code}
                      </div>
                      {t.redeemed && t.redeemed_at && (
                        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>
                          Redeemed at {new Date(t.redeemed_at).toLocaleTimeString()}
                        </div>
                      )}
                      {!t.redeemed && (
                        <div style={{ fontSize: 11, color: 'rgba(197,164,126,0.5)', marginTop: 2 }}>
                          {isExpanded ? 'Tap to hide QR' : 'Tap to show QR code'}
                        </div>
                      )}
                    </div>
                  </div>
                  <span style={{
                    padding: '4px 14px',
                    borderRadius: 50,
                    fontSize: 12,
                    fontWeight: 600,
                    background: t.redeemed ? 'rgba(255,255,255,0.05)' : 'rgba(46,204,113,0.12)',
                    color: t.redeemed ? 'rgba(255,255,255,0.35)' : '#2ecc71',
                    border: `1px solid ${t.redeemed ? 'rgba(255,255,255,0.08)' : 'rgba(46,204,113,0.3)'}`,
                  }}>
                    {t.redeemed ? 'Used' : 'Active'}
                  </span>
                </div>

                {/* QR code expanded area */}
                {isExpanded && !t.redeemed && (
                  <div style={{
                    padding: '0 18px 18px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 10,
                    borderTop: '1px solid rgba(197,164,126,0.1)',
                    paddingTop: 16,
                  }}>
                    <QRCode data={`IMPERIALACCESS-DINING:${t.token_code}`} size={160} />
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', textAlign: 'center', margin: 0, lineHeight: 1.5 }}>
                      Show this QR code at the dining counter to redeem your token
                    </p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
        )}
      </div>
    </>
  )
}

export default DiningTokens
