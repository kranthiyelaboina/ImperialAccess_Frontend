import React from 'react'

const history = [
  { event: 'entry', time: '2026-02-27T10:20:00', mode: 'gate', lounge: 'Skyview Premium' },
  { event: 'exit', time: '2026-02-27T12:45:00', mode: 'exit', lounge: 'Skyview Premium', duration: 145 },
  { event: 'entry', time: '2026-02-26T09:15:00', mode: 'gate', lounge: 'Elara International' },
  { event: 'exit', time: '2026-02-26T11:30:00', mode: 'exit', lounge: 'Elara International', duration: 135 },
  { event: 'entry', time: '2026-02-25T14:00:00', mode: 'reception', lounge: 'Horizon Club' },
  { event: 'exit', time: '2026-02-25T16:20:00', mode: 'exit', lounge: 'Horizon Club', duration: 140 },
]

const VisitHistory: React.FC = () => {
  return (
    <div className="ea-dash-card">
      <h3 className="ea-dash-card-title">Visit History</h3>
      <div className="ea-dash-table-wrap">
        <table className="ea-dash-table">
          <thead>
            <tr>
              <th>Event</th>
              <th>Lounge</th>
              <th>Mode</th>
              <th>Time</th>
              <th>Duration</th>
            </tr>
          </thead>
          <tbody>
            {history.map((h, i) => (
              <tr key={i}>
                <td>
                  <span style={{
                    padding: '3px 10px',
                    borderRadius: 50,
                    fontSize: 12,
                    fontWeight: 600,
                    background: h.event === 'entry' ? 'rgba(46,204,113,0.12)' : 'rgba(231,76,60,0.12)',
                    color: h.event === 'entry' ? '#2ecc71' : '#e74c3c',
                    border: `1px solid ${h.event === 'entry' ? 'rgba(46,204,113,0.3)' : 'rgba(231,76,60,0.3)'}`,
                  }}>
                    {h.event === 'entry' ? 'Entry' : 'Exit'}
                  </span>
                </td>
                <td className="ea-dash-table-name">{h.lounge}</td>
                <td style={{ textTransform: 'capitalize' }}>{h.mode}</td>
                <td>{new Date(h.time).toLocaleString()}</td>
                <td>{h.duration ? `${h.duration} min` : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default VisitHistory
