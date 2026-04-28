import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Canvas, useFrame } from '@react-three/fiber'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import UserNavbar from './UserNavbar'
import UserFooter from './UserFooter'
import { FiCheck, FiZap, FiShield, FiStar, FiArrowRight } from 'react-icons/fi'
import { RiVipCrownFill, RiCopperCoinLine, RiVerifiedBadgeFill } from 'react-icons/ri'
import '../css/Membership.css'

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

const TIERS = [
  {
    id: 'free',
    name: 'Free',
    subtitle: 'The Starter',
    price: '0',
    period: 'Forever',
    icon: <FiStar />,
    color: '#555',
    features: [
      { text: 'Basic Customizer Access',     ok: true  },
      { text: '1 Saved Draft',               ok: true  },
      { text: 'Community Access',            ok: true  },
      { text: 'Monthly Credits Bonus',       ok: false },
      { text: 'Print Discount',              ok: false },
      { text: 'Sell on Marketplace',         ok: false },
      { text: 'Priority Delivery',           ok: false },
      { text: 'Verified Badge',              ok: false },
    ],
    btn: 'Current Plan',
    popular: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    subtitle: 'The Creator',
    price: '999',
    period: 'Per Month',
    icon: <RiVipCrownFill />,
    color: '#f97316',
    features: [
      { text: 'Basic Customizer Access',     ok: true  },
      { text: 'Unlimited Saved Drafts',      ok: true  },
      { text: 'Community Access',            ok: true  },
      { text: '200 Monthly Credits Free',    ok: true  },
      { text: '10% Discount on Orders',      ok: true  },
      { text: 'Sell on Marketplace',         ok: true  },
      { text: 'Pro Exclusive Stickers',      ok: true  },
      { text: 'Verified Badge',              ok: false },
    ],
    btn: 'Go Pro',
    popular: true,
    bonus: '🎁 Welcome Bonus: 100 Credits on signup!',
  },
  {
    id: 'legend',
    name: 'Legend',
    subtitle: 'The Business',
    price: '2499',
    period: 'Per Month',
    icon: <RiVerifiedBadgeFill />,
    color: '#3b82f6',
    features: [
      { text: 'Everything in Pro',           ok: true  },
      { text: 'Unlimited Premium Assets',    ok: true  },
      { text: '25% Flat Discount',           ok: true  },
      { text: '24h Priority Delivery (KHI)', ok: true  },
      { text: 'Verified Blue Tick',          ok: true  },
      { text: 'Dedicated Support',           ok: true  },
      { text: 'Early Access to Drops',       ok: true  },
      { text: 'Top Seller Leaderboard',      ok: true  },
    ],
    btn: 'Become Legend',
    popular: false,
  },
]

const COMPARE = [
  { feature: 'Saved Drafts',         free: '1',    pro: 'Unlimited', legend: 'Unlimited' },
  { feature: 'Monthly Credits',      free: '—',    pro: '200 CR',    legend: '500 CR'    },
  { feature: 'Print Discount',       free: '—',    pro: '10%',       legend: '25%'       },
  { feature: 'Marketplace Selling',  free: '✗',    pro: '✓',         legend: '✓'         },
  { feature: 'Priority Delivery',    free: '✗',    pro: '✗',         legend: '24h KHI'   },
  { feature: 'Verified Badge',       free: '✗',    pro: '✗',         legend: '✓'         },
]

