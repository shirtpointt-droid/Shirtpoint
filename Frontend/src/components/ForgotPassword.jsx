import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Canvas, useFrame } from '@react-three/fiber'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMail, FiLock, FiCheck, FiX, FiArrowLeft, FiShield, FiKey } from 'react-icons/fi'
import '../css/Login.css'

function WavyGrid() {
  const meshRef = useRef()
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const positions = meshRef.current.geometry.attributes.position.array
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i]
      const y = positions[i + 1]
      positions[i + 2] = Math.sin(x * 0.5 + t) * Math.cos(y * 0.5 + t) * 0.5
    }
    meshRef.current.geometry.attributes.position.needsUpdate = true
  })
  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 3, 0, 0]} position={[0, 0, -2]}>
      <planeGeometry args={[100, 100, 100, 100]} />
      <meshBasicMaterial color="#f97316" wireframe transparent opacity={0.08} />
    </mesh>
  )
}

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1) // 1: Email, 2: 2FA & New Pass
  const [form, setForm] = useState({ email: '', code: '', newPassword: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleNext = async (e) => {
    e.preventDefault()
    if (!form.email) return setError('Email is required')
    setStep(2)
  }

  const handleReset = async (e) => {
    e.preventDefault()
    if (form.newPassword !== form.confirm) return setError('Passwords do not match')
    if (form.code.length < 6) return setError('Enter 6-digit 2FA code')
    
    setLoading(true)
    setError('')
    try {
      const res = await fetch('http://localhost:5000/api/auth/forgot-password-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, code: form.code, newPassword: form.newPassword })
      })
      const data = await res.json()
      if (!res.ok) { setError(data.message || 'Reset failed'); setLoading(false); return }
      
      setSuccess(true)
      setTimeout(() => navigate('/login'), 3000)
    } catch {
      setError('Server error')
    }
    setLoading(false)
  }

  return (
    <div className="login-wrapper">
      <div className="login-bg">
        <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
          <WavyGrid />
        </Canvas>
      </div>

      <nav className="login-nav">
        <button className="login-back" onClick={() => navigate('/login')}>
          <FiArrowLeft /> Back to Login
        </button>
        <h1 className="login-nav-logo">👕 T-SHIRT<span>.</span>POINT</h1>
      </nav>

      <motion.div className="login-card"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}>
        
        <div className="login-header">
          <div className="forgot-icon-wrap">
            <FiShield />
          </div>
          <h2 className="login-title">Reset Password</h2>
          <p className="login-sub">Reset using your Authenticator App</p>
        </div>

        {error && <div className="login-global-error"><FiX /> {error}</div>}
        {success && <div className="login-global-error" style={{background:'#f0fdf4', borderColor:'#bbf7d0', color:'#16a34a'}}><FiCheck /> Password reset successful! Redirecting...</div>}

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.form key="step1" onSubmit={handleNext}
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <div className="login-field">
                <label>Email Address</label>
                <div className="login-input-wrap">
                  <FiMail className="login-input-icon" />
                  <input type="email" placeholder="you@example.com" value={form.email} 
                    onChange={e => setForm({...form, email: e.target.value})} />
                </div>
              </div>
              <button type="submit" className="login-submit">Next Step →</button>
            </motion.form>
          ) : (
            <motion.form key="step2" onSubmit={handleReset}
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              
              <div className="login-field">
                <label>6-Digit 2FA Code</label>
                <div className="login-input-wrap">
                  <FiKey className="login-input-icon" />
                  <input type="text" placeholder="000000" maxLength={6} value={form.code}
                    onChange={e => setForm({...form, code: e.target.value.replace(/\D/g, '')})} />
                </div>
              </div>

              <div className="login-field">
                <label>New Password</label>
                <div className="login-input-wrap">
                  <FiLock className="login-input-icon" />
                  <input type="password" placeholder="Min 8 characters" value={form.newPassword}
                    onChange={e => setForm({...form, newPassword: e.target.value})} />
                </div>
              </div>

              <div className="login-field">
                <label>Confirm Password</label>
                <div className="login-input-wrap">
                  <FiLock className="login-input-icon" />
                  <input type="password" placeholder="Confirm new password" value={form.confirm}
                    onChange={e => setForm({...form, confirm: e.target.value})} />
                </div>
              </div>

              <button type="submit" className="login-submit" disabled={loading}>
                {loading ? <span className="login-spinner" /> : 'Reset Password'}
              </button>
              <button type="button" className="login-back-btn" onClick={() => setStep(1)} style={{width:'100%', marginTop:'1rem', background:'none', border:'none', color:'#888', fontSize:'0.8rem', cursor:'pointer'}}>← Back to Email</button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>

      <style>{`
        .forgot-icon-wrap {
          width: 60px;
          height: 60px;
          background: rgba(249,115,22,0.1);
          color: #f97316;
          border-radius: 1.25rem;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.75rem;
          margin: 0 auto 1.5rem;
        }
      `}</style>
    </div>
  )
}
