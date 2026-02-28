import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { loginAdmin, loginGuest } from '../services/api'

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'guest' | 'admin'>('guest')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const loginFn = role === 'admin' ? loginAdmin : loginGuest
      const res = await loginFn(username, password)
      if (res.success) {
        login(res.token, res.user)
        navigate(role === 'admin' ? '/admin' : '/guest')
      }
    } catch (err: any) {
      setError(err?.error || err?.message || 'Login failed. Please check your credentials and ensure the server is running.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="ea-auth-page">
      <div className="ea-auth-bg">
        <img src="/images/hero.webp" alt="" className="ea-auth-bg-img" />
        <div className="ea-auth-bg-overlay"></div>
      </div>

      <div className="ea-auth-content">
        <div className="ea-auth-left">
          <div className="ea-auth-left-inner">
            <h1 className="ea-auth-hero-title">
              Your Gateway to<br />
              Premium Lounge<br />
              Access
            </h1>
            <div className="ea-auth-tags">
              <span className="ea-auth-tag">Face Recognition</span>
              <span className="ea-auth-tag ea-auth-tag-active">Airport Lounge</span>
              <span className="ea-auth-tag">Seamless Entry</span>
              <span className="ea-auth-tag">Security</span>
            </div>
            <p className="ea-auth-tagline">
              Walk in with confidence. Your face is your premium pass.
            </p>
          </div>
        </div>

        <div className="ea-auth-right">
          <div className="ea-auth-card">
            <div className="ea-auth-card-logo">
              <img src="/images/logo.png" alt="ImperialAccess" style={{ height: 72, width: 'auto' }} />
            </div>
            <h2 className="ea-auth-card-title">Welcome!</h2>
            <p className="ea-auth-card-subtitle">Sign in to continue</p>

            {/* Role selector */}
            <div className="ea-auth-role-selector">
              <button
                type="button"
                className={`ea-auth-role-btn${role === 'guest' ? ' ea-auth-role-active' : ''}`}
                onClick={() => setRole('guest')}
              >
                Guest
              </button>
              <button
                type="button"
                className={`ea-auth-role-btn${role === 'admin' ? ' ea-auth-role-active' : ''}`}
                onClick={() => setRole('admin')}
              >
                Admin
              </button>
            </div>

            <form onSubmit={handleLogin}>
              {error && (
                <div style={{ color: '#e74c3c', fontSize: 13, marginBottom: 10, textAlign: 'left' }}>{error}</div>
              )}
              {role === 'admin' && (
                <div style={{
                  background: 'rgba(197,164,126,0.08)',
                  border: '1px solid rgba(197,164,126,0.2)',
                  borderRadius: 8,
                  padding: '10px 14px',
                  marginBottom: 12,
                  fontSize: 12,
                  color: 'rgba(255,255,255,0.5)',
                  lineHeight: 1.6,
                }}>
                  <span style={{ color: '#c5a47e', fontWeight: 600 }}>Admin Credentials</span><br />
                  Username: <span style={{ color: '#fff', fontFamily: 'monospace' }}>admin</span>&nbsp;&nbsp;|&nbsp;&nbsp;Password: <span style={{ color: '#fff', fontFamily: 'monospace' }}>admin123</span>
                </div>
              )}
              <input
                type="text"
                className="ea-auth-input"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <input
                type="password"
                className="ea-auth-input"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button type="submit" className="ea-auth-proceed-btn" disabled={loading}>
                {loading ? 'Signing in...' : role === 'admin' ? 'Sign In as Admin' : 'Sign In'}
              </button>
            </form>

            <p className="ea-auth-terms">
              By proceeding, you agree with our{' '}
              <a href="#" className="ea-auth-link">Terms and Conditions</a> &{' '}
              <a href="#" className="ea-auth-link">Privacy Policy</a>.
            </p>

            <p className="ea-auth-switch">
              Don't have an account?{' '}
              <Link to="/register" className="ea-auth-link">Register here</Link>
            </p>
          </div>
          <p className="ea-auth-copyright">&copy; {new Date().getFullYear()} ImperialAccess</p>
        </div>
      </div>

      <Link to="/" className="ea-auth-back">&larr; Back to Home</Link>
    </div>
  )
}

export default LoginPage