export default function Membership() {
  const { user, login } = useAuth()
  const { theme } = useTheme()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(null)
  const [toast, setToast] = useState('')

  const currentPlan = user?.membership || 'free'

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  const handleUpgrade = async (tierId) => {
    if (!user) { navigate('/login'); return }
    if (tierId === 'free' || tierId === currentPlan) return
    setLoading(tierId)
    await new Promise(r => setTimeout(r, 1200))
    const bonusCredits = tierId === 'pro' ? 100 : 200
    const updated = {
      ...user,
      membership: tierId,
      isPro: tierId !== 'free',
      credits: (user.credits || 0) + bonusCredits,
    }
    login(updated, undefined)
    showToast(`🎉 Welcome to ${tierId.charAt(0).toUpperCase() + tierId.slice(1)}! +${bonusCredits} Credits added!`)
    setLoading(null)
  }

  return (
    <div className="mem-wrapper">
      <div className="mem-bg">
        <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
          <WavyGrid color={theme === 'light' ? '#000' : '#f97316'} bgColor={theme === 'light' ? '#fff' : '#050505'} />
        </Canvas>
      </div>

      <UserNavbar />

      {toast && <div className="mem-toast">{toast}</div>}

      <div className="mem-page">

        {/* Header */}
        <motion.div className="mem-header" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <p className="mem-eyebrow">👑 Membership Plans</p>
          <h1 className="mem-title">ELEVATE YOUR <span className="mem-title-orange">STYLE</span></h1>
          <p className="mem-sub">Membership lein aur premium benefits ka maza uthayen</p>
          {user && (
            <div className="mem-current-badge">
              Current Plan: <strong>{currentPlan.toUpperCase()}</strong>
              {user.credits && <span><RiCopperCoinLine /> {user.credits.toLocaleString()} Credits</span>}
            </div>
          )}
        </motion.div>

        {/* Pricing Cards */}
        <div className="mem-cards">
          {TIERS.map((tier, i) => (
            <motion.div key={tier.id}
              className={`mem-card ${tier.popular ? 'mem-card-popular' : ''} ${currentPlan === tier.id ? 'mem-card-current' : ''}`}
              style={{ '--tier-color': tier.color }}
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -8 }}>

              {tier.popular && <div className="mem-popular-badge">⚡ Most Popular</div>}
              {currentPlan === tier.id && <div className="mem-current-label">✓ Your Plan</div>}

              <div className="mem-card-glow" />

              <div className="mem-card-top">
                <div className="mem-tier-icon" style={{ color: tier.color }}>{tier.icon}</div>
                <div>
                  <h3 className="mem-tier-name">{tier.name}</h3>
                  <p className="mem-tier-sub">{tier.subtitle}</p>
                </div>
              </div>

              <div className="mem-price">
                <span className="mem-price-val">Rs {tier.price}</span>
                <span className="mem-price-period">/{tier.period}</span>
              </div>

              {tier.bonus && (
                <div className="mem-bonus">{tier.bonus}</div>
              )}

              <ul className="mem-features">
                {tier.features.map((f, j) => (
                  <li key={j} className={`mem-feature ${f.ok ? 'ok' : 'no'}`}>
                    <span className="mem-feature-icon">{f.ok ? <FiCheck /> : '—'}</span>
                    {f.text}
                  </li>
                ))}
              </ul>

              <button
                className={`mem-btn ${tier.popular ? 'mem-btn-popular' : ''} ${currentPlan === tier.id ? 'mem-btn-current' : ''}`}
                onClick={() => handleUpgrade(tier.id)}
                disabled={loading === tier.id || currentPlan === tier.id}>
                {loading === tier.id
                  ? <span className="mem-spinner" />
                  : currentPlan === tier.id
                    ? '✓ Current Plan'
                    : <>{tier.btn} <FiArrowRight /></>
                }
              </button>
            </motion.div>
          ))}
        </div>

        {/* Comparison Table */}
        <motion.div className="mem-compare" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <h2 className="mem-compare-title">📊 Plan Comparison</h2>
          <div className="mem-table-wrap">
            <table className="mem-table">
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>Free</th>
                  <th className="mem-th-pro">Pro ⚡</th>
                  <th className="mem-th-legend">Legend 👑</th>
                </tr>
              </thead>
              <tbody>
                {COMPARE.map((row, i) => (
                  <tr key={i}>
                    <td className="mem-td-feature">{row.feature}</td>
                    <td className="mem-td-free">{row.free}</td>
                    <td className="mem-td-pro">{row.pro}</td>
                    <td className="mem-td-legend">{row.legend}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Trust Signals */}
        <motion.div className="mem-trust" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          {[
            { icon: <FiZap />, color: '#f97316', label: 'Instant Activation',  desc: 'Plan activate hote hi benefits milte hain' },
            { icon: <FiShield />, color: '#3b82f6', label: 'Cancel Anytime',   desc: 'Koi commitment nahi, jab chahein cancel karein' },
            { icon: <RiCopperCoinLine />, color: '#f59e0b', label: 'Credits System', desc: 'Har purchase par credits earn karein' },
            { icon: <FiStar />, color: '#a855f7', label: 'Exclusive Drops',    desc: 'Members ko pehle naye designs milte hain' },
          ].map((t, i) => (
            <div key={i} className="mem-trust-item">
              <div className="mem-trust-icon" style={{ color: t.color, background: `${t.color}15` }}>{t.icon}</div>
              <p className="mem-trust-label">{t.label}</p>
              <p className="mem-trust-desc">{t.desc}</p>
            </div>
          ))}
        </motion.div>

        {/* Payment Methods */}
        <motion.div className="mem-payment" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          <p className="mem-payment-label">Accepted Payment Methods</p>
          <div className="mem-payment-methods">
            {['JazzCash', 'EasyPaisa', 'Bank Transfer', 'Credit Card'].map(m => (
              <span key={m} className="mem-payment-badge">{m}</span>
            ))}
          </div>
        </motion.div>

      </div>

      <UserFooter />
    </div>
  )
}
