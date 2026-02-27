import React from 'react'

const LoungeAccess: React.FC = () => {
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
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>Skyview Premium Lounge</div>
          </div>

          {/* Details */}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[
                { label: 'Entry Time', value: '10:20 AM' },
                { label: 'Valid Until', value: '11:59 PM' },
                { label: 'Terminal', value: 'Terminal 3' },
                { label: 'Membership', value: 'Premium' },
                { label: 'Payment', value: 'Paid — $45.00' },
                { label: 'Dining Token', value: '1 Active' },
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
