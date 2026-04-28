import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Canvas, useFrame } from '@react-three/fiber'
import { motion, AnimatePresence } from 'framer-motion'
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiCheck, FiX, FiArrowLeft, FiPhone } from 'react-icons/fi'
import { FcGoogle } from 'react-icons/fc'
import '../css/SignUp.css'

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
      <meshBasicMaterial color="black" wireframe transparent opacity={0.08} />
    </mesh>
  )
}

const rules = [
  { id: 'len', label: 'At least 8 characters', test: v => v.length >= 8 },
  { id: 'upper', label: 'One uppercase letter', test: v => /[A-Z]/.test(v) },
  { id: 'num', label: 'One number', test: v => /[0-9]/.test(v) },
  { id: 'special', label: 'One special character', test: v => /[^A-Za-z0-9]/.test(v) },
]

function SignUp() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }))
    setErrors(e => ({ ...e, [k]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name required'
    else if (form.name.trim().length < 2) e.name = 'Name too short'

    if (!form.email.trim()) e.email = 'Email required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email format'

    if (!form.password) e.password = 'Password required'
    else if (!rules.every(r => r.test(form.password))) e.password = 'Password does not meet requirements'

    if (!form.confirm) e.confirm = 'Please confirm password'
    else if (form.confirm !== form.password) e.confirm = 'Passwords do not match'

    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length) return setErrors(e2)
    setLoading(true)
    setServerError('')
    try {
      const res = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password })
      })
      const data = await res.json()
      if (!res.ok) { setServerError(data.message || 'Signup failed'); setLoading(false); return }
      login(data.user, data.token)
      navigate('/user-home')
    } catch {
      setServerError('Server error. Please try again.')
    }
    setLoading(false)
  }

  const passStrength = () => {
    const passed = rules.filter(r => r.test(form.password)).length
    if (passed <= 1) return { label: 'Weak', color: '#ef4444', width: '25%' }
    if (passed === 2) return { label: 'Fair', color: '#f97316', width: '50%' }
    if (passed === 3) return { label: 'Good', color: '#eab308', width: '75%' }
    return { label: 'Strong', color: '#22c55e', width: '100%' }
  }

  const strength = form.password ? passStrength() : null

  return (
    <div className="signup-wrapper">

      {/* 3D Background */}
      <div className="signup-bg">
        <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
          <WavyGrid />
        </Canvas>
      </div>

      {/* Navbar */}
      <nav className="signup-nav">
        <button className="signup-back" onClick={() => navigate(-1)}>
          <FiArrowLeft /> Back
        </button>
        <h1 className="signup-nav-logo">👕 T-SHIRT<span>.</span>POINT</h1>
        <button className="signup-nav-login" onClick={() => navigate('/login')}>Login</button>
      </nav>

      <AnimatePresence>
        {submitted ? (
          <motion.div className="signup-success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <div className="signup-success-icon">✅</div>
            <h2>Account Created!</h2>
            <p>Welcome to T-Shirt Point. You can now login.</p>
            <a href="/" className="signup-success-btn">Go to Home</a>
          </motion.div>
        ) : (
          <motion.div className="signup-card"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Header */}
            <div className="signup-header">
              <h1 className="signup-logo">👕 T-SHIRT<span>.</span>POINT</h1>
              <h2 className="signup-title">Create Account</h2>
              <p className="signup-sub">Join the creative lab today</p>
            </div>

            <form onSubmit={handleSubmit} noValidate>

              {/* Name */}
              <div className={`signup-field ${errors.name ? 'error' : form.name ? 'success' : ''}`}>
                <label>Full Name</label>
                <div className="signup-input-wrap">
                  <FiUser className="signup-input-icon" />
                  <input
                    type="text"
                    placeholder="Your full name"
                    value={form.name}
                    onChange={e => set('name', e.target.value)}
                    autoComplete="off"
                  />
                  {form.name && !errors.name && <FiCheck className="signup-check" />}
                  {errors.name && <FiX className="signup-x" />}
                </div>
                {errors.name && <p className="signup-error-msg">{errors.name}</p>}
              </div>

              {/* Email */}
              <div className={`signup-field ${errors.email ? 'error' : form.email ? 'success' : ''}`}>
                <label>Email Address</label>
                <div className="signup-input-wrap">
                  <FiMail className="signup-input-icon" />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={e => set('email', e.target.value)}
                    autoComplete="off"
                  />
                  {form.email && !errors.email && <FiCheck className="signup-check" />}
                  {errors.email && <FiX className="signup-x" />}
                </div>
                {errors.email && <p className="signup-error-msg">{errors.email}</p>}
              </div>

              {/* Password */}
              <div className={`signup-field ${errors.password ? 'error' : form.password && rules.every(r => r.test(form.password)) ? 'success' : ''}`}>
                <label>Password</label>
                <div className="signup-input-wrap">
                  <FiLock className="signup-input-icon" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    placeholder="Create a strong password"
                    value={form.password}
                    onChange={e => set('password', e.target.value)}
                    autoComplete="new-password"
                  />
                  <button type="button" className="signup-eye" onClick={() => setShowPass(!showPass)}>
                    {showPass ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                {errors.password && <p className="signup-error-msg">{errors.password}</p>}

                {/* Strength Bar */}
                {form.password && (
                  <div className="signup-strength">
                    <div className="signup-strength-bar">
                      <div className="signup-strength-fill" style={{ width: strength.width, background: strength.color }} />
                    </div>
                    <span style={{ color: strength.color }}>{strength.label}</span>
                  </div>
                )}

                {/* Rules */}
                {form.password && (
                  <div className="signup-rules">
                    {rules.map(r => (
                      <div key={r.id} className={`signup-rule ${r.test(form.password) ? 'pass' : 'fail'}`}>
                        {r.test(form.password) ? <FiCheck /> : <FiX />}
                        <span>{r.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className={`signup-field ${errors.confirm ? 'error' : form.confirm && form.confirm === form.password ? 'success' : ''}`}>
                <label>Confirm Password</label>
                <div className="signup-input-wrap">
                  <FiLock className="signup-input-icon" />
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Repeat your password"
                    value={form.confirm}
                    onChange={e => set('confirm', e.target.value)}
                    autoComplete="new-password"
                  />
                  <button type="button" className="signup-eye" onClick={() => setShowConfirm(!showConfirm)}>
                    {showConfirm ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                {errors.confirm && <p className="signup-error-msg">{errors.confirm}</p>}
                {form.confirm && form.confirm === form.password && (
                  <p className="signup-match-msg"><FiCheck /> Passwords match</p>
                )}
              </div>

              <button type="submit" className="signup-submit" disabled={loading}>
                {loading ? 'Creating...' : 'Sign Up →'}
              </button>

              {serverError && <p className="signup-error-msg" style={{textAlign:'center',marginTop:'0.5rem'}}>{serverError}</p>}

              <p className="signup-login">Already have an account? <a href="#" onClick={() => navigate('/login')}>Login</a></p>

              <div className="signup-divider"><span>or continue with</span></div>

              <div className="signup-social">
                <button className="signup-social-btn"><FcGoogle /> Google</button>
                <button className="signup-social-btn"><FiPhone /> Contact</button>
              </div>

            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SignUp
