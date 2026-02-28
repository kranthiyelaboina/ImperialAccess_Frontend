import React, { useEffect, useState } from 'react'
import { getGuestDashboard } from '../../services/api'

interface HistoryEntry {
  event: string
  time: string
  mode?: string
  duration_minutes?: number
}

const VisitHistory: React.FC = () => {
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getGuestDashboard()
      .then(data => {
        setHistory(data.attendance_history || [])
      })
      .catch(err => {
        setError(err?.error || err?.message || 'Failed to load visit history. Is the backend running?')
      })
      .finally(() => setLoading(false))
  }, [])

  const formatTime = (t: string | null | undefined): string => {
    if (!t) return '—'
    try {
      const d = new Date(t)
      if (isNaN(d.getTime())) return '—'
      return d.toLocaleString()
    } catch {
      return '—'
    }
  }

  if (loading) return <div style={{ color: 'rgba(255,255,255,0.4)', padding: 40 }}>Loading...</div>

  if (error) {
    return (
      <div className="ea-dash-card">
        <h3 className="ea-dash-card-title">Visit History</h3>
        <div style={{ padding: '20px 0', textAlign: 'center' }}>
          <svg width="44" height="44" fill="none" viewBox="0 0 44 44" style={{ marginBottom: 10, opacity: 0.5 }}>
            <circle cx="22" cy="22" r="18" stroke="#e74c3c" strokeWidth="2" />
            <path d="M22 14v10M22 28v2" stroke="#e74c3c" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <p style={{ color: '#e74c3c', fontSize: 14, marginBottom: 4 }}>{error}</p>
          <button
            style={{
              marginTop: 10, background: 'rgba(197,164,126,0.1)', border: '1px solid rgba(197,164,126,0.3)',
              color: '#c5a47e', padding: '8px 20px', borderRadius: 6, cursor: 'pointer', fontSize: 13,
            }}
            onClick={() => {
              setError('')
              setLoading(true)
              getGuestDashboard()
                .then(data => setHistory(data.attendance_history || []))
                .catch(err => setError(err?.error || err?.message || 'Failed to load visit history.'))
                .finally(() => setLoading(false))
            }}
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="ea-dash-card">
      <h3 className="ea-dash-card-title">Visit History</h3>
      <div className="ea-dash-table-wrap">
        <table className="ea-dash-table">
          <thead>
            <tr>
              <th>Event</th>
              <th>Mode</th>
              <th>Time</th>
              <th>Duration</th>
            </tr>
          </thead>
          <tbody>
            {history.length === 0 ? (
              <tr><td colSpan={4} style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>
                No visit history yet. Your entry/exit events will appear here after using face recognition at the lounge.
              </td></tr>
            ) : history.map((h, i) => (
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
                <td style={{ textTransform: 'capitalize' }}>{h.mode || '—'}</td>
                <td>{formatTime(h.time)}</td>
                <td>{h.duration_minutes ? `${h.duration_minutes} min` : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default VisitHistory
