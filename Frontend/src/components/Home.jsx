import React, { useRef, useMemo, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, Image } from '@react-three/drei'
import { FiArrowUpRight } from 'react-icons/fi'
import * as THREE from 'three'
import '../css/Home.css'
import Footer from './Footer'
import Navbar from './Navbar'
import ScrollBtn from './ScrollBtn'
import ProductGrid from './ProductGrid'

const BRAND_DEFAULT = [
  { tag: 'Getting Started', title: 'How Print-on-Demand Works', desc: 'Find out the basics of print-on-demand and start your brand without any inventory.', image: '' },
  { tag: 'Products', title: 'Mega T Shirt Designs Products', desc: 'Learn about our curated selection of customizable products for your brand.', image: '' },
  { tag: 'Integrations',    title: 'Connect Your Store',        desc: 'Get your products in front of customers no matter where they shop.',                  image: '' },
  { tag: 'Pricing',         title: 'Calculate Your Profit',     desc: 'Find out how much profit you can make on every product you sell.',                    image: '' },
]

function WavyGrid({ color = 'black' }) {
  const meshRef = useRef()
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const positions = meshRef.current.geometry.attributes.position.array
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i]
      const y = positions[i + 1]
      positions[i + 2] = Math.sin(x * 0.5 + t) * Math.cos(y * 0.5 + t) * 0.5
    }
    meshRef.current.geometry.attributes.position.needsUpdate = true
  })
  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 3, 0, 0]} position={[0, 0, -2]}>
      <planeGeometry args={[100, 100, 100, 100]} />
      <meshBasicMaterial color={color} wireframe={true} transparent opacity={color === 'black' ? 0.08 : 0.35} />
    </mesh>
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

function CarouselCard({ url, radius, angle }) {
  const meshRef = useRef()
  const x = Math.sin(angle) * radius
  const z = Math.cos(angle) * radius
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.quaternion.copy(meshRef.current.parent.quaternion).invert()
    }
  })
  return (
    <group position={[x, 0, z]}>
      <Image ref={meshRef} url={url} transparent side={THREE.DoubleSide} scale={[2.2, 3, 1]} />
    </group>
  )
}

function RingGroup({ images, radius }) {
  const groupRef = useRef()
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  useFrame(({ clock }) => {
    groupRef.current.rotation.y = clock.getElapsedTime() * 0.4
  })
  const cards = useMemo(() => {
    return images.map((url, i) => {
      const angle = (i / images.length) * Math.PI * 2
      return <CarouselCard key={i} url={url} radius={isMobile ? 1.8 : radius} angle={angle} />
    })
  }, [images, radius, isMobile])
  return <group ref={groupRef}>{cards}</group>
}

