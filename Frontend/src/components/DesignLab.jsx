import React, { useRef, useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Canvas, useFrame } from '@react-three/fiber'
import { FiArrowLeft } from 'react-icons/fi'
import { motion } from 'framer-motion'
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

function TShirt3D() {
  const groupRef = useRef()
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    groupRef.current.rotation.y = t * 0.5
    groupRef.current.position.y = Math.sin(t * 0.8) * 0.12
  })
  const orange = '#f97316'
  const darkOrange = '#ea580c'
  const light = '#fed7aa'
  return (
    <group ref={groupRef}>
      <mesh position={[0, -0.1, 0]}>
        <boxGeometry args={[1.6, 1.8, 0.08]} />
        <meshPhysicalMaterial color={orange} roughness={0.3} metalness={0.1} clearcoat={1} clearcoatRoughness={0.1} />
      </mesh>
      <mesh position={[-1.1, 0.55, 0]} rotation={[0, 0, 0.55]}>
        <boxGeometry args={[0.9, 0.32, 0.08]} />
        <meshPhysicalMaterial color={orange} roughness={0.3} metalness={0.1} clearcoat={1} clearcoatRoughness={0.1} />
      </mesh>
      <mesh position={[1.1, 0.55, 0]} rotation={[0, 0, -0.55]}>
        <boxGeometry args={[0.9, 0.32, 0.08]} />
        <meshPhysicalMaterial color={orange} roughness={0.3} metalness={0.1} clearcoat={1} clearcoatRoughness={0.1} />
      </mesh>
      <mesh position={[0, 0.95, 0.01]}>
        <torusGeometry args={[0.3, 0.06, 16, 32, Math.PI]} />
        <meshPhysicalMaterial color={darkOrange} roughness={0.2} metalness={0.2} clearcoat={1} />
      </mesh>
      <mesh position={[0, 0.1, 0.05]}>
        <boxGeometry args={[0.5, 0.06, 0.01]} />
        <meshPhysicalMaterial color={light} roughness={0.2} />
      </mesh>
      <mesh position={[0, -0.98, 0.01]}>
        <boxGeometry args={[1.62, 0.06, 0.01]} />
        <meshPhysicalMaterial color={darkOrange} roughness={0.2} />
      </mesh>
    </group>
  )
}

