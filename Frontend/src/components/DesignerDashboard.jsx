import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Canvas, useFrame } from '@react-three/fiber'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import UserNavbar from './UserNavbar'
import UserFooter from './UserFooter'
import { FiTrendingUp, FiDollarSign, FiUsers, FiShoppingBag, FiPlus, FiEye, FiEdit2, FiTrash2, FiArrowRight } from 'react-icons/fi'
import { RiCopperCoinLine, RiVipCrownFill } from 'react-icons/ri'
import '../css/DesignerDashboard.css'

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

const STATS = [
  { label: 'Total Earnings', value: 'Rs 15,400', icon: <FiDollarSign />, color: '#22c55e' },
  { label: 'Designs Sold',   value: '142',        icon: <FiShoppingBag />, color: '#3b82f6' },
  { label: 'Profile Views',  value: '12.5k',      icon: <FiUsers />,       color: '#a855f7' },
  { label: 'Market Rank',    value: '#12',         icon: <FiTrendingUp />,  color: '#f97316' },
]

const MY_DESIGNS = [
  { id: 1, title: 'Neon Samurai v1', listed: '2 weeks ago', royalty: 150, sales: 24, earned: 3600, status: 'live' },
  { id: 2, title: 'Cyber Dragon',    listed: '1 month ago', royalty: 200, sales: 18, earned: 3600, status: 'live' },
  { id: 3, title: 'Street Ghost',    listed: '3 days ago',  royalty: 80,  sales: 5,  earned: 400,  status: 'live' },
  { id: 4, title: 'Abstract Bloom',  listed: '5 days ago',  royalty: 110, sales: 0,  earned: 0,    status: 'draft' },
]

const TRANSACTIONS = [
  { id: 1, desc: 'Sale — Neon Samurai',  amount: '+150 CR', time: '2h ago',  type: 'credit' },
  { id: 2, desc: 'Sale — Cyber Dragon',  amount: '+200 CR', time: '5h ago',  type: 'credit' },
  { id: 3, desc: 'Withdrawal',           amount: '-500 CR', time: '1d ago',  type: 'debit'  },
  { id: 4, desc: 'Sale — Street Ghost',  amount: '+80 CR',  time: '2d ago',  type: 'credit' },
]

