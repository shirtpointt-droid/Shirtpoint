import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Canvas, useFrame } from '@react-three/fiber'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMail, FiLock, FiEye, FiEyeOff, FiCheck, FiX, FiArrowLeft } from 'react-icons/fi'
import { FcGoogle } from 'react-icons/fc'
import { FiPhone } from 'react-icons/fi'
import '../css/Login.css'

function WavyGrid({ color = '#f97316' }) {
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
      <meshBasicMaterial color={color} wireframe={true} transparent opacity={0.35} />
    </mesh>
  )
}

function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [remember, setRemember] = useState(false)
  const [requires2FA, setRequires2FA] = useState(false)
  const [tempUserId, setTempUserId] = useState(null)
  const [code, setCode] = useState('')

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }))
    setErrors(e => ({ ...e, [k]: '' }))
    setLoginError('')
  }

  const validate = () => {
    const e = {}
    if (!form.email.trim()) e.email = 'Email required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email format'
    if (!form.password) e.password = 'Password required'
    else if (form.password.length < 6) e.password = 'Password too short'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length) return setErrors(e2)
    setLoading(true)
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password })
      })
      const data = await res.json()
      if (!res.ok) { setLoginError(data.message || 'Login failed'); setLoading(false); return }
      
      if (data.requires2FA) {
        setRequires2FA(true)
        setTempUserId(data.userId)
        setLoading(false)
        return
      }

      login(data.user, data.token)
      navigate('/user-home')
    } catch {
      setLoginError('Server error. Please try again.')
    }
    setLoading(false)
  }

  const handle2FA = async (e) => {
    e.preventDefault()
    if (code.length < 6) return
    setLoading(true)
    try {
      const res = await fetch('http://localhost:5000/api/auth/verify-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: tempUserId, code })
      })
      const data = await res.json()
      if (!res.ok) { setLoginError(data.message || 'Invalid code'); setLoading(false); return }
      login(data.user, data.token)
      navigate('/user-home')
    } catch {
      setLoginError('Server error')
    }
    setLoading(false)
  }

  return (
    <div className="login-wrapper">

      {/* 3D Background */}
      <div className="login-bg">
        <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
          <WavyGrid color="#f97316" />
        </Canvas>
      </div>

      {/* Navbar */}
      <nav className="login-nav">
        <button className="login-back" onClick={() => navigate(-1)}>
          <FiArrowLeft /> Back
        </button>
        <h1 className="login-nav-logo">🎨 MEGA T SHIRT<span>.</span>DESIGNS</h1>
        <button className="login-nav-signup" onClick={() => navigate('/signup')}>Sign Up</button>
      </nav>

      <motion.div className="login-card"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="login-header">
          <h2 className="login-title">Welcome Back</h2>
          <p className="login-sub">Sign in to your account</p>
        </div>

        {/* Global Error */}
        <AnimatePresence>
          {loginError && (
            <motion.div className="login-global-error"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <FiX /> {loginError}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} noValidate>

          {/* Email */}
          <div className={`login-field ${errors.email ? 'error' : form.email && !errors.email ? 'success' : ''}`}>
            <label>Email Address</label>
            <div className="login-input-wrap">
              <FiMail className="login-input-icon" />
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => set('email', e.target.value)}
                autoComplete="off"
              />
              {form.email && !errors.email && <FiCheck className="login-check" />}
              {errors.email && <FiX className="login-x" />}
            </div>
            {errors.email && <p className="login-error-msg">{errors.email}</p>}
          </div>

          {/* Password */}
          <div className={`login-field ${errors.password ? 'error' : form.password && !errors.password ? 'success' : ''}`}>
            <div className="login-label-row">
              <label>Password</label>
              <a href="#" className="login-forgot" onClick={() => navigate('/forgot-password')}>Forgot password?</a>
            </div>
            <div className="login-input-wrap">
              <FiLock className="login-input-icon" />
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="Enter your password"
                value={form.password}
                onChange={e => set('password', e.target.value)}
                autoComplete="new-password"
              />
              <button type="button" className="login-eye" onClick={() => setShowPass(!showPass)}>
                {showPass ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {errors.password && <p className="login-error-msg">{errors.password}</p>}
          </div>

          {/* Remember Me */}
          <div className="login-remember">
            <label className="login-checkbox-wrap">
              <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} />
              <span className="login-checkbox" />
              <span>Remember me</span>
            </label>
          </div>

          {/* Submit */}
          <button type="submit" className={`login-submit ${loading ? 'loading' : ''}`} disabled={loading}>
            {loading ? <span className="login-spinner" /> : 'Sign In →'}
          </button>

          <p className="login-signup-link">
            Don't have an account? <a href="#" onClick={() => navigate('/signup')}>Sign Up</a>
          </p>

          {/* Divider */}
          <div className="login-divider"><span>or continue with</span></div>

          {/* Social */}
          <div className="login-social">
            <button type="button" className="login-social-btn"><FcGoogle /> Google</button>
            <button type="button" className="login-social-btn"><FiPhone /> Contact</button>
          </div>

          {/* 2FA Overlay */}
          <AnimatePresence>
            {requires2FA && (
              <motion.div className="login-2fa-overlay"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <motion.div className="login-2fa-modal"
                  initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}>
                  <button type="button" className="login-2fa-close" onClick={() => setRequires2FA(false)}><FiX /></button>
                  <h3 className="login-2fa-title">Two-Factor Authentication</h3>
                  <p className="login-2fa-sub">Authenticator app se 6-digit code enter karein</p>
                  <div className="login-field">
                    <div className="login-input-wrap">
                      <input
                        type="text"
                        placeholder="000000"
                        maxLength={6}
                        value={code}
                        onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
                        className="login-2fa-input"
                        autoFocus
                      />
                    </div>
                  </div>
                  <button type="button" onClick={handle2FA} className="login-submit" disabled={loading || code.length < 6}>
                    {loading ? <span className="login-spinner" /> : 'Verify & Sign In'}
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

        </form>
      </motion.div>
    </div>
  )
}

export default Login
