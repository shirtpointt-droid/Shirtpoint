import React, { useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Canvas, useFrame } from '@react-three/fiber'
import { FiSun, FiMoon, FiArrowLeft } from 'react-icons/fi'
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

export default function DesignLab() {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [search, setSearch] = useState('')
  const [categories, setCategories] = useState([])

  useEffect(() => {
    fetch('http://localhost:5000/api/design-lab-categories')
      .then(r => r.json())
      .then(data => { if (data.length > 0) setCategories(data) })
      .catch(() => {})
  }, [])

  const displayCats = categories

  const filtered = displayCats.filter(c =>
    c.label.toLowerCase().includes(search.toLowerCase()) ||
    c.desc.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className={`dl-wrapper${isDark ? '' : ' dl-light'}`}>

      {/* 3D Background */}
      <div className="dl-bg">
        <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
          <WavyGrid
            color={isDark ? '#f97316' : '#000000'}
            bgColor={isDark ? '#050505' : '#ffffff'}
          />
        </Canvas>
      </div>

      <UserNavbar />

      {/* Page Content */}
      <div className="dl-step1-wrap">

        {/* Header */}
        <div className="dl-step1-header">
          <div className="cp-top-bar">
            <button className="cp-back-btn" onClick={() => navigate('/user-home')}>
              <FiArrowLeft /> Back
            </button>
            <div className="dl-step1-steps">
              {[
                {n:1, label:'All Categories', path:'/design-lab'},
                {n:2, label:'Category', path:null},
                {n:3, label:'Color Design', path:null},
                {n:4, label:'Icons Design', path:null},
                {n:5, label:'Final Look', path:null},
                {n:6, label:'Order', path:null},
              ].map(({n, label, path}) => (
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

        {/* Search */}
        <div className="dl-step1-search-wrap">
          <span className="dl-step1-search-icon">🔍</span>
          <input
            className="dl-step1-search"
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Category Grid */}
        <div className="dl-step1-grid">
          {filtered.map((cat, i) => (
            <motion.button
              key={cat._id || cat.id || i}
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
      <Footer />
    </div>
  )
}
