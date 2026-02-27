import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [navVisible, setNavVisible] = useState(true)
  const [scrolled, setScrolled] = useState(false)
  const lastScrollY = useRef(0)
  const location = useLocation()

  // Only apply hide/show on landing page
  const isLanding = location.pathname === '/'

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY
      setScrolled(currentY > 50)

      if (isLanding) {
        if (currentY > lastScrollY.current && currentY > 80) {
          // Scrolling down → hide
          setNavVisible(false)
        } else {
          // Scrolling up → show
          setNavVisible(true)
        }
      }
      lastScrollY.current = currentY
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isLanding])

  const navStyle: React.CSSProperties = {
    transform: isLanding && !navVisible ? 'translateY(-100%)' : 'translateY(0)',
    transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.3s ease',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: scrolled ? 'rgba(0, 0, 0, 0.95)' : 'transparent',
    backdropFilter: scrolled ? 'blur(12px)' : 'none',
  }

  const scrollTo = (id: string) => {
    setMenuOpen(false)
    if (location.pathname !== '/') return
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div style={navStyle}>
      <div
        role="banner"
        className="navbar w-nav"
        style={{ backgroundColor: 'transparent' }}
      >
        <div className="content-wrapper-nav">
          <Link to="/" className="brand w-inline-block w--current">
            <img
              src="/images/logo.png"
              loading="lazy"
              alt="ImperialAccess"
              style={{ height: 72, width: 'auto', maxHeight: '72px' }}
              className="image-20"
            />
          </Link>
          <nav role="navigation" className={`nav-menu w-nav-menu ${menuOpen ? 'w--open' : ''}`}>
            <div className="nav-menu-styling-wrapper">
              <a href="#Features" className="navlink w-inline-block" onClick={(e) => { e.preventDefault(); scrollTo('Features') }}>
                <div className="nav-text">Features</div>
                <div className="underline-hover"></div>
              </a>
              <a href="#HowItWorks" className="navlink w-inline-block" onClick={(e) => { e.preventDefault(); scrollTo('HowItWorks') }}>
                <div className="nav-text">How It Works</div>
                <div className="underline-hover"></div>
              </a>
              <a href="#Requirements" className="navlink w-inline-block" onClick={(e) => { e.preventDefault(); scrollTo('Requirements') }}>
                <div className="nav-text">Why Us</div>
                <div className="underline-hover"></div>
              </a>
              <a href="#Stats" className="navlink w-inline-block" onClick={(e) => { e.preventDefault(); scrollTo('Stats') }}>
                <div className="nav-text">Stats</div>
                <div className="underline-hover"></div>
              </a>
              <Link to="/login" className="navlink w-inline-block">
                <div className="login-nav lOgin-res">Login</div>
              </Link>
            </div>
          </nav>
          <div className="menu-button w-nav-button" onClick={() => setMenuOpen(!menuOpen)}>
            <Link to="/login" className="navlink w-inline-block">
              <div className="login-nav">Login</div>
            </Link>
            <div className="icon-2 w-icon-nav-menu"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar
