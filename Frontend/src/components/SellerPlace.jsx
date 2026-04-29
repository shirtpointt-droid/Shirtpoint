import React, { useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Canvas, useFrame } from '@react-three/fiber'
import { motion } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import UserNavbar from './UserNavbar'
import Footer from './Footer'
import '../css/SellerPlace.css'

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
    <>
      <color attach="background" args={[bgColor]} />
      <mesh ref={meshRef} rotation={[-Math.PI / 3, 0, 0]} position={[0, 0, -2]}>
        <planeGeometry args={[100, 100, 100, 100]} />
        <meshBasicMaterial color={color} wireframe transparent opacity={0.07} />
      </mesh>
    </>
  )
}

const CATEGORIES = ['All', 'Streetwear', 'Minimalist', 'Cyberpunk', 'Vintage', 'Abstract', 'Urdu Calligraphy']

export default function SellerPlace() {
  const { theme } = useTheme()
  const { user } = useAuth()
  const navigate = useNavigate()
  const light = theme === 'light'

  const [designs, setDesigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [wishlist, setWishlist] = useState([])
  const [hero, setHero] = useState({ eyebrow: '🛍️ Community Designs', title: 'SELLER PLACE', desc: 'Pakistani designers ke unique designs — apni T-shirt pe laga ke order karo.', stat1Label: 'Designs', stat2Value: '100+', stat2Label: 'Designers', stat3Value: 'PKR', stat3Label: 'Credits', card1Image: '', card2Image: '', card3Image: '' })

  useEffect(() => {
    fetch('http://localhost:5000/api/seller-designs')
      .then(r => r.json())
      .then(data => { setDesigns(data); setLoading(false) })
      .catch(() => setLoading(false))
    fetch('http://localhost:5000/api/seller-place-hero')
      .then(r => r.json())
      .then(data => { if (data._id) setHero(data) })
      .catch(() => {})
  }, [])

  const toggleWishlist = (id) => setWishlist(w => w.includes(id) ? w.filter(x => x !== id) : [...w, id])

  const filtered = designs
    .filter(d => activeCategory === 'All' || d.category === activeCategory)
    .filter(d => d.title.toLowerCase().includes(search.toLowerCase()) || d.designerName.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sortBy === 'newest' ? new Date(b.createdAt) - new Date(a.createdAt) : sortBy === 'price' ? a.price - b.price : b.sales - a.sales)

  return (
    <div className={`sp-wrapper${light ? ' sp-light' : ''}`}>
      <div className="sp-bg">
        <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
          <WavyGrid color={light ? '#000' : '#f97316'} bgColor={light ? '#fff' : '#050505'} />
        </Canvas>
      </div>

      <UserNavbar />

      <div className="sp-page">

        {/* HERO */}
        <motion.div className="sp-hero" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <div className="sp-hero-left">
            <span className="sp-eyebrow">{hero.eyebrow}</span>
            <h1 className="sp-title">{hero.title.split(' ')[0]}<br /><span className="sp-title-outline">{hero.title.split(' ').slice(1).join(' ')}</span></h1>
            <p className="sp-desc">{hero.desc}</p>
            <div className="sp-hero-stats">
              <div className="sp-stat"><span>{designs.length}</span><p>{hero.stat1Label}</p></div>
              <div className="sp-stat"><span>{hero.stat2Value}</span><p>{hero.stat2Label}</p></div>
              <div className="sp-stat"><span>{hero.stat3Value}</span><p>{hero.stat3Label}</p></div>
            </div>
          </div>
          <div className="sp-hero-right">
            <div className="sp-hero-cards">
              {[hero.card1Image, hero.card2Image, hero.card3Image].map((img, i) => {
                const field = `card${i+1}Image`
                const posX = hero[`${field}X`] ?? 50
                const posY = hero[`${field}Y`] ?? 50
                const scale = hero[`${field}Scale`] ?? 100
                return (
                  <div key={i} className={`sp-hero-card sp-hero-card-${i}`}>
                    {img
                      ? <img src={img} alt={`card${i+1}`} style={{ objectFit: 'cover', objectPosition: `${posX}% ${posY}%`, transform: `scale(${scale/100})`, transformOrigin: `${posX}% ${posY}%` }} />
                      : <div className="sp-hero-card-empty"><span>🎨</span></div>
                    }
                    <div className="sp-hero-card-shadow" />
                  </div>
                )
              })}
            </div>
          </div>
        </motion.div>

        {/* TOOLBAR */}
        <div className="sp-toolbar">
          <div className="sp-search-wrap">
            <span className="sp-search-icon">🔍</span>
            <input className="sp-search" placeholder="Search designs or designers..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="sp-sort" value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="newest">Newest</option>
            <option value="trending">Trending</option>
            <option value="price">Lowest Price</option>
          </select>
        </div>

        {/* CATEGORIES */}
        <div className="sp-cats">
          {CATEGORIES.map(c => (
            <button key={c} className={`sp-cat${activeCategory === c ? ' active' : ''}`} onClick={() => setActiveCategory(c)}>{c}</button>
          ))}
        </div>

        {/* DESIGNS GRID */}
        {loading ? (
          <div className="sp-loading">
            {[...Array(6)].map((_, i) => <div key={i} className="sp-skeleton" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="sp-empty">
            <span>🎨</span>
            <p>{designs.length === 0 ? 'Admin se designs approve karwao — yahan show honge' : 'Koi design nahi mila'}</p>
          </div>
        ) : (
          <div className="sp-grid">
            {filtered.map((d, i) => (
              <motion.div key={d._id} className="sp-card"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }} whileHover={{ y: -6 }}>

                {/* Image */}
                <div className="sp-card-img-wrap">
                  <img src={d.image} alt={d.title} className="sp-card-img" />
                  <button className={`sp-wish${wishlist.includes(d._id) ? ' active' : ''}`} onClick={() => toggleWishlist(d._id)}>♥</button>
                  <span className="sp-card-cat">{d.category}</span>
                  {d.verified && <span className="sp-verified-badge">✅</span>}
                </div>

                {/* Info */}
                <div className="sp-card-body">
                  <div className="sp-card-top">
                    <h3 className="sp-card-title">{d.title}</h3>
                    <span className="sp-card-price">{d.price} CR</span>
                  </div>
                  <p className="sp-card-designer">by {d.designerName}</p>
                  <div className="sp-card-meta">
                    <span>🛍️ {d.sales} sold</span>
                    <span>♥ {d.likes}</span>
                  </div>
                  <button className="sp-try-btn" onClick={() => navigate('/design-lab')}>
                    👕 Try on T-Shirt
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}



      </div>

      <Footer />
    </div>
  )
}
