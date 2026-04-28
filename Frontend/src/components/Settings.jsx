import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Canvas, useFrame } from '@react-three/fiber'
import { motion } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'
import UserNavbar from './UserNavbar'
import Footer from './Footer'
import {
  FiUser, FiLock, FiBell, FiShield, FiTrash2,
  FiEye, FiEyeOff, FiSave, FiChevronRight
} from 'react-icons/fi'
import { RiVipCrownFill } from 'react-icons/ri'
import '../css/Settings.css'

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

const TABS = [
  { id: 'account',      label: 'Account',       icon: <FiUser /> },
  { id: 'password',     label: 'Password',      icon: <FiLock /> },
  { id: 'notifications',label: 'Notifications', icon: <FiBell /> },
  { id: 'privacy',      label: 'Privacy',       icon: <FiShield /> },
  { id: 'danger',       label: 'Danger Zone',   icon: <FiTrash2 /> },
]

export default function Settings() {
  const { user, token, login, logout } = useAuth()
  const { theme } = useTheme()
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState('account')
  const [toast, setToast] = useState('')
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500) }

  // Account
  const [account, setAccount] = useState({
    name:  user?.name  || '',
    email: user?.email || '',
    phone: user?.phone || '',
    city:  user?.city  || '',
  })

  // Password
  const [pass, setPass] = useState({ current: '', newPass: '', confirm: '' })
  const [showPass, setShowPass] = useState({ current: false, newPass: false, confirm: false })
  const [passError, setPassError] = useState('')

  // Notifications
  const [notifs, setNotifs] = useState({
    orderUpdates:  true,
    promotions:    false,
    newDesigns:    true,
    newsletter:    false,
  })

  // Privacy
  const [privacy, setPrivacy] = useState({
    profilePublic:  true,
    showDesigns:    true,
    showActivity:   false,
  })

  const saveAccount = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(account)
      })
      const data = await res.json()
      if (!res.ok) { showToast('❌ ' + (data.message || 'Save failed')); return }
      login({ ...user, ...data }, token)
      showToast('✅ Account updated!')
    } catch {
      showToast('❌ Server error')
    }
  }

  const savePassword = () => {
    setPassError('')
    if (!pass.current) return setPassError('Enter current password')
    if (pass.newPass.length < 8) return setPassError('New password must be 8+ characters')
    if (pass.newPass !== pass.confirm) return setPassError('Passwords do not match')
    setPass({ current: '', newPass: '', confirm: '' })
    showToast('✅ Password changed!')
  }

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure? This cannot be undone.')) {
      logout()
      navigate('/')
    }
  }

  return (
    <div className="st-wrapper">
      <div className="st-bg">
        <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
          <WavyGrid color={theme === 'light' ? '#000000' : '#f97316'} bgColor={theme === 'light' ? '#ffffff' : '#050505'} />
        </Canvas>
      </div>

      <UserNavbar />

      {toast && <div className="st-toast">{toast}</div>}

      <div className="st-page">
        <div className="st-header">
          <h1 className="st-title">Settings</h1>
          <p className="st-sub">Manage your account preferences</p>
        </div>

        <div className="st-layout">

          {/* Sidebar Tabs */}
          <aside className="st-sidebar">
            {TABS.map(t => (
              <button key={t.id}
                className={`st-tab ${activeTab === t.id ? 'active' : ''} ${t.id === 'danger' ? 'danger' : ''}`}
                onClick={() => setActiveTab(t.id)}>
                <span className="st-tab-icon">{t.icon}</span>
                <span>{t.label}</span>
                <FiChevronRight className="st-tab-arrow" />
              </button>
            ))}
          </aside>

          {/* Content */}
          <div className="st-content">

            {/* ── Account ── */}
            {activeTab === 'account' && (
              <motion.div className="st-card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                <h2 className="st-card-title"><FiUser /> Account Information</h2>
                <div className="st-fields">
                  {[
                    { key: 'name',  label: 'Full Name',    type: 'text',  placeholder: 'Your name' },
                    { key: 'email', label: 'Email Address', type: 'email', placeholder: 'you@example.com' },
                    { key: 'phone', label: 'Phone Number',  type: 'tel',   placeholder: '+92 300 0000000' },
                    { key: 'city',  label: 'City',          type: 'text',  placeholder: 'e.g. Karachi' },
                  ].map(f => (
                    <div key={f.key} className="st-field">
                      <label>{f.label}</label>
                      <input type={f.type} value={account[f.key]} placeholder={f.placeholder}
                        onChange={e => setAccount(p => ({ ...p, [f.key]: e.target.value }))} />
                    </div>
                  ))}
                </div>
                <button className="st-save-btn" onClick={saveAccount}><FiSave /> Save Changes</button>
              </motion.div>
            )}

            {/* ── Password ── */}
            {activeTab === 'password' && (
              <motion.div className="st-card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                <h2 className="st-card-title"><FiLock /> Change Password</h2>
                <div className="st-fields">
                  {[
                    { key: 'current', label: 'Current Password' },
                    { key: 'newPass', label: 'New Password' },
                    { key: 'confirm', label: 'Confirm New Password' },
                  ].map(f => (
                    <div key={f.key} className="st-field">
                      <label>{f.label}</label>
                      <div className="st-pass-wrap">
                        <input type={showPass[f.key] ? 'text' : 'password'}
                          value={pass[f.key]} placeholder="••••••••"
                          onChange={e => setPass(p => ({ ...p, [f.key]: e.target.value }))} />
                        <button className="st-eye" onClick={() => setShowPass(p => ({ ...p, [f.key]: !p[f.key] }))}>
                          {showPass[f.key] ? <FiEyeOff /> : <FiEye />}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                {passError && <p className="st-error">{passError}</p>}
                <button className="st-save-btn" onClick={savePassword}><FiSave /> Update Password</button>
              </motion.div>
            )}

            {/* ── Notifications ── */}
            {activeTab === 'notifications' && (
              <motion.div className="st-card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                <h2 className="st-card-title"><FiBell /> Notification Preferences</h2>
                <div className="st-toggles">
                  {[
                    { key: 'orderUpdates', label: 'Order Updates',    desc: 'Get notified about your order status' },
                    { key: 'promotions',   label: 'Promotions',       desc: 'Deals, discounts and special offers' },
                    { key: 'newDesigns',   label: 'New Designs',      desc: 'When new designs are added to marketplace' },
                    { key: 'newsletter',   label: 'Newsletter',       desc: 'Weekly newsletter from T-Shirt Point' },
                  ].map(n => (
                    <div key={n.key} className="st-toggle-row">
                      <div>
                        <p className="st-toggle-label">{n.label}</p>
                        <p className="st-toggle-desc">{n.desc}</p>
                      </div>
                      <button className={`st-toggle ${notifs[n.key] ? 'on' : ''}`}
                        onClick={() => setNotifs(p => ({ ...p, [n.key]: !p[n.key] }))}>
                        <span className="st-toggle-thumb" />
                      </button>
                    </div>
                  ))}
                </div>
                <button className="st-save-btn" onClick={() => showToast('✅ Notifications saved!')}><FiSave /> Save</button>
              </motion.div>
            )}

            {/* ── Privacy ── */}
            {activeTab === 'privacy' && (
              <motion.div className="st-card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                <h2 className="st-card-title"><FiShield /> Privacy Settings</h2>
                <div className="st-toggles">
                  {[
                    { key: 'profilePublic', label: 'Public Profile',    desc: 'Allow others to see your profile' },
                    { key: 'showDesigns',   label: 'Show My Designs',   desc: 'Display your designs in marketplace' },
                    { key: 'showActivity',  label: 'Show Activity',     desc: 'Show your recent activity to others' },
                  ].map(n => (
                    <div key={n.key} className="st-toggle-row">
                      <div>
                        <p className="st-toggle-label">{n.label}</p>
                        <p className="st-toggle-desc">{n.desc}</p>
                      </div>
                      <button className={`st-toggle ${privacy[n.key] ? 'on' : ''}`}
                        onClick={() => setPrivacy(p => ({ ...p, [n.key]: !p[n.key] }))}>
                        <span className="st-toggle-thumb" />
                      </button>
                    </div>
                  ))}
                </div>
                <button className="st-save-btn" onClick={() => showToast('✅ Privacy settings saved!')}><FiSave /> Save</button>
              </motion.div>
            )}

            {/* ── Danger Zone ── */}
            {activeTab === 'danger' && (
              <motion.div className="st-card st-danger-card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                <h2 className="st-card-title danger"><FiTrash2 /> Danger Zone</h2>
                <div className="st-danger-item">
                  <div>
                    <p className="st-danger-label">Delete Account</p>
                    <p className="st-danger-desc">Permanently delete your account and all data. This cannot be undone.</p>
                  </div>
                  <button className="st-delete-btn" onClick={handleDeleteAccount}><FiTrash2 /> Delete Account</button>
                </div>
                <div className="st-danger-item">
                  <div>
                    <p className="st-danger-label">Logout All Devices</p>
                    <p className="st-danger-desc">Sign out from all active sessions on all devices.</p>
                  </div>
                  <button className="st-logout-btn" onClick={() => { logout(); navigate('/') }}>Logout All</button>
                </div>
              </motion.div>
            )}

          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
