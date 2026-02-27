import React, { useState } from 'react'

const FaceRegister: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'capturing' | 'done'>('idle')
  const [progress, setProgress] = useState(0)

  const startCapture = () => {
    setStatus('capturing')
    // Simulate face capture progress
    let p = 0
    const interval = setInterval(() => {
      p += 2
      setProgress(p)
      if (p >= 100) {
        clearInterval(interval)
        setStatus('done')
      }
    }, 60)
  }

  return (
    <div className="ea-dash-grid">
      <div className="ea-dash-card ea-dash-card-wide">
        <h3 className="ea-dash-card-title">Face Registration</h3>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, margin: '0 0 20px' }}>
          Register your face for hands-free lounge access. Position your face within the frame and stay still.
        </p>

        <div style={{ display: 'flex', gap: 28, alignItems: 'flex-start' }}>
          {/* Camera area */}
          <div style={{
            flex: '0 0 480px',
            aspectRatio: '4/3',
            borderRadius: 12,
            border: '2px dashed rgba(197,164,126,0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0,0,0,0.3)',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {status === 'idle' && (
              <div style={{ textAlign: 'center' }}>
                <SvgCameraIcon />
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: '12px 0 0' }}>Camera preview</p>
              </div>
            )}
            {status === 'capturing' && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ position: 'relative', width: 120, height: 120, margin: '0 auto 16px' }}>
                  <svg width="120" height="120" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
                    <circle cx="60" cy="60" r="54" fill="none" stroke="#c5a47e" strokeWidth="4"
                      strokeDasharray={`${progress * 3.39} 339`}
                      strokeLinecap="round"
                      transform="rotate(-90 60 60)"
                      style={{ transition: 'stroke-dasharray 0.1s ease' }}
                    />
                  </svg>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700, color: '#c5a47e' }}>
                    {progress}%
                  </div>
                </div>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>Capturing face embeddings...</p>
              </div>
            )}
            {status === 'done' && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(46,204,113,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', border: '2px solid rgba(46,204,113,0.4)' }}>
                  <svg width="28" height="28" fill="none" viewBox="0 0 28 28"><path d="M7 14l5 5 9-9" stroke="#2ecc71" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <p style={{ color: '#2ecc71', fontSize: 15, fontWeight: 600 }}>Face Registered!</p>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>150 embeddings collected</p>
              </div>
            )}
          </div>

          {/* Instructions */}
          <div style={{ flex: 1 }}>
            <h4 style={{ color: '#c5a47e', fontSize: 16, margin: '0 0 16px', fontFamily: 'Cormorant Garamond, serif' }}>Instructions</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {['Ensure good lighting on your face', 'Remove sunglasses and face coverings', 'Look directly at the camera', 'Stay still during capture', 'The process takes about 10 seconds'].map((text, i) => (
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
