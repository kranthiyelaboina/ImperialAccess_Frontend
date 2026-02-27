import React, { useState } from 'react'
import { Link } from 'react-router-dom'

/* Admin Dashboard — professional layout, no emojis */

interface Guest {
  id: number
  name: string
  status: 'Verified' | 'Pending' | 'Denied'
  time: string
  lounge: string
}

const recentEntries: Guest[] = [
  { id: 1, name: 'Ananya Sharma', status: 'Verified', time: '09:14 AM', lounge: 'Terminal 3 — Skyview' },
  { id: 2, name: 'Rohan Mehta', status: 'Verified', time: '09:22 AM', lounge: 'Terminal 1 — Elara' },
  { id: 3, name: 'Priya Nair', status: 'Pending', time: '09:35 AM', lounge: 'Terminal 2 — Horizon' },
  { id: 4, name: 'Aditya Verma', status: 'Denied', time: '09:41 AM', lounge: 'Terminal 3 — Skyview' },
  { id: 5, name: 'Sneha Kapoor', status: 'Verified', time: '09:48 AM', lounge: 'Terminal 1 — Elara' },
]

const statusColor: Record<string, string> = {
  Verified: '#2ecc71',
  Pending: '#f39c12',
  Denied: '#e74c3c',
}

/* SVG icons for stat cards */
const SvgUsers = () => (
  <svg width="28" height="28" fill="none" viewBox="0 0 28 28">
    <circle cx="10" cy="8" r="4" stroke="#c5a47e" strokeWidth="2"/>
    <path d="M2 24c0-4.418 3.582-8 8-8s8 3.582 8 8" stroke="#c5a47e" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="20" cy="10" r="3" stroke="#c5a47e" strokeWidth="1.5" opacity=".6"/>
    <path d="M22 24c0-3.5-2-6-5-7" stroke="#c5a47e" strokeWidth="1.5" strokeLinecap="round" opacity=".6"/>
  </svg>
)
const SvgCamera = () => (
  <svg width="28" height="28" fill="none" viewBox="0 0 28 28">
    <rect x="2" y="7" width="24" height="16" rx="3" stroke="#c5a47e" strokeWidth="2"/>
    <circle cx="14" cy="15" r="4" stroke="#c5a47e" strokeWidth="2"/>
    <path d="M9 7l1.5-3h7L19 7" stroke="#c5a47e" strokeWidth="2" strokeLinejoin="round"/>
  </svg>
)
const SvgToken = () => (
  <svg width="28" height="28" fill="none" viewBox="0 0 28 28">
    <circle cx="14" cy="14" r="11" stroke="#c5a47e" strokeWidth="2"/>
    <circle cx="14" cy="14" r="6" stroke="#c5a47e" strokeWidth="1.5" strokeDasharray="3 2"/>
    <path d="M14 9v5l3 3" stroke="#c5a47e" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)
const SvgAlert = () => (
  <svg width="28" height="28" fill="none" viewBox="0 0 28 28">
    <path d="M14 3L2 25h24L14 3z" stroke="#c5a47e" strokeWidth="2" strokeLinejoin="round"/>
    <path d="M14 11v6" stroke="#c5a47e" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="14" cy="21" r="1" fill="#c5a47e"/>
  </svg>
)

