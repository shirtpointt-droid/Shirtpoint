import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { FaInstagram, FaTiktok, FaTwitter, FaArrowUp } from 'react-icons/fa'
import '../css/Footer.css'

function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const navigate = useNavigate()

  const handleSubscribe = () => {
    if (email.trim()) { setSubscribed(true); setEmail('') }
  }

  return (
    <footer className="footer">

      {/* Big CTA + Newsletter */}
      <div className="footer-top">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <p className="footer-eyebrow">Stay in the loop</p>
          <h2 className="footer-cta">JOIN THE<br /><span className="footer-cta-outline">CREATIVE LAB.</span></h2>
          <p className="footer-cta-sub">Naye drops aur exclusive offers ki updates ke liye subscribe karein.</p>
          <button className="footer-signup-btn" onClick={() => navigate('/signup')}>Create Account →</button>
        </motion.div>

        <motion.div className="footer-newsletter"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {subscribed
            ? <p className="footer-subscribed">✅ Subscribed! Thank you.</p>
            : <>
                <div className="footer-input-wrap">
                  <input
                    type="email"
                    placeholder="YOUR EMAIL"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSubscribe()}
                    className="footer-input"
                  />
                  <button className="footer-input-btn" onClick={() => navigate('/signup')}>SIGN UP →</button>
                </div>
                <p className="footer-input-hint">No spam. Unsubscribe anytime.</p>
              </>
          }
        </motion.div>
      </div>

      {/* Links Grid */}
      <div className="footer-grid">
        <div className="footer-col">
          <h4 className="footer-col-title">Navigation</h4>
          <a href="#">Shop All</a>
          <a href="#">Customizer</a>
          <a href="#">3D Studio</a>
          <a href="#">New Arrivals</a>
        </div>
        <div className="footer-col">
          <h4 className="footer-col-title">Support</h4>
          <a href="#">Shipping</a>
          <a href="#">Returns</a>
          <a href="#">Contact Us</a>
          <a href="#">FAQ</a>
        </div>
        <div className="footer-col">
          <h4 className="footer-col-title">Company</h4>
          <a href="#">About Us</a>
          <a href="#">Careers</a>
          <a href="#">Press</a>
          <a href="#">Blog</a>
        </div>
        <div className="footer-col footer-col-right">
          <h4 className="footer-col-title">Follow Us</h4>
          <div className="footer-socials">
            <a href="#" className="footer-social-btn"><FaInstagram /></a>
            <a href="#" className="footer-social-btn"><FaTiktok /></a>
            <a href="#" className="footer-social-btn"><FaTwitter /></a>
          </div>
          <button className="footer-top-btn" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <FaArrowUp /> Back to Top
          </button>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <p className="footer-copy">© 2024 T-SHIRT POINT — MADE IN PAKISTAN</p>
        <div className="footer-legal">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>
      </div>

      {/* Massive Watermark */}
      <h1 className="footer-watermark">T-SHIRT POINT</h1>

    </footer>
  )
}

export default Footer