function Home() {
  const navigate = useNavigate()
  const [images, setImages] = useState([])
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])
  const [split, setSplit] = useState({
    eyebrow: 'Premium Collection', heading: '3D CUSTOM T-SHIRT',
    description: 'Your unique vision meets our premium craftsmanship. Design without limits.', btn1: 'Customize Now', btn2: 'View Details', videoUrl: '',
    features: [{ title: 'Fabric', value: '100% Organic Cotton' }, { title: 'Fit', value: 'Oversized / Regular' }, { title: 'Delivery', value: '3–5 Business Days' }, { title: 'Returns', value: 'Easy 7-Day Return' }]
  })
  const [split2, setSplit2] = useState({
    eyebrow: 'Exclusive Designs', heading: 'STYLE YOUR OWN WAY',
    description: 'Express your true self through custom apparel that defines your personality.', btn1: 'Explore Now', btn2: 'Learn More', videoUrl: '',
    features: [{ title: 'Material', value: 'Premium Blend' }, { title: 'Colors', value: '20+ Options' }, { title: 'Sizes', value: 'XS to 3XL' }, { title: 'Print', value: 'HD Quality' }]
  })
  const [reviews, setReviews] = useState([
    { name: 'Alex R.', city: 'Karachi', text: 'The 3D design lab is a game changer. I could see exactly how my design would look on the shirt before ordering. 10/10 quality!', rating: 5 },
    { name: 'Sarah M.', city: 'Lahore', text: 'Best custom apparel platform I\'ve used. The HD printing is crisp and the fabric feels premium. Highly recommend.', rating: 5 },
    { name: 'Zain U.', city: 'Islamabad', text: 'Fastest delivery I\'ve experienced for custom products. Received my shirt in 3 days and the fit is perfect.', rating: 5 },
    { name: 'Maya J.', city: 'Faisalabad', text: 'Love the sustainable focus and the vibrant prints. Finally a brand that delivers what it promises.', rating: 5 }
  ])
  const [brandCards, setBrandCards] = useState([])

  useEffect(() => {
    fetch('http://localhost:5000/api/carousel').then(r => r.json()).then(data => setImages(data.map(d => d.url))).catch(() => {})
    fetch('http://localhost:5000/api/split').then(r => r.json()).then(data => setSplit(data)).catch(() => {})
    fetch('http://localhost:5000/api/split2').then(r => r.json()).then(data => setSplit2(data)).catch(() => {})
    // fetch('http://localhost:5000/api/reviews').then(r => r.json()).then(data => setReviews(data)).catch(() => {})
    fetch('http://localhost:5000/api/brand-guide').then(r => r.json()).then(data => setBrandCards(data.length ? data : BRAND_DEFAULT)).catch(() => setBrandCards(BRAND_DEFAULT))
  }, [])

  return (
    <div className="home-wrapper">

      {/* Single Global 3D Background */}
      <div className="home-bg">
        <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
          <WavyGrid color="#cccccc" />
        </Canvas>
      </div>

      {/* Navbar */}
      <Navbar />

      {/* Hero */}
      <section className="home-hero">
        <div className="home-center-text">
          <p className="home-center-eyebrow">Est. 2026 — Premium Streetwear</p>
          <h1 className="home-center-heading">
            <span>MEGA T SHIRT</span>
            <span className="home-center-outline">DESIGNS</span>
          </h1>
          <p className="home-center-tagline">Wear Bold. Live Free. Define Your Style.</p>
        </div>
        <div className="home-hero-box">
          <div className="home-hero-canvas">
            <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
              <ambientLight intensity={0.5} />
              <directionalLight position={[5, 5, 5]} intensity={1.5} />
              <directionalLight position={[-5, -2, -5]} intensity={0.4} color="#fed7aa" />
              <pointLight position={[0, 3, 2]} intensity={0.8} color="#fb923c" />
              <TShirt3D />
            </Canvas>
          </div>
          {/* Brand Name removed */}
          <h2 className="home-hero-title">Premium T-Shirts Designs</h2>
          <p className="home-hero-sub">Wear the vibe. Own the style.</p>
          <a href="#" className="home-hero-btn">Shop Now</a>
        </div>
        <div className="home-hero-carousel">
          <Canvas camera={{ position: [0, isMobile ? 0.5 : 2, isMobile ? 5 : 10], fov: isMobile ? 70 : 45 }} dpr={[1, 2]}>
            <ambientLight intensity={1.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <RingGroup images={images} radius={4} />
            <Environment preset="city" />
            <OrbitControls enableZoom={false} enablePan={false} minPolarAngle={Math.PI / 3} maxPolarAngle={Math.PI / 2.2} />
          </Canvas>
        </div>
      </section>

      {/* Marquee */}
      <div className="home-marquee-wrap">
        <div className="home-marquee-track">
          {[...Array(3)].map((_, j) => (
            <span key={j} className="home-marquee-inner">
              <span>NEW COLLECTION</span><span className="home-marquee-dot"></span>
              <span>FREE DELIVERY</span><span className="home-marquee-dot"></span>
              <span>PREMIUM QUALITY</span><span className="home-marquee-dot"></span>
              <span>LIMITED EDITION</span><span className="home-marquee-dot"></span>
              <span>SHOP NOW</span><span className="home-marquee-dot"></span>
            </span>
          ))}
        </div>
      </div>

      {/* Split 1 */}
      <div className="split-wrapper" style={{ background: '#050505', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
            <WavyGrid color="#f97316" />
          </Canvas>
        </div>
        <motion.div className="split-video-side" initial={{ opacity: 0, x: -60 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
          <video key={split.videoUrl} src={split.videoUrl || 'https://assets.mixkit.co/videos/preview/mixkit-man-wearing-a-black-t-shirt-standing-against-a-white-40430-large.mp4'} autoPlay muted loop playsInline className="split-video" disablePictureInPicture controlsList="nodownload nofullscreen noremoteplayback" />
          <div className="split-video-overlay" />
        </motion.div>
        <motion.div className="split-info-side" initial={{ opacity: 0, x: 60 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }} viewport={{ once: true }}>
          <span className="split-eyebrow">{split.eyebrow}</span>
          <h2 className="split-heading">{split.heading}</h2>
          <div className="split-divider" />
          <p className="split-desc">{split.description}</p>
          <div className="split-btns">
            <button className="split-btn-primary" onClick={() => navigate('/design-lab')}>{split.btn1}</button>
            <button className="split-btn-outline">{split.btn2}</button>
          </div>
          <div className="split-features">
            {split.features?.map((f, i) => <div key={i}><h4>{f.title}</h4><p>{f.value}</p></div>)}
          </div>
        </motion.div>
      </div>

      {/* ===== MIDDLE HERO between videos ===== */}
      <section className="mid-hero">
        <div className="mid-hero-side">Est. 2024 // Mega T Shirt Designs Studio</div>

        <motion.div className="mid-hero-tag" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
          Future of Apparel
        </motion.div>

        <motion.h2 className="mid-hero-heading" initial={{ opacity: 0, x: -80 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
          DIGITAL<br /><span className="mid-hero-outline">THREADS</span>
        </motion.h2>

        {/* Stats Row */}
        <motion.div
          className="mid-hero-stats"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {[
            { value: '10K+', label: 'Happy Customers' },
            { value: '494', label: 'Custom Products' },
            { value: '3–5', label: 'Days Delivery' },
            { value: '100%', label: 'Organic Cotton' },
          ].map((s, i) => (
            <div key={i} className="mid-hero-stat">
              <span className="mid-hero-stat-value">{s.value}</span>
              <span className="mid-hero-stat-label">{s.label}</span>
            </div>
          ))}
        </motion.div>

        <div className="mid-hero-bottom">
          <motion.p className="mid-hero-desc" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.6 }} viewport={{ once: true }}>
            Experience your unique designs in a professional 3D space. Real-time visualization on premium quality fabrics.
          </motion.p>
          <motion.button className="mid-hero-btn" onClick={() => navigate('/design-lab')} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.93 }}>
            Shop Now
          </motion.button>
        </div>

        {/* Floating Badges removed */}

      </section>

      {/* Split 2 - Reversed */}
      <div className="split-wrapper split-wrapper-2" style={{ background: '#050505', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
            <WavyGrid color="#f97316" />
          </Canvas>
        </div>
        <motion.div className="split-info-side split-info-blue" initial={{ opacity: 0, x: -60 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
          <span className="split-eyebrow-blue">{split2.eyebrow}</span>
          <h2 className="split-heading">{split2.heading}</h2>
          <div className="split-divider split-divider-blue" />
          <p className="split-desc">{split2.description}</p>
          <div className="split-btns">
            <button className="split-btn-blue" onClick={() => navigate('/design-lab')}>{split2.btn1}</button>
            <button className="split-btn-outline">{split2.btn2}</button>
          </div>
          <div className="split-features split-features-blue">
            {split2.features?.map((f, i) => <div key={i}><h4>{f.title}</h4><p>{f.value}</p></div>)}
          </div>
        </motion.div>
        <motion.div className="split-video-side" initial={{ opacity: 0, x: 60 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }} viewport={{ once: true }}>
          <video key={split2.videoUrl} src={split2.videoUrl || 'https://assets.mixkit.co/videos/preview/mixkit-man-wearing-a-black-t-shirt-standing-against-a-white-40430-large.mp4'} autoPlay muted loop playsInline className="split-video" disablePictureInPicture controlsList="nodownload nofullscreen noremoteplayback" />
          <div className="split-video-overlay" />
        </motion.div>
      </div>

      {/* Printful Style Product Grid */}
      <section className="py-20 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex gap-8 items-start">
            {/* Left Sidebar */}
            <div className="w-80 flex-shrink-0">
              <motion.div 
                className="rounded-3xl p-8 sticky top-8"
                style={{
                  background: 'linear-gradient(145deg, rgba(255, 210, 170, 0.75), rgba(251, 146, 60, 0.55))',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.5)',
                  boxShadow: '0 20px 60px rgba(234, 88, 12, 0.2), inset 0 1px 0 rgba(255,255,255,0.7)'
                }}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-black text-black mb-4 leading-tight">
                  Choose from <span className="text-orange-500">494</span> beautiful custom products
                </h2>
                <p className="text-gray-600 text-base mb-8 leading-relaxed">
                  From apparel to home & living, we've got the perfect product for your brand
                </p>
                <button 
                  className="w-full bg-black text-white px-6 py-4 rounded-2xl font-bold text-base hover:bg-gray-800 transition-colors shadow-lg"
                  onClick={() => navigate('/design-lab')}
                >
                  Browse all products
                </button>
              </motion.div>
            </div>
            
            {/* Right Product Grid — bottom aligned */}
            <div className="flex-1">
              <ProductGrid navigate={navigate} />
            </div>
          </div>
        </div>
      </section>

      {/* ===== PROMO BANNER ===== */}
      <section className="py-16 relative overflow-hidden">
        <motion.div
          className="container mx-auto px-6"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div
            className="relative rounded-3xl overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 40%, #f97316 100%)',
              minHeight: '220px',
            }}
          >
            {/* Decorative circles */}
            <div style={{ position: 'absolute', top: -60, right: -60, width: 300, height: 300, borderRadius: '50%', background: 'rgba(249,115,22,0.15)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: -40, right: 100, width: 200, height: 200, borderRadius: '50%', background: 'rgba(249,115,22,0.1)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', top: 20, right: 200, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />

            {/* Content */}
            <div className="relative z-10 flex items-center justify-between px-12 py-10 gap-8">
              {/* Left Text */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className="text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full"
                    style={{ background: '#f97316', color: '#fff' }}
                  >
                    Limited Offer
                  </span>
                  <span className="text-gray-400 text-xs font-semibold tracking-widest uppercase">New Members Only</span>
                </div>

                <h2
                  className="font-black leading-tight mb-2"
                  style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: '#fff', letterSpacing: '-1px' }}
                >
                  Sign Up & Get
                  <span style={{ color: '#f97316' }}> 100 </span>
                  Free Credits
                </h2>

                <p className="text-gray-400 text-sm max-w-md leading-relaxed">
                  Create your free account today and start designing with 100 credits — no card required.
                </p>
              </div>

              {/* Right CTA */}
              <div className="flex flex-col items-center gap-4 flex-shrink-0">
                <div
                  className="text-center px-6 py-3 rounded-2xl"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  <p className="text-5xl font-black text-white">100</p>
                  <p className="text-orange-400 text-xs font-bold uppercase tracking-widest mt-1">Credits Free</p>
                </div>

                <motion.button
                  className="font-black uppercase tracking-widest px-8 py-4 rounded-2xl text-sm"
                  style={{ background: '#f97316', color: '#fff', border: 'none', cursor: 'pointer', letterSpacing: '2px' }}
                  whileHover={{ scale: 1.05, background: '#ea580c' }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate('/signup')}
                >
                  Sign Up Free →
                </motion.button>

                <p className="text-gray-600 text-xs">No credit card required</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ===== WHY CHOOSE US ===== */}
      <section className="why-us-section">
        <div className="why-us-bg">
          <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
            <WavyGrid color="#f97316" />
          </Canvas>
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            className="why-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="why-eyebrow">Why Choose Us</span>
            <h2 className="why-heading">Everything you need for <span className="why-highlight">Premium</span> apparel</h2>
          </motion.div>

          <div className="why-grid">
            {[
              { icon: '⚡', title: 'No Minimum Order', desc: 'Order even a single T-shirt. No bulk requirement, just your unique style.' },
              { icon: '💎', title: 'HD Printing', desc: 'Premium high-definition prints with vibrant colors that never fade or crack.' },
              { icon: '🚚', title: 'Fast Delivery', desc: 'Custom products delivered to your doorstep in just 3–5 business days.' },
              { icon: '🏆', title: 'Premium Quality', desc: '100% organic cotton and high-stitch count for maximum comfort and durability.' }
            ].map((item, i) => (
              <motion.div 
                key={i} 
                className="why-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="why-icon-wrap">{item.icon}</div>
                <h3 className="why-card-title">{item.title}</h3>
                <p className="why-card-desc">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== REVIEWS SECTION ===== */}
      <section className="reviews-section">
        <div className="reviews-header">
          <span className="reviews-eyebrow">What People Say</span>
          <h2 className="reviews-heading">Loved by <span className="reviews-highlight">Thousands</span></h2>
          <div className="reviews-stars-row">
            {'★★★★★'.split('').map((s, i) => <span key={i} className="reviews-star">{s}</span>)}
            <span className="reviews-avg">4.9 / 5</span>
          </div>
        </div>
        <div className="reviews-track-wrap">
          <div className="reviews-track">
            {[...Array(2)].map((_, rep) => (
              reviews.map((r, i) => (
                <div key={`${rep}-${i}`} className="review-card">
                  <div className="review-card-top">
                    <div className="review-avatar">{r.name[0]}</div>
                    <div>
                      <p className="review-name">{r.name}</p>
                      <p className="review-city">{r.city}</p>
                    </div>
                    <div className="review-badge">Verified ✓</div>
                  </div>
                  <div className="review-stars">
                    {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                  </div>
                  <p className="review-text">{r.text}</p>
                </div>
              ))
            ))}
          </div>
        </div>
      </section>

      {/* ===== BRAND GUIDE SECTION ===== */}
      <section className="py-20 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-black text-black mb-4 leading-tight">
              Let's build your brand <span className="home-center-outline" style={{ WebkitTextStroke: '2px #f97316', WebkitTextFillColor: 'transparent' }}>together</span>
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Our blogposts, guides, and video tutorials have everything you need to build a thriving business
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {brandCards.map((item, i) => (
              <motion.div key={item._id || i} className="group cursor-pointer" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.1 }} viewport={{ once: true }} whileHover={{ y: -8 }} onClick={() => navigate('/design-lab')}>
                <div className="h-full rounded-3xl overflow-hidden flex flex-col transition-all duration-300 group-hover:shadow-2xl" style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.3)' }}>
                  <div className="w-full h-40 overflow-hidden">
                    {item.image ? <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /> : <div className="w-full h-full bg-orange-100 flex items-center justify-center"><span className="text-5xl opacity-30">📷</span></div>}
                  </div>
                  <div className="p-5 flex flex-col gap-2 flex-1">
                    <h3 className="font-black text-gray-900 text-base leading-tight group-hover:text-orange-500 transition-colors">{item.title}</h3>
                    <p className="text-gray-700 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <ScrollBtn />

    </div>
  )
}

export default Home
