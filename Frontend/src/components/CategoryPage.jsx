import React, { useRef, useState, useEffect, Suspense } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, OrbitControls } from '@react-three/drei'
import { motion } from 'framer-motion'
import { FiArrowLeft, FiSearch } from 'react-icons/fi'
import { useTheme } from '../context/ThemeContext'
import UserNavbar from './UserNavbar'
import Footer from './Footer'
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

function TShirt3DCard({ color = '#f97316', hovered = false }) {
  const groupRef = useRef()
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    groupRef.current.rotation.y = hovered ? t * 1.5 : t * 0.4
    groupRef.current.position.y = Math.sin(t * 0.8) * 0.08
  })
  const dark = '#c2410c'
  const light = '#fed7aa'
  return (
    <group ref={groupRef} scale={0.72}>
      <mesh position={[0, -0.1, 0]}>
        <boxGeometry args={[1.6, 1.8, 0.08]} />
        <meshPhysicalMaterial color={color} roughness={0.3} metalness={0.1} clearcoat={1} clearcoatRoughness={0.1} />
      </mesh>
      <mesh position={[-1.1, 0.55, 0]} rotation={[0, 0, 0.55]}>
        <boxGeometry args={[0.9, 0.32, 0.08]} />
        <meshPhysicalMaterial color={color} roughness={0.3} metalness={0.1} clearcoat={1} />
      </mesh>
      <mesh position={[1.1, 0.55, 0]} rotation={[0, 0, -0.55]}>
        <boxGeometry args={[0.9, 0.32, 0.08]} />
        <meshPhysicalMaterial color={color} roughness={0.3} metalness={0.1} clearcoat={1} />
      </mesh>
      <mesh position={[0, 0.95, 0.01]}>
        <torusGeometry args={[0.3, 0.06, 16, 32, Math.PI]} />
        <meshPhysicalMaterial color={dark} roughness={0.2} metalness={0.2} clearcoat={1} />
      </mesh>
      <mesh position={[0, 0.1, 0.05]}>
        <boxGeometry args={[0.5, 0.06, 0.01]} />
        <meshPhysicalMaterial color={light} roughness={0.2} />
      </mesh>
      <mesh position={[0, -0.98, 0.01]}>
        <boxGeometry args={[1.62, 0.06, 0.01]} />
        <meshPhysicalMaterial color={dark} roughness={0.2} />
      </mesh>
    </group>
  )
}

const TSHIRT_COLORS = [
  '#f97316','#111111','#ffffff','#3b82f6','#ef4444',
  '#8b5cf6','#10b981','#f59e0b','#ec4899','#64748b',
  '#1e293b','#065f46','#7c3aed','#dc2626','#0ea5e9',
]

function GLBModel({ url }) {
  const { scene } = useGLTF(url)
  return <primitive object={scene} scale={1.5} position={[0, -1, 0]} />
}

