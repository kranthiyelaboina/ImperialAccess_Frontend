import React, { useEffect, useState } from 'react'
import { getGuestDashboard, type GuestDashboardData } from '../../services/api'

const LoungeAccess: React.FC = () => {
  const [data, setData] = useState<GuestDashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getGuestDashboard()
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div style={{ color: 'rgba(255,255,255,0.4)', padding: 40 }}>Loading...</div>

  const la = data?.lounge_access
  const g = data?.guest

  if (!la?.active) {
    return (
      <div className="ea-dash-card ea-dash-card-wide" style={{ textAlign: 'center', padding: 40 }}>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 16 }}>No active lounge access. Register for a lounge first.</p>
      </div>
    )
  }
  return (
    <div className="ea-dash-grid">
      <div className="ea-dash-card ea-dash-card-wide">
        <h3 className="ea-dash-card-title">Lounge Access Status</h3>

        <div style={{ display: 'flex', gap: 28, alignItems: 'flex-start' }}>
          {/* Access Pass */}
          <div style={{
            flex: '0 0 280px',
            background: 'linear-gradient(135deg, rgba(197,164,126,0.12), rgba(197,164,126,0.04))',
            borderRadius: 16,
            padding: 28,
            border: '1px solid rgba(197,164,126,0.2)',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 16 }}>Access Pass</div>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(46,204,113,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', border: '2px solid rgba(46,204,113,0.3)' }}>
              <svg width="36" height="36" fill="none" viewBox="0 0 36 36"><path d="M9 18l6 6 12-12" stroke="#2ecc71" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div style={{ color: '#2ecc71', fontSize: 18, fontWeight: 700, fontFamily: 'Cormorant Garamond, serif', marginBottom: 4 }}>ACCESS GRANTED</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>{la.lounge_name}</div>
          </div>

          {/* Details */}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[
                { label: 'Registered At', value: la.registered_at ? new Date(la.registered_at).toLocaleString() : '—' },
                { label: 'Valid Until', value: la.valid_until ? new Date(la.valid_until).toLocaleString() : '—' },
                { label: 'Payment Status', value: la.payment_status || '—' },
                { label: 'Membership', value: g?.membership_type || '—' },
                { label: 'Face Registered', value: g?.face_registered ? 'Yes' : 'No' },
                { label: 'Dining Tokens', value: data?.dining_tokens ? `${data.dining_tokens.remaining} remaining` : '—' },
              ].map(item => (
                <div key={item.label}>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>{item.label}</div>
                  <div style={{ fontSize: 15, color: '#fff', fontWeight: 500 }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoungeAccess
