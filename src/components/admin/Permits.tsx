import React, { useState, useEffect } from 'react'
import { getGuests, type GuestListResponse } from '../../services/api'

interface Permit {
  guest_id: string
  name: string
  membership_type: string
  face_registered: boolean
  created_at: string | null
  status: 'active' | 'expired' | 'revoked'
}

const Permits: React.FC = () => {
  const [data, setData] = useState<Permit[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getGuests()
      .then(d => {
        const permits: Permit[] = (d.guests || []).map(g => ({
          guest_id: g.guest_id,
          name: g.full_name,
          membership_type: g.membership_type || 'standard',
          face_registered: g.face_registered,
          created_at: g.created_at,
          status: g.face_registered ? 'active' as const : 'expired' as const,
        }))
        setData(permits)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const revoke = (guest_id: string) => {
    setData(prev => prev.map(p => p.guest_id === guest_id ? { ...p, status: 'revoked' as const } : p))
  }

  return (
    <>
      <div className="ea-dash-stats" style={{ marginBottom: 20 }}>
        {[
          { label: 'Active Permits', value: data.filter(p => p.status === 'active').length, color: '#2ecc71' },
          { label: 'Expired', value: data.filter(p => p.status === 'expired').length, color: '#f39c12' },
          { label: 'Revoked', value: data.filter(p => p.status === 'revoked').length, color: '#e74c3c' },
        ].map((s, i) => (
          <div className="ea-dash-stat-card" key={i}>
            <div>
              <div className="ea-dash-stat-value" style={{ color: s.color }}>{s.value}</div>
              <div className="ea-dash-stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="ea-dash-card">
        <h3 className="ea-dash-card-title">Access Permits</h3>
        <div className="ea-dash-table-wrap">
          <table className="ea-dash-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Guest</th>
                <th>Membership</th>
                <th>Face Registered</th>
                <th>Registered</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>Loading...</td></tr>
              ) : data.length > 0 ? data.map((p, i) => (
                <tr key={p.guest_id}>
                  <td>{i + 1}</td>
                  <td className="ea-dash-table-name">{p.name}</td>
                  <td style={{ textTransform: 'capitalize' }}>{p.membership_type}</td>
                  <td>{p.face_registered ? 'Yes' : 'No'}</td>
                  <td>{p.created_at ? new Date(p.created_at).toLocaleDateString() : '—'}</td>
                  <td>
                    <span style={{
                      padding: '3px 10px', borderRadius: 50, fontSize: 11, fontWeight: 600,
                      background: p.status === 'active' ? 'rgba(46,204,113,0.12)' : p.status === 'expired' ? 'rgba(243,156,18,0.12)' : 'rgba(231,76,60,0.12)',
                      color: p.status === 'active' ? '#2ecc71' : p.status === 'expired' ? '#f39c12' : '#e74c3c',
                      border: `1px solid ${p.status === 'active' ? 'rgba(46,204,113,0.3)' : p.status === 'expired' ? 'rgba(243,156,18,0.3)' : 'rgba(231,76,60,0.3)'}`,
                      textTransform: 'capitalize',
                    }}>{p.status}</span>
                  </td>
                  <td>
                    {p.status === 'active' && (
                      <button
                        className="ea-dash-btn ea-dash-btn-outline"
                        style={{ fontSize: 11, padding: '4px 10px' }}
                        onClick={() => revoke(p.guest_id)}
                      >
                        Revoke
                      </button>
                    )}
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={7} style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>No permits found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default Permits
