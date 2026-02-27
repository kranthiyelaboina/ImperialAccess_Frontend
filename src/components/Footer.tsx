import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const Footer: React.FC = () => {
  const [year] = useState(new Date().getFullYear())
  const [showGoUp, setShowGoUp] = useState(false)

  useEffect(() => {
    const handleScroll = () => setShowGoUp(window.scrollY > 500)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      <div className="footer">
        <div className="footer-1440-pixels">
          <div>
            <div className="footer-container">
              <div className="footer-expand middle" style={{ justifyContent: 'space-between' }}>
                {/* Brand */}
                <div className="menu">
                  <div style={{ marginBottom: '20px' }}>
                    <img src="/images/logo.png" alt="ImperialAccess" style={{ height: 36, width: 'auto', marginBottom: '16px' }} />
                    <p className="paragraph-medium" style={{ maxWidth: '280px', opacity: 0.6 }}>
                      AI-powered face recognition for premium airport lounge access. Built for the future of travel.
                    </p>
                  </div>
                  <div className="div-block-10" style={{ marginTop: '16px' }}>
                    <a href="#" target="_blank" rel="noreferrer" className="logo-link w-inline-block">
                      <img src="/images/twitter.png" style={{ width: 24 }} loading="lazy" alt="Twitter" />
                    </a>
                    <a href="#" target="_blank" rel="noreferrer" className="logo-link w-inline-block">
                      <img src="/images/linkedin.svg" loading="lazy" alt="LinkedIn" />
                    </a>
                    <a href="#" target="_blank" rel="noreferrer" className="logo-link w-inline-block">
                      <img src="/images/instagram_1.svg" loading="lazy" alt="Instagram" />
                    </a>
                  </div>
                </div>

                {/* Quick Links */}
                <div className="menu">
                  <div className="footer-title">Quick Links</div>
                  <div className="footer-top-margin first">
                    <a href="#Features" className="footer-menu-link w-inline-block">
                      <div>Features</div>
                      <div className="footer-underline"></div>
                    </a>
                  </div>
                  <div className="footer-top-margin first">
                    <a href="#HowItWorks" className="footer-menu-link w-inline-block">
                      <div>How It Works</div>
                      <div className="footer-underline"></div>
                    </a>
                  </div>
                  <div className="footer-top-margin first">
                    <a href="#Requirements" className="footer-menu-link w-inline-block">
                      <div>Why Us</div>
                      <div className="footer-underline"></div>
                    </a>
                  </div>
                  <div className="footer-top-margin first">
                    <a href="#Stats" className="footer-menu-link w-inline-block">
                      <div>Stats</div>
                      <div className="footer-underline"></div>
                    </a>
                  </div>
                </div>

                {/* Account */}
                <div className="menu">
                  <div className="footer-title">Account</div>
                  <div className="footer-top-margin first">
                    <Link to="/login" className="footer-menu-link w-inline-block">
                      <div>Login</div>
                      <div className="footer-underline"></div>
                    </Link>
                  </div>
                  <div className="footer-top-margin first">
                    <Link to="/register" className="footer-menu-link w-inline-block">
                      <div>Register</div>
                      <div className="footer-underline"></div>
                    </Link>
                  </div>
                </div>

                {/* Contact */}
                <div className="menu">
                  <div className="footer-title">Contact</div>
                  <div className="footer-top-margin first" style={{ opacity: 0.6 }}>
                    <p style={{ margin: 0 }}>contact@imperialaccess.com</p>
                  </div>
                  <div className="footer-top-margin first" style={{ opacity: 0.6 }}>
                    <p style={{ margin: 0 }}>+91 800 123 4567</p>
                  </div>
                </div>
              </div>
              <div className="divider-line" style={{ marginTop: '40px' }}></div>
            </div>
            <div className="text-block-3">© {year} ImperialAccess. All rights reserved.</div>
          </div>
        </div>
      </div>
      <a
        href="#Top"
        className="go-up-button w-inline-block"
        style={{ opacity: showGoUp ? 1 : 0, display: showGoUp ? 'flex' : 'none' }}
        onClick={scrollToTop}
      ></a>
    </>
  )
}

export default Footer
