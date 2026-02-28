import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { registerLounge } from '../../services/api'

const lounges = [
  { name: 'Skyview Premium Lounge', terminal: 'Terminal 3', amenities: 'Wi-Fi, Showers, Dining', price: 45 },
  { name: 'Elara International', terminal: 'Terminal 1', amenities: 'Bar, Spa, Nap Rooms', price: 55 },
  { name: 'Horizon Club', terminal: 'Terminal 2', amenities: 'Wi-Fi, Snacks, Charging', price: 35 },
]

const LoungeRegister: React.FC = () => {
  const [selected, setSelected] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { user } = useAuth()

  const handleRegister = async () => {
    if (selected === null || !user?.guest_id) return
    setLoading(true)
    setError('')
    try {
      const res = await registerLounge(user.guest_id, lounges[selected].name)
      if (res.success) {
        if (res.payment_required) {
          navigate('/guest/payment', { state: { registration_id: res.registration_id, amount: res.amount_due, lounge_name: res.lounge_name, currency: res.currency } })
        } else {
          navigate('/guest/confirmation', { state: { lounge_name: res.lounge_name, access_granted: true } })
        }
      }
    } catch (err: any) {
      setError(err?.error || err?.message || 'Lounge registration failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="ea-dash-card ea-dash-card-wide" style={{ marginBottom: 22 }}>
        <h3 className="ea-dash-card-title">Select a Lounge</h3>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, margin: '0 0 20px' }}>
          Choose a lounge to register for access. Check your credit card eligibility for complimentary entry.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18, marginBottom: 22 }}>
        {lounges.map((l, i) => (
          <div
            key={l.name}
            className="ea-dash-card"
            style={{
              cursor: 'pointer',
              borderColor: selected === i ? '#c5a47e' : undefined,
              boxShadow: selected === i ? '0 0 20px rgba(197,164,126,0.15)' : undefined,
            }}
            onClick={() => setSelected(i)}
          >
            <h4 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 18, fontWeight: 600, color: '#fff', margin: '0 0 8px' }}>{l.name}</h4>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', margin: '0 0 4px' }}>{l.terminal}</p>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', margin: '0 0 16px' }}>{l.amenities}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 22, fontWeight: 700, color: '#c5a47e', fontFamily: 'Cormorant Garamond, serif' }}>${l.price}</span>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: 1 }}>per visit</span>
            </div>
          </div>
        ))}
      </div>

      {selected !== null && (
        <div className="ea-dash-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h4 style={{ color: '#fff', margin: '0 0 4px', fontSize: 16 }}>Selected: {lounges[selected].name}</h4>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: 0 }}>Amount: ${lounges[selected].price}</p>
            {error && <p style={{ color: '#e74c3c', fontSize: 13, margin: '8px 0 0' }}>{error}</p>}
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="ea-dash-btn ea-dash-btn-outline" onClick={() => navigate('/guest/credit-check')}>
              Check Credit Eligibility
            </button>
            <button className="ea-dash-btn ea-dash-btn-gold" onClick={handleRegister} disabled={loading}>
              {loading ? 'Registering...' : 'Register & Pay'}
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default LoungeRegister
