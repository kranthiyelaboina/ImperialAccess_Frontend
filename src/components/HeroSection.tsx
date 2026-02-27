import React, { useEffect, useState } from 'react'

/*
 * Two-sentence continuous exchange loop using CSS @keyframes.
 * When one sentence exits upward, the other enters from below simultaneously.
 * Using CSS animation (not transition) avoids the browser batching issue
 * where transition + transform changes in the same frame get skipped.
 */
const quotes = [
  { top: 'Detect.', bottom: 'Premium Access.' },
  { top: 'Recognize.', bottom: 'Unlock Privilege.' },
]

const HOLD_DUR = 2800 // ms — how long text stays visible
const ANIM_DUR = 700  // ms — slide in/out duration
const CYCLE    = HOLD_DUR + ANIM_DUR // total per quote before swap

type QuoteState = 'enter' | 'show' | 'exit' | 'hidden'

const HeroSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [qState, setQState] = useState<QuoteState>('hidden')
  const [animReady, setAnimReady] = useState(false)
  const [onLoadBgVisible, setOnLoadBgVisible] = useState(true)
  const [showScrollDown, setShowScrollDown] = useState(false)

  // Kick-off after initial background fade
  useEffect(() => {
    const t = setTimeout(() => {
      setOnLoadBgVisible(false)
      setAnimReady(true)
      setQState('enter')
    }, 1000)
    return () => clearTimeout(t)
  }, [])

  // Scroll-down hint
  useEffect(() => {
    const h = () => {
      const y = window.scrollY
      setShowScrollDown(y > 10 && y < window.innerHeight * 0.7)
    }
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  // State machine: enter → show → exit → (swap index, enter)
  useEffect(() => {
    if (!animReady) return
    let t: number
    if (qState === 'enter') {
      t = window.setTimeout(() => setQState('show'), ANIM_DUR)
    } else if (qState === 'show') {
      t = window.setTimeout(() => setQState('exit'), HOLD_DUR)
    } else if (qState === 'exit') {
      t = window.setTimeout(() => {
        setCurrentIndex(prev => (prev + 1) % quotes.length)
        setQState('enter')
      }, ANIM_DUR)
    }
    return () => clearTimeout(t)
  }, [qState, animReady])

  const nextIndex = (currentIndex + 1) % quotes.length

  /*
   * Build style for each quote index.
   * Uses CSS animation names defined in a <style> tag below.
   */
  const getStyle = (index: number): React.CSSProperties => {
    const base: React.CSSProperties = {
      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
      willChange: 'transform, opacity',
      display: 'block', // override Webflow .top-2/.bottom-2 { display:none }
    }

    if (!animReady) {
      return { ...base, opacity: 0, transform: 'translate3d(0, 110%, 0)' }
    }

    const isActive = index === currentIndex

    if (isActive) {
      if (qState === 'enter') {
        return {
          ...base,
          animation: `heroSlideIn ${ANIM_DUR}ms cubic-bezier(.4,0,.2,1) forwards`,
        }
      }
      if (qState === 'show') {
        return { ...base, opacity: 1, transform: 'translate3d(0, 0, 0)' }
      }
      if (qState === 'exit') {
        return {
          ...base,
          animation: `heroSlideOut ${ANIM_DUR}ms cubic-bezier(.4,0,.2,1) forwards`,
        }
      }
    }

    // The NEXT quote enters while the current exits
    if (index === nextIndex && qState === 'exit') {
      return {
        ...base,
        animation: `heroSlideIn ${ANIM_DUR}ms cubic-bezier(.4,0,.2,1) forwards`,
      }
    }

    // Everything else: hidden below
    return { ...base, opacity: 0, transform: 'translate3d(0, 110%, 0)' }
  }

  return (
    <div id="Top" className="hero-section home">
      {/* Keyframes for hero text animation */}
      <style>{`
        @keyframes heroSlideIn {
          from { opacity: 0; transform: translate3d(0, 110%, 0); }
          to   { opacity: 1; transform: translate3d(0, 0, 0); }
        }
        @keyframes heroSlideOut {
          from { opacity: 1; transform: translate3d(0, 0, 0); }
          to   { opacity: 0; transform: translate3d(0, -110%, 0); }
        }
      `}</style>
      <a href="#Intro" className="hero-link-block main w-inline-block">
        <div className="background-video-2 w-background-video w-background-video-atom">
          <video autoPlay loop muted playsInline style={{ objectFit: 'cover', width: '100%', height: '100%' }}>
            <source src="/media/dreamfolks_video.mp4" type="video/mp4" />
          </video>
        </div>
      </a>
      <div style={{ opacity: 0 }} className="hero-image-scale home"></div>
      <div className="dark-on-scroll"></div>
      <div className="on-load-bg" style={{ display: 'block', opacity: onLoadBgVisible ? 1 : 0, transition: 'opacity 0.8s ease', pointerEvents: onLoadBgVisible ? 'auto' : 'none' }}></div>
      <div className="content-wrapper w-container">
        <div className="hero-column">
          <div className="hero-inner-padding">
            <div className="max-540-pixels">
              {/* Top rotating word */}
              <div className="hidden-hero top" style={{ display: 'block' }}>
                {quotes.map((q, i) => (
                  <div key={q.top} className={`top-${i + 1}`} style={getStyle(i)}>
                    <h1 className="bottom-word">{q.top}<br /></h1>
                  </div>
                ))}
              </div>
              {/* Bottom rotating word */}
              <div className="hidden-hero">
                {quotes.map((q, i) => (
                  <div key={q.bottom} className={`bottom-${i + 1}`} style={getStyle(i)}>
                    <h1 className="bottom-word">{q.bottom}</h1>
                  </div>
                ))}
              </div>
              {/* Subtitle */}
              <div className="hero-box-subtitle">
                <div style={{ display: 'block' }} className="hidden">
                  <p className="hero-subtitle" style={{
                    transform: animReady ? 'translate3d(0, 0, 0)' : 'translate3d(0, 100%, 0)',
                    opacity: animReady ? 1 : 0,
                    transition: 'transform 1s ease 0.3s, opacity 1s ease 0.3s',
                  }}>
                    AI-powered face recognition for premium airport lounge access.
                  </p>
                </div>
              </div>
              <div className="signature-box"></div>
            </div>
            <div className="button-box less-margin plus">
              <a href="#Features" className="w-inline-block" onClick={(e) => { e.preventDefault(); document.getElementById('Features')?.scrollIntoView({ behavior: 'smooth' }) }}>
                <img src="/images/access-your-benefits.svg" alt="Explore Features" />
              </a>
            </div>
          </div>
        </div>
      </div>
      {/* Scroll Down — anchored at bottom of video background */}
      <div style={{
        position: 'absolute',
        bottom: 48,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        opacity: showScrollDown ? 1 : 0,
        transition: 'opacity 0.5s ease',
        pointerEvents: 'none',
        zIndex: 5,
      }}>
        <div className="scroll-down" style={{ marginTop: 0, fontSize: 16, letterSpacing: 3, textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)' }}>Scroll Down</div>
      </div>
    </div>
  )
}

export default HeroSection
