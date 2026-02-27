import React, { useState, useEffect } from 'react'
import { getAgentState, changeMode } from '../../services/api'

const modes = [
  { id: 'gate', label: 'Gate Mode', desc: 'Verify ticket and identity at the gate', icon: '🚪' },
  { id: 'reception', label: 'Reception Mode', desc: 'Check-in and lounge registration', icon: '🛎️' },
  { id: 'entry', label: 'Entry Mode', desc: 'Face detection for lounge entry', icon: '✅' },
  { id: 'exit', label: 'Exit Mode', desc: 'Track departures and calculate stay', icon: '🚶' },
]

const ModeControl: React.FC = () => {
  const [activeMode, setActiveMode] = useState('gate')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getAgentState().then(d => setActiveMode(d.mode)).catch(() => {})
  }, [])

  const handleChange = async (mode: string) => {
    setLoading(true)
    try {
      await changeMode(mode)
      setActiveMode(mode)
    } catch {
      setActiveMode(mode) // mock fallback
    }
    setLoading(false)
  }

  return (
    <>
      <div className="ea-dash-grid">
        {modes.map(m => (
          <div
            key={m.id}
            className="ea-dash-card"
            style={{
              cursor: 'pointer',
              border: m.id === activeMode ? '1.5px solid rgba(197,164,126,0.5)' : undefined,
              boxShadow: m.id === activeMode ? '0 0 24px rgba(197,164,126,0.12)' : undefined,
              opacity: loading ? 0.6 : 1,
              transition: 'all 0.3s ease',
            }}
            onClick={() => !loading && handleChange(m.id)}
          >
            <div style={{ fontSize: 32, marginBottom: 12 }}>{m.icon}</div>
            <h3 className="ea-dash-card-title">{m.label}</h3>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>{m.desc}</p>
            {m.id === activeMode && (
              <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#2ecc71', boxShadow: '0 0 6px #2ecc71' }} />
                <span style={{ fontSize: 12, color: '#2ecc71', fontWeight: 600 }}>ACTIVE</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Entry / Exit Log */}
      <div className="ea-dash-card" style={{ marginTop: 20 }}>
        <h3 className="ea-dash-card-title">Entry / Exit Log</h3>
        <div className="ea-dash-table-wrap">
          <table className="ea-dash-table">
            <thead>
              <tr><th>Name</th><th>Type</th><th>Mode</th><th>Time</th></tr>
            </thead>
            <tbody>
              {[
                { name: 'Jane Smith', type: 'Entry', mode: 'entry', time: '10:20 AM' },
                { name: 'John Doe', type: 'Entry', mode: 'entry', time: '11:05 AM' },
                { name: 'Ananya Sharma', type: 'Exit', mode: 'exit', time: '12:30 PM' },
                { name: 'Rohan Mehta', type: 'Entry', mode: 'gate', time: '09:22 AM' },
              ].map((row, i) => (
                <tr key={i}>
                  <td className="ea-dash-table-name">{row.name}</td>
                  <td>
                    <span style={{
                      padding: '3px 10px', borderRadius: 50, fontSize: 11, fontWeight: 600,
                      background: row.type === 'Entry' ? 'rgba(46,204,113,0.12)' : 'rgba(231,76,60,0.12)',
                      color: row.type === 'Entry' ? '#2ecc71' : '#e74c3c',
                      border: `1px solid ${row.type === 'Entry' ? 'rgba(46,204,113,0.3)' : 'rgba(231,76,60,0.3)'}`,
                    }}>{row.type}</span>
                  </td>
                  <td style={{ textTransform: 'capitalize' }}>{row.mode}</td>
                  <td>{row.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default ModeControl
