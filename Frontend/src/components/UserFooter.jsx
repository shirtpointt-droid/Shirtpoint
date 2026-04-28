import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FaInstagram, FaTiktok, FaTwitter, FaArrowUp } from 'react-icons/fa'
import { FiHome, FiGrid, FiSettings, FiUser } from 'react-icons/fi'
import { RiScissorsFill, RiVipCrownFill, RiCopperCoinLine } from 'react-icons/ri'
import '../css/UserFooter.css'

const LINKS = [
  {
    title: 'Navigate',
    items: [
      { label: 'Home',        path: '/user-home',   icon: <FiHome /> },
      { label: 'Design Lab',  path: '/design-lab',  icon: <RiScissorsFill /> },
      { label: 'Marketplace', path: '/marketplace', icon: <FiGrid /> },
      { label: 'Membership',  path: '/membership',  icon: <RiVipCrownFill /> },
    ]
  },
  {
    title: 'Account',
    items: [
      { label: 'My Profile',  path: '/profile',   icon: <FiUser /> },
      { label: 'Settings',    path: '/settings',  icon: <FiSettings /> },
    ]
  },
  {
    title: 'Support',
    items: [
      { label: 'FAQ',         path: '#' },
      { label: 'Contact Us',  path: '#' },
      { label: 'Shipping',    path: '#' },
      { label: 'Returns',     path: '#' },
    ]
  },
]

export default function UserFooter() {
  const { user } = useAuth()
  const navigate = useNavigate()

  return (
    <footer className="uf-footer">

      {/* Top: Brand + Credits */}
      <div className="uf-top">
        <div className="uf-brand">
          <h2 className="uf-logo">👕 T-SHIRT<span className="uf-dot">.</span>POINT</h2>
          <p className="uf-tagline">Wear Bold. Live Free. Define Your Style.</p>
          {user && (
            <div className="uf-credits-pill">
              <RiCopperCoinLine className="uf-coin" />
              <span>{(user.credits || 0).toLocaleString()} Credits Available</span>
            </div>
          )}
          <div className="uf-socials">
            <a href="#" className="uf-social"><FaInstagram /></a>
            <a href="#" className="uf-social"><FaTiktok /></a>
            <a href="#" className="uf-social"><FaTwitter /></a>
          </div>
        </div>

        {/* Links */}
        {LINKS.map(col => (
          <div key={col.title} className="uf-col">
            <h4 className="uf-col-title">{col.title}</h4>
            {col.items.map(item => (
              <button key={item.label} className="uf-link"
                onClick={() => item.path !== '#' && navigate(item.path)}>
                {item.icon && <span className="uf-link-icon">{item.icon}</span>}
                {item.label}
              </button>
            ))}
          </div>
        ))}

        {/* Back to Top */}
        <div className="uf-col uf-col-top">
          <button className="uf-top-btn"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <FaArrowUp /> Top
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="uf-divider" />

      {/* Bottom */}
      <div className="uf-bottom">
        <p className="uf-copy">© 2024 T-SHIRT POINT — MADE IN PAKISTAN 🇵🇰</p>
        <div className="uf-legal">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Cookie Policy</a>
        </div>
      </div>

      {/* Watermark */}
      <h1 className="uf-watermark">T-SHIRT POINT</h1>

    </footer>
  )
}
