import React from 'react'
import { Link } from 'react-router-dom'

/* User / Guest Dashboard — professional, no emojis */

const lounges = [
  { name: 'Skyview Lounge', terminal: 'Terminal 3', status: 'Access Granted', img: '/images/hero-2.webp' },
  { name: 'Elara Premium', terminal: 'Terminal 1', status: 'Access Granted', img: '/images/hero-3.webp' },
  { name: 'Horizon Club', terminal: 'Terminal 2', status: 'Pending Verification', img: '/images/hero-4.webp' },
]

const UserDashboard: React.FC = () => {
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
          <a className="ea-dash-nav-item" href="#face">
            <SvgFaceIcon /> Face Registration
          </a>
          <a className="ea-dash-nav-item" href="#lounges">
            <SvgLoungeIcon /> My Lounges
          </a>
          <a className="ea-dash-nav-item" href="#boarding">
            <SvgBoardingIcon /> Boarding Pass
          </a>
          <a className="ea-dash-nav-item" href="#dining">
            <SvgDiningIcon /> Dining Tokens
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
            <h1 className="ea-dash-title">Guest Dashboard</h1>
            <p className="ea-dash-subtitle">Welcome back, Guest</p>
          </div>
          <div className="ea-dash-header-right">
            <span className="ea-dash-badge ea-dash-badge-user">Guest</span>
          </div>
        </header>

        {/* Quick Stats */}
        <div className="ea-dash-stats">
          <div className="ea-dash-stat-card">
            <div className="ea-dash-stat-icon"><SvgFaceStatIcon /></div>
            <div>
              <div className="ea-dash-stat-value">Enrolled</div>
              <div className="ea-dash-stat-label">Face Status</div>
            </div>
          </div>
          <div className="ea-dash-stat-card">
            <div className="ea-dash-stat-icon"><SvgLoungeStatIcon /></div>
            <div>
              <div className="ea-dash-stat-value">3</div>
              <div className="ea-dash-stat-label">Lounges Available</div>
            </div>
          </div>
          <div className="ea-dash-stat-card">
            <div className="ea-dash-stat-icon"><SvgTokenStatIcon /></div>
            <div>
              <div className="ea-dash-stat-value">5</div>
              <div className="ea-dash-stat-label">Dining Tokens</div>
            </div>
          </div>
          <div className="ea-dash-stat-card">
            <div className="ea-dash-stat-icon"><SvgFlightIcon /></div>
            <div>
              <div className="ea-dash-stat-value">AI-204</div>
              <div className="ea-dash-stat-label">Next Flight</div>
            </div>
          </div>
        </div>

        <div className="ea-dash-grid">
          {/* Face Registration */}
          <section className="ea-dash-card" id="face">
            <h3 className="ea-dash-card-title">Face Registration</h3>
            <div className="ea-user-face-area">
              <div className="ea-user-face-placeholder">
                <SvgFacePlaceholder />
                <p>Your face embedding is securely stored</p>
                <span className="ea-user-face-status enrolled">Enrolled</span>
              </div>
              <button className="ea-dash-btn ea-dash-btn-outline" style={{ width: '100%', marginTop: '16px' }}>
                Re-enroll Face
              </button>
            </div>
          </section>

          {/* Boarding Pass */}
          <section className="ea-dash-card" id="boarding">
            <h3 className="ea-dash-card-title">Boarding Pass</h3>
            <div className="ea-user-boarding">
              <div className="ea-user-boarding-row">
                <div>
                  <span className="ea-user-boarding-label">Flight</span>
                  <span className="ea-user-boarding-val">AI-204</span>
                </div>
                <div>
                  <span className="ea-user-boarding-label">Gate</span>
                  <span className="ea-user-boarding-val">G12</span>
                </div>
                <div>
                  <span className="ea-user-boarding-label">Seat</span>
                  <span className="ea-user-boarding-val">14A</span>
                </div>
              </div>
              <div className="ea-user-boarding-row">
                <div>
                  <span className="ea-user-boarding-label">From</span>
                  <span className="ea-user-boarding-val">DEL</span>
                </div>
                <div className="ea-user-boarding-arrow">
                  <svg width="24" height="12" viewBox="0 0 24 12" fill="none">
                    <path d="M0 6h20m0 0l-4-4m4 4l-4 4" stroke="#c5a47e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <span className="ea-user-boarding-label">To</span>
                  <span className="ea-user-boarding-val">BOM</span>
                </div>
              </div>
              <div className="ea-user-boarding-row">
                <div>
                  <span className="ea-user-boarding-label">Departure</span>
                  <span className="ea-user-boarding-val">14:30</span>
                </div>
                <div>
                  <span className="ea-user-boarding-label">Status</span>
                  <span className="ea-user-boarding-val" style={{ color: '#2ecc71' }}>On Time</span>
                </div>
              </div>
            </div>
          </section>

          {/* Lounge Access */}
          <section className="ea-dash-card ea-dash-card-wide" id="lounges">
            <h3 className="ea-dash-card-title">Available Lounges</h3>
            <div className="ea-user-lounge-grid">
              {lounges.map(l => (
                <div className="ea-user-lounge-card" key={l.name}>
                  <img src={l.img} alt={l.name} className="ea-user-lounge-img" />
                  <div className="ea-user-lounge-info">
                    <h4>{l.name}</h4>
                    <p>{l.terminal}</p>
                    <span className={`ea-user-lounge-status ${l.status === 'Access Granted' ? 'granted' : 'pending'}`}>
                      {l.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Dining Tokens */}
          <section className="ea-dash-card" id="dining">
            <h3 className="ea-dash-card-title">Dining Tokens</h3>
            <div className="ea-user-token-circle">
              <svg viewBox="0 0 120 120" width="120" height="120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="#2a2a2a" strokeWidth="8" />
                <circle cx="60" cy="60" r="50" fill="none" stroke="#c5a47e" strokeWidth="8"
                  strokeDasharray="314" strokeDashoffset="188" strokeLinecap="round"
                  transform="rotate(-90 60 60)" />
                <text x="60" y="58" textAnchor="middle" fill="#c5a47e" fontSize="28" fontWeight="600">5</text>
                <text x="60" y="76" textAnchor="middle" fill="#888" fontSize="10">remaining</text>
              </svg>
            </div>
            <div className="ea-user-token-detail">
              <div><span>Issued</span><strong>8</strong></div>
              <div><span>Used</span><strong>3</strong></div>
              <div><span>Active</span><strong>5</strong></div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

/* Nav icons */
const SvgDashIcon = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 18 18"><rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="11" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="1" y="11" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="11" y="11" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/></svg>
)
const SvgFaceIcon = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 18 18"><circle cx="9" cy="7" r="3.5" stroke="currentColor" strokeWidth="1.5"/><path d="M3 16c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
)
const SvgLoungeIcon = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 18 18"><rect x="2" y="6" width="14" height="8" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M5 6V4a4 4 0 018 0v2" stroke="currentColor" strokeWidth="1.5"/></svg>
)
const SvgBoardingIcon = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 18 18"><rect x="2" y="3" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M6 7h6M6 10h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
)
const SvgDiningIcon = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 18 18"><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.5"/><path d="M9 5v4l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
)
const SvgHomeIcon = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 18 18"><path d="M2 9l7-7 7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 8v7a1 1 0 001 1h3v-4h2v4h3a1 1 0 001-1V8" stroke="currentColor" strokeWidth="1.5"/></svg>
)

