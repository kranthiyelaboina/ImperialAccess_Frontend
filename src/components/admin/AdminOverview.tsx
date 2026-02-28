import React, { useEffect, useState } from 'react'
import { getAdminDashboard, type AdminDashboardData } from '../../services/api'

const AdminOverview: React.FC = () => {
  const [data, setData] = useState<AdminDashboardData | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    getAdminDashboard()
      .then(setData)
      .catch((err) => setError(err?.error || err?.message || 'Failed to load dashboard.'))
  }, [])

  if (error) return <div style={{ color: '#e74c3c', padding: 40 }}>{error}</div>
  if (!data) return <div style={{ color: 'rgba(255,255,255,0.4)', padding: 40 }}>Loading...</div>

  const s = data.stats
  const agent = data.agent_state

  return (
    <>
      {/* Stats */}
      <div className="ea-dash-stats">
        {[
          { icon: <SvgUsers />, value: s.today_entries, label: 'Entries Today' },
          { icon: <SvgInside />, value: s.current_occupancy, label: 'Currently Inside' },
          { icon: <SvgAlert />, value: s.today_registrations, label: 'Registrations' },
          { icon: <SvgToken />, value: s.total_guests, label: 'Total Guests' },
        ].map((stat, i) => (
          <div className="ea-dash-stat-card" key={i}>
            <div className="ea-dash-stat-icon">{stat.icon}</div>
            <div>
              <div className="ea-dash-stat-value">{stat.value}</div>
              <div className="ea-dash-stat-label">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="ea-dash-grid">
        {/* Live Occupancy */}
        <div className="ea-dash-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 className="ea-dash-card-title" style={{ margin: 0 }}>Live Occupancy</h3>
            <span style={{ fontSize: 12, padding: '4px 12px', borderRadius: 50, background: 'rgba(46,204,113,0.12)', color: '#2ecc71', border: '1px solid rgba(46,204,113,0.3)', fontWeight: 600 }}>
              {agent.occupancy} inside
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {agent.recognized_faces.length > 0 ? agent.recognized_faces.map((name, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, padding: '8px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.02)' }}>
                <span style={{ color: '#fff', fontWeight: 500 }}>{name}</span>
              </div>
            )) : (
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>No recognized faces currently</p>
            )}
          </div>
        </div>

        {/* Agent Mode */}
        <div className="ea-dash-card">
          <h3 className="ea-dash-card-title">Agent Status</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: agent.running ? '#2ecc71' : '#e74c3c', boxShadow: `0 0 8px ${agent.running ? '#2ecc71' : '#e74c3c'}` }} />
            <span style={{ fontSize: 16, fontWeight: 600, color: '#fff', textTransform: 'capitalize' }}>
              {agent.running ? `Mode: ${agent.mode}` : 'Agent Offline'}
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>Faces Detected: {agent.faces_detected}</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>Exits Today: {s.today_exits}</div>
          </div>
        </div>

        {/* Recent Events */}
        <div className="ea-dash-card ea-dash-card-wide">
          <h3 className="ea-dash-card-title">Recent Agent Events</h3>
          <div className="ea-dash-table-wrap">
            <table className="ea-dash-table">
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Name</th>
                  <th>Confidence</th>
                  <th>Mode</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {data.recent_events.length === 0 ? (
                  <tr><td colSpan={5} style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>No recent events</td></tr>
                ) : data.recent_events.map((ev, i) => (
                  <tr key={i}>
                    <td>
                      <span style={{
                        padding: '3px 10px', borderRadius: 50, fontSize: 11, fontWeight: 600,
                        background: ev.event_type === 'access_granted' ? 'rgba(46,204,113,0.12)' : ev.event_type === 'access_denied' ? 'rgba(231,76,60,0.12)' : 'rgba(243,156,18,0.12)',
                        color: ev.event_type === 'access_granted' ? '#2ecc71' : ev.event_type === 'access_denied' ? '#e74c3c' : '#f39c12',
                        border: `1px solid ${ev.event_type === 'access_granted' ? 'rgba(46,204,113,0.3)' : ev.event_type === 'access_denied' ? 'rgba(231,76,60,0.3)' : 'rgba(243,156,18,0.3)'}`,
                      }}>
                        {ev.event_type.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="ea-dash-table-name">{ev.face_name || 'Unknown'}</td>
                    <td>{ev.confidence ?? 0}%</td>
                    <td style={{ textTransform: 'capitalize' }}>{ev.mode || '-'}</td>
                    <td>{ev.timestamp ? new Date(ev.timestamp).toLocaleTimeString() : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}

/* Icons */
function SvgUsers() { return <svg width="28" height="28" fill="none" viewBox="0 0 28 28"><circle cx="10" cy="8" r="4" stroke="#c5a47e" strokeWidth="2"/><path d="M2 24c0-4.418 3.582-8 8-8s8 3.582 8 8" stroke="#c5a47e" strokeWidth="2" strokeLinecap="round"/><circle cx="20" cy="10" r="3" stroke="#c5a47e" strokeWidth="1.5" opacity=".6"/></svg> }
function SvgInside() { return <svg width="28" height="28" fill="none" viewBox="0 0 28 28"><rect x="3" y="3" width="22" height="22" rx="4" stroke="#c5a47e" strokeWidth="2"/><path d="M10 14l3 3 5-5" stroke="#c5a47e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> }
function SvgAlert() { return <svg width="28" height="28" fill="none" viewBox="0 0 28 28"><path d="M14 3L2 25h24L14 3z" stroke="#c5a47e" strokeWidth="2" strokeLinejoin="round"/><path d="M14 11v6" stroke="#c5a47e" strokeWidth="2" strokeLinecap="round"/><circle cx="14" cy="21" r="1" fill="#c5a47e"/></svg> }
function SvgToken() { return <svg width="28" height="28" fill="none" viewBox="0 0 28 28"><circle cx="14" cy="14" r="11" stroke="#c5a47e" strokeWidth="2"/><path d="M14 9v5l3 3" stroke="#c5a47e" strokeWidth="2" strokeLinecap="round"/></svg> }

export default AdminOverview
