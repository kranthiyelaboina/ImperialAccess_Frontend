import React, { useState, useEffect } from 'react'
import { getAgentState, changeMode, getAgentEvents, type AgentEvent } from '../../services/api'

/* ── Professional SVG icons for each mode ── */
const GateIcon = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
    <rect x="4" y="6" width="12" height="24" rx="2" stroke="currentColor" strokeWidth="1.8" />
    <rect x="20" y="6" width="12" height="24" rx="2" stroke="currentColor" strokeWidth="1.8" />
    <circle cx="13" cy="18" r="1.5" fill="currentColor" />
    <path d="M16 6v24" stroke="currentColor" strokeWidth="1.2" strokeDasharray="2 2" opacity=".5" />
    <path d="M4 4h28M4 32h28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity=".4" />
  </svg>
)

const ReceptionIcon = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
    <rect x="4" y="18" width="28" height="12" rx="2" stroke="currentColor" strokeWidth="1.8" />
    <path d="M10 18v-4a8 8 0 0 1 16 0v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="18" cy="11" r="3" stroke="currentColor" strokeWidth="1.5" />
    <rect x="14" y="22" width="8" height="4" rx="1" stroke="currentColor" strokeWidth="1.2" opacity=".6" />
  </svg>
)

const EntryIcon = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
    <rect x="6" y="4" width="24" height="28" rx="3" stroke="currentColor" strokeWidth="1.8" />
    <path d="M14 18h12M22 14l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6 12h4M6 18h4M6 24h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity=".4" />
    <circle cx="12" cy="8" r="1" fill="currentColor" opacity=".4" />
  </svg>
)

const ExitIcon = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
    <rect x="6" y="4" width="24" height="28" rx="3" stroke="currentColor" strokeWidth="1.8" />
    <path d="M22 18H10M14 14l-4 4 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M26 12h4M26 18h4M26 24h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity=".4" />
    <circle cx="28" cy="8" r="1" fill="currentColor" opacity=".4" />
  </svg>
)

const modes = [
  { id: 'gate', label: 'Gate Mode', desc: 'Multi-face detection and identity verification at the lounge entrance gate', Icon: GateIcon },
  { id: 'reception', label: 'Reception Mode', desc: 'Single-person verification and check-in at the reception desk', Icon: ReceptionIcon },
  { id: 'entry', label: 'Entry Mode', desc: 'Track and log incoming passengers entering the lounge', Icon: EntryIcon },
  { id: 'exit', label: 'Exit Mode', desc: 'Track departures and calculate duration of stay', Icon: ExitIcon },
]

