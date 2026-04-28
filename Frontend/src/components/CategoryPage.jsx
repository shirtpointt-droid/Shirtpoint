import React, { useRef, useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Canvas, useFrame } from '@react-three/fiber'
import { motion } from 'framer-motion'
import { FiArrowLeft, FiSearch } from 'react-icons/fi'
import { useTheme } from '../context/ThemeContext'
import UserNavbar from './UserNavbar'
import '../css/DesignLab.css'

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

// Products per category — removed, now fetched from Admin

export default function CategoryPage() {
  const { category } = useParams()
  const navigate = useNavigate()
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [search, setSearch] = useState('')
  const [catData, setCatData] = useState(null)
  const [products, setProducts] = useState([])
  const [lightbox, setLightbox] = useState(null)

  const catName = decodeURIComponent(category)

  useEffect(() => {
    fetch('http://localhost:5000/api/design-lab-categories')
      .then(r => r.json())
      .then(data => {
        const found = data.find(c => c._id === category || c.label === catName)
        if (found) setCatData(found)
      }).catch(() => {})

    fetch(`http://localhost:5000/api/category-products?category=${encodeURIComponent(catName)}`)
      .then(r => r.json())
      .then(data => setProducts(data))
      .catch(() => {})
  }, [category])

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className={`dl-wrapper${isDark ? '' : ' dl-light'}`}>
      <div className="dl-bg">
        <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
          <WavyGrid color={isDark ? '#f97316' : '#000000'} bgColor={isDark ? '#050505' : '#ffffff'} />
        </Canvas>
      </div>

      <UserNavbar />

      <div className="dl-step1-wrap">

        {/* Header */}
        <div className="dl-step1-header">
          <div className="cp-top-bar">
            <button className="cp-back-btn" onClick={() => navigate('/design-lab')}>
              <FiArrowLeft /> Back
            </button>
            <div className="dl-step1-steps">
              {[1,2,3,4].map(n => (
                <div key={n} className={`dl-step1-pill ${n === 2 ? 'active' : ''}`}>
                  <span className="dl-step1-pill-num">{`0${n}`}</span>
                  <span className="dl-step1-pill-label">
                    {n === 1 && 'Category'}{n === 2 && 'Product'}{n === 3 && 'Design'}{n === 4 && 'Order'}
                  </span>
                </div>
              ))}
            </div>
            <div style={{ width: 80 }} />
          </div>
          <h2 className="dl-step1-heading">Pick a <span>{catName}</span></h2>
          <p className="dl-step1-sub">{products.length} products available — select one to customize</p>
        </div>

        {/* Search */}
        <div className="dl-step1-search-wrap">
          <span className="dl-step1-search-icon"><FiSearch /></span>
          <input className="dl-step1-search" placeholder={`Search ${catName}...`} value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        {/* Products Grid */}
        <div className="dl-products-grid">
          {filtered.map((product, i) => (
            <motion.button
              key={product._id || i}
              className="dl-product-card"
              onClick={() => navigate(`/design-lab/${encodeURIComponent(catName)}/${encodeURIComponent(product.name)}`)}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03, type: 'spring', stiffness: 300, damping: 24 }}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.97 }}
            >
              <div className="dl-product-card-img">
                {product.image
                  ? <img src={product.image} alt={product.name} />
                  : <div className="dl-product-card-placeholder" style={{ background: catData?.gradient || 'linear-gradient(135deg,#f97316,#ea580c)' }}>
                      <span>👕</span>
                    </div>
                }
              </div>
              {product.image && (
                <button className="dl-product-zoom-btn" onClick={e => { e.stopPropagation(); setLightbox(product) }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"/>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    <line x1="11" y1="8" x2="11" y2="14"/>
                    <line x1="8" y1="11" x2="14" y2="11"/>
                  </svg>
                </button>
              )}
              <div className="dl-product-card-name">{product.name}</div>
              <div className="dl-product-card-arrow">→</div>
            </motion.button>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="dl-step1-empty">{products.length === 0 ? 'Admin se products add karo' : `No products found for "${search}"`}</div>
        )}

        {/* LIGHTBOX */}
        {lightbox && (
          <div className="dl-lightbox-overlay" onClick={() => setLightbox(null)}>
            <div className="dl-lightbox-box" onClick={e => e.stopPropagation()}>
              <img src={lightbox.image} alt={lightbox.name} className="dl-lightbox-img" />
              <div className="dl-lightbox-name">{lightbox.name}</div>
              <button className="dl-lightbox-close" onClick={() => setLightbox(null)}>✕</button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
