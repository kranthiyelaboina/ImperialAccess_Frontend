import React from 'react'

const rows = [
  { name: 'Jane Smith', entry: '10:20 AM', exit: '12:45 PM', duration: '2h 25m', lounge: 'Premium Lounge', mode: 'entry' },
  { name: 'John Doe', entry: '11:05 AM', exit: '-', duration: '-', lounge: 'First Class Lounge', mode: 'entry' },
  { name: 'Ananya Sharma', entry: '09:14 AM', exit: '11:30 AM', duration: '2h 16m', lounge: 'Business Lounge', mode: 'exit' },
  { name: 'Rohan Mehta', entry: '09:22 AM', exit: '-', duration: '-', lounge: 'Premium Lounge', mode: 'entry' },
  { name: 'Sneha Kapoor', entry: '09:48 AM', exit: '12:02 PM', duration: '2h 14m', lounge: 'First Class Lounge', mode: 'exit' },
  { name: 'Aditya Verma', entry: '08:30 AM', exit: '10:15 AM', duration: '1h 45m', lounge: 'Business Lounge', mode: 'exit' },
  { name: 'Priya Patel', entry: '07:55 AM', exit: '09:40 AM', duration: '1h 45m', lounge: 'Premium Lounge', mode: 'exit' },
  { name: 'Arjun Nair', entry: '10:02 AM', exit: '-', duration: '-', lounge: 'Premium Lounge', mode: 'entry' },
]

const Attendance: React.FC = () => {
  const [search, setSearch] = React.useState('')

  const filtered = rows.filter(r => r.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Search guest..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              padding: '8px 16px', borderRadius: 8, border: '1px solid rgba(197,164,126,0.25)',
              background: 'rgba(255,255,255,0.03)', color: '#fff', fontSize: 14, width: 260, outline: 'none',
            }}
          />
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
            Showing {filtered.length} of {rows.length}
          </div>
        </div>
        <button className="ea-dash-btn ea-dash-btn-outline" onClick={() => alert('CSV export coming soon')}>
          Export CSV
        </button>
      </div>

      <div className="ea-dash-card">
        <h3 className="ea-dash-card-title">Today's Attendance — {new Date().toLocaleDateString()}</h3>
        <div className="ea-dash-table-wrap">
          <table className="ea-dash-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Guest Name</th>
                <th>Lounge</th>
                <th>Entry</th>
                <th>Exit</th>
                <th>Duration</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td className="ea-dash-table-name">{r.name}</td>
                  <td>{r.lounge}</td>
                  <td>{r.entry}</td>
                  <td>{r.exit}</td>
                  <td>{r.duration}</td>
                  <td>
                    <span style={{
                      padding: '3px 10px', borderRadius: 50, fontSize: 11, fontWeight: 600,
                      background: r.exit === '-' ? 'rgba(46,204,113,0.12)' : 'rgba(197,164,126,0.12)',
                      color: r.exit === '-' ? '#2ecc71' : '#c5a47e',
                      border: `1px solid ${r.exit === '-' ? 'rgba(46,204,113,0.3)' : 'rgba(197,164,126,0.3)'}`,
                    }}>
                      {r.exit === '-' ? 'Inside' : 'Exited'}
                    </span>
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

export default Attendance
