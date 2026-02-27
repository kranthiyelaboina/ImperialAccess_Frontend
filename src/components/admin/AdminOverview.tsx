import React, { useEffect, useState } from 'react'
import { getAdminDashboard, type AdminDashboardData } from '../../services/api'

const mockData: AdminDashboardData = {
  success: true,
  agent: {
    mode: 'gate',
    occupancy_count: 5,
    occupancy: [
      { name: 'Jane Smith', entered_at: '2026-02-27T10:20:00' },
      { name: 'John Doe', entered_at: '2026-02-27T11:05:00' },
      { name: 'Ananya Sharma', entered_at: '2026-02-27T09:14:00' },
      { name: 'Rohan Mehta', entered_at: '2026-02-27T09:22:00' },
      { name: 'Sneha Kapoor', entered_at: '2026-02-27T09:48:00' },
    ],
    registered_members: ['Jane Smith', 'John Doe', 'Ananya Sharma', 'Rohan Mehta', 'Sneha Kapoor'],
    todays_attendance_count: 8,
  },
  recent_events: [
    { event_type: 'access_granted', name: 'Jane Smith', confidence: 92, timestamp: '2026-02-27T10:20:00' },
    { event_type: 'access_granted', name: 'John Doe', confidence: 88, timestamp: '2026-02-27T11:05:00' },
    { event_type: 'unknown_detected', name: 'Unknown', confidence: 45, timestamp: '2026-02-27T11:12:00' },
    { event_type: 'access_denied', name: 'Aditya Verma', confidence: 60, timestamp: '2026-02-27T09:41:00' },
  ],
  stats: { total_guests_today: 8, currently_inside: 5, unknown_alerts: 2, dining_tokens_issued: 12, avg_stay_minutes: 87.5 },
}

const AdminOverview: React.FC = () => {
  const [data, setData] = useState<AdminDashboardData | null>(null)

  useEffect(() => {
    getAdminDashboard().then(setData).catch(() => setData(mockData))
  }, [])

  if (!data) return <div style={{ color: 'rgba(255,255,255,0.4)', padding: 40 }}>Loading...</div>

  const s = data.stats

  return (
    <>
      {/* Stats */}
      <div className="ea-dash-stats">
        {[
          { icon: <SvgUsers />, value: s.total_guests_today, label: 'Guests Today' },
          { icon: <SvgInside />, value: s.currently_inside, label: 'Currently Inside' },
          { icon: <SvgAlert />, value: s.unknown_alerts, label: 'Alerts' },
          { icon: <SvgToken />, value: s.dining_tokens_issued, label: 'Tokens Issued' },
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
              {data.agent.occupancy_count} inside
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {data.agent.occupancy.map((o, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, padding: '8px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.02)' }}>
                <span style={{ color: '#fff', fontWeight: 500 }}>{o.name}</span>
                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>{new Date(o.entered_at).toLocaleTimeString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Agent Mode */}
        <div className="ea-dash-card">
          <h3 className="ea-dash-card-title">Agent Status</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#2ecc71', boxShadow: '0 0 8px #2ecc71' }} />
            <span style={{ fontSize: 16, fontWeight: 600, color: '#fff', textTransform: 'capitalize' }}>Mode: {data.agent.mode}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {['gate', 'reception', 'entry', 'exit'].map(mode => (
              <button
                key={mode}
                className={`ea-dash-btn ${mode === data.agent.mode ? 'ea-dash-btn-gold' : 'ea-dash-btn-outline'}`}
                style={{ textTransform: 'capitalize' }}
              >
                {mode}
              </button>
            ))}
          </div>
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>Avg stay: {s.avg_stay_minutes} min</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>Registered: {data.agent.registered_members.length} members</div>
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
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {data.recent_events.map((ev, i) => (
                  <tr key={i}>
                    <td>
                      <span style={{
                        padding: '3px 10px', borderRadius: 50, fontSize: 11, fontWeight: 600,
                        background: ev.event_type === 'access_granted' ? 'rgba(46,204,113,0.12)' : ev.event_type === 'access_denied' ? 'rgba(231,76,60,0.12)' : 'rgba(243,156,18,0.12)',
                        color: ev.event_type === 'access_granted' ? '#2ecc71' : ev.event_type === 'access_denied' ? '#e74c3c' : '#f39c12',
                        border: `1px solid ${ev.event_type === 'access_granted' ? 'rgba(46,204,113,0.3)' : ev.event_type === 'access_denied' ? 'rgba(231,76,60,0.3)' : 'rgba(243,156,18,0.3)'}`,
                      }}>
                        {ev.event_type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="ea-dash-table-name">{ev.name}</td>
                    <td>{ev.confidence}%</td>
                    <td>{new Date(ev.timestamp).toLocaleTimeString()}</td>
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
