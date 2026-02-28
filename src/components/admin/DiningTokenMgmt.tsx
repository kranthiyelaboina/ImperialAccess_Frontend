import React, { useState, useEffect } from 'react'
import { issueDiningToken, redeemDiningToken } from '../../services/api'

interface TokenRow {
  token_code: string
  guest_name: string
  guest_id: string
  status: 'active' | 'redeemed'
  issued_at: string
  redeemed_at?: string
}

const DiningTokenMgmt: React.FC = () => {
  const [tokens, setTokens] = useState<TokenRow[]>([])
  const [issueForm, setIssueForm] = useState({ guest_id: '' })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  // Fetch existing tokens from guest dashboard data — we'll collect from guest list
  useEffect(() => {
    // No dedicated "list all tokens" endpoint, so we start empty and accumulate via issue
  }, [])

  const handleIssue = async () => {
    if (!issueForm.guest_id) return
    setLoading(true)
    setMessage('')
    try {
      const res = await issueDiningToken(issueForm.guest_id)
      setTokens(prev => [...prev, {
        token_code: res.token_code,
        guest_name: `Guest ${issueForm.guest_id.slice(-4)}`,
        guest_id: issueForm.guest_id,
        status: 'active',
        issued_at: new Date().toISOString(),
      }])
      setMessage(res.message || 'Token issued successfully')
      setIssueForm({ guest_id: '' })
    } catch (err: any) {
      setMessage(err?.message || 'Failed to issue token')
    }
    setLoading(false)
  }

  const handleRedeem = async (token_code: string) => {
    try {
      await redeemDiningToken(token_code)
      setTokens(prev => prev.map(t => t.token_code === token_code ? { ...t, status: 'redeemed', redeemed_at: new Date().toISOString() } : t))
    } catch (err: any) {
      setMessage(err?.message || 'Failed to redeem token')
    }
  }

  const active = tokens.filter(t => t.status === 'active').length
  const redeemed = tokens.filter(t => t.status === 'redeemed').length

  return (
    <>
      {/* Stats */}
      <div className="ea-dash-stats" style={{ marginBottom: 20 }}>
        {[
          { label: 'Total Issued', value: tokens.length, color: '#c5a47e' },
          { label: 'Active', value: active, color: '#2ecc71' },
          { label: 'Redeemed', value: redeemed, color: '#f39c12' },
        ].map((s, i) => (
          <div className="ea-dash-stat-card" key={i}>
            <div>
              <div className="ea-dash-stat-value" style={{ color: s.color }}>{s.value}</div>
              <div className="ea-dash-stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="ea-dash-grid" style={{ gridTemplateColumns: '1fr 2fr' }}>
        {/* Issue Token Form */}
        <div className="ea-dash-card">
          <h3 className="ea-dash-card-title">Issue Token</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input
              type="text"
              placeholder="Guest ID"
              value={issueForm.guest_id}
              onChange={e => setIssueForm(prev => ({ ...prev, guest_id: e.target.value }))}
              style={{
                padding: '10px 14px', borderRadius: 8, border: '1px solid rgba(197,164,126,0.25)',
                background: 'rgba(255,255,255,0.03)', color: '#fff', fontSize: 14, outline: 'none',
              }}
            />
            {message && (
              <div style={{ fontSize: 12, color: message.includes('Failed') ? '#e74c3c' : '#2ecc71' }}>{message}</div>
            )}
            <button className="ea-dash-btn ea-dash-btn-gold" onClick={handleIssue} disabled={loading}>
              {loading ? 'Issuing...' : 'Issue Token'}
            </button>
          </div>
        </div>

        {/* Tokens Table */}
        <div className="ea-dash-card">
          <h3 className="ea-dash-card-title">All Tokens</h3>
          <div className="ea-dash-table-wrap">
            <table className="ea-dash-table">
              <thead>
                <tr>
                  <th>Token Code</th>
                  <th>Guest</th>
                  <th>Issued</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {tokens.length > 0 ? tokens.map(t => (
                  <tr key={t.token_code}>
                    <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{t.token_code}</td>
                    <td className="ea-dash-table-name">{t.guest_name}</td>
                    <td>{new Date(t.issued_at).toLocaleTimeString()}</td>
                    <td>
                      <span style={{
                        padding: '3px 10px', borderRadius: 50, fontSize: 11, fontWeight: 600,
                        background: t.status === 'active' ? 'rgba(46,204,113,0.12)' : 'rgba(243,156,18,0.12)',
                        color: t.status === 'active' ? '#2ecc71' : '#f39c12',
                        border: `1px solid ${t.status === 'active' ? 'rgba(46,204,113,0.3)' : 'rgba(243,156,18,0.3)'}`,
                        textTransform: 'capitalize',
                      }}>{t.status}</span>
                    </td>
                    <td>
                      {t.status === 'active' && (
                        <button
                          className="ea-dash-btn ea-dash-btn-outline"
                          style={{ fontSize: 11, padding: '4px 10px' }}
                          onClick={() => handleRedeem(t.token_code)}
                        >
                          Redeem
                        </button>
                      )}
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={5} style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>No tokens issued yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}

export default DiningTokenMgmt
