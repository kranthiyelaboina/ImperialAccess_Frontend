import React from 'react'

const BoardingPass: React.FC = () => {
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
            <div style={{ fontSize: 16, color: '#fff', fontWeight: 600 }}>Guest User</div>
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
            { label: 'Flight', value: 'EK501' },
            { label: 'Airline', value: 'Emirates' },
            { label: 'Gate', value: 'B12' },
            { label: 'Seat', value: '14A' },
            { label: 'Date', value: '27 Feb 2026' },
            { label: 'Departure', value: '18:30' },
            { label: 'Boarding', value: 'BP-2026-1234' },
            { label: 'Class', value: 'Business' },
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
