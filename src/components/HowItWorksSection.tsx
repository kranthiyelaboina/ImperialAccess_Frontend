import React, { useEffect, useRef, useState } from 'react'

/* Inline SVG icons — professional, no emojis */
const icons = {
  faceId: (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="12" height="4" rx="2" fill="#c5a47e"/>
      <rect x="4" y="4" width="4" height="12" rx="2" fill="#c5a47e"/>
      <rect x="32" y="4" width="12" height="4" rx="2" fill="#c5a47e"/>
      <rect x="40" y="4" width="4" height="12" rx="2" fill="#c5a47e"/>
      <rect x="4" y="40" width="12" height="4" rx="2" fill="#c5a47e"/>
      <rect x="4" y="32" width="4" height="12" rx="2" fill="#c5a47e"/>
      <rect x="32" y="40" width="12" height="4" rx="2" fill="#c5a47e"/>
      <rect x="40" y="32" width="4" height="12" rx="2" fill="#c5a47e"/>
      <circle cx="24" cy="22" r="8" stroke="#c5a47e" strokeWidth="2.5" fill="none"/>
      <path d="M14 36c0-5.523 4.477-10 10-10s10 4.477 10 10" stroke="#c5a47e" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
    </svg>
  ),
  walkIn: (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M30 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0z" fill="#c5a47e"/>
      <path d="M20 16h8l4 12h-4l-2-6-3 8-5 10h-4l6-14-3-6z" fill="#c5a47e" opacity="0.9"/>
      <rect x="36" y="14" width="4" height="24" rx="2" fill="#c5a47e" opacity="0.4"/>
      <rect x="36" y="14" width="10" height="4" rx="2" fill="#c5a47e" opacity="0.4"/>
    </svg>
  ),
  scan: (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="16" stroke="#c5a47e" strokeWidth="2" fill="none" strokeDasharray="4 3"/>
      <circle cx="24" cy="24" r="8" stroke="#c5a47e" strokeWidth="2.5" fill="none"/>
      <circle cx="24" cy="24" r="3" fill="#c5a47e"/>
      <path d="M24 4v6M24 38v6M4 24h6M38 24h6" stroke="#c5a47e" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  check: (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="18" stroke="#c5a47e" strokeWidth="2.5" fill="none"/>
      <path d="M15 24l6 6 12-12" stroke="#c5a47e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  ),
}

const steps = [
  {
    num: '01',
    title: 'Register Your Face',
    desc: 'Guest completes a one-time face enrollment with liveness detection. The system generates a 128-dimensional face embedding stored securely.',
    icon: icons.faceId,
  },
  {
    num: '02',
    title: 'Walk to the Lounge',
    desc: 'Approach any partnered airport lounge. High-res cameras capture your face automatically — no cards, no QR codes, no waiting.',
    icon: icons.walkIn,
  },
  {
    num: '03',
    title: 'Instant Recognition',
    desc: 'DeepFace + OpenCV pipeline matches your face against the member database in under 200ms with 99.7% accuracy.',
    icon: icons.scan,
  },
  {
    num: '04',
    title: 'Access Granted',
    desc: 'Gate opens automatically. Admin dashboard logs entry, activates dining tokens, and notifies lounge staff in real-time.',
    icon: icons.check,
  },
]

const HowItWorksSection: React.FC = () => {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect() } },
      { threshold: 0.15 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="content-bg small" id="HowItWorks">
      <div className="content-section offset" ref={ref}>
        <div className="content-wrapper w-container">
          <div className="heading-box full">
            <div style={{ display: 'block' }} className="hidden">
              <h4 className="h4 no-top-margin center-content" style={{
                transform: visible ? 'translate3d(0, 0, 0)' : 'translate3d(0, 30px, 0)',
                opacity: visible ? 1 : 0,
                transition: 'transform 0.8s ease, opacity 0.8s ease',
              }}>How It Works</h4>
              <p className="center-content" style={{
                opacity: visible ? 0.7 : 0,
                transition: 'opacity 0.8s ease 0.2s',
              }}>Four simple steps from registration to lounge access</p>
            </div>
            <div className="subtitle-box _5-pixels-margin"></div>
            <div className="divider-line"></div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '40px', padding: '40px 0 20px' }}>
            {steps.map((step, i) => (
              <div key={step.num} style={{
                textAlign: 'center',
                transform: visible ? 'translate3d(0, 0, 0)' : 'translate3d(0, 50px, 0)',
                opacity: visible ? 1 : 0,
                transition: `transform 0.8s ease ${0.15 * i}s, opacity 0.8s ease ${0.15 * i}s`,
              }}>
                <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
                  {step.icon}
                </div>
                <div style={{
                  fontFamily: "'Cormorant', serif",
                  fontSize: '14px',
                  letterSpacing: '3px',
                  textTransform: 'uppercase',
                  color: '#c5a47e',
                  marginBottom: '8px',
                }}>Step {step.num}</div>
                <h5 className="h5 medium" style={{ marginBottom: '12px' }}>{step.title}</h5>
                <p className="paragraph-medium">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HowItWorksSection
