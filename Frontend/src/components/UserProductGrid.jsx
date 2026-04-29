import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'

function TshirtPreview({ baseImage, logo, tshirtBg }) {
  return (
    <div style={{ position: 'relative', width: '100%', aspectRatio: '1', borderRadius: '0.85rem', overflow: 'hidden', background: tshirtBg }}>
      {baseImage && <img src={baseImage} alt="tshirt" style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />}
      {logo && (
        <img
          src={logo.image}
          alt="logo"
          style={{
            position: 'absolute',
            top: `${logo.pos?.top || 45}%`,
            left: `${logo.pos?.left || 50}%`,
            width: `${logo.size || 35}%`,
            height: `${logo.size || 35}%`,
            transform: 'translate(-50%, -50%)',
            objectFit: 'contain',
            pointerEvents: 'none',
            filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.4))',
            transition: 'opacity 0.2s',
          }}
        />
      )}
    </div>
  )
}

const UserProductGrid = ({ navigate }) => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [hoveredLogos, setHoveredLogos] = useState({})
  const { theme } = useTheme()

  const isLight = theme === 'light'
  const cardBg = isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.04)'
  const cardBorder = isLight ? '1px solid rgba(0,0,0,0.12)' : '1px solid rgba(255,255,255,0.08)'
  const tshirtBg = isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.04)'
  const nameColor = isLight ? '#111' : '#fff'
  const logoBorder = isLight ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.1)'
  const logoBg = isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.04)'

  useEffect(() => {
    fetch('http://localhost:5000/api/user-products')
      .then(r => r.json())
      .then(data => setProducts(data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '1rem' }}>
      {[...Array(2)].map((_, i) => <div key={i} style={{ borderRadius: '1rem', background: cardBg, height: 160 }} />)}
    </div>
  )

  if (products.length === 0) return (
    <div style={{ textAlign: 'center', padding: '3rem', color: '#555', fontSize: '0.85rem' }}>
      Admin se products add karo — yahan show honge
    </div>
  )

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem' }}>
      {products.map((product) => {
        const logos = (product.logos || []).filter(l => l.image)
        const activeLogo = hoveredLogos[product._id] || null

        return (
          <motion.div
            key={product._id}
            whileHover={{ y: -4 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 90px',
              gap: '0.75rem',
              alignItems: 'stretch',
              background: cardBg,
              border: cardBorder,
              borderRadius: '1.25rem',
              padding: '0.85rem',
            }}
          >
            {/* LEFT — T-shirt + name + button */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <TshirtPreview baseImage={product.baseImage} logo={activeLogo} tshirtBg={tshirtBg} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <div style={{ width: 3, height: 14, background: '#f97316', borderRadius: 999, flexShrink: 0 }} />
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: nameColor, textTransform: 'uppercase', letterSpacing: '1px' }}>
                  {product.name}
                </span>
              </div>
              <button
                onClick={() => navigate('/design-lab')}
                style={{ padding: '0.45rem', background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.3)', borderRadius: '0.6rem', color: '#f97316', fontSize: '0.65rem', fontWeight: 800, cursor: 'pointer', letterSpacing: '1px' }}
              >
                Customize →
              </button>
            </div>

            {/* RIGHT — Logos stacked */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', justifyContent: 'center' }}>
              {logos.length > 0 ? logos.map((logo, li) => (
                <div
                  key={li}
                  onMouseEnter={() => setHoveredLogos(p => ({ ...p, [product._id]: logo }))}
                  onMouseLeave={() => setHoveredLogos(p => ({ ...p, [product._id]: null }))}
                  style={{
                    width: '100%',
                    aspectRatio: '1',
                    borderRadius: '0.75rem',
                    border: `2px solid ${hoveredLogos[product._id]?.image === logo.image ? '#f97316' : logoBorder}`,
                    background: hoveredLogos[product._id]?.image === logo.image ? 'rgba(249,115,22,0.08)' : logoBg,
                    cursor: 'pointer',
                    padding: '0.35rem',
                    transition: 'all 0.2s',
                    transform: hoveredLogos[product._id]?.image === logo.image ? 'scale(1.08)' : 'scale(1)',
                    overflow: 'hidden',
                    boxShadow: hoveredLogos[product._id]?.image === logo.image ? '0 4px 16px rgba(249,115,22,0.25)' : 'none',
                  }}
                >
                  <img src={logo.image} alt={`logo-${li}`} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
              )) : (
                <div style={{ color: '#444', fontSize: '0.65rem', textAlign: 'center' }}>No logos</div>
              )}
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

export default UserProductGrid
