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

// Products per category
const CATEGORY_PRODUCTS = {
  'T-Shirts':       ['Classic T-Shirt','Oversized T-Shirt','V-Neck T-Shirt','Polo T-Shirt','Half Sleeve','Full Sleeve','Crop T-Shirt','Longline T-Shirt','Slim Fit','Graphic Tee','Striped Tee','Henley T-Shirt'],
  'Hoodies':        ['Pullover Hoodie','Zip-Up Hoodie','Oversized Hoodie','Crop Hoodie','Fleece Hoodie','Tech Fleece','Sleeveless Hoodie','Printed Hoodie'],
  'Switers':        ['Classic Sweatshirt','Zip Sweatshirt','Crop Sweatshirt','Pullover','Ribbed Sweater','Knit Sweater','Varsity Sweater'],
  'Trousers':       ['Jogger Pants','Cargo Pants','Chino Pants','Slim Fit Jeans','Wide Leg Jeans','Track Pants','Linen Pants','Shorts','Sweatpants'],
  'Caps':           ['Baseball Cap','Snapback Cap','Dad Cap','Trucker Cap','Flat Cap','5-Panel Cap','Embroidered Cap'],
  'Hats':           ['Bucket Hat','Beanie','Fedora','Cowboy Hat','Fisherman Hat','Wide Brim Hat'],
  'Snokes':         ['Ankle Socks','Crew Socks','No-Show Socks','Knee High Socks','Compression Socks','Printed Socks','Sports Socks'],
  'Mobile Covers':  ['iPhone 16 Pro Max','iPhone 16 Pro','iPhone 16','iPhone 15 Pro Max','iPhone 15 Pro','iPhone 15','iPhone 14 Pro Max','iPhone 14','iPhone 13','Samsung S25 Ultra','Samsung S25+','Samsung S25','Samsung S24 Ultra','Samsung S24','Samsung A55','Samsung A35','Xiaomi 14 Pro','Xiaomi 14','OnePlus 12','OnePlus 11','Google Pixel 9','Google Pixel 8','Realme 12 Pro','Oppo Reno 12'],
  'Laptop Sleeves': ['13" MacBook Sleeve','14" Laptop Sleeve','15.6" Laptop Sleeve','16" MacBook Sleeve','Dell XPS Sleeve','HP Spectre Sleeve','Universal 13"','Universal 15"'],
  'Mouse Pads':     ['Small Mouse Pad','Medium Mouse Pad','Large Mouse Pad','XL Desk Mat','Gaming Mouse Pad','Wireless Charging Pad','Custom Print Pad'],
  'Earbud Cases':   ['AirPods Pro Case','AirPods 3 Case','Samsung Buds Case','Nothing Ear Case','JBL Buds Case','Custom Earbud Case'],
  'Notebooks':      ['A5 Hardcover','A4 Hardcover','A5 Softcover','Spiral Notebook','Dotted Journal','Lined Notebook','Blank Sketchbook'],
  'Books & Covers': ['Custom Book Cover','Planner Cover','Diary Cover','Portfolio Cover','Binder Cover'],
  'Pens':           ['Ballpoint Pen','Gel Pen','Fountain Pen','Marker Set','Highlighter Set','Custom Engraved Pen'],
  'Mugs':           ['Classic Mug','Magic Color Mug','Travel Mug','Tall Latte Mug','Espresso Cup','Glass Mug','Enamel Mug'],
  'Stickers':       ['Die-Cut Sticker','Circle Sticker','Rectangle Sticker','Holographic Sticker','Waterproof Sticker','Sticker Sheet','Laptop Sticker Pack'],
  'Tote Bags':      ['Canvas Tote','Cotton Tote','Printed Tote','Zipper Tote','Mini Tote','Large Tote','Eco Tote'],
  'Backpacks':      ['Classic Backpack','Laptop Backpack','Mini Backpack','Drawstring Bag','Roll-Top Backpack','Travel Backpack'],
  'Duffle Bags':    ['Small Duffle','Medium Duffle','Large Duffle','Gym Bag','Weekend Bag','Sports Duffle'],
  'Wallets':        ['Bifold Wallet','Slim Card Holder','Trifold Wallet','Zip Wallet','Phone Wallet','Leather Wallet'],
  'Cushions':       ['Square Cushion','Rectangle Cushion','Round Cushion','Throw Pillow','Floor Cushion','Custom Print Cushion'],
  'Water Bottles':  ['500ml Bottle','750ml Bottle','1L Bottle','Insulated Flask','Glass Bottle','Sports Bottle','Infuser Bottle'],
  'Wall Arts':      ['A4 Print','A3 Print','A2 Print','Canvas Print','Framed Print','Poster Print','Panoramic Print'],
}

export default function CategoryPage() {
  const { category } = useParams()
  const navigate = useNavigate()
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [search, setSearch] = useState('')
  const [catData, setCatData] = useState(null)

  // Decode category name from URL
  const catName = decodeURIComponent(category)

  useEffect(() => {
    fetch('http://localhost:5000/api/design-lab-categories')
      .then(r => r.json())
      .then(data => {
        const found = data.find(c => c._id === category || c.label === catName)
        if (found) setCatData(found)
      })
      .catch(() => {})
  }, [category])

  const products = CATEGORY_PRODUCTS[catName] || []
  const filtered = products.filter(p => p.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className={`dl-wrapper${isDark ? '' : ' dl-light'}`}>
      <div className="dl-bg">
        <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
          <WavyGrid color={isDark ? '#f97316' : '#000000'} bgColor={isDark ? '#050505' : '#ffffff'} />
        </Canvas>
      </div>

      <UserNavbar />

      <div className="dl-step1-wrap">

        {/* Step pills */}
        <div className="dl-step1-header">
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

          {/* Back + Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'center', marginBottom: '0.5rem' }}>
            <button onClick={() => navigate('/design-lab')} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 999, padding: '0.4rem 1rem', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <FiArrowLeft /> Back
            </button>
          </div>

          <h2 className="dl-step1-heading">
            Pick a <span>{catName}</span>
          </h2>
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
              key={i}
              className="dl-product-card"
              onClick={() => navigate(`/design-lab/${encodeURIComponent(catName)}/${encodeURIComponent(product)}`)}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03, type: 'spring', stiffness: 300, damping: 24 }}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.97 }}
            >
              <div className="dl-product-card-img">
                {catData?.img
                  ? <img src={catData.img} alt={product} />
                  : <div className="dl-product-card-placeholder" style={{ background: catData?.gradient || 'linear-gradient(135deg,#f97316,#ea580c)' }}>
                      <span>👕</span>
                    </div>
                }
              </div>
              <div className="dl-product-card-name">{product}</div>
              <div className="dl-product-card-arrow">→</div>
            </motion.button>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="dl-step1-empty">No products found for "{search}"</div>
        )}

      </div>
    </div>
  )
}
