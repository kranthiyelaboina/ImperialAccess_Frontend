import React, { useState, useRef, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getRegisterFeedUrl, conciergeTTS } from '../../services/api'

const API_BASE = import.meta.env.VITE_API_URL || ''

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem('ea_token')
  const h: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) h['Authorization'] = `Bearer ${token}`
  return h
}

const FaceRegister: React.FC = () => {
  const { user } = useAuth()
  const [status, setStatus] = useState<'idle' | 'capturing' | 'done' | 'error'>('idle')
  const [progress, setProgress] = useState(0)
  const [collected, setCollected] = useState(0)
  const [message, setMessage] = useState('')
  const [feedError, setFeedError] = useState(false)

  const pollRef = useRef<number>(0)
  const statusRef = useRef(status)
  statusRef.current = status

  /* ── Cleanup polling on unmount ── */
  useEffect(() => {
    return () => { if (pollRef.current) clearInterval(pollRef.current) }
  }, [])

  /* ── Start face capture (agent-based) ── */
  const startCapture = async () => {
    if (!user?.guest_id) { setStatus('error'); setMessage('Guest ID not found.'); return }

    setStatus('capturing')
    setProgress(0); setCollected(0); setMessage(''); setFeedError(false)

    // 1) Start registration session on backend (uses agent's camera)
    try {
      const res = await fetch(`${API_BASE}/api/register_guest/face_start`, {
        method: 'POST', headers: authHeaders(),
        body: JSON.stringify({ guest_id: user.guest_id, name: user.full_name }),
      })
      const d = await res.json()
      if (!d.success) { setStatus('error'); setMessage(d.error || 'Failed to start'); return }
    } catch {
      setStatus('error'); setMessage('Network error — is the backend running?'); return
    }

    // 2) Poll for progress every 500ms
    pollRef.current = window.setInterval(async () => {
      if (statusRef.current !== 'capturing') return
      try {
        const res = await fetch(`${API_BASE}/api/register_guest/face_progress`, {
          headers: authHeaders(),
        })
        const d = await res.json()
        if (!d.success) return
        setCollected(d.collected); setProgress(d.percent)

        if (d.done) {
          clearInterval(pollRef.current)
          // 3) Finalize — save embeddings & update profile
          const fin = await fetch(`${API_BASE}/api/register_guest/face_finish`, {
            method: 'POST', headers: authHeaders(),
            body: JSON.stringify({ guest_id: user!.guest_id, name: user!.full_name }),
          })
          const fd = await fin.json()
          if (fd.success) {
            setCollected(fd.embeddings_collected); setProgress(100); setStatus('done')
            // TTS announcement for successful face registration
            try {
              const name = user?.full_name || 'Guest'
              const ttsText = `Face registration complete, ${name}. You are now set for hands-free lounge access. Welcome to Imperial Access.`
              const audioBuf = await conciergeTTS(ttsText)
              const blob = new Blob([audioBuf], { type: 'audio/wav' })
              const url = URL.createObjectURL(blob)
              const audio = new Audio(url)
              audio.onended = () => URL.revokeObjectURL(url)
              audio.play().catch(() => {})
            } catch { /* TTS is optional, don't block UI */ }
          } else {
            setStatus('error'); setMessage(fd.error || 'Failed to save face data')
          }
        }
      } catch { /* continue polling */ }
    }, 500)
  }

  return (
    <div className="ea-dash-grid">
      <div className="ea-dash-card ea-dash-card-wide">
        <h3 className="ea-dash-card-title">Face Registration</h3>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, margin: '0 0 20px' }}>
          Register your face for hands-free lounge access. Position your face within the frame and follow the instructions.
        </p>

        <div style={{ display: 'flex', gap: 28, alignItems: 'flex-start' }}>
          {/* Camera area — MJPEG from backend (shares camera with agent) */}
          <div style={{
            flex: '0 0 480px', aspectRatio: '4/3', borderRadius: 12,
            border: '2px dashed rgba(197,164,126,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0,0,0,0.3)', position: 'relative', overflow: 'hidden',
          }}>

            {/* ── Idle placeholder ── */}
            {status === 'idle' && (
              <div style={{ textAlign: 'center', padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <SvgCameraIcon />
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, margin: '14px 0 4px', fontWeight: 500 }}>Camera Preview</p>
                <p style={{ color: 'rgba(197,164,126,0.5)', fontSize: 12, maxWidth: 260 }}>Click "Start Face Capture" to activate the camera and begin registration</p>
              </div>
            )}

            {/* ── Live registration feed (only during capture) ── */}
            {status === 'capturing' && !feedError && (
              <img
                src={`${getRegisterFeedUrl()}?t=${Date.now()}`}
                alt="Registration Feed"
                style={{
                  width: '100%', height: '100%', objectFit: 'cover',
                  position: 'absolute', inset: 0,
                }}
                onError={() => setFeedError(true)}
              />
            )}

            {/* Feed error during capture */}
            {status === 'capturing' && feedError && (
              <div style={{ textAlign: 'center', padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <SvgCameraIcon />
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: '12px 0 4px' }}>Camera feed unavailable</p>
                <p style={{ color: 'rgba(197,164,126,0.5)', fontSize: 12 }}>Make sure the backend agent is running</p>
              </div>
            )}

            {/* ── Progress overlay during capture ── */}
            {status === 'capturing' && !feedError && (
              <>
                {/* Bottom progress bar */}
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 6, background: 'rgba(40,40,40,0.8)' }}>
                  <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg, #c5a47e, #e8d5b7)', transition: 'width 0.3s ease', borderRadius: '0 3px 3px 0' }} />
                </div>
                {/* REC indicator */}
                <div style={{ position: 'absolute', bottom: 12, right: 14, display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(0,0,0,0.6)', borderRadius: 6, padding: '4px 10px' }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#e74c3c', boxShadow: '0 0 6px #e74c3c', animation: 'pulse 1.5s infinite' }} />
                  <span style={{ color: '#fff', fontSize: 11, fontWeight: 700, letterSpacing: 1 }}>REC</span>
                </div>
                <style>{`@keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }`}</style>
              </>
            )}

            {/* ── Done state ── */}
            {status === 'done' && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(46,204,113,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', border: '2px solid rgba(46,204,113,0.4)' }}>
                  <svg width="28" height="28" fill="none" viewBox="0 0 28 28"><path d="M7 14l5 5 9-9" stroke="#2ecc71" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <p style={{ color: '#2ecc71', fontSize: 15, fontWeight: 600 }}>Face Registered!</p>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>{collected} embeddings collected</p>
              </div>
            )}

            {/* ── Error state ── */}
            {status === 'error' && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(231,76,60,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', border: '2px solid rgba(231,76,60,0.4)' }}>
                  <svg width="28" height="28" fill="none" viewBox="0 0 28 28"><path d="M8 8l12 12M20 8L8 20" stroke="#e74c3c" strokeWidth="3" strokeLinecap="round"/></svg>
                </div>
                <p style={{ color: '#e74c3c', fontSize: 15, fontWeight: 600 }}>Registration Failed</p>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>{message}</p>
              </div>
            )}
          </div>

          {/* Instructions */}
          <div style={{ flex: 1 }}>
            <h4 style={{ color: '#c5a47e', fontSize: 16, margin: '0 0 16px', fontFamily: 'Cormorant Garamond, serif' }}>Instructions</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                'Ensure good lighting on your face',
                'Remove sunglasses and face coverings',
                'Look directly at the camera',
                'Slowly move your head left, right, up, down',
                'The process takes about 10–15 seconds',
              ].map((text, i) => (
                <li key={i} style={{ display: 'flex', gap: 10, fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>
                  <span style={{ color: '#c5a47e', fontWeight: 600 }}>{i + 1}.</span>
                  {text}
                </li>
              ))}
            </ul>
            {status === 'idle' && (
              <button className="ea-dash-btn ea-dash-btn-gold" style={{ marginTop: 24 }} onClick={startCapture}>
                Start Face Capture
              </button>
            )}
            {status === 'capturing' && (
              <div style={{ marginTop: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>
                  <span>Embeddings: {collected} / 150</span>
                  <span>{progress}%</span>
                </div>
                <div style={{ height: 6, borderRadius: 4, background: 'rgba(255,255,255,0.08)' }}>
                  <div style={{ height: '100%', borderRadius: 4, background: '#c5a47e', width: `${progress}%`, transition: 'width 0.3s ease' }} />
                </div>
              </div>
            )}
            {status === 'error' && (
              <button className="ea-dash-btn ea-dash-btn-gold" style={{ marginTop: 24 }} onClick={() => { setStatus('idle'); setProgress(0); setFeedError(false) }}>
                Try Again
              </button>
            )}
            {status === 'done' && (
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginTop: 20 }}>
                You can now use face recognition for lounge entry.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function SvgCameraIcon() {
  return <svg width="48" height="48" fill="none" viewBox="0 0 48 48"><rect x="4" y="12" width="40" height="28" rx="4" stroke="#c5a47e" strokeWidth="2.5"/><circle cx="24" cy="26" r="7" stroke="#c5a47e" strokeWidth="2.5"/><path d="M16 12l2-4h12l2 4" stroke="#c5a47e" strokeWidth="2.5" strokeLinejoin="round"/></svg>
}

export default FaceRegister
