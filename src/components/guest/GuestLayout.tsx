import React from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const navItems = [
  { path: '/guest', label: 'Overview', icon: <SvgDash /> },
  { path: '/guest/face-register', label: 'Face Registration', icon: <SvgFace /> },
  { path: '/guest/lounge-register', label: 'Register Lounge', icon: <SvgLounge /> },
  { path: '/guest/credit-check', label: 'Credit Check', icon: <SvgCard /> },
  { path: '/guest/dining', label: 'Dining Tokens', icon: <SvgDining /> },
  { path: '/guest/boarding', label: 'Boarding Pass', icon: <SvgBoarding /> },
  { path: '/guest/history', label: 'Visit History', icon: <SvgHistory /> },
  { path: '/guest/concierge', label: 'AI Concierge', icon: <SvgConcierge /> },
]

const GuestLayout: React.FC = () => {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="ea-dash">
      <aside className="ea-dash-sidebar">
        <div className="ea-dash-sidebar-logo">
          <img src="/images/logo.png" alt="ImperialAccess" style={{ height: 52, width: 'auto' }} />
        </div>
        <nav className="ea-dash-nav">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`ea-dash-nav-item${location.pathname === item.path ? ' active' : ''}`}
            >
              {item.icon} {item.label}
            </Link>
          ))}
        </nav>
        <div className="ea-dash-sidebar-bottom">
          <Link to="/" className="ea-dash-nav-item"><SvgHome /> Home</Link>
          <button className="ea-dash-nav-item" onClick={handleLogout} style={{ width: '100%' }}>
            <SvgLogout /> Logout
          </button>
        </div>
      </aside>

      <main className="ea-dash-main">
        <header className="ea-dash-header">
          <div>
            <h1 className="ea-dash-title">Guest Dashboard</h1>
            <p className="ea-dash-subtitle">Welcome, {user?.full_name || 'Guest'}</p>
          </div>
          <div className="ea-dash-header-right">
            <span className="ea-dash-badge ea-dash-badge-user">Guest</span>
          </div>
        </header>
        <Outlet />
      </main>
    </div>
  )
}

/* ── Icons ── */
function SvgDash() { return <svg width="18" height="18" fill="none" viewBox="0 0 18 18"><rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="11" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="1" y="11" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="11" y="11" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/></svg> }
function SvgFace() { return <svg width="18" height="18" fill="none" viewBox="0 0 18 18"><circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.5"/><path d="M2 16c0-3.5 3-6 7-6s7 2.5 7 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg> }
function SvgLounge() { return <svg width="18" height="18" fill="none" viewBox="0 0 18 18"><rect x="2" y="6" width="14" height="8" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M5 6V4a4 4 0 018 0v2" stroke="currentColor" strokeWidth="1.5"/></svg> }
function SvgCard() { return <svg width="18" height="18" fill="none" viewBox="0 0 18 18"><rect x="1" y="4" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M1 8h16" stroke="currentColor" strokeWidth="1.5"/></svg> }
function SvgDining() { return <svg width="18" height="18" fill="none" viewBox="0 0 18 18"><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.5"/><path d="M9 5v4l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg> }
function SvgBoarding() { return <svg width="18" height="18" fill="none" viewBox="0 0 18 18"><rect x="2" y="3" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M6 7h6M6 10h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg> }
function SvgHistory() { return <svg width="18" height="18" fill="none" viewBox="0 0 18 18"><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.5"/><path d="M9 5v4l-3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg> }
function SvgHome() { return <svg width="18" height="18" fill="none" viewBox="0 0 18 18"><path d="M2 9l7-7 7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 8v7a1 1 0 001 1h3v-4h2v4h3a1 1 0 001-1V8" stroke="currentColor" strokeWidth="1.5"/></svg> }
function SvgLogout() { return <svg width="18" height="18" fill="none" viewBox="0 0 18 18"><path d="M6 2H4a2 2 0 00-2 2v10a2 2 0 002 2h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M12 13l4-4-4-4M7 9h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg> }
function SvgConcierge() { return <svg width="18" height="18" fill="none" viewBox="0 0 18 18"><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.5"/><path d="M9 4c-2.8 0-5 1.6-5 3.6 0 1.2.7 2.2 1.7 2.8v1.6l2-1.2c.4.1.8.1 1.3.1 2.8 0 5-1.6 5-3.6S11.8 4 9 4z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/><circle cx="7" cy="7.5" r=".8" fill="currentColor"/><circle cx="9" cy="7.5" r=".8" fill="currentColor"/><circle cx="11" cy="7.5" r=".8" fill="currentColor"/></svg> }

export default GuestLayout
