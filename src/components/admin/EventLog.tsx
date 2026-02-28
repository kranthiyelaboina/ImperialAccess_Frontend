import React, { useState, useEffect } from 'react'
import { getAgentEvents, type AgentEvent } from '../../services/api'

const typeColors: Record<string, { bg: string; fg: string; border: string }> = {
  access_granted: { bg: 'rgba(46,204,113,0.12)', fg: '#2ecc71', border: 'rgba(46,204,113,0.3)' },
  access_denied: { bg: 'rgba(231,76,60,0.12)', fg: '#e74c3c', border: 'rgba(231,76,60,0.3)' },
  unknown_detected: { bg: 'rgba(243,156,18,0.12)', fg: '#f39c12', border: 'rgba(243,156,18,0.3)' },
  mode_change: { bg: 'rgba(52,152,219,0.12)', fg: '#3498db', border: 'rgba(52,152,219,0.3)' },
  system: { bg: 'rgba(255,255,255,0.05)', fg: 'rgba(255,255,255,0.5)', border: 'rgba(255,255,255,0.1)' },
}

const EventLog: React.FC = () => {
  const [events, setEvents] = useState<AgentEvent[]>([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAgentEvents()
      .then(d => setEvents(d.events || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'all' ? events : events.filter(e => e.event_type === filter)
  const types = ['all', ...new Set(events.map(e => e.event_type))]

  return (
    <>
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

      <div className="ea-dash-card" style={{ maxHeight: 600, overflowY: 'auto' }}>
        <h3 className="ea-dash-card-title">Agent Event Log ({filtered.length})</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {loading ? (
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>Loading events...</p>
          ) : filtered.length > 0 ? filtered.map((ev, i) => {
            const c = typeColors[ev.event_type] || typeColors.system
            const faceName = ev.face_name || 'Unknown'
            const detail = `${faceName} - ${ev.event_type.replace(/_/g, ' ')} (confidence: ${ev.confidence ?? 0}%, mode: ${ev.mode || '-'})`
            return (
              <div key={ev.id || i} style={{
                padding: '12px 16px', borderRadius: 10,
                background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
                display: 'flex', gap: 14, alignItems: 'flex-start',
              }}>
                <div style={{ minWidth: 90, fontSize: 12, color: 'rgba(255,255,255,0.35)', paddingTop: 2 }}>
                  {ev.timestamp ? new Date(ev.timestamp).toLocaleTimeString() : '-'}
                </div>
                <span style={{
                  padding: '3px 10px', borderRadius: 50, fontSize: 10, fontWeight: 600,
                  background: c.bg, color: c.fg, border: `1px solid ${c.border}`,
                  textTransform: 'capitalize', whiteSpace: 'nowrap',
                }}>
                  {ev.event_type.replace(/_/g, ' ')}
                </span>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.4, flex: 1 }}>
                  {detail}
                </div>
              </div>
            )
          }) : (
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>No events found</p>
          )}
        </div>
      </div>
    </>
  )
}

export default EventLog
