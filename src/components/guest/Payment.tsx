import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { confirmPayment } from '../../services/api'

const Payment: React.FC = () => {
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')
  const [name, setName] = useState('')
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()

  // Read amount and registration_id from navigation state (set by LoungeRegister)
  const state = location.state as { registration_id?: string; amount?: number; lounge_name?: string; currency?: string } | null
  const amount = state?.amount ?? 45.00

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.guest_id || !state?.registration_id) {
      setError('Missing registration information. Please register for a lounge first.')
      return
    }
    setProcessing(true)
    setError('')
    try {
      const cardLast4 = cardNumber.replace(/\s/g, '').slice(-4)
      const res = await confirmPayment({
        registration_id: state.registration_id,
        guest_id: user.guest_id,
        amount,
        card_last_four: cardLast4,
        card_type: 'credit',
      })
      if (res.success) {
        navigate('/guest/confirmation', { state: { payment_id: res.payment_id, access_granted: res.access_granted, valid_until: res.valid_until, dining_tokens_issued: res.dining_tokens_issued, lounge_name: state.lounge_name, message: res.message } })
      }
    } catch (err: any) {
      setError(err?.error || err?.message || 'Payment failed. Please try again.')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="ea-dash-grid">
      <div className="ea-dash-card">
        <h3 className="ea-dash-card-title">Payment Details</h3>
        <form onSubmit={handlePayment}>
          {error && <div style={{ color: '#e74c3c', fontSize: 13, marginBottom: 14 }}>{error}</div>}
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>Cardholder Name</label>
            <input className="ea-dash-search" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} style={{ marginBottom: 0 }} required />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>Card Number</label>
            <input className="ea-dash-search" placeholder="4242 4242 4242 4242" value={cardNumber} onChange={e => setCardNumber(e.target.value)} style={{ marginBottom: 0 }} required />
          </div>
          <div style={{ display: 'flex', gap: 14, marginBottom: 14 }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>Expiry</label>
              <input className="ea-dash-search" placeholder="MM/YY" value={expiry} onChange={e => setExpiry(e.target.value)} style={{ marginBottom: 0 }} required />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>CVV</label>
              <input className="ea-dash-search" placeholder="123" type="password" value={cvv} onChange={e => setCvv(e.target.value)} style={{ marginBottom: 0 }} required />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="button" className="ea-dash-btn ea-dash-btn-outline" onClick={() => navigate(-1)}>Cancel</button>
            <button type="submit" className="ea-dash-btn ea-dash-btn-gold" disabled={processing} style={{ flex: 1 }}>
              {processing ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
            </button>
          </div>
        </form>
      </div>

      <div className="ea-dash-card">
        <h3 className="ea-dash-card-title">Order Summary</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>
            <span>Lounge Access</span><span>$45.00</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>
            <span>Dining Token (1x)</span><span>Included</span>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 12, display: 'flex', justifyContent: 'space-between', fontSize: 18, fontWeight: 700, color: '#c5a47e', fontFamily: 'Cormorant Garamond, serif' }}>
            <span>Total</span><span>${amount.toFixed(2)}</span>
          </div>
        </div>
        <div className="ea-dash-card-note">
          Payment is securely processed. Your lounge access will be activated immediately upon confirmation.
        </div>
      </div>
    </div>
  )
}

export default Payment