const ModeControl: React.FC = () => {
  const [activeMode, setActiveMode] = useState('gate')
  const [loading, setLoading] = useState(false)
  const [switchingMode, setSwitchingMode] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [events, setEvents] = useState<AgentEvent[]>([])

  useEffect(() => {
    getAgentState().then(d => setActiveMode((d.state.mode || 'gate').toLowerCase())).catch(() => {})
    getAgentEvents().then(d => setEvents((d.events || []).slice(0, 10))).catch(() => {})
  }, [])

  // Re-fetch events after mode change to reflect updated state
  const refreshEvents = () => {
    getAgentEvents().then(d => setEvents((d.events || []).slice(0, 10))).catch(() => {})
  }

  const handleChange = async (mode: string) => {
    if (mode === activeMode) return
    setLoading(true)
    setSwitchingMode(mode)
    setError('')
    setSuccess('')
    try {
      const res = await changeMode(mode)
      const newMode = res.current_mode.toLowerCase()
      setActiveMode(newMode)
      setSuccess(`Switched to ${newMode.charAt(0).toUpperCase() + newMode.slice(1)} mode`)
      setTimeout(() => setSuccess(''), 3000)
      refreshEvents()
    } catch (err: any) {
      setError(err?.message || 'Failed to change mode. Ensure the backend agent is running.')
    }
    setLoading(false)
    setSwitchingMode(null)
  }

  return (
    <>
      {error && (
        <div style={{ marginBottom: 16, padding: '12px 18px', borderRadius: 10, background: 'rgba(231,76,60,0.1)', border: '1px solid rgba(231,76,60,0.25)', color: '#e74c3c', fontSize: 13, display: 'flex', alignItems: 'center', gap: 10 }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="8" stroke="currentColor" strokeWidth="1.5"/><path d="M9 5v5M9 12.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          {error}
        </div>
      )}
      {success && (
        <div style={{ marginBottom: 16, padding: '12px 18px', borderRadius: 10, background: 'rgba(46,204,113,0.1)', border: '1px solid rgba(46,204,113,0.25)', color: '#2ecc71', fontSize: 13, display: 'flex', alignItems: 'center', gap: 10 }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="8" stroke="currentColor" strokeWidth="1.5"/><path d="M6 9l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          {success}
        </div>
      )}
      <div className="ea-dash-grid">
        {modes.map(m => {
          const isActive = m.id === activeMode
          const isSwitching = switchingMode === m.id
          return (
            <div
              key={m.id}
              className="ea-dash-card"
              style={{
                cursor: loading ? 'not-allowed' : 'pointer',
                border: isActive ? '1.5px solid rgba(197,164,126,0.5)' : '1.5px solid transparent',
                boxShadow: isActive ? '0 0 24px rgba(197,164,126,0.12)' : undefined,
                opacity: loading && !isSwitching ? 0.5 : 1,
                transition: 'all 0.3s ease',
                position: 'relative',
              }}
              onClick={() => !loading && handleChange(m.id)}
            >
              <div style={{
                color: isActive ? '#c5a47e' : 'rgba(255,255,255,0.4)',
                marginBottom: 14,
                transition: 'color 0.3s ease',
              }}>
                <m.Icon />
              </div>
              <h3 className="ea-dash-card-title">{m.label}</h3>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>{m.desc}</p>
              {isActive && (
                <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#2ecc71', boxShadow: '0 0 6px #2ecc71' }} />
                  <span style={{ fontSize: 12, color: '#2ecc71', fontWeight: 600, letterSpacing: 0.5 }}>ACTIVE</span>
                </div>
              )}
              {isSwitching && (
                <div style={{
                  position: 'absolute', inset: 0, borderRadius: 'inherit',
                  background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <div style={{
                    width: 24, height: 24, border: '2.5px solid rgba(197,164,126,0.3)',
                    borderTopColor: '#c5a47e', borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                  }} />
                </div>
              )}
            </div>
          )
        })}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Entry / Exit Log */}
      <div className="ea-dash-card" style={{ marginTop: 20 }}>
        <h3 className="ea-dash-card-title">Entry / Exit Log</h3>
        <div className="ea-dash-table-wrap">
          <table className="ea-dash-table">
            <thead>
              <tr><th>Name</th><th>Type</th><th>Mode</th><th>Time</th></tr>
            </thead>
            <tbody>
              {events.length > 0 ? events.map((ev, i) => {
                const isEntry = ev.event_type === 'access_granted'
                const typeLabel = isEntry ? 'Entry' : ev.event_type === 'access_denied' ? 'Denied' : ev.event_type.replace(/_/g, ' ')
                return (
                <tr key={i}>
                  <td className="ea-dash-table-name">{ev.face_name || 'Unknown'}</td>
                  <td>
                    <span style={{
                      padding: '3px 10px', borderRadius: 50, fontSize: 11, fontWeight: 600,
                      background: isEntry ? 'rgba(46,204,113,0.12)' : 'rgba(231,76,60,0.12)',
                      color: isEntry ? '#2ecc71' : '#e74c3c',
                      border: `1px solid ${isEntry ? 'rgba(46,204,113,0.3)' : 'rgba(231,76,60,0.3)'}`,
                      textTransform: 'capitalize',
                    }}>{typeLabel}</span>
                  </td>
                  <td style={{ textTransform: 'capitalize' }}>{ev.mode || '-'}</td>
                  <td>{ev.timestamp ? new Date(ev.timestamp).toLocaleTimeString() : '-'}</td>
                </tr>
              )}) : (
                <tr><td colSpan={4} style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>No events yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default ModeControl
