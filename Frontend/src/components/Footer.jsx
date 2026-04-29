import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FaInstagram, FaTiktok, FaTwitter, FaYoutube } from 'react-icons/fa'
import { FiShoppingBag, FiGrid, FiStar, FiTruck, FiRefreshCw, FiHelpCircle, FiMail, FiInfo, FiBriefcase, FiShield, FiFileText } from 'react-icons/fi'
import { RiCopperCoinLine } from 'react-icons/ri'
import '../css/Footer.css'

export default function Footer() {
  const navigate = useNavigate()
  const { user } = useAuth()

  return (
    <footer className="footer">

      {/* Top divider glow */}
      <div className="footer-glow-line" />

      <div className="footer-inner">

        {/* Brand col */}
        <div className="footer-brand">
          <div className="footer-logo">
            <span className="footer-logo-icon">🎨</span>
            <span>MEGA T SHIRT<span className="footer-logo-dot">.</span>DESIGNS</span>
          </div>
          <p className="footer-tagline">Wear Bold. Live Free.<br />Define Your Style.</p>
          <div className="footer-socials">
            <a href="#" className="footer-social" title="Instagram"><FaInstagram /></a>
            <a href="#" className="footer-social" title="TikTok"><FaTiktok /></a>
            <a href="#" className="footer-social" title="Twitter"><FaTwitter /></a>
            <a href="#" className="footer-social" title="YouTube"><FaYoutube /></a>
          </div>
          {user && (
            <div className="footer-credits-pill">
              <RiCopperCoinLine className="footer-coin" />
              <span>{(user.credits || 0).toLocaleString()} Credits Available</span>
            </div>
          )}
          <div className="footer-badge">🇵🇰 Made in Pakistan</div>
        </div>

        {/* Shop */}
        <div className="footer-col">
          <h4 className="footer-col-title">Shop</h4>
          <button onClick={() => navigate('/design-lab')}><FiShoppingBag /> Design Lab</button>
          <button onClick={() => navigate('/marketplace')}><FiGrid /> Marketplace</button>
          <button onClick={() => navigate('/membership')}><FiStar /> Membership</button>
        </div>

        {/* Support */}
        <div className="footer-col">
          <h4 className="footer-col-title">Support</h4>
          <button><FiTruck /> Shipping</button>
          <button><FiRefreshCw /> Returns</button>
          <button><FiHelpCircle /> FAQ</button>
          <button><FiMail /> Contact Us</button>
        </div>

        {/* Company */}
        <div className="footer-col">
          <h4 className="footer-col-title">Company</h4>
          <button><FiInfo /> About Us</button>
          <button><FiBriefcase /> Careers</button>
          <button><FiShield /> Privacy Policy</button>
          <button><FiFileText /> Terms of Service</button>
        </div>

      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        <p className="footer-copy">© 2026 Mega T Shirt Designs — All rights reserved</p>
        <div className="footer-legal">
          <button>Privacy</button>
          <button>Terms</button>
          <button>Cookies</button>
        </div>
      </div>

    </footer>
  )
}