/* Stat icons */
const SvgFaceStatIcon = () => (
  <svg width="28" height="28" fill="none" viewBox="0 0 28 28"><circle cx="14" cy="11" r="5" stroke="#c5a47e" strokeWidth="2"/><path d="M5 25c0-5 4-9 9-9s9 4 9 9" stroke="#c5a47e" strokeWidth="2" strokeLinecap="round"/></svg>
)
const SvgLoungeStatIcon = () => (
  <svg width="28" height="28" fill="none" viewBox="0 0 28 28"><rect x="3" y="9" width="22" height="12" rx="3" stroke="#c5a47e" strokeWidth="2"/><path d="M8 9V6a6 6 0 0112 0v3" stroke="#c5a47e" strokeWidth="2"/></svg>
)
const SvgTokenStatIcon = () => (
  <svg width="28" height="28" fill="none" viewBox="0 0 28 28"><circle cx="14" cy="14" r="10" stroke="#c5a47e" strokeWidth="2"/><path d="M14 8v6l4 3" stroke="#c5a47e" strokeWidth="2" strokeLinecap="round"/></svg>
)
const SvgFlightIcon = () => (
  <svg width="28" height="28" fill="none" viewBox="0 0 28 28"><path d="M3 21l22-7-22-7v6l16 1-16 1v6z" stroke="#c5a47e" strokeWidth="2" strokeLinejoin="round"/></svg>
)
const SvgFacePlaceholder = () => (
  <svg width="64" height="64" fill="none" viewBox="0 0 64 64">
    <rect x="8" y="8" width="14" height="5" rx="2.5" stroke="#c5a47e" strokeWidth="2"/>
    <rect x="8" y="8" width="5" height="14" rx="2.5" stroke="#c5a47e" strokeWidth="2"/>
    <rect x="42" y="8" width="14" height="5" rx="2.5" stroke="#c5a47e" strokeWidth="2"/>
    <rect x="51" y="8" width="5" height="14" rx="2.5" stroke="#c5a47e" strokeWidth="2"/>
    <rect x="8" y="51" width="14" height="5" rx="2.5" stroke="#c5a47e" strokeWidth="2"/>
    <rect x="8" y="42" width="5" height="14" rx="2.5" stroke="#c5a47e" strokeWidth="2"/>
    <rect x="42" y="51" width="14" height="5" rx="2.5" stroke="#c5a47e" strokeWidth="2"/>
    <rect x="51" y="42" width="5" height="14" rx="2.5" stroke="#c5a47e" strokeWidth="2"/>
    <circle cx="32" cy="28" r="8" stroke="#c5a47e" strokeWidth="2"/>
    <path d="M18 48c0-7.732 6.268-14 14-14s14 6.268 14 14" stroke="#c5a47e" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

export default UserDashboard