export default function CategoryPage() {
  const { category } = useParams()
  const navigate = useNavigate()
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [search, setSearch] = useState('')
  const [catData, setCatData] = useState(null)
  const [products, setProducts] = useState([])
  const [garments, setGarments] = useState([])
  const [lightbox, setLightbox] = useState(null)
  const [loading, setLoading] = useState(true)
  const [hoveredCard, setHoveredCard] = useState(null)
  const [selectedColor, setSelectedColor] = useState('#f97316')

  const catName = decodeURIComponent(category)

  useEffect(() => {
    setLoading(true)
    fetch('http://localhost:5000/api/design-lab-categories')
      .then(r => r.json())
      .then(data => {
        const found = data.find(c => c._id === category || c.label === catName)
        if (found) setCatData(found)
      }).catch(() => {})

    Promise.all([
      fetch(`http://localhost:5000/api/category-products?category=${encodeURIComponent(catName)}`).then(r => r.json()),
      fetch(`http://localhost:5000/api/garment-mockups`).then(r => r.json())
    ]).then(([catProds, allGarments]) => {
      setProducts(catProds)
      const filtered = allGarments.filter(g =>
        g.category?.toLowerCase() === catName.toLowerCase()
      )
      setGarments(filtered)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [category])

  // Merge both sources — category products + garment mockups
  const allItems = [
    ...products.map(p => ({ _id: p._id, name: p.name, image: p.image, source: 'product' })),
    ...garments.map(g => ({ _id: g._id, name: g.label, image: g.url, source: 'garment' }))
  ]
  const filtered = allItems.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))

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
              {[
                {n:1, label:'All Categories'},
                {n:2, label:'Category'},
                {n:3, label:'Color Design'},
                {n:4, label:'Icons Design'},
                {n:5, label:'Final Look'},
                {n:6, label:'Order'},
              ].map(({n, label}) => (
                <div key={n} className={`dl-step1-pill ${n === 2 ? 'active' : ''}`}
                  onClick={() => n === 1 && navigate('/design-lab')}
                  style={{ cursor: n === 1 ? 'pointer' : 'default' }}
                >
                  <span className="dl-step1-pill-label">{label}</span>
                </div>
              ))}
            </div>
          </div>
          <h2 className="dl-step1-heading">Pick a <span>{catName}</span></h2>
          <p className="dl-step1-sub">{loading ? 'Loading...' : `${allItems.length} products available — select one to customize`}</p>
        </div>

        {/* Search */}
        <div className="dl-step1-search-wrap">
          <span className="dl-step1-search-icon"><FiSearch /></span>
          <input className="dl-step1-search" placeholder={`Search ${catName}...`} value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        {/* Color Picker */}
        {!loading && filtered.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: isDark ? '#aaa' : '#555' }}>T-Shirt Color:</span>
            {TSHIRT_COLORS.map(c => (
              <button key={c} onClick={() => setSelectedColor(c)} style={{
                width: 26, height: 26, borderRadius: '50%', background: c,
                border: selectedColor === c ? '3px solid #f97316' : '2px solid rgba(255,255,255,0.2)',
                cursor: 'pointer', transition: 'transform 0.15s',
                transform: selectedColor === c ? 'scale(1.3)' : 'scale(1)',
                boxShadow: selectedColor === c ? '0 0 0 2px rgba(249,115,22,0.4)' : 'none'
              }} />
            ))}
          </div>
        )}

        {/* Products Grid */}
        <div className="dl-products-grid">
          {loading
            ? [...Array(12)].map((_, i) => <div key={i} className="dl-product-skeleton" />)
            : filtered.map((product, i) => (
              <motion.button
                key={product._id || i}
                className="dl-product-card"
                style={{ background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)', padding: 0, overflow: 'hidden' }}
                onClick={() => navigate(`/design-lab/${encodeURIComponent(catName)}/${encodeURIComponent(product.name)}`)}
                onMouseEnter={() => setHoveredCard(i)}
                onMouseLeave={() => setHoveredCard(null)}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03, type: 'spring', stiffness: 300, damping: 24 }}
                whileHover={{ y: -6 }}
                whileTap={{ scale: 0.97 }}
              >
                {/* 3D Canvas or Image */}
                <div style={{ width: '100%', aspectRatio: '1', position: 'relative' }}>
                  {product.image ? (
                    <img src={product.image} alt={product.name}
                      style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
                  ) : (
                    <Canvas camera={{ position: [0, 0, 4], fov: 50 }} style={{ width: '100%', height: '100%' }}>
                      <ambientLight intensity={0.6} />
                      <directionalLight position={[5, 5, 5]} intensity={1.5} />
                      <directionalLight position={[-5, -2, -5]} intensity={0.4} color="#fed7aa" />
                      <pointLight position={[0, 3, 2]} intensity={0.8} color="#fb923c" />
                      {product.modelUrl ? (
                        <Suspense fallback={null}>
                          <GLBModel url={product.modelUrl} />
                          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={hoveredCard === i ? 4 : 1.5} />
                        </Suspense>
                      ) : (
                        <TShirt3DCard color={product.color || selectedColor} hovered={hoveredCard === i} />
                      )}
                    </Canvas>
                  )}
                  {product.image && (
                    <button className="dl-product-zoom-btn" onClick={e => { e.stopPropagation(); setLightbox(product) }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                        <line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
                      </svg>
                    </button>
                  )}
                </div>
                <div className="dl-product-card-name">{product.name}</div>
                <div className="dl-product-card-arrow">→</div>
              </motion.button>
            ))
          }
        </div>

        {!loading && filtered.length === 0 && (
          <div className="dl-step1-empty">{allItems.length === 0 ? 'Admin se products add karo' : `No products found for "${search}"`}</div>
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
      <Footer />
    </div>
  )
}
