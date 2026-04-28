import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import UserNavbar from './UserNavbar'
import { FiShield, FiSmartphone, FiCheck, FiArrowLeft, FiCopy, FiAlertCircle } from 'react-icons/fi'
import '../css/Login.css'

function WavyGrid({ color, bgColor }) {
  const meshRef = useRef()
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const pos = meshRef.current.geometry.attributes.position.array
    for (let i = 0; i < pos.length; i += 3) {
      pos[i + 2] = Math.sin(pos[i] * 0.5 + t) * Math.cos(pos[i + 1] * 0.5 + t) * 0.5
    }
    meshRef.current.geometry.attributes.position.needsUpdate = true
  })
  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 3, 0, 0]} position={[0, 0, -2]}>
      <planeGeometry args={[100, 100, 100, 100]} />
      <meshBasicMaterial color={color} wireframe transparent opacity={0.07} />
    </mesh>
  )
}

export default function TwoFactorSetup() {
  const { user, token, login } = useAuth()
  const { theme } = useTheme()
  const navigate = useNavigate()
  
  const [qr, setQr] = useState('')
  const [secret, setSecret] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    fetchSetup()
  }, [])

  const fetchSetup = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/2fa-setup', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setQr(data.qr)
      setSecret(data.secret)
    } catch {
      setError('Failed to fetch 2FA setup')
    }
  }

  const handleVerify = async (e) => {
    e.preventDefault()
    if (code.length < 6) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('http://localhost:5000/api/auth/2fa-enable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ code })
      })
      const data = await res.json()
      if (!res.ok) { setError(data.message || 'Invalid code'); setLoading(false); return }
      
      setSuccess(true)
      // Update local user state
      login({ ...user, isTwoFactorEnabled: true }, token)
      setTimeout(() => navigate('/settings'), 2000)
    } catch {
      setError('Verification failed')
    }
    setLoading(false)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(secret)
    setCopySuccess(true)
    setTimeout(() => setCopySuccess(false), 2000)
  }

  return (
    <div className="login-wrapper" style={{background: theme === 'light' ? '#fff' : '#050505'}}>
      <div className="login-bg">
        <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
          <WavyGrid color={theme === 'light' ? '#000' : '#f97316'} bgColor={theme === 'light' ? '#fff' : '#050505'} />
        </Canvas>
      </div>

      <UserNavbar />

      <div style={{ position: 'relative', zIndex: 1, paddingTop: '100px', display: 'flex', justifyContent: 'center', width: '100%' }}>
        <motion.div className="login-card" style={{ maxWidth: '500px' }}
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          
          <div className="login-header">
            <div className="setup-icon-wrap"><FiShield /></div>
            <h2 className="login-title">Secure Your Account</h2>
            <p className="login-sub">Authenticator app ke zarye 2FA enable karein</p>
          </div>

          {!success ? (
            <div className="setup-content">
              {/* Steps */}
              <div className="setup-steps">
                <div className="setup-step">
                  <div className="setup-step-num">1</div>
                  <p>Google Authenticator ya Authy app open karein.</p>
                </div>
                <div className="setup-step">
                  <div className="setup-step-num">2</div>
                  <p>Niche diya gaya QR code scan karein ya Key manual dalein.</p>
                </div>
              </div>

              {/* QR Section */}
              <div className="setup-qr-card">
                {qr ? <img src={qr} alt="2FA QR" className="setup-qr" /> : <div className="setup-qr-placeholder" />}
                <div className="setup-secret-wrap" onClick={copyToClipboard}>
                  <code>{secret}</code>
                  <FiCopy className={copySuccess ? 'success' : ''} />
                  {copySuccess && <span className="copy-hint">Copied!</span>}
                </div>
              </div>

              {/* Verify form */}
              <form onSubmit={handleVerify} style={{ marginTop: '2rem' }}>
                <div className="login-field">
                  <label>Initial Verification Code</label>
                  <div className="login-input-wrap">
                    <FiSmartphone className="login-input-icon" />
                    <input type="text" placeholder="000000" maxLength={6} value={code}
                      onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
                      className="setup-verify-input" />
                  </div>
                  {error && <p className="login-error-msg"><FiAlertCircle /> {error}</p>}
                </div>

                <button type="submit" className="login-submit" disabled={loading || code.length < 6}>
                  {loading ? <span className="login-spinner" /> : 'Enable 2FA Now'}
                </button>
              </form>
            </div>
          ) : (
            <motion.div className="setup-success" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="success-circle"><FiCheck /></div>
              <h3>2FA Enabled Successfully!</h3>
              <p>Ab aapka account pehle se zyada secure hai.</p>
            </motion.div>
          )}

          <button className="setup-later" onClick={() => navigate('/settings')}>Set up later</button>
        </motion.div>
      </div>

      <style>{`
        .setup-icon-wrap {
          width: 60px; height: 60px;
          background: rgba(34,197,94,0.1);
          color: #22c55e;
          border-radius: 1.25rem;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.75rem; margin: 0 auto 1rem;
        }
        .setup-steps { text-align: left; margin: 1.5rem 0; }
        .setup-step { display: flex; gap: 1rem; margin-bottom: 0.75rem; align-items: flex-start; }
        .setup-step-num {
          width: 20px; height: 20px; border-radius: 50%;
          background: #f97316; color: #fff; font-size: 0.7rem;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; font-weight: 800;
        }
        .setup-step p { font-size: 0.8rem; color: #555; margin:0; line-height: 1.4; }
        .setup-qr-card {
          background: #f9fafb; border-radius: 1.5rem;
          padding: 1.5rem; display: flex; flex-direction: column;
          align-items: center; gap: 1rem; border: 1px solid #e5e7eb;
        }
        .setup-qr { width: 180px; height: 180px; mix-blend-mode: multiply; }
        .setup-qr-placeholder { width: 180px; height: 180px; background: #eee; border-radius: 1rem; }
        .setup-secret-wrap {
          display: flex; align-items: center; gap: 0.75rem;
          background: #fff; padding: 0.5rem 1rem; border-radius: 0.75rem;
          border: 1px solid #ddd; cursor: pointer; position: relative;
          transition: all 0.2s;
        }
        .setup-secret-wrap:hover { border-color: #f97316; }
        .setup-secret-wrap code { font-family: monospace; font-size: 0.85rem; color: #f97316; font-weight: 700; }
        .copy-hint { position: absolute; top: -30px; left: 50%; transform: translateX(-50%); background: #111; color: #fff; font-size: 0.6rem; padding: 0.3rem 0.6rem; border-radius: 4px; }
        
        .setup-verify-input { text-align: center; font-size: 1.5rem !important; letter-spacing: 4px !important; font-weight: 800 !important; }
        
        .setup-success { text-align: center; padding: 2rem 0; }
        .success-circle { width: 70px; height: 70px; background: #22c55e; color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; margin: 0 auto 1.5rem; }
        .setup-later { background: none; border: none; color: #888; font-size: 0.8rem; margin-top: 1.5rem; cursor: pointer; text-decoration: underline; width: 100%; }
      `}</style>
    </div>
  )
}
