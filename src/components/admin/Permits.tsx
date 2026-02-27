import React from 'react'

const permits = [
  { id: 1, name: 'Jane Smith', lounge: 'Premium Lounge', issued: '2026-02-27', expires: '2026-02-27', status: 'active' },
  { id: 2, name: 'John Doe', lounge: 'First Class Lounge', issued: '2026-02-27', expires: '2026-02-27', status: 'active' },
  { id: 3, name: 'Ananya Sharma', lounge: 'Business Lounge', issued: '2026-02-26', expires: '2026-02-26', status: 'expired' },
  { id: 4, name: 'Sneha Kapoor', lounge: 'First Class Lounge', issued: '2026-02-27', expires: '2026-02-27', status: 'active' },
  { id: 5, name: 'Aditya Verma', lounge: 'Premium Lounge', issued: '2026-02-25', expires: '2026-02-25', status: 'revoked' },
]

const Permits: React.FC = () => {
  const [data, setData] = React.useState(permits)

  const revoke = (id: number) => {
    setData(prev => prev.map(p => p.id === id ? { ...p, status: 'revoked' } : p))
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
                <th>Lounge</th>
                <th>Issued</th>
                <th>Expires</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((p, i) => (
                <tr key={p.id}>
                  <td>{i + 1}</td>
                  <td className="ea-dash-table-name">{p.name}</td>
                  <td>{p.lounge}</td>
                  <td>{p.issued}</td>
                  <td>{p.expires}</td>
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
                        onClick={() => revoke(p.id)}
                      >
                        Revoke
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default Permits
