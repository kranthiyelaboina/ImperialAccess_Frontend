import React, { useEffect, useRef, useState } from 'react'

interface Feature {
  image: string
  imageSrcSet: string
  hoverClass: string
  number: number
  title: string
  description: string
}

const adminFeatures: Feature[] = [
  {
    image: '/images/3_3.webp',
    imageSrcSet: '/images/3_3.webp 500w, /images/3_3.webp 800w',
    hoverClass: 'hover-image about-us _01',
    number: 1,
    title: 'Live Camera Feed & Multi-Guest Detection',
    description: 'High-resolution camera integration for simultaneous multi-face detection and identification in real-time lounge entry footage.',
  },
  {
    image: '/images/otas-and-airlines-6569f9cf3a4b5.webp',
    imageSrcSet: '/images/otas-and-airlines-6569f9cf3a4b5-p-500.webp 500w, /images/otas-and-airlines-6569f9cf3a4b5.webp 800w',
    hoverClass: 'hover-image about-us-2',
    number: 2,
    title: 'Admin Dashboard & Permit Control',
    description: 'Centralized dashboard with auto-detected guest details, access permit management, and real-time attendance tracking.',
  },
  {
    image: '/images/1_1.webp',
    imageSrcSet: '/images/1_1.webp 500w, /images/1_1.webp 800w',
    hoverClass: 'hover-image about-us-3 _03',
    number: 3,
    title: 'Dining Token Management',
    description: 'Digital dining token system for lounge F&B services — issue, validate, and track meal tokens for every verified guest.',
  },
]

const userFeatures: Feature[] = [
  {
    image: '/images/face.png',
    imageSrcSet: '/images/face.png 500w, /images/face.png 800w',
    hoverClass: 'hover-image about-us',
    number: 1,
    title: 'Face Registration & Identity Setup',
    description: 'Secure one-time face data registration with liveness detection. Your biometric template is encrypted and stored with military-grade security.',
  },
  {
    image: '/images/lounge.webp',
    imageSrcSet: '/images/lounge.webp 500w, /images/lounge.webp 800w',
    hoverClass: 'hover-image about-us-2 _12',
    number: 2,
    title: 'Lounge Access & Boarding Pass Check',
    description: 'View available lounges, verify boarding pass eligibility, and walk through — your face is your ticket to premium access.',
  },
  {
    image: '/images/banking-p-500.webp',
    imageSrcSet: '/images/banking-p-500.webp 500w, /images/banking-p-500.webp 800w',
    hoverClass: 'hover-image about-us-3',
    number: 3,
    title: 'Payments & Dining Tokens',
    description: 'Seamless in-app payments for lounge upgrades and digital dining tokens for complimentary F&B at partner lounges.',
  },
]

const useScrollAnimation = () => {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect() } },
      { threshold: 0.12 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])
  return { ref, visible }
}

const FeatureCard: React.FC<{ item: Feature; isLast?: boolean; visible: boolean; delay: number }> = ({ item, isLast, visible, delay }) => (
  <div
    className={`intro-about-us${isLast ? ' last' : ''}`}
    style={{
      transform: visible ? 'translate3d(0, 0, 0)' : 'translate3d(0, 40px, 0)',
      opacity: visible ? 1 : 0,
      transition: `transform 0.8s ease ${delay}s, opacity 0.8s ease ${delay}s`,
    }}
  >
    <a href="#" className="intro-image w-inline-block">
      <img src={item.image} loading="lazy" sizes="(max-width: 479px) 100vw, (max-width: 1279px) 30vw, 360px" srcSet={item.imageSrcSet} alt={item.title} />
      <div className={item.hoverClass}></div>
      <div className="top-number" style={{
        transform: visible ? 'translate3d(0, 0, 0)' : 'translate3d(0, -100%, 0)',
        opacity: visible ? 1 : 0,
        transition: `transform 0.6s ease ${delay + 0.3}s, opacity 0.6s ease ${delay + 0.3}s`,
      }}>{item.number}</div>
    </a>
    <h5 className="h5 medium">{item.title}</h5>
    <p className="paragraph-medium">{item.description}</p>
  </div>
)

const FeaturesSection: React.FC = () => {
  const adminAnim = useScrollAnimation()
  const userAnim = useScrollAnimation()
  const headingAnim1 = useScrollAnimation()
  const headingAnim2 = useScrollAnimation()

  return (
    <div id="Features" className="content-section services">
      <div className="content-wrapper w-container">
        {/* Admin Features */}
        <div className="heading-box mediun" ref={headingAnim1.ref}>
          <div style={{ transform: headingAnim1.visible ? 'translate3d(0, 0, 0)' : 'translate3d(0, 115%, 0)', transition: 'transform 0.8s ease' }}>
            <div style={{ display: 'block' }} className="hidden">
              <h4 className="h4 center">Admin Control Panel</h4>
            </div>
            <div className="subtitle-box _10-pixels-margin">
              <p className="paragraph-medium" style={{ textAlign: 'center', opacity: 0.7 }}>Camera feeds, access control, attendance & dining management</p>
            </div>
          </div>
        </div>
        <div className="bottom-line" ref={adminAnim.ref}>
          <div className="flex-center">
            {adminFeatures.map((item, i) => (
              <FeatureCard key={item.title} item={item} isLast={i === adminFeatures.length - 1} visible={adminAnim.visible} delay={i * 0.2} />
            ))}
          </div>
          <div className="divider-line" style={{ transform: adminAnim.visible ? 'translate3d(0, 0, 0)' : 'translate3d(-101%, 0, 0)', transition: 'transform 1.2s ease' }}></div>
        </div>

        {/* User Features */}
        <div className="heading-box mediun" ref={headingAnim2.ref}>
          <div style={{ transform: headingAnim2.visible ? 'translate3d(0, 0, 0)' : 'translate3d(0, 115%, 0)', transition: 'transform 0.8s ease' }}>
            <div style={{ display: 'block' }} className="hidden">
              <h4 className="h4 center">Guest Experience</h4>
            </div>
            <div className="subtitle-box _10-pixels-margin">
              <p className="paragraph-medium" style={{ textAlign: 'center', opacity: 0.7 }}>Register once, access everywhere — face-first premium experience</p>
            </div>
          </div>
        </div>
        <div className="bottom-line" ref={userAnim.ref}>
          <div className="flex-center">
            {userFeatures.map((item, i) => (
              <FeatureCard key={item.title} item={item} isLast={i === userFeatures.length - 1} visible={userAnim.visible} delay={i * 0.2} />
            ))}
          </div>
          <div className="divider-line" style={{ transform: userAnim.visible ? 'translate3d(0, 0, 0)' : 'translate3d(-101%, 0, 0)', transition: 'transform 1.2s ease' }}></div>
        </div>
      </div>
    </div>
  )
}

export default FeaturesSection
