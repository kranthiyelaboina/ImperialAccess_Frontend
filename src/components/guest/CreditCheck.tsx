import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { checkCredit } from '../../services/api'

const CARD_NETWORK_OPTIONS = [
  { value: 'visa_infinite', label: 'Visa Infinite' },
  { value: 'amex_platinum', label: 'Amex Platinum' },
  { value: 'mastercard_world_elite', label: 'Mastercard World Elite' },
]

const CreditCheck: React.FC = () => {
  const [cardLast4, setCardLast4] = useState('')
  const [cardType, setCardType] = useState('visa')
  const [cardNetwork, setCardNetwork] = useState(CARD_NETWORK_OPTIONS[0].value)
  const [result, setResult] = useState<null | { eligible: boolean; message: string; visits_remaining?: number; amount_due?: number }>(null)
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.guest_id) return
    setLoading(true)
    try {
      const res = await checkCredit(user.guest_id, cardLast4, cardType, cardNetwork)
      setResult({
        eligible: res.eligible,
        message: res.message,
        visits_remaining: res.visits_remaining,
        amount_due: res.amount_due,
      })
    } catch (err: any) {
      setResult({ eligible: false, message: err?.error || err?.message || 'Credit check failed.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="ea-dash-grid">
      <div className="ea-dash-card ea-dash-card-wide">
        <h3 className="ea-dash-card-title">Credit Card Eligibility Check</h3>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, margin: '0 0 24px' }}>
          Enter your credit card details to check if you qualify for complimentary lounge access.
        </p>

        <form onSubmit={handleCheck} style={{ maxWidth: 480 }}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>Last 4 Digits</label>
            <input className="ea-dash-search" placeholder="4242" value={cardLast4} onChange={e => setCardLast4(e.target.value)} maxLength={4} style={{ marginBottom: 0 }} />
          </div>
          <div style={{ display: 'flex', gap: 14, marginBottom: 14 }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>Card Type</label>
              <select
                className="ea-dash-search"
                value={cardType}
                onChange={e => setCardType(e.target.value)}
                style={{ marginBottom: 0, appearance: 'none', WebkitAppearance: 'none' }}
              >
                <option value="visa">Visa</option>
                <option value="mastercard">Mastercard</option>
                <option value="amex">American Express</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>Card Network / Tier</label>
              <select
                className="ea-dash-search"
                value={cardNetwork}
                onChange={e => setCardNetwork(e.target.value)}
                style={{ marginBottom: 0, appearance: 'none', WebkitAppearance: 'none' }}
              >
                {CARD_NETWORK_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>
          <button type="submit" className="ea-dash-btn ea-dash-btn-gold" disabled={loading || !cardLast4}>
            {loading ? 'Checking...' : 'Check Eligibility'}
          </button>
        </form>

        {result && (
          <div style={{
            marginTop: 24,
            padding: 20,
            borderRadius: 12,
            border: `1px solid ${result.eligible ? 'rgba(46,204,113,0.3)' : 'rgba(231,76,60,0.3)'}`,
            background: result.eligible ? 'rgba(46,204,113,0.06)' : 'rgba(231,76,60,0.06)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <span style={{ fontSize: 20, color: result.eligible ? '#2ecc71' : '#e74c3c' }}>
                {result.eligible ? '✓' : '✗'}
              </span>
              <span style={{ fontSize: 16, fontWeight: 600, color: result.eligible ? '#2ecc71' : '#e74c3c' }}>
                {result.eligible ? 'Eligible!' : 'Not Eligible'}
              </span>
            </div>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', margin: 0 }}>{result.message}</p>
            {result.visits_remaining !== undefined && (
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: '8px 0 0' }}>Visits remaining: {result.visits_remaining}</p>
            )}
            {result.amount_due !== undefined && (
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: '8px 0 0' }}>Standard rate: ${result.amount_due}</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default CreditCheck
