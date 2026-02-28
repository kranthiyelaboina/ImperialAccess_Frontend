import React, { useEffect, useState } from 'react'
import { getGuestDashboard, type GuestDashboardData } from '../../services/api'

const BoardingPass: React.FC = () => {
  const [guest, setGuest] = useState<GuestDashboardData['guest'] | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getGuestDashboard()
      .then(data => setGuest(data.guest))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div style={{ color: 'rgba(255,255,255,0.4)', padding: 40 }}>Loading...</div>

  const g = guest
  return (
    <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 20 }}>
      <div className="ea-dash-card" style={{
        maxWidth: 520,
        width: '100%',
        background: 'linear-gradient(135deg, rgba(20,20,22,0.9), rgba(197,164,126,0.06))',
        border: '1px solid rgba(197,164,126,0.15)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: 2 }}>Boarding Pass</div>
            <div style={{ fontSize: 13, color: '#c5a47e', marginTop: 4 }}>ImperialAccess</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: 1 }}>Passenger</div>
            <div style={{ fontSize: 16, color: '#fff', fontWeight: 600 }}>{g?.full_name || 'Guest'}</div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '24px 0' }}>
          <div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>From</div>
            <div style={{ fontSize: 36, fontWeight: 700, color: '#fff', fontFamily: 'Cormorant Garamond, serif' }}>DEL</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>New Delhi</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <svg width="40" height="24" fill="none" viewBox="0 0 40 24"><path d="M2 12h36M32 6l6 6-6 6" stroke="#c5a47e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>Direct</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>To</div>
            <div style={{ fontSize: 36, fontWeight: 700, color: '#fff', fontFamily: 'Cormorant Garamond, serif' }}>DXB</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>Dubai</div>
          </div>
        </div>

        <div style={{ borderTop: '1px dashed rgba(197,164,126,0.15)', paddingTop: 20, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {[
            { label: 'Flight', value: g?.flight_number || '—' },
            { label: 'Airline', value: g?.airline || '—' },
            { label: 'Gate', value: '—' },
            { label: 'Seat', value: '—' },
            { label: 'Departure', value: g?.departure_time ? new Date(g.departure_time).toLocaleString() : '—' },
            { label: 'Boarding Pass', value: g?.boarding_pass_no || '—' },
          ].map(item => (
            <div key={item.label}>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 3 }}>{item.label}</div>
              <div style={{ fontSize: 14, color: '#fff', fontWeight: 500 }}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default BoardingPass
