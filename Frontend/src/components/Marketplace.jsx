import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Canvas, useFrame } from '@react-three/fiber'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import UserNavbar from './UserNavbar'
import UserFooter from './UserFooter'
import { FiSearch, FiHeart, FiStar, FiShoppingCart, FiTrendingUp, FiFilter } from 'react-icons/fi'
import { RiVipCrownFill, RiVerifiedBadgeFill } from 'react-icons/ri'
import '../css/Marketplace.css'

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

const CATEGORIES = ['All', 'Streetwear', 'Minimalist', 'Urdu Calligraphy', 'Cyberpunk', 'Vintage', 'Abstract']

const DESIGNS = [
  { id: 1, title: 'Neon Samurai',      designer: 'ArtByAbrar',  verified: true,  price: 150, rating: 4.9, sales: 142, likes: 520, category: 'Cyberpunk',    city: 'Karachi' },
  { id: 2, title: 'Urdu Waves',        designer: 'DesignKing',  verified: true,  price: 120, rating: 4.7, sales: 98,  likes: 380, category: 'Urdu Calligraphy', city: 'Lahore' },
  { id: 3, title: 'Street Ghost',      designer: 'PakStreet',   verified: false, price: 80,  rating: 4.5, sales: 67,  likes: 210, category: 'Streetwear',   city: 'Islamabad' },
  { id: 4, title: 'Minimal Black',     designer: 'CleanCuts',   verified: true,  price: 100, rating: 4.8, sales: 201, likes: 670, category: 'Minimalist',   city: 'Karachi' },
  { id: 5, title: 'Cyber Dragon',      designer: 'ArtByAbrar',  verified: true,  price: 200, rating: 5.0, sales: 55,  likes: 290, category: 'Cyberpunk',    city: 'Karachi' },
  { id: 6, title: 'Vintage Eagle',     designer: 'RetroVibes',  verified: false, price: 90,  rating: 4.3, sales: 44,  likes: 160, category: 'Vintage',      city: 'Peshawar' },
  { id: 7, title: 'Lahori Kalam',      designer: 'DesignKing',  verified: true,  price: 130, rating: 4.6, sales: 88,  likes: 340, category: 'Urdu Calligraphy', city: 'Lahore' },
  { id: 8, title: 'Abstract Bloom',    designer: 'ColorSoul',   verified: false, price: 110, rating: 4.4, sales: 33,  likes: 120, category: 'Abstract',     city: 'Karachi' },
]

const ARTISTS = [
  { name: 'ArtByAbrar',  sales: 197, verified: true,  city: 'Karachi' },
  { name: 'DesignKing',  sales: 186, verified: true,  city: 'Lahore'  },
  { name: 'CleanCuts',   sales: 201, verified: true,  city: 'Karachi' },
  { name: 'PakStreet',   sales: 67,  verified: false, city: 'Islamabad' },
]

const LIVE_FEED = [
  'Abrar just earned 150 Credits from "Neon Samurai"',
  'Ali bought "Urdu Waves" from Lahore',
  'Sara just earned 100 Credits from "Minimal Black"',
  'Ahmed bought "Cyber Dragon" from Karachi',
  'Zara just earned 80 Credits from "Street Ghost"',
]

