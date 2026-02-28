import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const Confirmation: React.FC = () => {
  const location = useLocation()
  const state = location.state as {
    payment_id?: string
    access_granted?: boolean
    valid_until?: string
    dining_tokens_issued?: number
    lounge_name?: string
    message?: string
  } | null

  return (
    <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 40 }}>
      <div className="ea-dash-card" style={{ maxWidth: 480, textAlign: 'center' }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(46,204,113,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', border: '2px solid rgba(46,204,113,0.3)' }}>
          <svg width="32" height="32" fill="none" viewBox="0 0 32 32"><path d="M8 16l6 6 10-10" stroke="#2ecc71" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <h3 className="ea-dash-card-title" style={{ fontSize: 24, marginBottom: 8 }}>
          {state?.access_granted ? 'Payment Successful!' : 'Access Confirmed!'}
        </h3>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, margin: '0 0 24px' }}>
          {state?.message || 'Your lounge access has been activated. A dining token has been issued.'}
        </p>

        <div style={{ background: 'rgba(197,164,126,0.06)', borderRadius: 12, padding: 20, marginBottom: 24, border: '1px solid rgba(197,164,126,0.12)' }}>
          {state?.payment_id && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 1 }}>Payment ID</span>
              <span style={{ fontSize: 14, color: '#fff', fontFamily: 'monospace' }}>{state.payment_id}</span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 1 }}>Lounge</span>
            <span style={{ fontSize: 14, color: '#fff' }}>{state?.lounge_name || 'Premium Lounge'}</span>
          </div>
          {state?.valid_until && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 1 }}>Valid Until</span>
              <span style={{ fontSize: 14, color: '#fff' }}>{new Date(state.valid_until).toLocaleString()}</span>
            </div>
          )}
          {state?.dining_tokens_issued !== undefined && (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 1 }}>Dining Tokens</span>
              <span style={{ fontSize: 14, color: '#c5a47e', fontWeight: 600 }}>{state.dining_tokens_issued} issued</span>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <Link to="/guest/lounge-access" className="ea-dash-btn ea-dash-btn-gold" style={{ flex: 1, textAlign: 'center', textDecoration: 'none' }}>
            View Access Pass
          </Link>
          <Link to="/guest" className="ea-dash-btn ea-dash-btn-outline" style={{ flex: 1, textAlign: 'center', textDecoration: 'none' }}>
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Confirmation
