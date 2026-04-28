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
    activeTab: 'Overview'
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
            
            {/* TAB NAVIGATION */}
            <div className="up-tabs">
              {['Overview', 'Orders', 'Wishlist', 'Addresses', 'Security', 'Referrals'].map(tab => (
                <button key={tab} 
                  className={`up-tab-btn ${form.activeTab === tab ? 'active' : ''}`}
                  onClick={() => setForm(p => ({ ...p, activeTab: tab }))}>
                  {tab}
                </button>
              ))}
            </div>

            {form.activeTab === 'Overview' && (
              <>
                {/* Profile Completeness */}
                <motion.div className="up-card up-completeness-card"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <div className="up-comp-info">
                    <div>
                      <h4 className="up-comp-title">Profile Completeness</h4>
                      <p className="up-comp-desc">Finish setting up your account for faster checkouts.</p>
                    </div>
                    <span className="up-comp-pct">85%</span>
                  </div>
                  <div className="up-comp-bar"><div className="up-comp-fill" style={{ width: '85%' }} /></div>
                  <div className="up-comp-tasks">
                    <span className="up-task-done">✓ Phone Verified</span>
                    <span className="up-task-done">✓ Email Verified</span>
                    <span className="up-task-pending" onClick={() => setForm(p => ({ ...p, activeTab: 'Addresses' }))}>+ Add Shipping Address</span>
                  </div>
                </motion.div>

                {/* Stats */}
                <motion.div className="up-stats-row"
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
                  {STATS.map((s, i) => (
                    <div key={i} className="up-stat">
                      <div className="up-stat-icon">{s.icon}</div>
                      <h4 className="up-stat-val">{s.value}</h4>
                      <p className="up-stat-label">{s.label}</p>
                    </div>
                  ))}
                </motion.div>

                {/* Active Support Ticket */}
                <motion.div className="up-card up-support-card"
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                  <div className="up-sec-header">
                    <span>Active Support Queries</span>
                    <span className="up-sec-badge on">1 OPEN</span>
                  </div>
                  <div className="up-order-item">
                    <div className="up-trans-icon"><FiClock /></div>
                    <div>
                      <p className="up-order-name">Case #SP-441: Refund Request</p>
                      <p className="up-order-meta">Average response time: 2 hours</p>
                    </div>
                  </div>
                </motion.div>

                {/* Membership */}
                <motion.div className={`up-membership-banner ${user?.isPro ? 'pro' : ''}`}
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
                  <div className="up-mem-content">
                    <div className="up-mem-icon"><RiVipCrownFill /></div>
                    <div>
                      <h3>{user?.isPro ? 'Platinum Membership Active' : 'Unlock Exclusive Perks'}</h3>
                      <p>{user?.isPro ? 'You are saving 15% on every order with Pro access.' : 'Get free shipping, 2x credits, and limited edition drops.'}</p>
                    </div>
                  </div>
                  {!user?.isPro && <button className="up-mem-btn" onClick={() => navigate('/membership')}>Upgrade Now</button>}
                </motion.div>
              </>
            )}

            {form.activeTab === 'Wishlist' && (
              <motion.div className="up-tab-content" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="up-section-header">
                  <h3 className="up-section-title">Your Saved Items</h3>
                  <span className="up-section-link" onClick={() => navigate('/marketplace')}>Browse Shop →</span>
                </div>
                <div className="up-designs-grid">
                  {[
                    { name: 'Vintage Oversized Tee', price: 'Rs 1,600', img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500' },
                    { name: 'Cyberpunk Black Hoodie', price: 'Rs 3,800', img: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=500' }
                  ].map((item, i) => (
                    <div key={i} className="up-design-card">
                      <div className="up-design-img"><img src={item.img} alt="item" style={{ opacity: 1, borderRadius: '1rem' }} /></div>
                      <div className="up-design-actions" style={{ opacity: 1, transform: 'none' }}>
                        <span className="up-design-btn edit">Buy Now</span>
                        <span className="up-design-btn sell" style={{ background: '#ef4444' }}>Remove</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {form.activeTab === 'Orders' && (
              <motion.div className="up-tab-content" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="up-section-header">
                  <h3 className="up-section-title">Purchase History</h3>
                  <select className="up-sort-select"><option>Last 3 months</option><option>2026</option><option>2025</option></select>
                </div>
                <div className="up-transaction-list">
                  {[
                    { id: 'ORD-9912', item: 'Custom Hoodie (White)', status: 'Delivered', price: 'Rs 3,200', date: '12 Apr' },
                    { id: 'ORD-9884', item: 'Graphic T-Shirt (XXL)', status: 'Delivered', price: 'Rs 1,850', date: '05 Apr' },
                    { id: 'ORD-9721', item: 'Plain Cotton Kurta', status: 'Refunded', price: 'Rs 2,500', date: '28 Mar' },
                  ].map((ord, i) => (
                    <div key={i} className="up-trans-row">
                      <div className="up-trans-icon"><FiShoppingBag /></div>
                      <div className="up-trans-info">
                        <span className="up-trans-name">{ord.item}</span>
                        <span className="up-trans-meta">{ord.id} • {ord.date}</span>
                      </div>
                      <div className="up-trans-status">
                        <span className={`up-status-dot ${ord.status.toLowerCase()}`} />
                        {ord.status}
                      </div>
                      <div className="up-trans-price">{ord.price}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {form.activeTab === 'Addresses' && (
              <motion.div className="up-tab-content" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="up-section-header">
                  <h3 className="up-section-title">Shipping Addresses</h3>
                  <button className="up-add-address-btn">+ Add New</button>
                </div>
                <div className="up-address-grid">
                  <div className="up-address-card active">
                    <div className="up-address-tag">DEFAULT</div>
                    <h4 className="up-address-name">Home Office</h4>
                    <p className="up-address-text">House #123, Block-C, Gulshan-e-Iqbal, Karachi. 75300</p>
                    <p className="up-address-phone">0300-1234567</p>
                    <div className="up-address-actions"><span>Edit</span><span>Remove</span></div>
                  </div>
                  <div className="up-address-card">
                    <h4 className="up-address-name">Work Studio</h4>
                    <p className="up-address-text">Plot #45, Industrial Area Phase 2, Lahore. 54000</p>
                    <div className="up-address-actions"><span>Edit</span><span>Remove</span></div>
                  </div>
                </div>
              </motion.div>
            )}

            {form.activeTab === 'Security' && (
              <motion.div className="up-tab-content" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h3 className="up-section-title">Account Security</h3>
                <div className="up-security-grid">
                  <div className="up-sec-box">
                    <div className="up-sec-header">
                      <span>Two-Factor Authentication</span>
                      <span className={`up-sec-badge ${user?.isTwoFactorEnabled ? 'on' : 'off'}`}>{user?.isTwoFactorEnabled ? 'PROTECTED' : 'DISABLED'}</span>
                    </div>
                    <p className="up-sec-desc">Add an extra layer of security to your account by requiring a code from your phone.</p>
                    <button className="up-sec-btn" onClick={() => navigate('/settings')}>Configure Security</button>
                  </div>
                  <div className="up-sec-box">
                    <div className="up-sec-header"><span>Account Recovery</span></div>
                    <p className="up-sec-desc">Ensure your backup email and phone are up to date for account recovery.</p>
                    <button className="up-sec-btn">Update Recovery</button>
                  </div>
                </div>
              </motion.div>
            )}

            {form.activeTab === 'Referrals' && (
              <motion.div className="up-tab-content" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="up-refer-hero">
                  <div className="up-refer-icon">🎁</div>
                  <h3>Give Rs 500, Get Rs 500</h3>
                  <p>Invite your friends to Shirtpoint and both of you will receive Rs 500 in credits on their first purchase.</p>
                  <div className="up-refer-link-box">
                    <input readOnly value={`shirtpoint.com/join?ref=${user?._id?.slice(-6) || 'XYZ123'}`} />
                    <button onClick={() => alert('Link Copied!')}>Copy Link</button>
                  </div>
                </div>
              </motion.div>
            )}

          </main>
        </div>
      </div>
      <Footer />
    </div>
  )
}
