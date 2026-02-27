import React from 'react'

const tokens = [
  { code: 'DT-001', redeemed: true, redeemed_at: '2026-02-27T12:30:00' },
  { code: 'DT-002', redeemed: false, redeemed_at: null },
  { code: 'DT-003', redeemed: false, redeemed_at: null },
]

const DiningTokens: React.FC = () => {
  return (
    <>
      {/* Stats */}
      <div className="ea-dash-stats" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="ea-dash-stat-card">
          <div>
            <div className="ea-dash-stat-value">3</div>
            <div className="ea-dash-stat-label">Total Tokens</div>
          </div>
        </div>
        <div className="ea-dash-stat-card">
          <div>
            <div className="ea-dash-stat-value" style={{ color: '#2ecc71' }}>2</div>
            <div className="ea-dash-stat-label">Available</div>
          </div>
        </div>
        <div className="ea-dash-stat-card">
          <div>
            <div className="ea-dash-stat-value" style={{ color: 'rgba(255,255,255,0.4)' }}>1</div>
            <div className="ea-dash-stat-label">Redeemed</div>
          </div>
        </div>
      </div>

      {/* Token list */}
      <div className="ea-dash-card">
        <h3 className="ea-dash-card-title">Your Dining Tokens</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {tokens.map(t => (
            <div key={t.code} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '14px 18px',
              borderRadius: 10,
              border: `1px solid ${t.redeemed ? 'rgba(255,255,255,0.06)' : 'rgba(197,164,126,0.15)'}`,
              background: t.redeemed ? 'rgba(255,255,255,0.02)' : 'rgba(197,164,126,0.04)',
            }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: t.redeemed ? 'rgba(255,255,255,0.4)' : '#fff', fontFamily: 'monospace' }}>{t.code}</div>
                {t.redeemed && t.redeemed_at && (
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>
                    Redeemed at {new Date(t.redeemed_at).toLocaleTimeString()}
                  </div>
                )}
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
          ))}
        </div>
      </div>
    </>
  )
}

export default DiningTokens
