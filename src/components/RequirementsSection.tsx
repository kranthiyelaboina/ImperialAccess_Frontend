import React, { useEffect, useRef, useState } from 'react'
import { HoverEffect, type HoverEffectItem } from './ui/card-hover-effect'

const items: HoverEffectItem[] = [
  {
    title: 'Seamless Premium Entry',
    description:
      'Enable walk-through access for registered members — no physical cards, tickets, or manual identity checks. Just walk in.',
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 3L6 21h10l-2 12 14-18H18l2-12z" stroke="#c5a47e" strokeWidth="2.5" strokeLinejoin="round" fill="none"/>
      </svg>
    ),
  },
  {
    title: 'Reduce Queue Times',
    description:
      'Cut average check-in time from 45 seconds to under 2 seconds with automated face recognition at every entry gate.',
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="18" cy="18" r="14" stroke="#c5a47e" strokeWidth="2.5" fill="none"/>
        <path d="M18 10v9l6 3" stroke="#c5a47e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      </svg>
    ),
  },
  {
    title: 'Enhanced Security',
    description:
      'Multi-layer verification with liveness detection, anti-spoofing measures, and real-time audit trails for every entry point.',
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 3L5 9v9c0 8.5 5.5 14.5 13 17 7.5-2.5 13-8.5 13-17V9L18 3z" stroke="#c5a47e" strokeWidth="2.5" strokeLinejoin="round" fill="none"/>
        <path d="M13 18l3 3 7-7" stroke="#c5a47e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      </svg>
    ),
  },
  {
    title: 'Smart Dining Tokens',
    description:
      'Issue, track and redeem digital dining tokens in real-time. Guests enjoy complimentary meals with zero paperwork.',
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="18" cy="18" r="14" stroke="#c5a47e" strokeWidth="2.5" fill="none"/>
        <path d="M18 10v4M14 14h8M12 20h12" stroke="#c5a47e" strokeWidth="2" strokeLinecap="round" fill="none"/>
        <path d="M14 24h8" stroke="#c5a47e" strokeWidth="2" strokeLinecap="round" fill="none"/>
      </svg>
    ),
  },
  {
    title: 'Real-Time Analytics',
    description:
      'Monitor lounge occupancy, peak hours, guest demographics, and dining usage — all on a single premium dashboard.',
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 30h24" stroke="#c5a47e" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
        <path d="M10 24V16M16 24V12M22 24V8M28 24V14" stroke="#c5a47e" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      </svg>
    ),
  },
  {
    title: 'Multi-Mode AI Agent',
    description:
      'Switch between Gate, Reception, Entry, and Exit modes. The AI adapts its behavior for each scenario automatically.',
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="18" cy="18" r="6" stroke="#c5a47e" strokeWidth="2.5" fill="none"/>
        <path d="M18 4v6M18 26v6M4 18h6M26 18h6M8.6 8.6l4.2 4.2M23.2 23.2l4.2 4.2M27.4 8.6l-4.2 4.2M12.8 23.2l-4.2 4.2" stroke="#c5a47e" strokeWidth="2" strokeLinecap="round" fill="none"/>
      </svg>
    ),
  },
]

const RequirementsSection: React.FC = () => {
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
    <div id="Requirements" className="content-section services" ref={ref}>
      <div className="content-wrapper w-container">
        <div className="heading-box mediun">
          <div style={{
            transform: visible ? 'translate3d(0, 0, 0)' : 'translate3d(0, 115%, 0)',
            transition: 'transform 0.8s ease',
          }}>
            <div style={{ display: 'block' }} className="hidden">
              <h4 className="h4 center">Why ImperialAccess?</h4>
            </div>
            <div className="subtitle-box _10-pixels-margin"></div>
          </div>
        </div>
        <div style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s',
          maxWidth: 1200,
          margin: '0 auto',
          padding: '20px 0 60px',
        }}>
          <HoverEffect items={items} />
        </div>
      </div>
    </div>
  )
}

export default RequirementsSection