export default function DesignLab() {
  const navigate = useNavigate()
  const { category, product } = useParams()
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [search, setSearch] = useState('')
  const [categories, setCategories] = useState([])

  const selectedProduct = product ? decodeURIComponent(product) : null
  const selectedCategory = category ? decodeURIComponent(category) : null

  useEffect(() => {
    fetch('http://localhost:5000/api/design-lab-categories')
      .then(r => r.json())
      .then(data => { if (data.length > 0) setCategories(data) })
      .catch(() => {})
  }, [])

  const filtered = categories.filter(c =>
    c.label.toLowerCase().includes(search.toLowerCase()) ||
    c.desc.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className={`dl-wrapper${isDark ? '' : ' dl-light'}`}>

      <div className="dl-bg">
        <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
          <WavyGrid color={isDark ? '#f97316' : '#000000'} bgColor={isDark ? '#050505' : '#ffffff'} />
        </Canvas>
      </div>

      <UserNavbar />

      {selectedProduct ? (
        <div className="dl-step1-wrap">
          <div className="dl-step1-header">
            <div className="cp-top-bar">
              <button className="cp-back-btn" onClick={() => navigate(`/design-lab/${encodeURIComponent(selectedCategory)}`)}>
                <FiArrowLeft /> Back
              </button>
              <div className="dl-step1-steps">
                {[
                  { n: 1, label: 'All Categories', path: '/design-lab' },
                  { n: 2, label: 'Category', path: `/design-lab/${encodeURIComponent(selectedCategory)}` },
                  { n: 3, label: 'Color Design', path: null },
                  { n: 4, label: 'Icons Design', path: null },
                  { n: 5, label: 'Final Look', path: null },
                  { n: 6, label: 'Order', path: null },
                ].map(({ n, label, path }) => (
                  <div key={n} className={`dl-step1-pill ${n === 3 ? 'active' : ''}`}
                    style={{ cursor: path ? 'pointer' : 'default' }}
                    onClick={() => path && navigate(path)}>
                    <span className="dl-step1-pill-label">{label}</span>
                  </div>
                ))}
              </div>
            </div>
            <h2 className="dl-step1-heading">Designing: <span>{selectedProduct}</span></h2>
            <p className="dl-step1-sub">Category: {selectedCategory}</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', padding: '2rem 0' }}>
            <div style={{
              width: '100%', maxWidth: 500, height: 420,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(249,115,22,0.3)',
              borderRadius: '2rem', position: 'relative', overflow: 'hidden'
            }}>
              <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
                <ambientLight intensity={0.6} />
                <directionalLight position={[5, 5, 5]} intensity={1.5} />
                <directionalLight position={[-5, -2, -5]} intensity={0.4} color="#fed7aa" />
                <pointLight position={[0, 3, 2]} intensity={0.8} color="#fb923c" />
                <TShirt3D />
              </Canvas>
              <div style={{
                position: 'absolute', bottom: '1rem', right: '1rem',
                fontSize: '0.6rem', fontWeight: 800, letterSpacing: 2,
                textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)',
                background: 'rgba(0,0,0,0.4)', padding: '0.25rem 0.65rem',
                borderRadius: 999, backdropFilter: 'blur(8px)'
              }}>3D Preview</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: isDark ? 'rgba(255,255,255,0.5)' : '#666', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                Full design customization coming soon — color, icons, text & more!
              </p>
              <button onClick={() => navigate(`/design-lab/${encodeURIComponent(selectedCategory)}`)}
                style={{ padding: '0.85rem 2.5rem', background: '#f97316', color: '#fff', border: 'none', borderRadius: 999, fontSize: '0.85rem', fontWeight: 800, cursor: 'pointer' }}>
                ← Choose Different Style
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="dl-step1-wrap">
          <div className="dl-step1-header">
            <div className="cp-top-bar">
              <button className="cp-back-btn" onClick={() => navigate('/user-home')}>
                <FiArrowLeft /> Back
              </button>
              <div className="dl-step1-steps">
                {[
                  { n: 1, label: 'All Categories', path: '/design-lab' },
                  { n: 2, label: 'Category', path: null },
                  { n: 3, label: 'Color Design', path: null },
                  { n: 4, label: 'Icons Design', path: null },
                  { n: 5, label: 'Final Look', path: null },
                  { n: 6, label: 'Order', path: null },
                ].map(({ n, label, path }) => (
                  <div key={n} className={`dl-step1-pill ${n === 1 ? 'active' : ''}`}
                    style={{ cursor: path ? 'pointer' : 'default' }}
                    onClick={() => path && navigate(path)}>
                    <span className="dl-step1-pill-label">{label}</span>
                  </div>
                ))}
              </div>
            </div>
            <h2 className="dl-step1-heading">What do you want to <span>design?</span></h2>
            <p className="dl-step1-sub">Choose a product category to get started</p>
          </div>

          <div className="dl-step1-search-wrap">
            <span className="dl-step1-search-icon">🔍</span>
            <input className="dl-step1-search" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>

          <div className="dl-step1-grid">
            {filtered.map((cat, i) => (
              <motion.button
                key={cat._id || i}
                className="dl-cat-card"
                onClick={() => navigate(`/design-lab/${encodeURIComponent(cat.label)}`)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, type: 'spring', stiffness: 300, damping: 24 }}
                whileHover={{ y: -6, scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                <div className="dl-cat-card-glow" style={{ background: cat.gradient }} />
                <div className="dl-cat-card-img-wrap">
                  <img src={cat.img} alt={cat.label} className="dl-cat-card-img" />
                  <div className="dl-cat-card-img-overlay" style={{ background: cat.gradient }} />
                </div>
                <div className="dl-cat-card-body">
                  <div className="dl-cat-card-label">{cat.label}</div>
                  <div className="dl-cat-card-desc">{cat.desc}</div>
                  <div className="dl-cat-card-footer">
                    <span className="dl-cat-card-count" style={{ background: cat.gradient }}>{cat.count}</span>
                    <span className="dl-cat-card-arrow">→</span>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="dl-step1-empty">
              {search ? `No products found for "${search}"` : 'Admin se categories add karo — yahan show hongi'}
            </div>
          )}
        </div>
      )}

      <Footer />
    </div>
  )
}
