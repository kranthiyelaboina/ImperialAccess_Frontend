import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getGuestDashboard, type GuestDashboardData } from '../../services/api'

/* Mock data — used when backend is unavailable */
const mockData: GuestDashboardData = {
  success: true,
  guest: {
    full_name: 'Guest User',
    email: 'guest@example.com',
    membership_type: 'premium',
    face_registered: true,
    boarding_pass_no: 'BP-2026-1234',
    airline: 'Emirates',
    flight_number: 'EK501',
    departure_time: '2026-02-27T18:30:00',
  },
  lounge_access: {
    active: true,
    lounge_name: 'Skyview Premium Lounge',
    registered_at: '2026-02-27T10:15:00',
    valid_until: '2026-02-27T23:59:59',
    payment_status: 'paid',
  },
  dining_tokens: { total: 3, redeemed: 1, remaining: 2, tokens: [] },
  attendance_history: [
    { event: 'entry', time: '2026-02-27T10:20:00', mode: 'gate' },
    { event: 'exit', time: '2026-02-27T12:45:00', duration_minutes: 145 },
  ],
}

const GuestOverview: React.FC = () => {
  const [data, setData] = useState<GuestDashboardData | null>(null)

  useEffect(() => {
    getGuestDashboard()
      .then(setData)
      .catch(() => setData(mockData))
  }, [])

  if (!data) return <div style={{ color: 'rgba(255,255,255,0.4)', padding: 40 }}>Loading...</div>

  const g = data.guest
  const la = data.lounge_access
  const dt = data.dining_tokens

  return (
    <>
      {/* Quick Stats */}
      <div className="ea-dash-stats">
        <div className="ea-dash-stat-card">
          <div className="ea-dash-stat-icon"><SvgFace /></div>
          <div>
            <div className="ea-dash-stat-value">{g.face_registered ? 'Enrolled' : 'Pending'}</div>
            <div className="ea-dash-stat-label">Face Status</div>
          </div>
        </div>
        <div className="ea-dash-stat-card">
          <div className="ea-dash-stat-icon"><SvgLounge /></div>
          <div>
            <div className="ea-dash-stat-value">{la.active ? 'Active' : 'Inactive'}</div>
            <div className="ea-dash-stat-label">Lounge Access</div>
          </div>
        </div>
        <div className="ea-dash-stat-card">
          <div className="ea-dash-stat-icon"><SvgToken /></div>
          <div>
            <div className="ea-dash-stat-value">{dt.remaining}</div>
            <div className="ea-dash-stat-label">Dining Tokens</div>
          </div>
        </div>
        <div className="ea-dash-stat-card">
          <div className="ea-dash-stat-icon"><SvgFlight /></div>
          <div>
            <div className="ea-dash-stat-value">{g.flight_number || '—'}</div>
            <div className="ea-dash-stat-label">Flight</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="ea-dash-grid">
        <div className="ea-dash-card">
          <h3 className="ea-dash-card-title">Lounge Access</h3>
          {la.active ? (
            <>
              <p style={{ color: '#2ecc71', fontSize: 14, margin: '0 0 8px' }}>Access Active — {la.lounge_name}</p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: 0 }}>
                Valid until {new Date(la.valid_until).toLocaleTimeString()}
              </p>
            </>
          ) : (
            <>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, margin: '0 0 12px' }}>No active lounge access</p>
              <Link to="/guest/lounge-register" className="ea-dash-btn ea-dash-btn-gold">Register for Lounge</Link>
            </>
          )}
        </div>

        <div className="ea-dash-card">
          <h3 className="ea-dash-card-title">Boarding Pass</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', margin: '8px 0' }}>
            <div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: 1 }}>From</div>
              <div style={{ fontSize: 20, fontWeight: 600, color: '#fff', fontFamily: 'Cormorant Garamond, serif' }}>DEL</div>
            </div>
            <div style={{ color: '#c5a47e', fontSize: 20, display: 'flex', alignItems: 'center' }}>→</div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: 1 }}>To</div>
              <div style={{ fontSize: 20, fontWeight: 600, color: '#fff', fontFamily: 'Cormorant Garamond, serif' }}>DXB</div>
            </div>
          </div>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: 0 }}>
            {g.airline} · {g.flight_number} · {g.boarding_pass_no}
          </p>
        </div>

        <div className="ea-dash-card">
          <h3 className="ea-dash-card-title">Dining Tokens</h3>
          <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center', margin: '12px 0' }}>
            <div>
              <div style={{ fontSize: 28, fontWeight: 700, color: '#c5a47e', fontFamily: 'Cormorant Garamond, serif' }}>{dt.total}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>Total</div>
            </div>
            <div>
              <div style={{ fontSize: 28, fontWeight: 700, color: '#2ecc71', fontFamily: 'Cormorant Garamond, serif' }}>{dt.remaining}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>Remaining</div>
            </div>
            <div>
              <div style={{ fontSize: 28, fontWeight: 700, color: 'rgba(255,255,255,0.5)', fontFamily: 'Cormorant Garamond, serif' }}>{dt.redeemed}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>Used</div>
            </div>
          </div>
          <Link to="/guest/dining" className="ea-dash-btn ea-dash-btn-outline" style={{ width: '100%', display: 'block', textAlign: 'center' }}>View Tokens</Link>
        </div>

        <div className="ea-dash-card">
          <h3 className="ea-dash-card-title">Recent Activity</h3>
          {data.attendance_history.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {data.attendance_history.slice(0, 4).map((a, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>
                  <span style={{ color: a.event === 'entry' ? '#2ecc71' : '#e74c3c' }}>
                    {a.event === 'entry' ? '→ Entry' : '← Exit'}
                  </span>
                  <span>{new Date(a.time).toLocaleTimeString()}</span>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>No recent activity</p>
          )}
          <Link to="/guest/history" style={{ display: 'block', marginTop: 12, fontSize: 13, color: '#c5a47e', textDecoration: 'none' }}>View All History →</Link>
        </div>
      </div>
    </>
  )
}

/* Icons */
function SvgFace() { return <svg width="28" height="28" fill="none" viewBox="0 0 28 28"><circle cx="14" cy="11" r="5" stroke="#c5a47e" strokeWidth="2"/><path d="M5 25c0-5 4-9 9-9s9 4 9 9" stroke="#c5a47e" strokeWidth="2" strokeLinecap="round"/></svg> }
function SvgLounge() { return <svg width="28" height="28" fill="none" viewBox="0 0 28 28"><rect x="3" y="9" width="22" height="12" rx="3" stroke="#c5a47e" strokeWidth="2"/><path d="M8 9V6a6 6 0 0112 0v3" stroke="#c5a47e" strokeWidth="2"/></svg> }
function SvgToken() { return <svg width="28" height="28" fill="none" viewBox="0 0 28 28"><circle cx="14" cy="14" r="10" stroke="#c5a47e" strokeWidth="2"/><path d="M14 8v6l4 3" stroke="#c5a47e" strokeWidth="2" strokeLinecap="round"/></svg> }
function SvgFlight() { return <svg width="28" height="28" fill="none" viewBox="0 0 28 28"><path d="M3 21l22-7-22-7v6l16 1-16 1v6z" stroke="#c5a47e" strokeWidth="2" strokeLinejoin="round"/></svg> }

export default GuestOverview
