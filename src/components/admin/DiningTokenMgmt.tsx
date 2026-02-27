import React, { useState } from 'react'
import { issueDiningToken, redeemDiningToken } from '../../services/api'

const mockTokens = [
  { id: 1, guest: 'Jane Smith', guest_id: 1, type: 'breakfast', status: 'active', issued_at: '2026-02-27T10:20:00' },
  { id: 2, guest: 'Jane Smith', guest_id: 1, type: 'lunch', status: 'redeemed', issued_at: '2026-02-27T10:20:00', redeemed_at: '2026-02-27T12:45:00' },
  { id: 3, guest: 'John Doe', guest_id: 2, type: 'breakfast', status: 'active', issued_at: '2026-02-27T11:05:00' },
  { id: 4, guest: 'Sneha Kapoor', guest_id: 5, type: 'snacks', status: 'redeemed', issued_at: '2026-02-27T09:48:00', redeemed_at: '2026-02-27T11:00:00' },
  { id: 5, guest: 'Rohan Mehta', guest_id: 4, type: 'lunch', status: 'active', issued_at: '2026-02-27T09:22:00' },
]

const DiningTokenMgmt: React.FC = () => {
  const [tokens, setTokens] = useState(mockTokens)
  const [issueForm, setIssueForm] = useState({ guest_id: '', type: 'breakfast' })
  const [loading, setLoading] = useState(false)

  const handleIssue = async () => {
    if (!issueForm.guest_id) return
    setLoading(true)
    try {
      await issueDiningToken(Number(issueForm.guest_id))
    } catch {}
    setTokens(prev => [...prev, {
      id: prev.length + 1, guest: `Guest #${issueForm.guest_id}`, guest_id: Number(issueForm.guest_id),
      type: issueForm.type, status: 'active', issued_at: new Date().toISOString(),
    }])
    setIssueForm({ guest_id: '', type: 'breakfast' })
    setLoading(false)
  }

  const handleRedeem = async (tokenId: number) => {
    try { await redeemDiningToken(String(tokenId)) } catch {}
    setTokens(prev => prev.map(t => t.id === tokenId ? { ...t, status: 'redeemed', redeemed_at: new Date().toISOString() } : t))
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
              type="number"
              placeholder="Guest ID"
              value={issueForm.guest_id}
              onChange={e => setIssueForm(prev => ({ ...prev, guest_id: e.target.value }))}
              style={{
                padding: '10px 14px', borderRadius: 8, border: '1px solid rgba(197,164,126,0.25)',
                background: 'rgba(255,255,255,0.03)', color: '#fff', fontSize: 14, outline: 'none',
              }}
            />
            <select
              value={issueForm.type}
              onChange={e => setIssueForm(prev => ({ ...prev, type: e.target.value }))}
              style={{
                padding: '10px 14px', borderRadius: 8, border: '1px solid rgba(197,164,126,0.25)',
                background: 'rgba(15,12,8,0.9)', color: '#fff', fontSize: 14, outline: 'none',
              }}
            >
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snacks">Snacks</option>
            </select>
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
                  <th>ID</th>
                  <th>Guest</th>
                  <th>Type</th>
                  <th>Issued</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {tokens.map(t => (
                  <tr key={t.id}>
                    <td>{t.id}</td>
                    <td className="ea-dash-table-name">{t.guest}</td>
                    <td style={{ textTransform: 'capitalize' }}>{t.type}</td>
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
                          onClick={() => handleRedeem(t.id)}
                        >
                          Redeem
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}

export default DiningTokenMgmt