export default function Marketplace() {
  const { user } = useAuth()
  const { theme } = useTheme()
  const navigate = useNavigate()
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [wishlist, setWishlist] = useState([])
  const [sortBy, setSortBy] = useState('trending')
  const [feedIdx] = useState(0)

  const toggleWishlist = (id) => setWishlist(w => w.includes(id) ? w.filter(x => x !== id) : [...w, id])

  const filtered = DESIGNS
    .filter(d => activeCategory === 'All' || d.category === activeCategory)
    .filter(d => d.title.toLowerCase().includes(search.toLowerCase()) || d.designer.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sortBy === 'trending' ? b.sales - a.sales : sortBy === 'rating' ? b.rating - a.rating : a.price - b.price)

  return (
    <div className="mp-wrapper">
      <div className="mp-bg">
        <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
          <WavyGrid color={theme === 'light' ? '#000' : '#f97316'} bgColor={theme === 'light' ? '#fff' : '#050505'} />
        </Canvas>
      </div>

      <UserNavbar />

      {/* Live Feed Strip */}
      <div className="mp-live-strip">
        <span className="mp-live-dot" />
        <span className="mp-live-label">LIVE</span>
        <div className="mp-live-track">
          {[...LIVE_FEED, ...LIVE_FEED].map((f, i) => <span key={i} className="mp-live-item">{f} •</span>)}
        </div>
      </div>

      <div className="mp-page">

        {/* Header */}
        <motion.div className="mp-header" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div>
            <p className="mp-eyebrow">🛍️ Community Designs</p>
            <h1 className="mp-title">MARKETPLACE</h1>
            <p className="mp-sub">Buy designs from verified artists. Wear something unique.</p>
          </div>
          {user && (
            <button className="mp-sell-btn" onClick={() => navigate('/designer-dashboard')}>
              🎨 Sell Your Design
            </button>
          )}
        </motion.div>

        {/* Search + Sort */}
        <motion.div className="mp-toolbar" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="mp-search-wrap">
            <FiSearch className="mp-search-icon" />
            <input className="mp-search" placeholder="Search designs or artists..."
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="mp-sort">
            <FiFilter />
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="mp-sort-select">
              <option value="trending">Trending</option>
              <option value="rating">Top Rated</option>
              <option value="price">Lowest Price</option>
            </select>
          </div>
        </motion.div>

        {/* Categories */}
        <motion.div className="mp-cats" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
          {CATEGORIES.map(c => (
            <button key={c} className={`mp-cat ${activeCategory === c ? 'active' : ''}`}
              onClick={() => setActiveCategory(c)}>{c}</button>
          ))}
        </motion.div>

        <div className="mp-grid">

          {/* LEFT: Designs */}
          <div className="mp-main">

            {/* Trending Banner */}
            <motion.div className="mp-trending-banner" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <FiTrendingUp />
              <span>Trending in <strong>Karachi</strong> this week — Cyberpunk & Minimalist designs are 🔥</span>
            </motion.div>

            {/* Designs Grid */}
            <div className="mp-designs-grid">
              {filtered.length === 0
                ? <p className="mp-empty">No designs found</p>
                : filtered.map((d, i) => (
                  <motion.div key={d.id} className="mp-design-card"
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * i }} whileHover={{ y: -4 }}>

                    {/* Thumb */}
                    <div className="mp-card-thumb">
                      <img src="https://www.pngarts.com/files/5/Plain-Black-T-Shirt-PNG-Image-Background.png" alt={d.title} />
                      <button className={`mp-wish-btn ${wishlist.includes(d.id) ? 'active' : ''}`}
                        onClick={() => toggleWishlist(d.id)}>
                        <FiHeart />
                      </button>
                      <div className="mp-card-category">{d.category}</div>
                    </div>

                    {/* Info */}
                    <div className="mp-card-info">
                      <div className="mp-card-top">
                        <h3 className="mp-card-title">{d.title}</h3>
                        <span className="mp-card-price">+{d.price} CR</span>
                      </div>
                      <div className="mp-card-designer">
                        <span className="mp-designer-name">
                          {d.designer}
                          {d.verified && <RiVerifiedBadgeFill className="mp-verified" />}
                        </span>
                        <span className="mp-card-city">📍 {d.city}</span>
                      </div>
                      <div className="mp-card-meta">
                        <span><FiStar className="mp-star" /> {d.rating}</span>
                        <span>🛍️ {d.sales} sold</span>
                        <span><FiHeart className="mp-heart-sm" /> {d.likes}</span>
                      </div>
                      <button className="mp-buy-btn">
                        <FiShoppingCart /> Use This Design
                      </button>
                    </div>
                  </motion.div>
                ))
              }
            </div>
          </div>

          {/* RIGHT: Sidebar */}
          <aside className="mp-sidebar">

            {/* Verified Artists */}
            <motion.div className="mp-card" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>
              <h3 className="mp-card-heading">⭐ Verified Artists</h3>
              <div className="mp-artists">
                {ARTISTS.map((a, i) => (
                  <div key={a.name} className="mp-artist">
                    <div className="mp-artist-rank">#{i + 1}</div>
                    <div className="mp-artist-avatar">{a.name[0]}</div>
                    <div className="mp-artist-info">
                      <p className="mp-artist-name">
                        {a.name}
                        {a.verified && <RiVerifiedBadgeFill className="mp-verified" />}
                      </p>
                      <p className="mp-artist-meta">{a.sales} sales • {a.city}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Sell CTA */}
            <motion.div className="mp-sell-card" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}>
              <div className="mp-sell-glow" />
              <h3 className="mp-sell-title">🎨 Become a Designer</h3>
              <p className="mp-sell-desc">List your designs aur har sale pe Credits kamao. Aapka design, aapki earning!</p>
              <div className="mp-sell-steps">
                <div className="mp-sell-step"><span>1</span> Design banao Lab mein</div>
                <div className="mp-sell-step"><span>2</span> Royalty fee set karo</div>
                <div className="mp-sell-step"><span>3</span> Har sale pe earn karo</div>
              </div>
              <button className="mp-sell-cta" onClick={() => navigate('/designer-dashboard')}>
                Start Selling →
              </button>
            </motion.div>

            {/* Wishlist Count */}
            {wishlist.length > 0 && (
              <motion.div className="mp-card mp-wishlist-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h3 className="mp-card-heading"><FiHeart /> Wishlist ({wishlist.length})</h3>
                <p className="mp-wishlist-hint">Aapne {wishlist.length} design save kiye hain</p>
                <button className="mp-wishlist-btn">View Wishlist →</button>
              </motion.div>
            )}

          </aside>
        </div>
      </div>

      <UserFooter />
    </div>
  )
}
