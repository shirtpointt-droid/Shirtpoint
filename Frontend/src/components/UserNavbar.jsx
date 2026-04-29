import React, { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { FiShoppingCart, FiHome, FiGrid, FiLogOut, FiUser, FiMenu, FiX, FiSettings, FiSun, FiMoon } from 'react-icons/fi'
import { RiCopperCoinLine, RiVipCrownFill, RiScissorsFill } from 'react-icons/ri'
import '../css/UserNavbar.css'

const NAV_LINKS = [
  { label: 'Home',        path: '/user-home',   icon: <FiHome /> },
  { label: 'Design Lab',  path: '/design-lab',  icon: <RiScissorsFill /> },
  { label: 'Seller Place', path: '/marketplace', icon: <FiGrid /> },
  { label: 'Membership',  path: '/membership',  icon: <RiVipCrownFill /> },
]

export default function UserNavbar() {
  const { user, logout } = useAuth()
  const { theme, toggle } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const [dropdown, setDropdown] = useState(false)
  const [mobileMenu, setMobileMenu] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const dropRef = useRef()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const handler = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setDropdown(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = () => { logout(); navigate('/') }

  const initials = user?.name ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : 'U'

  return (
    <>
      <nav className={`unav ${scrolled ? 'unav-scrolled' : ''}`} data-theme={theme}>
        <div className="unav-inner">

          {/* Logo */}
          <div className="unav-logo" onClick={() => navigate('/user-home')}>
            👕 <span>T-SHIRT</span><span className="unav-dot">.</span><span>POINT</span>
          </div>

          {/* Desktop Links */}
          <div className="unav-links">
            {NAV_LINKS.map(l => (
              <button key={l.path}
                className={`unav-link ${location.pathname === l.path ? 'active' : ''}`}
                onClick={() => navigate(l.path)}
              >
                {l.icon} {l.label}
              </button>
            ))}
          </div>

          {/* Right Actions */}
          <div className="unav-actions">

            {/* Theme Toggle */}
            <button className="unav-theme-btn" onClick={toggle} title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}>
              {theme === 'dark' ? <FiSun /> : <FiMoon />}
            </button>

            {/* Cart */}
            <div className="unav-cart" onClick={() => navigate('/cart')}>
              <FiShoppingCart />
              <span className="unav-cart-badge">0</span>
            </div>

            {/* User Info Pill */}
            <div className="unav-user-pill" ref={dropRef} onClick={() => setDropdown(d => !d)}>
              <div className="unav-avatar">
                {user?.photo ? <img src={user.photo} alt="avatar" /> : <span>{initials}</span>}
                {user?.isPro && <div className="unav-pro-badge"><RiVipCrownFill /></div>}
              </div>
              <div className="unav-pill-info">
                <span className="unav-pill-name">{user?.name || 'User'}</span>
                <span className="unav-pill-credits"><RiCopperCoinLine /> {(user?.credits || 0).toLocaleString()}</span>
              </div>

              {dropdown && (
                <div className="unav-dropdown">
                  <div className="unav-dropdown-header">
                    <div className="unav-dropdown-avatar">
                      {user?.photo ? <img src={user.photo} alt="" /> : <span>{initials}</span>}
                    </div>
                    <div>
                      <p className="unav-dropdown-name">{user?.name}</p>
                      <p className="unav-dropdown-email">{user?.email}</p>
                    </div>
                  </div>
                  <div className="unav-dropdown-credits">
                    <RiCopperCoinLine className="unav-coin" />
                    <span>{(user?.credits || 0).toLocaleString()} Credits</span>
                  </div>
                  <div className="unav-dropdown-divider" />
                  <button className="unav-dropdown-item" onClick={() => { navigate('/profile'); setDropdown(false) }}>
                    <FiUser /> My Profile
                  </button>
                  <button className="unav-dropdown-item" onClick={() => { navigate('/settings'); setDropdown(false) }}>
                    <FiSettings /> Settings
                  </button>
                  <button className="unav-dropdown-item logout" onClick={handleLogout}>
                    <FiLogOut /> Logout
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Hamburger */}
            <button className="unav-hamburger" onClick={() => setMobileMenu(m => !m)}>
              {mobileMenu ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenu && (
          <div className="unav-mobile">
            <div className="unav-mobile-user">
              <div className="unav-mobile-avatar">
                {user?.photo ? <img src={user.photo} alt="" /> : <span>{initials}</span>}
              </div>
              <div>
                <p className="unav-mobile-name">{user?.name}</p>
                <div className="unav-mobile-credits"><RiCopperCoinLine /> {(user?.credits || 0).toLocaleString()} Credits</div>
              </div>
            </div>
            <div className="unav-mobile-divider" />
            {NAV_LINKS.map(l => (
              <button key={l.path} className={`unav-mobile-link ${location.pathname === l.path ? 'active' : ''}`}
                onClick={() => { navigate(l.path); setMobileMenu(false) }}>
                {l.icon} {l.label}
              </button>
            ))}
            <div className="unav-mobile-divider" />
            <button className="unav-mobile-logout" onClick={handleLogout}><FiLogOut /> Logout</button>
          </div>
        )}
      </nav>
    </>
  )
}
