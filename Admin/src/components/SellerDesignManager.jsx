import React, { useState, useEffect } from 'react'
import { removeBg } from '../utils/removeBg'

const CATEGORIES = ['General', 'Streetwear', 'Minimalist', 'Cyberpunk', 'Vintage', 'Abstract', 'Urdu Calligraphy']

export default function SellerDesignManager() {
  const [designs, setDesigns] = useState([])
  const [form, setForm] = useState({ title: '', designerName: '', image: '', category: 'General', price: 100, verified: false })
  const [uploading, setUploading] = useState(false)
  const [filter, setFilter] = useState('all')

  // Hero state
  const [hero, setHero] = useState({ eyebrow: '🛍️ Community Designs', title: 'SELLER PLACE', desc: 'Pakistani designers ke unique designs — apni T-shirt pe laga ke order karo.', stat1Label: 'Designs', stat2Value: '100+', stat2Label: 'Designers', stat3Value: 'PKR', stat3Label: 'Credits', card1Image: '', card2Image: '', card3Image: '' })
  const [heroUploading, setHeroUploading] = useState('')
  const [heroSaved, setHeroSaved] = useState(false)

  const fetch_ = () => fetch('http://localhost:5000/api/seller-designs/admin').then(r => r.json()).then(setDesigns).catch(() => {})
  useEffect(() => {
    fetch_()
    fetch('http://localhost:5000/api/seller-place-hero').then(r => r.json()).then(data => { if (data._id) setHero(data) }).catch(() => {})
  }, [])

  const upload = async (file) => {
    const fd = new FormData(); fd.append('image', file)
    const res = await fetch('http://localhost:5000/api/upload', { method: 'POST', body: fd })
    return (await res.json()).url
  }

  const handleHeroImgUpload = async (e, field) => {
    const file = e.target.files[0]; if (!file) return
    setHeroUploading(field)
    const url = await upload(file)
    setHero(p => ({ ...p, [field]: url }))
    setHeroUploading('')
  }

  const handleHeroSave = async () => {
    await fetch('http://localhost:5000/api/seller-place-hero', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(hero) })
    setHeroSaved(true)
    setTimeout(() => setHeroSaved(false), 2000)
  }

  const removeHeroBg = async (field) => {
    setHeroUploading(field + '_rmbg')
    try {
      const blob = await removeBg(hero[field])
      const fd = new FormData(); fd.append('image', blob, `hero_${field}_clean.png`)
      const res = await fetch('http://localhost:5000/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      setHero(p => ({ ...p, [field]: data.url }))
    } catch { alert('Background remove nahi hua') }
    setHeroUploading('')
  }

  const handleSave = async () => {
    if (!form.title || !form.designerName || !form.image) return
    await fetch('http://localhost:5000/api/seller-designs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    setForm({ title: '', designerName: '', image: '', category: 'General', price: 100, verified: false })
    fetch_()
  }

  const updateStatus = async (id, status) => {
    await fetch(`http://localhost:5000/api/seller-designs/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) })
    fetch_()
  }

  const toggleVerified = async (id, verified) => {
    await fetch(`http://localhost:5000/api/seller-designs/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ verified: !verified }) })
    fetch_()
  }

  const handleDelete = async (id) => {
    await fetch(`http://localhost:5000/api/seller-designs/${id}`, { method: 'DELETE' })
    fetch_()
  }

  const filtered = designs.filter(d => filter === 'all' || d.status === filter)

  return (
    <div className="admin-page">
      {/* HERO SECTION */}
      <div className="admin-carousel-section">
        <h2 className="admin-carousel-title">🏠 Seller Place — Hero Section</h2>
        <p className="admin-carousel-sub">Page ka top hero section customize karo — title, description, stats aur 3 floating cards</p>
        <div className="admin-product-form">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="admin-split-field">
              <label>Eyebrow Text</label>
              <input value={hero.eyebrow} onChange={e => setHero(p => ({ ...p, eyebrow: e.target.value }))} placeholder="e.g. 🛍️ Community Designs" />
            </div>
            <div className="admin-split-field">
              <label>Main Title</label>
              <input value={hero.title} onChange={e => setHero(p => ({ ...p, title: e.target.value }))} placeholder="e.g. SELLER PLACE" />
            </div>
            <div className="admin-split-field" style={{ gridColumn: '1/-1' }}>
              <label>Description</label>
              <input value={hero.desc} onChange={e => setHero(p => ({ ...p, desc: e.target.value }))} placeholder="Hero description..." />
            </div>
            <div className="admin-split-field">
              <label>Stat 1 Label (auto = designs count)</label>
              <input value={hero.stat1Label} onChange={e => setHero(p => ({ ...p, stat1Label: e.target.value }))} placeholder="Designs" />
            </div>
            <div className="admin-split-field">
              <label>Stat 2 Value + Label</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input value={hero.stat2Value} onChange={e => setHero(p => ({ ...p, stat2Value: e.target.value }))} placeholder="100+" style={{ width: 80 }} />
                <input value={hero.stat2Label} onChange={e => setHero(p => ({ ...p, stat2Label: e.target.value }))} placeholder="Designers" />
              </div>
            </div>
            <div className="admin-split-field">
              <label>Stat 3 Value + Label</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input value={hero.stat3Value} onChange={e => setHero(p => ({ ...p, stat3Value: e.target.value }))} placeholder="PKR" style={{ width: 80 }} />
                <input value={hero.stat3Label} onChange={e => setHero(p => ({ ...p, stat3Label: e.target.value }))} placeholder="Credits" />
              </div>
            </div>
          </div>

          {/* 3 Card Images */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', marginTop: '1.5rem' }}>
            {['card1Image', 'card2Image', 'card3Image'].map((field, i) => {
              const posX = hero[`${field}X`] ?? 50
              const posY = hero[`${field}Y`] ?? 50
              const scale = hero[`${field}Scale`] ?? 100
              return (
                <div key={field} className="admin-split-field">
                  <label>Card {i + 1} Image</label>
                  <div className="admin-image-upload" onClick={() => !heroUploading && document.getElementById(`hero_${field}`).click()}>
                    {hero[field]
                      ? <img src={hero[field]} alt={`card${i+1}`} className="admin-image-preview"
                          style={{
                            objectFit: 'cover',
                            objectPosition: `${posX}% ${posY}%`,
                            transform: `scale(${scale/100})`,
                            transformOrigin: `${posX}% ${posY}%`,
                            background: 'repeating-conic-gradient(#2a2a2a 0% 25%, #1a1a1a 0% 50%) 0 0 / 16px 16px'
                          }} />
                      : <div className="admin-image-placeholder"><span>🎨</span><p>{heroUploading === field ? 'Uploading...' : `Upload Card ${i+1}`}</p></div>}
                    <input id={`hero_${field}`} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleHeroImgUpload(e, field)} />
                  </div>

                  {hero[field] && (
                    <>
                      {/* Position X */}
                      <div style={{ marginTop: 8 }}>
                        <label style={{ fontSize: 10, color: '#aaa' }}>Position X: {posX}%</label>
                        <input type="range" min="0" max="100" value={posX}
                          onChange={e => setHero(p => ({ ...p, [`${field}X`]: Number(e.target.value) }))}
                          style={{ width: '100%' }} />
                      </div>
                      {/* Position Y */}
                      <div style={{ marginTop: 4 }}>
                        <label style={{ fontSize: 10, color: '#aaa' }}>Position Y: {posY}%</label>
                        <input type="range" min="0" max="100" value={posY}
                          onChange={e => setHero(p => ({ ...p, [`${field}Y`]: Number(e.target.value) }))}
                          style={{ width: '100%' }} />
                      </div>
                      {/* Zoom */}
                      <div style={{ marginTop: 4 }}>
                        <label style={{ fontSize: 10, color: '#aaa' }}>Zoom: {scale}%</label>
                        <input type="range" min="100" max="200" value={scale}
                          onChange={e => setHero(p => ({ ...p, [`${field}Scale`]: Number(e.target.value) }))}
                          style={{ width: '100%' }} />
                      </div>
                      <div className="admin-rmbg-actions" style={{ marginTop: 6 }}>
                        <button className="admin-rmbg-btn" onClick={() => removeHeroBg(field)} disabled={!!heroUploading}>
                          ✂️ {heroUploading === field + '_rmbg' ? 'Removing...' : 'Remove BG'}
                        </button>
                        <button className="admin-rmbg-cancel" onClick={() => setHero(p => ({ ...p, [field]: '', [`${field}X`]: 50, [`${field}Y`]: 50, [`${field}Scale`]: 100 }))}>✕ Remove</button>
                      </div>
                    </>
                  )}
                </div>
              )
            })}
          </div>

          <div className="admin-product-actions" style={{ marginTop: '1rem' }}>
            <button className="admin-carousel-btn" onClick={handleHeroSave} disabled={!!heroUploading}>
              {heroSaved ? '✅ Saved!' : '💾 Save Hero'}
            </button>
          </div>
        </div>
      </div>
      <div className="admin-carousel-section">
        <h2 className="admin-carousel-title">🛍️ Seller Place — Designs Manager</h2>
        <p className="admin-carousel-sub">Designs add karo, approve/reject karo, verified badge do</p>

        {/* Add Form */}
        <div className="admin-product-form">
          <h3>Add New Design</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="admin-split-field">
              <label>Design Title</label>
              <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Neon Samurai" />
            </div>
            <div className="admin-split-field">
              <label>Designer Name</label>
              <input value={form.designerName} onChange={e => setForm(p => ({ ...p, designerName: e.target.value }))} placeholder="e.g. ArtByAbrar" />
            </div>
            <div className="admin-split-field">
              <label>Category</label>
              <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #333', background: '#1a1a1a', color: '#fff', fontSize: 13 }}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="admin-split-field">
              <label>Price (Credits)</label>
              <input type="number" value={form.price} onChange={e => setForm(p => ({ ...p, price: Number(e.target.value) }))} min={10} />
            </div>
          </div>

          <div className="admin-split-field" style={{ marginTop: '1rem' }}>
            <label>Design Image</label>
            <div className="admin-image-upload" onClick={() => !uploading && document.getElementById('sdImg').click()}>
              {form.image
                ? <img src={form.image} alt="design" className="admin-image-preview" style={{ objectFit: 'contain' }} />
                : <div className="admin-image-placeholder"><span>🎨</span><p>{uploading ? 'Uploading...' : 'Upload Design Image'}</p></div>}
              <input id="sdImg" type="file" accept="image/*" style={{ display: 'none' }} onChange={async e => {
                const file = e.target.files[0]; if (!file) return
                setUploading(true)
                const url = await upload(file)
                setForm(p => ({ ...p, image: url }))
                setUploading(false)
              }} />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
            <input type="checkbox" id="verifiedCheck" checked={form.verified} onChange={e => setForm(p => ({ ...p, verified: e.target.checked }))} />
            <label htmlFor="verifiedCheck" style={{ color: '#aaa', fontSize: 13 }}>✅ Verified Designer</label>
          </div>

          <div className="admin-product-actions" style={{ marginTop: '1rem' }}>
            <button className="admin-carousel-btn" onClick={handleSave} disabled={uploading || !form.title || !form.designerName || !form.image}>
              💾 Add Design
            </button>
          </div>
        </div>

        {/* Filter */}
        <div style={{ display: 'flex', gap: 8, margin: '1.5rem 0 1rem' }}>
          {['all', 'pending', 'approved', 'rejected'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: '6px 16px', borderRadius: 999, border: '1px solid', borderColor: filter === f ? '#f97316' : '#333', background: filter === f ? '#f97316' : 'transparent', color: filter === f ? '#fff' : '#aaa', fontSize: 12, fontWeight: 700, cursor: 'pointer', textTransform: 'capitalize' }}>
              {f} {f === 'all' ? `(${designs.length})` : `(${designs.filter(d => d.status === f).length})`}
            </button>
          ))}
        </div>

        {/* Designs Grid */}
        <div className="admin-products-grid">
          {filtered.length === 0
            ? <div className="admin-carousel-empty"><span>🎨</span><p>Koi design nahi</p></div>
            : filtered.map(d => (
              <div key={d._id} className="admin-product-card">
                <div className="admin-product-images">
                  <div className="admin-product-image-container">
                    <img src={d.image} alt={d.title} className="admin-product-img" style={{ objectFit: 'contain' }} />
                  </div>
                </div>
                <div className="admin-product-info">
                  <h4>{d.title}</h4>
                  <p style={{ fontSize: 11, color: '#888', margin: '2px 0' }}>by {d.designerName} • {d.category}</p>
                  <p style={{ fontSize: 11, color: '#f97316', margin: '2px 0' }}>{d.price} Credits</p>
                  <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 999, background: d.status === 'approved' ? '#22c55e22' : d.status === 'rejected' ? '#ef444422' : '#f9731622', color: d.status === 'approved' ? '#22c55e' : d.status === 'rejected' ? '#ef4444' : '#f97316', fontWeight: 700 }}>
                      {d.status}
                    </span>
                    {d.verified && <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 999, background: '#3b82f622', color: '#3b82f6', fontWeight: 700 }}>✅ Verified</span>}
                  </div>
                </div>
                <div className="admin-product-actions" style={{ flexWrap: 'wrap', gap: 4 }}>
                  {d.status !== 'approved' && <button className="admin-product-edit" onClick={() => updateStatus(d._id, 'approved')}>✅ Approve</button>}
                  {d.status !== 'rejected' && <button className="admin-carousel-delete" style={{ background: '#ef444420', color: '#ef4444', border: '1px solid #ef444440' }} onClick={() => updateStatus(d._id, 'rejected')}>❌ Reject</button>}
                  <button className="admin-product-edit" style={{ background: d.verified ? '#3b82f620' : 'transparent', color: '#3b82f6', border: '1px solid #3b82f640' }} onClick={() => toggleVerified(d._id, d.verified)}>
                    {d.verified ? '🔵 Unverify' : '✅ Verify'}
                  </button>
                  <button className="admin-carousel-delete" onClick={() => handleDelete(d._id)}>🗑 Delete</button>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}
