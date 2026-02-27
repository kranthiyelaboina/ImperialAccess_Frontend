import React, { useState, useEffect } from 'react'
import { getAgentEvents } from '../../services/api'

const mockEvents = [
  { id: 1, timestamp: '2026-02-27T11:12:00', event_type: 'unknown_detected', details: 'Unknown face detected at entry camera — confidence 45%' },
  { id: 2, timestamp: '2026-02-27T11:05:00', event_type: 'access_granted', details: 'John Doe recognized and granted entry — confidence 88%' },
  { id: 3, timestamp: '2026-02-27T10:20:00', event_type: 'access_granted', details: 'Jane Smith recognized and granted entry — confidence 92%' },
  { id: 4, timestamp: '2026-02-27T09:48:00', event_type: 'access_granted', details: 'Sneha Kapoor recognized and granted entry — confidence 90%' },
  { id: 5, timestamp: '2026-02-27T09:41:00', event_type: 'access_denied', details: 'Aditya Verma — face match below threshold (60%), access denied' },
  { id: 6, timestamp: '2026-02-27T09:22:00', event_type: 'access_granted', details: 'Rohan Mehta recognized and granted entry — confidence 85%' },
  { id: 7, timestamp: '2026-02-27T09:14:00', event_type: 'access_granted', details: 'Ananya Sharma recognized and granted entry — confidence 91%' },
  { id: 8, timestamp: '2026-02-27T09:00:00', event_type: 'mode_change', details: 'Agent mode changed from "gate" to "entry" by admin' },
  { id: 9, timestamp: '2026-02-27T08:50:00', event_type: 'system', details: 'Camera stream initialized — detection pipeline started' },
  { id: 10, timestamp: '2026-02-27T08:45:00', event_type: 'system', details: 'Agent started — loading face embeddings for 28 registered members' },
]

const typeColors: Record<string, { bg: string; fg: string; border: string }> = {
  access_granted: { bg: 'rgba(46,204,113,0.12)', fg: '#2ecc71', border: 'rgba(46,204,113,0.3)' },
  access_denied: { bg: 'rgba(231,76,60,0.12)', fg: '#e74c3c', border: 'rgba(231,76,60,0.3)' },
  unknown_detected: { bg: 'rgba(243,156,18,0.12)', fg: '#f39c12', border: 'rgba(243,156,18,0.3)' },
  mode_change: { bg: 'rgba(52,152,219,0.12)', fg: '#3498db', border: 'rgba(52,152,219,0.3)' },
  system: { bg: 'rgba(255,255,255,0.05)', fg: 'rgba(255,255,255,0.5)', border: 'rgba(255,255,255,0.1)' },
}

const EventLog: React.FC = () => {
  const [events, setEvents] = useState(mockEvents)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    getAgentEvents().then(d => {
      if (d.events?.length) setEvents(d.events as typeof mockEvents)
    }).catch(() => {})
  }, [])

  const filtered = filter === 'all' ? events : events.filter(e => e.event_type === filter)
  const types = ['all', ...new Set(events.map(e => e.event_type))]

  return (
    <>
      {/* Filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {types.map(t => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`ea-dash-btn ${t === filter ? 'ea-dash-btn-gold' : 'ea-dash-btn-outline'}`}
            style={{ fontSize: 12, padding: '6px 14px', textTransform: 'capitalize' }}
          >
            {t.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {/* Events */}
      <div className="ea-dash-card" style={{ maxHeight: 600, overflowY: 'auto' }}>
        <h3 className="ea-dash-card-title">Agent Event Log ({filtered.length})</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.map(ev => {
            const c = typeColors[ev.event_type] || typeColors.system
            return (
              <div key={ev.id} style={{
                padding: '12px 16px', borderRadius: 10,
                background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
                display: 'flex', gap: 14, alignItems: 'flex-start',
              }}>
                <div style={{ minWidth: 90, fontSize: 12, color: 'rgba(255,255,255,0.35)', paddingTop: 2 }}>
                  {new Date(ev.timestamp).toLocaleTimeString()}
                </div>
                <span style={{
                  padding: '3px 10px', borderRadius: 50, fontSize: 10, fontWeight: 600,
                  background: c.bg, color: c.fg, border: `1px solid ${c.border}`,
                  textTransform: 'capitalize', whiteSpace: 'nowrap',
                }}>
                  {ev.event_type.replace(/_/g, ' ')}
                </span>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.4, flex: 1 }}>
                  {ev.details}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}

export default EventLog
