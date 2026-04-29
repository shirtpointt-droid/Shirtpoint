import React, { useRef, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Canvas, useFrame } from '@react-three/fiber'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import UserNavbar from './UserNavbar'
import Footer from './Footer'
import UserProductGrid from './UserProductGrid'
import '../css/UserHome.css'

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

export default function UserHome() {
  const { user } = useAuth()
  const { theme } = useTheme()
  const navigate = useNavigate()
  const [current, setCurrent] = useState(0)
  const [hoveredCard, setHoveredCard] = useState(null)
  const [tshirtColor, setTshirtColor] = useState('#ffffff')
  const [previewTshirt, setPreviewTshirt] = useState('')
  const [colorCards, setColorCards] = useState([])
  const [hiwImages, setHiwImages] = useState([])
  const [collImages, setCollImages] = useState([])
  const canvasRef = useRef(null)

  const [newDropsData, setNewDropsData] = useState([])

  const defaultCards = [
    { name: 'T-Shirts', imgDefault: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=95&fit=crop', imgHover: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&q=95&fit=crop' },
    { name: 'Hoodies',  imgDefault: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800&q=95&fit=crop', imgHover: 'https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?w=800&q=95&fit=crop' },
    { name: 'Kurtas',   imgDefault: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=95&fit=crop', imgHover: 'https://images.unsplash.com/photo-1594938298603-c8148c4b4e5b?w=800&q=95&fit=crop' },
    { name: 'Polos',    imgDefault: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=800&q=95&fit=crop', imgHover: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800&q=95&fit=crop' },
    { name: 'Jackets',  imgDefault: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=95&fit=crop', imgHover: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=95&fit=crop' },
    { name: 'Caps',     imgDefault: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&q=95&fit=crop', imgHover: 'https://images.unsplash.com/photo-1534215754734-18e55d13e346?w=800&q=95&fit=crop' },
  ]

  const [slides, setSlides] = useState([
    { img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80', title: 'Premium Collection' },
    { img: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&q=80', title: 'Custom Designs' },
    { img: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800&q=80', title: 'New Arrivals' },
  ])



  const defaultHiwImgs = [
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=90&fit=crop',
    'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=400&q=90&fit=crop',
    'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&q=90&fit=crop',
    'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&q=90&fit=crop',
    'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400&q=90&fit=crop',
    'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&q=90&fit=crop',
    'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400&q=90&fit=crop',
    'https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?w=400&q=90&fit=crop',
  ]

  const defaultBoxes = [
    { top: { title: 'Neon Cyber Tee', img: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&q=95&fit=crop' }, bot: { title: 'Minimalist Cloud Hoodie', img: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800&q=95&fit=crop' } }
  ]
  const activeBoxes = newDropsData.length > 0
    ? newDropsData.map(d => ({ top: { title: d.topTitle, img: d.topImage }, bot: { title: d.bottomTitle, img: d.bottomImage }, color: '#f97316', glow: 'rgba(249,115,22,0.8)' }))
    : defaultBoxes.map(d => ({ ...d, color: '#f97316', glow: 'rgba(249,115,22,0.8)' }))

  useEffect(() => {
    fetch('http://localhost:5000/api/user-banners').then(r => r.json()).then(data => { if (data.length > 0) setSlides(data.map(b => ({ img: b.image, title: b.title || '' }))) }).catch(() => {})
    fetch('http://localhost:5000/api/category-cards').then(r => r.json()).then(data => { if (data.length > 0) setColorCards(data) }).catch(() => {})
    fetch('http://localhost:5000/api/preview-tshirt').then(r => r.json()).then(data => { if (data.image) setPreviewTshirt(data.image) }).catch(() => {})
    fetch('http://localhost:5000/api/how-it-works').then(r => r.json()).then(data => { if (data.length > 0) setHiwImages(data.map(d => d.image)) }).catch(() => {})
    fetch('http://localhost:5000/api/collection-images').then(r => r.json()).then(data => { if (data.length > 0) setCollImages(data) }).catch(() => {})
    fetch('http://localhost:5000/api/new-drop').then(r => r.json()).then(data => { if (Array.isArray(data) && data.length > 0) setNewDropsData(data) }).catch(() => {})
  }, [])

  useEffect(() => {
    if (!previewTshirt || !canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const d = imageData.data
      const r = parseInt(tshirtColor.slice(1, 3), 16)
      const g = parseInt(tshirtColor.slice(3, 5), 16)
      const b = parseInt(tshirtColor.slice(5, 7), 16)
      for (let i = 0; i < d.length; i += 4) {
        if (d[i + 3] < 10) continue
        const brightness = (0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]) / 255
        d[i]     = Math.round(r * brightness)
        d[i + 1] = Math.round(g * brightness)
        d[i + 2] = Math.round(b * brightness)
      }
      ctx.putImageData(imageData, 0, 0)
    }
    img.src = previewTshirt
  }, [previewTshirt, tshirtColor])

  useEffect(() => {
    const timer = setInterval(() => setCurrent(p => (p + 1) % slides.length), 3000)
    return () => clearInterval(timer)
  }, [slides.length])

  const hiwImgs = hiwImages.length > 0 ? hiwImages : defaultHiwImgs
  const brands = [
    { name: 'Khaadi' }, { name: 'Gul Ahmed' }, { name: 'Sapphire' }, { name: 'Outfitters' },
    { name: 'Alkaram' }, { name: 'Bonanza' }, { name: 'Nishat' }, { name: 'Breakout' },
  ]

  return (
    <div className={`uh-wrapper${theme === 'light' ? ' light' : ''}`}>

      <div className="uh-bg">
        <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
          <WavyGrid color={theme === 'light' ? '#000000' : '#f97316'} bgColor={theme === 'light' ? '#ffffff' : '#050505'} />
        </Canvas>
      </div>

      <UserNavbar />

      <div className="uh-page">

        {/* SLIDER */}
        <div className="uh-slider">
          <div className="uh-slider-track" style={{ transform: `translateX(-${current * 100}%)` }}>
            {slides.map((s, i) => (
              <div key={i} className="uh-slide">
                <img src={s.img} alt={s.title} className="uh-slide-img" />
              </div>
            ))}
          </div>
        </div>

        {/* TRUST */}
        <div className="trust-wrap" style={{ marginLeft: '-1.5rem', marginRight: '-1.5rem', paddingLeft: '1.5rem' }}>
          <div className="trust-ratings">
            <div className="trust-rating-box">
              <div className="trust-rating-name"><span style={{color:'#00b67a'}}>★</span> Trustpilot</div>
              <div className="trust-rating-row">
                <span className="trust-score">4.6</span>
                <span className="trust-stars">★★★★★</span>
                <span className="trust-count">6,936 reviews</span>
              </div>
            </div>
            <div className="trust-divider" />
            <div className="trust-rating-box">
              <div className="trust-rating-name" style={{fontStyle:'italic'}}>Shopify</div>
              <div className="trust-rating-row">
                <span className="trust-score">4.8</span>
                <span className="trust-stars">★★★★★</span>
                <span className="trust-count">3,098 reviews</span>
              </div>
            </div>
          </div>
          <div className="trust-logos-wrap">
            <div className="trust-fade-left" />
            <div className="trust-fade-right" />
            <div className="trust-logos-track">
              {[...brands, ...brands].map((b, i) => (
                <div key={i} className="trust-logo-item">
                  <span className="trust-logo-text">{b.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* NEW DROPS */}
        <div className="new-drops-section">
          <div className="new-drops-header">
            <div>
              <span className="uh-eyebrow">Fresh Arrivals</span>
              <h2 className="uh-heading">NEW DROPS <span className="uh-heading-outline">2026</span></h2>
            </div>
            <button className="uh-view-all" onClick={() => navigate('/marketplace')}>View Seller Place →</button>
          </div>
          <div className="nd-grid">
            {activeBoxes.map((box, bi) => (
              <div key={bi} className="nd-card" style={{ '--ec': box.color, '--eg': box.glow }} onClick={() => navigate('/marketplace')}>
                <div className="nd-frame nd-frame-top">
                  <img src={box.top.img} alt={box.top.title} className="nd-frame-img" />
                  <div className="nd-frame-overlay" />
                  <span className="nd-badge">LIMITED</span>
                  <span className="nd-frame-title">{box.top.title}</span>
                </div>
                <div className="nd-crack-zone">
                  <svg width="100%" height="100%" viewBox="0 0 300 48" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                    <defs><filter id={`glow${bi}`}><feGaussianBlur stdDeviation="1.5" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter></defs>
                    <polyline points="0,24 18,24 26,10 34,36 44,14 52,32 62,18 72,30 82,12 92,34 102,20 112,28 120,24 138,24 148,8 158,38 168,16 178,32 188,20 196,28 204,24 222,24 232,12 242,34 252,18 262,30 272,14 282,36 292,10 300,24" fill="none" stroke="var(--ec)" strokeWidth="1.5" filter={`url(#glow${bi})`} />
                    <polyline points="100,24 112,28 120,24 138,24 148,8 158,38 168,16 178,32 188,20 196,28 204,24" fill="none" stroke="white" strokeWidth="0.8" opacity="0.9" />
                    <line x1="62" y1="18" x2="55" y2="4" stroke="var(--ec)" strokeWidth="0.8" opacity="0.6" />
                    <line x1="148" y1="8" x2="142" y2="0" stroke="white" strokeWidth="0.6" opacity="0.5" />
                    <line x1="92" y1="34" x2="86" y2="46" stroke="var(--ec)" strokeWidth="0.8" opacity="0.6" />
                    <line x1="158" y1="38" x2="164" y2="48" stroke="white" strokeWidth="0.6" opacity="0.5" />
                  </svg>
                </div>
                <div className="nd-frame nd-frame-bottom">
                  <img src={box.bot.img} alt={box.bot.title} className="nd-frame-img" />
                  <div className="nd-frame-overlay nd-frame-overlay-bottom" />
                  <span className="nd-frame-title nd-frame-title-bottom">{box.bot.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* DESIGN STUDIO */}
        <div className="ct-section-wrap">
          <div className="ct-section">
            <div className="ct-left">
              <span className="ct-eyebrow">Design Studio</span>
              <h2 className="ct-heading">All Custom<br /><span className="ct-heading-outline">T-Shirts</span></h2>
              <p className="ct-desc">Create your own design. Make your unique look on premium quality fabric.</p>
              <p className="ct-color-label">T-Shirt Color</p>
              <div className="ct-colors">
                {['#ffffff','#f5f0eb','#e8d5c4','#f97316','#ef4444','#ec4899','#a855f7','#3b82f6','#06b6d4','#22c55e','#eab308','#111111','#1e293b','#44403c','#065f46','#7c3aed'].map((c, i) => (
                  <button key={i} className={`ct-color-dot${tshirtColor === c ? ' active' : ''}`} style={{ background: c }} onClick={() => setTshirtColor(c)} />
                ))}
              </div>
              <div className="ct-preview">
                <canvas ref={canvasRef} className="ct-preview-img" />
                <span className="ct-preview-label">Live Preview</span>
              </div>
              <button className="ct-btn" onClick={() => navigate('/design-lab')}>Start Designing →</button>
            </div>
            <div className="ct-right">
              <div className="ct-grid">
                {(colorCards.length > 0 ? colorCards : defaultCards).map((c, i) => (
                  <motion.div key={i} className="ct-card" onMouseEnter={() => setHoveredCard(i)} onMouseLeave={() => setHoveredCard(null)} onClick={() => navigate('/design-lab')} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                    <div className="ct-card-img-wrap">
                      <img src={hoveredCard === i && c.imgHover ? c.imgHover : c.imgDefault} alt={c.name} className="ct-card-img" />
                    </div>
                    <div className="ct-card-footer">
                      <span className="ct-card-name">{c.name}</span>
                      <span className="ct-card-arrow">→</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* HOW IT WORKS */}
        <div className="ct-section-wrap">
          <div className="hiw-section">
            <div className="hiw-left">
              <span className="hiw-eyebrow">How It Works</span>
              <h2 className="hiw-heading">Design Your Own<br /><span className="hiw-heading-accent">T-Shirt</span></h2>
              <p className="hiw-desc">First pick any T-shirt style you like — then select your color. Every design will be uniquely yours.</p>
              <div className="hiw-steps">
                <div className="hiw-step"><div className="hiw-step-num">01</div><div><div className="hiw-step-title">Pick a Style</div><div className="hiw-step-desc">T-Shirt, Hoodie, Kurta — whatever you like</div></div></div>
                <div className="hiw-step"><div className="hiw-step-num">02</div><div><div className="hiw-step-title">Select a Color</div><div className="hiw-step-desc">Choose your favorite from 16+ colors</div></div></div>
              </div>
              <button className="hiw-btn" onClick={() => navigate('/design-lab')}>Open Design Lab →</button>
            </div>
            <div className="hiw-right">
              <div className="hiw-scroll-wrap">
                <div className="hiw-scroll-track">
                  {[...hiwImgs, ...hiwImgs].map((img, i) => (
                    <div key={i} className={`hiw-frame hiw-frame-${i % 3}`}>
                      <img src={img} alt="style" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PROMO BANNER */}
        <div className="promo-banner">
          <div className="promo-bg-glow" />
          <div className="promo-bg-glow promo-bg-glow-2" />
          <div className="promo-content">
            <div className="promo-left">
              <span className="promo-tag">🎁 Welcome Gift</span>
              <h2 className="promo-heading">{user?.name ? `Hey ${user.name.split(' ')[0]},` : 'Welcome!'}<br />You Got <span className="promo-heading-accent">1,000 Free</span> Credits!</h2>
              <p className="promo-desc">Start designing your custom T-shirt right now — 1,000 credits are already in your account, on us.</p>
              <button className="promo-cta" onClick={() => navigate('/design-lab')}>Start Designing →</button>
            </div>
            <div className="promo-right">
              <div className="promo-badge-wrap">
                <div className="promo-badge">
                  <span className="promo-badge-num">1,000</span>
                  <span className="promo-badge-label">CREDITS</span>
                </div>
                <div className="promo-stats">
                  <div className="promo-stat"><span>🎁</span><p>Free Gift</p></div>
                  <div className="promo-stat"><span>⚡</span><p>Use Now</p></div>
                  <div className="promo-stat"><span>✅</span><p>No Card</p></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="ct-section-wrap">
          <div className="uh-products-section">
            <div className="uh-products-header">
              <div>
                <span className="ct-eyebrow">Our Collection</span>
                <h2 className="ct-heading">Choose from <span className="ct-heading-outline">494</span> Products</h2>
                <p className="ct-desc">From apparel to home & living, we've got the perfect product for your brand.</p>
              </div>
              <button className="hiw-btn" onClick={() => navigate('/design-lab')}>Browse All →</button>
            </div>
            <UserProductGrid navigate={navigate} />
          </div>
        </div>

        {/* COLLECTION SPLIT SECTION */}
        <div className="ct-section-wrap">
          <div className="coll-split">
            <div className="coll-images">
              <div className="coll-img-stack">
                {(() => {
                  const defaultImgs = [
                    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=90&fit=crop',
                    'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=500&q=90&fit=crop',
                    'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500&q=90&fit=crop',
                  ]
                  const imgs = collImages.length >= 3 ? collImages.map(c => c.image) : defaultImgs
                  return imgs.slice(0, 3).map((img, i) => (
                    <div key={i} className={`coll-img-card coll-img-${i + 1}`}>
                      <img src={img} alt={`t${i + 1}`} />
                    </div>
                  ))
                })()}
              </div>
            </div>
            <div className="coll-info">
              <span className="ct-eyebrow">Why Choose Us</span>
              <h2 className="ct-heading">500+ Free<br /><span className="ct-heading-outline">Designs</span></h2>
              <p className="ct-desc">Premium quality garments with unlimited customization. Your brand, your style.</p>
              <div className="coll-steps">
                <div className="coll-step"><div className="coll-step-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.57a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.57a2 2 0 00-1.34-2.23z"/></svg></div><div><div className="coll-step-title">500+ Garment Styles</div><div className="coll-step-desc">T-Shirts, Hoodies, Polos, Kurtas & more</div></div></div>
                <div className="coll-step"><div className="coll-step-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 011.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg></div><div><div className="coll-step-title">Free Design Icons</div><div className="coll-step-desc">500+ premium icons — no extra cost</div></div></div>
                <div className="coll-step"><div className="coll-step-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></div><div><div className="coll-step-title">Fast Delivery</div><div className="coll-step-desc">3–5 business days across Pakistan</div></div></div>
                <div className="coll-step"><div className="coll-step-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg></div><div><div className="coll-step-title">Affordable Pricing</div><div className="coll-step-desc">Bulk discounts available on all orders</div></div></div>
                <div className="coll-step"><div className="coll-step-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div><div><div className="coll-step-title">Premium Quality</div><div className="coll-step-desc">100% organic cotton, HD print guaranteed</div></div></div>
              </div>
              <button className="ct-btn" onClick={() => navigate('/design-lab')}>Start Designing →</button>
            </div>
          </div>
        </div>

      </div>

      <Footer />
    </div>
  )
}
