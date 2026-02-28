import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { registerGuest, loginGuest } from '../services/api'

const RegisterPage: React.FC = () => {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '', username: '',
    boarding_pass_no: '', airline: '', flight_number: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await registerGuest({
        username: form.username || form.email.split('@')[0],
        password: form.password,
        full_name: form.name,
        email: form.email,
        phone: form.phone,
        boarding_pass_no: form.boarding_pass_no || undefined,
        airline: form.airline || undefined,
        flight_number: form.flight_number || undefined,
      })
      if (res.success) {
        // Auto-login after registration using real backend
        const username = form.username || form.email.split('@')[0]
        const loginRes = await loginGuest(username, form.password)
        if (loginRes.success) {
          login(loginRes.token, loginRes.user)
          navigate('/guest/face-register')
        }
      }
    } catch (err: any) {
      setError(err?.error || err?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="ea-auth-page">
      <div className="ea-auth-bg">
        <img src="/images/pexels-cottonbro-studio-4325450.jpg" alt="" className="ea-auth-bg-img" />
        <div className="ea-auth-bg-overlay"></div>
      </div>

      <div className="ea-auth-content">
        <div className="ea-auth-left">
          <div className="ea-auth-left-inner">
            <h1 className="ea-auth-hero-title">
              Register Once,<br />
              Access Every<br />
              Premium Lounge
            </h1>
            <div className="ea-auth-tags">
              <span className="ea-auth-tag ea-auth-tag-active">Guest Registration</span>
              <span className="ea-auth-tag">Face Enrollment</span>
              <span className="ea-auth-tag">Instant Access</span>
            </div>
            <p className="ea-auth-tagline">
              Set up your face ID in seconds. Welcome to hands-free travel.
            </p>
          </div>
        </div>

        <div className="ea-auth-right">
          <div className="ea-auth-card">
            <div className="ea-auth-card-logo">
              <img src="/images/logo.png" alt="ImperialAccess" style={{ height: 72, width: 'auto' }} />
            </div>
            <h2 className="ea-auth-card-title">Create Account</h2>
            <p className="ea-auth-card-subtitle">Register as a guest to get started</p>

            <form onSubmit={handleRegister}>
              {error && (
                <div style={{ color: '#e74c3c', fontSize: 13, marginBottom: 10, textAlign: 'left' }}>{error}</div>
              )}
              <input type="text" className="ea-auth-input" placeholder="Full Name" name="name" value={form.name} onChange={handleChange} required />
              <input type="email" className="ea-auth-input" placeholder="Email Address" name="email" value={form.email} onChange={handleChange} required />
              <input type="tel" className="ea-auth-input" placeholder="Phone Number" name="phone" value={form.phone} onChange={handleChange} required />
              <input type="text" className="ea-auth-input" placeholder="Username" name="username" value={form.username} onChange={handleChange} />
              <input type="password" className="ea-auth-input" placeholder="Password" name="password" value={form.password} onChange={handleChange} required />
              <input type="text" className="ea-auth-input" placeholder="Boarding Pass No. (optional)" name="boarding_pass_no" value={form.boarding_pass_no} onChange={handleChange} />
              <div style={{ display: 'flex', gap: 8 }}>
                <input type="text" className="ea-auth-input" placeholder="Airline" name="airline" value={form.airline} onChange={handleChange} style={{ flex: 1 }} />
                <input type="text" className="ea-auth-input" placeholder="Flight No." name="flight_number" value={form.flight_number} onChange={handleChange} style={{ flex: 1 }} />
              </div>

              <button type="submit" className="ea-auth-proceed-btn" disabled={loading}>
                {loading ? 'Registering...' : 'Register'}
              </button>
            </form>

            <p className="ea-auth-terms">
              By registering, you agree with our{' '}
              <a href="#" className="ea-auth-link">Terms and Conditions</a> &{' '}
              <a href="#" className="ea-auth-link">Privacy Policy</a>.
            </p>

            <p className="ea-auth-switch">
              Already have an account?{' '}
              <Link to="/login" className="ea-auth-link">Login here</Link>
            </p>
          </div>
          <p className="ea-auth-copyright">&copy; {new Date().getFullYear()} ImperialAccess</p>
        </div>
      </div>

      <Link to="/" className="ea-auth-back">&larr; Back to Home</Link>
    </div>
  )
}

export default RegisterPage