const AdminDashboard: React.FC = () => {
  const [permitSearch, setPermitSearch] = useState('')

  const stats = [
    { icon: <SvgUsers />, value: '1,247', label: 'Registered Guests' },
    { icon: <SvgCamera />, value: '8', label: 'Active Cameras' },
    { icon: <SvgToken />, value: '342', label: 'Tokens Issued Today' },
    { icon: <SvgAlert />, value: '3', label: 'Alerts' },
  ]

  return (
    <div className="ea-dash">
      {/* Sidebar */}
      <aside className="ea-dash-sidebar">
        <div className="ea-dash-sidebar-logo">
          <img src="/images/logo.png" alt="ImperialAccess" style={{ height: 52, width: 'auto' }} />
        </div>
        <nav className="ea-dash-nav">
          <a className="ea-dash-nav-item active" href="#overview">
            <SvgDashIcon /> Overview
          </a>
          <a className="ea-dash-nav-item" href="#camera">
            <SvgCamNavIcon /> Camera Feed
          </a>
          <a className="ea-dash-nav-item" href="#permits">
            <SvgPermitIcon /> Permits
          </a>
          <a className="ea-dash-nav-item" href="#attendance">
            <SvgAttendIcon /> Attendance
          </a>
          <a className="ea-dash-nav-item" href="#tokens">
            <SvgTokenNavIcon /> Dining Tokens
          </a>
        </nav>
        <div className="ea-dash-sidebar-bottom">
          <Link to="/" className="ea-dash-nav-item">
            <SvgHomeIcon /> Back to Home
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="ea-dash-main">
        <header className="ea-dash-header">
          <div>
            <h1 className="ea-dash-title">Admin Dashboard</h1>
            <p className="ea-dash-subtitle">ImperialAccess Lounge Management</p>
          </div>
          <div className="ea-dash-header-right">
            <span className="ea-dash-badge">Admin</span>
          </div>
        </header>

        {/* Stats */}
        <div className="ea-dash-stats">
          {stats.map(s => (
            <div className="ea-dash-stat-card" key={s.label}>
              <div className="ea-dash-stat-icon">{s.icon}</div>
              <div>
                <div className="ea-dash-stat-value">{s.value}</div>
                <div className="ea-dash-stat-label">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="ea-dash-grid">
          {/* Camera Feed Preview */}
          <section className="ea-dash-card ea-dash-card-wide" id="camera">
            <h3 className="ea-dash-card-title">Live Camera Feed</h3>
            <div className="ea-dash-camera-grid">
              {[1, 2, 3, 4].map(n => (
                <div className="ea-dash-camera-slot" key={n}>
                  <img src={`/images/hero-${n === 1 ? '2' : n === 2 ? '3' : n === 3 ? '4' : '2'}.webp`} alt={`Camera ${n}`} />
                  <div className="ea-dash-camera-label">
                    <span className="ea-dash-camera-dot"></span>
                    CAM {n} — Terminal {n <= 2 ? '1' : n === 3 ? '2' : '3'}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Permit Control */}
          <section className="ea-dash-card" id="permits">
            <h3 className="ea-dash-card-title">Permit Control</h3>
            <input
              className="ea-dash-search"
              placeholder="Search guest by name..."
              value={permitSearch}
              onChange={e => setPermitSearch(e.target.value)}
            />
            <div className="ea-dash-permit-actions">
              <button className="ea-dash-btn ea-dash-btn-gold">Grant Permit</button>
              <button className="ea-dash-btn ea-dash-btn-outline">Revoke Permit</button>
            </div>
            <p className="ea-dash-card-note">Search a registered guest above to manage their lounge access permit.</p>
          </section>

          {/* Recent Entries */}
          <section className="ea-dash-card ea-dash-card-wide" id="attendance">
            <h3 className="ea-dash-card-title">Recent Entries</h3>
            <div className="ea-dash-table-wrap">
              <table className="ea-dash-table">
                <thead>
                  <tr>
                    <th>Guest</th>
                    <th>Lounge</th>
                    <th>Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentEntries.map(g => (
                    <tr key={g.id}>
                      <td className="ea-dash-table-name">{g.name}</td>
                      <td>{g.lounge}</td>
                      <td>{g.time}</td>
                      <td>
                        <span className="ea-dash-status" style={{ color: statusColor[g.status], borderColor: statusColor[g.status] }}>
                          {g.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Dining Tokens */}
          <section className="ea-dash-card" id="tokens">
            <h3 className="ea-dash-card-title">Dining Tokens</h3>
            <div className="ea-dash-token-stats">
              <div className="ea-dash-token-stat">
                <span className="ea-dash-token-val">342</span>
                <span className="ea-dash-token-lbl">Issued</span>
              </div>
              <div className="ea-dash-token-stat">
                <span className="ea-dash-token-val">289</span>
                <span className="ea-dash-token-lbl">Redeemed</span>
              </div>
              <div className="ea-dash-token-stat">
                <span className="ea-dash-token-val">53</span>
                <span className="ea-dash-token-lbl">Active</span>
              </div>
            </div>
            <button className="ea-dash-btn ea-dash-btn-gold" style={{ width: '100%', marginTop: '16px' }}>
              Issue New Token
            </button>
          </section>
        </div>
      </main>
    </div>
  )
}

/* Small nav icons */
const SvgDashIcon = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 18 18"><rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="11" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="1" y="11" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="11" y="11" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/></svg>
)
const SvgCamNavIcon = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 18 18"><rect x="1" y="5" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="1.5"/><circle cx="9" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5"/></svg>
)
const SvgPermitIcon = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 18 18"><path d="M9 2L3 5v4c0 5 2.5 8.5 6 10 3.5-1.5 6-5 6-10V5L9 2z" stroke="currentColor" strokeWidth="1.5"/></svg>
)
const SvgAttendIcon = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 18 18"><rect x="2" y="3" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M2 7h14" stroke="currentColor" strokeWidth="1.5"/><path d="M6 1v4M12 1v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
)
const SvgTokenNavIcon = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 18 18"><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.5"/><path d="M9 6v3l2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
)
const SvgHomeIcon = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 18 18"><path d="M2 9l7-7 7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 8v7a1 1 0 001 1h3v-4h2v4h3a1 1 0 001-1V8" stroke="currentColor" strokeWidth="1.5"/></svg>
)

export default AdminDashboard
