import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiOutlineMenuAlt3, HiOutlineX } from 'react-icons/hi'
import { FiShoppingCart, FiUser, FiBell, FiPlusCircle } from 'react-icons/fi'
import { RiCopperCoinLine, RiVipCrownFill } from 'react-icons/ri'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../css/Navbar.css'

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenu, setMobileMenu] = useState(false)
  const navigate = useNavigate()
  const { user } = useAuth()

  const userCredits = user?.credits || 0
  const isProMember = user?.isPro || false
  const hasNotification = !!user

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
        <div className={`navbar-inner ${isScrolled ? 'navbar-inner-scrolled' : ''}`}>

          {/* Logo */}
          <h1 className="navbar-logo">👕 T-SHIRT<span className="navbar-logo-dot">.</span>POINT</h1>

          {/* Desktop Links */}
          <div className="navbar-links">
            <a href="#" className="navbar-link" onClick={() => navigate('/design-lab')}>Design Lab<span className="navbar-link-line" /></a>
            <a href="#" className="navbar-link">Marketplace<span className="navbar-link-line" /></a>
            <a href="#" className="navbar-link navbar-link-gold">
              <RiVipCrownFill /> Membership
              <span className="navbar-link-line" />
            </a>
          </div>

          {/* Actions */}
          <div className="navbar-actions">

            {/* Login Button - always show */}
            <button className="navbar-create" onClick={() => navigate('/login')}><FiUser /><span>Login</span></button>

            {/* Profile */}
            <div className="navbar-profile" onClick={() => !user && navigate('/login')}>
              <div className="navbar-avatar"><FiUser /></div>
              {isProMember && (
                <div className="navbar-pro-badge"><RiVipCrownFill /></div>
              )}
            </div>

            {/* Cart */}
            <div className="navbar-cart-wrap">
              <FiShoppingCart className="navbar-icon" />
              <span className="navbar-cart-badge">0</span>
            </div>

            {/* Mobile Hamburger */}
            <div className="navbar-mobile-btn" onClick={() => setMobileMenu(!mobileMenu)}>
              {mobileMenu ? <HiOutlineX /> : <HiOutlineMenuAlt3 />}
            </div>
          </div>

        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenu && (
            <motion.div className="navbar-mobile"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <a href="#" className="navbar-mobile-link" onClick={() => { navigate('/design-lab'); setMobileMenu(false) }}>Design Lab</a>
              <a href="#" className="navbar-mobile-link" onClick={() => setMobileMenu(false)}>Marketplace</a>
              <a href="#" className="navbar-mobile-link navbar-mobile-gold" onClick={() => setMobileMenu(false)}>
                <RiVipCrownFill /> Membership
              </a>
              <button className="navbar-mobile-cta" onClick={() => { navigate('/signup'); setMobileMenu(false) }}>Sign Up</button>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Mobile Bottom Tab Bar */}
      <div className="navbar-bottom-bar">
        <a href="#" className="navbar-tab"><FiUser /><span>Profile</span></a>
        <a href="#" className="navbar-tab"><span className="navbar-tab-icon">🏪</span><span>Market</span></a>
        <button className="navbar-tab-create" onClick={() => navigate('/design-lab')}><FiPlusCircle /></button>
        <a href="#" className="navbar-tab">
          <FiBell />
          {hasNotification && <span className="navbar-tab-dot" />}
          <span>Alerts</span>
        </a>
        <a href="#" className="navbar-tab"><FiShoppingCart /><span>Cart</span></a>
      </div>
    </>
  )
}

export default Navbar
