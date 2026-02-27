import React from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const navItems = [
  { path: '/admin', label: 'Overview', icon: <SvgDash /> },
  { path: '/admin/camera', label: 'Live Camera', icon: <SvgCamera /> },
  { path: '/admin/modes', label: 'Mode Control', icon: <SvgModes /> },
  { path: '/admin/attendance', label: 'Attendance', icon: <SvgAttend /> },
  { path: '/admin/analytics', label: 'Analytics', icon: <SvgChart /> },
  { path: '/admin/guests', label: 'Guests', icon: <SvgGuests /> },
  { path: '/admin/permits', label: 'Permits', icon: <SvgPermit /> },
  { path: '/admin/dining', label: 'Dining Tokens', icon: <SvgDining /> },
  { path: '/admin/events', label: 'Event Log', icon: <SvgEvents /> },
  { path: '/admin/settings', label: 'Settings', icon: <SvgSettings /> },
]

const AdminLayout: React.FC = () => {
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
            <h1 className="ea-dash-title">Admin Dashboard</h1>
            <p className="ea-dash-subtitle">Welcome, {user?.full_name || 'Admin'}</p>
          </div>
          <div className="ea-dash-header-right">
            <span className="ea-dash-badge">Admin</span>
          </div>
        </header>
        <Outlet />
      </main>
    </div>
  )
}

/* Icons */
function SvgDash() { return <svg width="18" height="18" fill="none" viewBox="0 0 18 18"><rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="11" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="1" y="11" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="11" y="11" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/></svg> }
function SvgCamera() { return <svg width="18" height="18" fill="none" viewBox="0 0 18 18"><rect x="1" y="5" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="1.5"/><circle cx="9" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5"/></svg> }
function SvgModes() { return <svg width="18" height="18" fill="none" viewBox="0 0 18 18"><path d="M9 2v14M2 9h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><circle cx="9" cy="9" r="3" stroke="currentColor" strokeWidth="1.5"/></svg> }
function SvgAttend() { return <svg width="18" height="18" fill="none" viewBox="0 0 18 18"><rect x="2" y="3" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M2 7h14" stroke="currentColor" strokeWidth="1.5"/><path d="M6 1v4M12 1v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg> }
function SvgChart() { return <svg width="18" height="18" fill="none" viewBox="0 0 18 18"><path d="M2 16h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M4 12V8M8 12V5M12 12V3M16 12V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg> }
function SvgGuests() { return <svg width="18" height="18" fill="none" viewBox="0 0 18 18"><circle cx="7" cy="6" r="3" stroke="currentColor" strokeWidth="1.5"/><path d="M1 16c0-3 2.5-5 6-5s6 2 6 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><circle cx="14" cy="7" r="2" stroke="currentColor" strokeWidth="1.2" opacity=".6"/><path d="M15 16c0-2-1-3.5-3-4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity=".6"/></svg> }
function SvgPermit() { return <svg width="18" height="18" fill="none" viewBox="0 0 18 18"><path d="M9 2L3 5v4c0 5 2.5 8.5 6 10 3.5-1.5 6-5 6-10V5L9 2z" stroke="currentColor" strokeWidth="1.5"/></svg> }
function SvgDining() { return <svg width="18" height="18" fill="none" viewBox="0 0 18 18"><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.5"/><path d="M9 5v4l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg> }
function SvgEvents() { return <svg width="18" height="18" fill="none" viewBox="0 0 18 18"><rect x="2" y="2" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M6 6h6M6 9h4M6 12h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg> }
function SvgSettings() { return <svg width="18" height="18" fill="none" viewBox="0 0 18 18"><circle cx="9" cy="9" r="3" stroke="currentColor" strokeWidth="1.5"/><path d="M9 1v2M9 15v2M1 9h2M15 9h2M3.3 3.3l1.4 1.4M13.3 13.3l1.4 1.4M14.7 3.3l-1.4 1.4M4.7 13.3l-1.4 1.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg> }
function SvgHome() { return <svg width="18" height="18" fill="none" viewBox="0 0 18 18"><path d="M2 9l7-7 7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 8v7a1 1 0 001 1h3v-4h2v4h3a1 1 0 001-1V8" stroke="currentColor" strokeWidth="1.5"/></svg> }
function SvgLogout() { return <svg width="18" height="18" fill="none" viewBox="0 0 18 18"><path d="M6 2H4a2 2 0 00-2 2v10a2 2 0 002 2h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M12 13l4-4-4-4M7 9h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg> }

export default AdminLayout
