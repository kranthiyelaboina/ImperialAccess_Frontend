import React, { useState, useEffect, useCallback } from 'react'
import { getAgentEvents, type AgentEvent } from '../../services/api'

const Attendance: React.FC = () => {
  const [search, setSearch] = useState('')
  const [events, setEvents] = useState<AgentEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchEvents = useCallback(() => {
    setLoading(true)
    setError('')
    getAgentEvents()
      .then(d => setEvents(d.events || []))
      .catch(err => setError(err?.error || err?.message || 'Failed to load attendance data'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { fetchEvents() }, [fetchEvents])

  // Auto-refresh every 10s
  useEffect(() => {
    const timer = setInterval(() => {
      getAgentEvents()
        .then(d => setEvents(d.events || []))
        .catch(() => {})
    }, 10000)
    return () => clearInterval(timer)
  }, [])

  // Filter to attendance-related event types
  const attendanceEvents = events.filter(e =>
    e.event_type === 'access_granted' ||
    e.event_type === 'access_denied' ||
    e.event_type === 'person_entered' ||
    e.event_type === 'person_exited'
  )
  const filtered = attendanceEvents.filter(e =>
    (e.face_name || 'Unknown').toLowerCase().includes(search.toLowerCase())
  )

  const isEntryEvent = (type: string) =>
    type === 'access_granted' || type === 'person_entered'

  const statusLabel = (type: string) => {
    switch (type) {
      case 'access_granted': return 'Granted'
      case 'person_entered': return 'Entered'
      case 'access_denied': return 'Denied'
      case 'person_exited': return 'Exited'
      default: return type.replace(/_/g, ' ')
    }
  }

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
            Showing {filtered.length} of {attendanceEvents.length}
          </div>
        </div>
        <button
          onClick={fetchEvents}
          style={{
            background: 'rgba(197,164,126,0.1)', border: '1px solid rgba(197,164,126,0.3)',
            color: '#c5a47e', padding: '6px 16px', borderRadius: 6, cursor: 'pointer', fontSize: 13,
          }}
        >
          Refresh
        </button>
      </div>

      {error && (
        <div style={{ background: 'rgba(231,76,60,0.1)', border: '1px solid rgba(231,76,60,0.3)', borderRadius: 8, padding: '12px 16px', marginBottom: 16, color: '#e74c3c', fontSize: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{error}</span>
          <button onClick={fetchEvents} style={{ background: 'transparent', border: '1px solid rgba(231,76,60,0.4)', color: '#e74c3c', padding: '4px 12px', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>Retry</button>
        </div>
      )}

      <div className="ea-dash-card">
        <h3 className="ea-dash-card-title">Today's Attendance — {new Date().toLocaleDateString()}</h3>
        <div className="ea-dash-table-wrap">
          <table className="ea-dash-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Guest Name</th>
                <th>Event</th>
                <th>Mode</th>
                <th>Time</th>
                <th>Confidence</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>Loading...</td></tr>
              ) : filtered.length > 0 ? filtered.map((ev, i) => {
                const isEntry = isEntryEvent(ev.event_type)
                return (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td className="ea-dash-table-name">{ev.face_name || 'Unknown'}</td>
                  <td style={{ textTransform: 'capitalize' }}>{ev.event_type.replace(/_/g, ' ')}</td>
                  <td style={{ textTransform: 'capitalize' }}>{ev.mode || '-'}</td>
                  <td>{ev.timestamp ? new Date(ev.timestamp).toLocaleTimeString() : '-'}</td>
                  <td>{ev.confidence ?? 0}%</td>
                  <td>
                    <span style={{
                      padding: '3px 10px', borderRadius: 50, fontSize: 11, fontWeight: 600,
                      background: isEntry ? 'rgba(46,204,113,0.12)' : 'rgba(231,76,60,0.12)',
                      color: isEntry ? '#2ecc71' : '#e74c3c',
                      border: `1px solid ${isEntry ? 'rgba(46,204,113,0.3)' : 'rgba(231,76,60,0.3)'}`,
                    }}>
                      {statusLabel(ev.event_type)}
                    </span>
                  </td>
                </tr>
              )}) : (
                <tr><td colSpan={7} style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>
                  No attendance records yet. Records appear when the agent detects face entries and exits.
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default Attendance