export default function DesignerDashboard() {
  const { user } = useAuth()
  const { theme } = useTheme()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('designs')
  const [showListModal, setShowListModal] = useState(false)
  const [royaltyFee, setRoyaltyFee] = useState(100)
  const [designTitle, setDesignTitle] = useState('')

  return (
    <div className="dd-wrapper">
      <div className="dd-bg">
        <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
          <WavyGrid color={theme === 'light' ? '#000' : '#f97316'} bgColor={theme === 'light' ? '#fff' : '#050505'} />
        </Canvas>
      </div>

      <UserNavbar />

      <div className="dd-page">

        {/* Header */}
        <motion.div className="dd-header" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div>
            <p className="dd-eyebrow">🎨 Designer Studio</p>
            <h1 className="dd-title">YOUR DASHBOARD</h1>
            <p className="dd-sub">Track your sales, manage listings aur earnings withdraw karo.</p>
          </div>
          <button className="dd-new-btn" onClick={() => navigate('/design-lab')}>
            <FiPlus strokeWidth={3} /> New Design
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div className="dd-stats" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          {STATS.map((s, i) => (
            <motion.div key={i} className="dd-stat-card"
              style={{ '--stat-color': s.color }}
              whileHover={{ y: -3 }}>
              <div className="dd-stat-icon" style={{ color: s.color }}>{s.icon}</div>
              <h3 className="dd-stat-val">{s.value}</h3>
              <p className="dd-stat-label">{s.label}</p>
            </motion.div>
          ))}
        </motion.div>

        <div className="dd-grid">

          {/* LEFT: Main */}
          <div className="dd-main">

            {/* Tabs */}
            <div className="dd-tabs">
              {['designs', 'transactions'].map(t => (
                <button key={t} className={`dd-tab ${activeTab === t ? 'active' : ''}`}
                  onClick={() => setActiveTab(t)}>
                  {t === 'designs' ? '🎨 My Designs' : '💳 Transactions'}
                </button>
              ))}
            </div>

            {/* Designs Tab */}
            {activeTab === 'designs' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="dd-designs-list">
                  {MY_DESIGNS.map((d, i) => (
                    <motion.div key={d.id} className="dd-design-row"
                      initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.07 }}>
                      <div className="dd-design-thumb">
                        <img src="https://www.pngarts.com/files/5/Plain-Black-T-Shirt-PNG-Image-Background.png" alt="" />
                      </div>
                      <div className="dd-design-info">
                        <div className="dd-design-top">
                          <h4 className="dd-design-title">{d.title}</h4>
                          <span className={`dd-status ${d.status}`}>{d.status === 'live' ? '🟢 Live' : '⚪ Draft'}</span>
                        </div>
                        <p className="dd-design-meta">Listed {d.listed} • Royalty: Rs {d.royalty}</p>
                        <div className="dd-design-stats">
                          <span>🛍️ {d.sales} sales</span>
                          <span className="dd-earned">+Rs {d.earned.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="dd-design-actions">
                        <button className="dd-action-btn" title="View"><FiEye /></button>
                        <button className="dd-action-btn" title="Edit"><FiEdit2 /></button>
                        <button className="dd-action-btn danger" title="Delete"><FiTrash2 /></button>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* List New Design */}
                <button className="dd-list-btn" onClick={() => setShowListModal(true)}>
                  <FiPlus /> List a Design on Marketplace
                </button>
              </motion.div>
            )}

            {/* Transactions Tab */}
            {activeTab === 'transactions' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="dd-transactions">
                  {TRANSACTIONS.map((t, i) => (
                    <motion.div key={t.id} className="dd-txn"
                      initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.07 }}>
                      <div className={`dd-txn-dot ${t.type}`} />
                      <div className="dd-txn-info">
                        <p className="dd-txn-desc">{t.desc}</p>
                        <p className="dd-txn-time">{t.time}</p>
                      </div>
                      <span className={`dd-txn-amount ${t.type}`}>{t.amount}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* RIGHT: Sidebar */}
          <aside className="dd-sidebar">

            {/* Payout Card */}
            <motion.div className="dd-payout-card" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <div className="dd-payout-glow" />
              <p className="dd-payout-label">Ready for Payout</p>
              <h2 className="dd-payout-val">Rs 4,850</h2>
              <p className="dd-payout-hint">JazzCash ya EasyPaisa mein withdraw karein</p>
              <button className="dd-withdraw-btn">Withdraw Funds</button>
            </motion.div>

            {/* Credits */}
            <motion.div className="dd-card" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <div className="dd-card-header">
                <RiCopperCoinLine className="dd-card-icon" />
                <h3 className="dd-card-title">Credits Balance</h3>
              </div>
              <p className="dd-credits-val">{(user?.credits || 0).toLocaleString()} CR</p>
              <p className="dd-credits-hint">Har sale pe credits milte hain</p>
            </motion.div>

            {/* Commission Info */}
            <motion.div className="dd-card dd-commission-card" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
              <h3 className="dd-card-title" style={{ marginBottom: '1rem' }}>💡 How It Works</h3>
              <div className="dd-commission-steps">
                <div className="dd-comm-step">
                  <span className="dd-comm-num">1</span>
                  <p>Shirt price: <strong>Rs 1,500</strong></p>
                </div>
                <div className="dd-comm-step">
                  <span className="dd-comm-num">2</span>
                  <p>Your royalty: <strong>Rs 100</strong></p>
                </div>
                <div className="dd-comm-step">
                  <span className="dd-comm-num">3</span>
                  <p>Buyer pays: <strong>Rs 1,600</strong></p>
                </div>
                <div className="dd-comm-step green">
                  <span className="dd-comm-num">✓</span>
                  <p>You earn: <strong>Rs 100 per sale!</strong></p>
                </div>
              </div>
            </motion.div>

            {/* Leaderboard */}
            <motion.div className="dd-card" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
              <div className="dd-card-header">
                <FiTrendingUp className="dd-card-icon orange" />
                <h3 className="dd-card-title">Top Sellers</h3>
              </div>
              {[
                { name: 'CleanCuts',  sales: 201, reward: '🏆' },
                { name: 'ArtByAbrar', sales: 197, reward: '🥈' },
                { name: 'DesignKing', sales: 186, reward: '🥉' },
              ].map((s, i) => (
                <div key={i} className="dd-leader">
                  <span className="dd-leader-reward">{s.reward}</span>
                  <span className="dd-leader-name">{s.name}</span>
                  <span className="dd-leader-sales">{s.sales} sales</span>
                </div>
              ))}
              <p className="dd-leader-hint">🎁 Top seller gets 500 Free Credits every week!</p>
            </motion.div>

          </aside>
        </div>
      </div>

      {/* List Design Modal */}
      {showListModal && (
        <div className="dd-modal-overlay" onClick={() => setShowListModal(false)}>
          <motion.div className="dd-modal" onClick={e => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <h3 className="dd-modal-title">🎨 List Design on Marketplace</h3>
            <div className="dd-modal-field">
              <label>Design Title</label>
              <input placeholder="e.g. Neon Samurai" value={designTitle}
                onChange={e => setDesignTitle(e.target.value)} />
            </div>
            <div className="dd-modal-field">
              <label>Royalty Fee (Credits per sale)</label>
              <input type="number" min={50} max={500} value={royaltyFee}
                onChange={e => setRoyaltyFee(e.target.value)} />
              <p className="dd-modal-hint">Buyer ko shirt price + {royaltyFee} CR extra dena hoga</p>
            </div>
            <div className="dd-modal-btns">
              <button className="dd-modal-cancel" onClick={() => setShowListModal(false)}>Cancel</button>
              <button className="dd-modal-submit" onClick={() => setShowListModal(false)}>
                List Now <FiArrowRight />
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <UserFooter />
    </div>
  )
}
