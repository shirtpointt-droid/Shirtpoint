import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Canvas, useFrame } from '@react-three/fiber'
import { motion } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'
import UserNavbar from './UserNavbar'
import Footer from './Footer'
import {
  FiEdit2, FiCamera, FiSave, FiX,
  FiShoppingBag, FiStar, FiClock, FiSettings, FiLogOut
} from 'react-icons/fi'
import { RiCopperCoinLine, RiVipCrownFill, RiScissorsFill } from 'react-icons/ri'
import '../css/UserProfile.css'

// ── 3D Wavy Grid (same as Home) ──
function WavyGrid({ color = '#f97316', bgColor = '#050505' }) {
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
    <>
      <color attach="background" args={[bgColor]} />
      <mesh ref={meshRef} rotation={[-Math.PI / 3, 0, 0]} position={[0, 0, -2]}>
        <planeGeometry args={[100, 100, 100, 100]} />
        <meshBasicMaterial color={color} wireframe transparent opacity={0.07} />
      </mesh>
    </>
  )
}

export default function UserProfile() {
  const { user, token, login, logout } = useAuth()
  const { theme } = useTheme()
  const navigate = useNavigate()
  const fileRef = useRef()

  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    name:  user?.name  || '',
    email: user?.email || '',
    phone: user?.phone || '',
    city:  user?.city  || '',
  })
  const [photo, setPhoto] = useState(user?.photo || null)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : 'U'

  const handlePhoto = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => setPhoto(ev.target.result)
    reader.readAsDataURL(file)
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    try {
      const res = await fetch('http://localhost:5000/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...form, photo })
      })
      const data = await res.json()
      if (!res.ok) { setError(data.message || 'Save failed'); setSaving(false); return }
      login({ ...user, ...data }, token)
      setEditing(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch {
      setError('Server error. Try again.')
    }
    setSaving(false)
  }

  const handleLogout = () => { logout(); navigate('/') }

  const STATS = [
    { icon: <FiShoppingBag />, label: 'Active Orders', value: user?.activeOrders ?? 0 },
    { icon: <RiScissorsFill />, label: 'Saved Designs', value: user?.savedDesigns ?? 0 },
    { icon: <FiClock />,        label: 'Total Spent',   value: `Rs ${(user?.totalSpent || 0).toLocaleString()}` },
  ]

  const ORDER_STEPS = ['Processing', 'Printing', 'Shipped', 'Delivered']

  return (
    <div className="up-wrapper">

      {/* 3D Background */}
      <div className="up-bg">
        <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
          <WavyGrid color={theme === 'light' ? '#000000' : '#f97316'} bgColor={theme === 'light' ? '#ffffff' : '#050505'} />
        </Canvas>
      </div>

      <UserNavbar />

              {/* Toast */}
      {saved && <div className="up-toast">✅ Profile saved!</div>}
      {error && <div className="up-toast" style={{borderLeftColor:'#ef4444'}}>❌ {error}</div>}

      <div className="up-page">
        <div className="up-grid">

          {/* ── LEFT: User Card ── */}
          <aside className="up-left">

            {/* Identity Card */}
            <motion.div className="up-card up-identity-card"
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="up-card-glow" />

              {/* Avatar */}
              <div className="up-avatar-wrap">
                <div className="up-avatar" onClick={() => editing && fileRef.current.click()}>
                  {photo ? <img src={photo} alt="avatar" /> : <span>{initials}</span>}
                  {editing && <div className="up-avatar-cam"><FiCamera /></div>}
                </div>
                <input ref={fileRef} type="file" accept="image/*" hidden onChange={handlePhoto} />
                {user?.isPro && <div className="up-pro-badge"><RiVipCrownFill /> Pro Member</div>}
              </div>

              {/* Name */}
              {editing
                ? <input className="up-name-input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
                : <h2 className="up-name">{user?.name || 'User'}</h2>
              }
              <p className="up-location">{form.city || 'Pakistan'}</p>

              {/* Edit / Save / Cancel */}
              <div className="up-identity-btns">
                {!editing ? (
                  <button className="up-edit-btn" onClick={() => setEditing(true)}><FiEdit2 /> Edit Profile</button>
                ) : (
                  <>
                    <button className="up-save-btn" onClick={handleSave} disabled={saving}>
                      <FiSave /> {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button className="up-cancel-btn" onClick={() => setEditing(false)}><FiX /></button>
                  </>
                )}
              </div>

              {/* Fields */}
              {editing && (
                <div className="up-fields">
                  {[
                    { key: 'email', placeholder: 'Email', type: 'email' },
                    { key: 'phone', placeholder: 'Phone', type: 'tel' },
                    { key: 'city',  placeholder: 'City',  type: 'text' },
                  ].map(f => (
                    <input key={f.key} className="up-field-input" type={f.type}
                      placeholder={f.placeholder} value={form[f.key]}
                      onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} />
                  ))}
                </div>
              )}

              <div className="up-divider" />

              {/* Menu */}
              <button className="up-menu-item" onClick={() => navigate('/settings')}>
                <FiSettings /> Settings <span>→</span>
              </button>
              <button className="up-menu-item up-menu-logout" onClick={handleLogout}>
                <FiLogOut /> Logout
              </button>
            </motion.div>

            {/* Credits Card */}
            <motion.div className="up-credits-card"
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
              <p className="up-credits-label">Available Balance</p>
              <div className="up-credits-row">
                <h3 className="up-credits-val">{(user?.credits || 0).toLocaleString()} CR</h3>
                <RiCopperCoinLine className="up-credits-icon" />
              </div>
              <button className="up-credits-btn">Buy More Credits</button>
            </motion.div>

          </aside>

          {/* ── RIGHT: Dashboard ── */}
          <main className="up-right">

            {/* Stats */}
            <motion.div className="up-stats-row"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
              {STATS.map((s, i) => (
                <div key={i} className="up-stat">
                  <div className="up-stat-icon">{s.icon}</div>
                  <h4 className="up-stat-val">{s.value}</h4>
                  <p className="up-stat-label">{s.label}</p>
                </div>
              ))}
            </motion.div>

            {/* Order Tracking */}
            <motion.div className="up-card up-order-card"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
              <div className="up-section-header">
                <h3 className="up-section-title">Current Order Tracking</h3>
                <span className="up-section-link">View History →</span>
              </div>

              {/* Progress */}
              <div className="up-track-steps">
                {ORDER_STEPS.map((s, i) => (
                  <span key={i} className={`up-track-step ${i === 0 ? 'active' : ''}`}>{s}</span>
                ))}
              </div>
              <div className="up-track-bar">
                <motion.div className="up-track-fill"
                  initial={{ width: 0 }} animate={{ width: '30%' }} transition={{ duration: 1.2, delay: 0.5 }} />
              </div>

              {/* Order Item */}
              <div className="up-order-item">
                <div className="up-order-thumb">
                  <img src="https://www.pngarts.com/files/5/Plain-Black-T-Shirt-PNG-Image-Background.png" alt="tshirt" />
                </div>
                <div>
                  <p className="up-order-name">Oversized "Cyberpunk" Tee</p>
                  <p className="up-order-meta">Order #TS-9921 • Expected Wed, 28th</p>
                </div>
              </div>
            </motion.div>

            {/* Design Gallery */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }}>
              <div className="up-section-header" style={{ marginBottom: '1rem' }}>
                <h3 className="up-section-title">Your Design Gallery</h3>
                <span className="up-section-link" onClick={() => navigate('/design-lab')}>+ New Design →</span>
              </div>
              <div className="up-designs-grid">
                {[1, 2, 3].map(d => (
                  <div key={d} className="up-design-card">
                    <div className="up-design-img">
                      <img src="https://www.pngarts.com/files/5/Plain-White-T-Shirt-PNG-Image-Background.png" alt="design" />
                    </div>
                    <div className="up-design-actions">
                      <span className="up-design-btn edit">Edit</span>
                      <span className="up-design-btn sell">Sell</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Membership */}
            <motion.div className={`up-card up-membership ${user?.isPro ? 'pro' : ''}`}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
              <div className="up-membership-inner">
                <RiVipCrownFill className="up-crown" />
                <div>
                  <h3>{user?.isPro ? 'PRO Member' : 'Free Plan'}</h3>
                  <p>{user?.isPro ? 'Full access to all premium features' : 'Upgrade to unlock all features'}</p>
                </div>
              </div>
              {!user?.isPro && (
                <button className="up-upgrade-btn"><RiVipCrownFill /> Upgrade to PRO</button>
              )}
            </motion.div>

          </main>
        </div>
      </div>
      <Footer />
    </div>
  )
}
