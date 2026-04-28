import React, { useState, useEffect } from 'react'
import { removeBg } from '../utils/removeBg'

function UserHomeManager() {
  const [banners, setBanners] = useState([])
  const [form, setForm] = useState({ img: '', title: '', sub: '' })
  const [editing, setEditing] = useState(null)
  const [uploading, setUploading] = useState(false)

  const [cards, setCards] = useState([])
  const [cardForm, setCardForm] = useState({ name: '', imgDefault: '', imgHover: '', order: 0 })
  const [editingCard, setEditingCard] = useState(null)
  const [cardUploading, setCardUploading] = useState(false)
  const [cardOriginals, setCardOriginals] = useState({ imgDefault: '', imgHover: '' })
  const [cardHoverUploading, setCardHoverUploading] = useState(false)

  const [previewImg, setPreviewImg] = useState('')
  const [previewUploading, setPreviewUploading] = useState(false)

  const [hiwImages, setHiwImages] = useState([])
  const [hiwUploading, setHiwUploading] = useState(false)

  const [collImages, setCollImages] = useState([])
  const [collUploading, setCollUploading] = useState(false)

  const [newDrop, setNewDrop] = useState({ topImage: '', topTitle: 'Neon Cyber Tee', bottomImage: '', bottomTitle: 'Minimalist Cloud Hoodie' })
  const [ndUploading, setNdUploading] = useState(false)

  const [userProducts, setUserProducts] = useState([])
  const [upForm, setUpForm] = useState({ name: '', baseImage: '', logos: ['', '', ''], logoSizes: [30, 30, 30], logoPos: [{top:45,left:50},{top:45,left:50},{top:45,left:50}] })
  const [editingUp, setEditingUp] = useState(null)
  const [upLoading, setUpLoading] = useState(false)
  const [upOriginals, setUpOriginals] = useState({ baseImage: '' })
  const [logosLocked, setLogosLocked] = useState([false, false, false])

  const fetchAll = async () => {
    const [b, c, h, up] = await Promise.all([
      fetch('http://localhost:5000/api/user-banners').then(r => r.json()),
      fetch('http://localhost:5000/api/category-cards').then(r => r.json()),
      fetch('http://localhost:5000/api/how-it-works').then(r => r.json()),
      fetch('http://localhost:5000/api/user-products').then(r => r.json()),
    ])
    setBanners(b)
    setCards(c)
    setHiwImages(h)
    setUserProducts(up)
    const pt = await fetch('http://localhost:5000/api/preview-tshirt').then(r => r.json())
    if (pt.image) setPreviewImg(pt.image)
    const ci = await fetch('http://localhost:5000/api/collection-images').then(r => r.json())
    setCollImages(ci)
    const nd = await fetch('http://localhost:5000/api/new-drop').then(r => r.json())
    if (nd.topImage) setNewDrop({ topImage: nd.topImage, topTitle: nd.topTitle || '', bottomImage: nd.bottomImage || '', bottomTitle: nd.bottomTitle || '' })
  }

  useEffect(() => { fetchAll() }, [])

  const upload = async (file) => {
    const fd = new FormData()
    fd.append('image', file)
    const res = await fetch('http://localhost:5000/api/upload', { method: 'POST', body: fd })
    return (await res.json()).url
  }

  // ── Slider ──
  const handleImageUpload = async (e) => {
    const file = e.target.files[0]; if (!file) return
    setUploading(true)
    const url = await upload(file)
    setForm(p => ({ ...p, img: url }))
    setUploading(false)
  }

  const handleSave = async () => {
    if (!form.img) return
    const method = editing ? 'PUT' : 'POST'
    const url = editing ? `http://localhost:5000/api/user-banners/${editing._id}` : 'http://localhost:5000/api/user-banners'
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ image: form.img, title: form.title || '', subtitle: form.sub || '', order: 0 }) })
    setForm({ img: '', title: '', sub: '' }); setEditing(null)
    setBanners(await fetch('http://localhost:5000/api/user-banners').then(r => r.json()))
  }

  const handleEdit = (b) => { setForm({ img: b.image, title: b.title || '', sub: b.subtitle || '' }); setEditing(b) }
  const handleDelete = async (id) => { await fetch(`http://localhost:5000/api/user-banners/${id}`, { method: 'DELETE' }); setBanners(await fetch('http://localhost:5000/api/user-banners').then(r => r.json())) }

  // ── Category Cards ──
  const handleCardImgUpload = async (e, field) => {
    const file = e.target.files[0]; if (!file) return
    setCardUploading(true)
    const url = await upload(file)
    setCardForm(p => ({ ...p, [field]: url }))
    setCardOriginals(p => ({ ...p, [field]: url }))
    setCardUploading(false)
  }

  const removeCardBg = async (field) => {
    setCardUploading(true)
    try {
      const blob = await removeBg(cardForm[field])
      const fd = new FormData(); fd.append('image', blob, `${field}_clean.png`)
      const res = await fetch('http://localhost:5000/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      setCardForm(p => ({ ...p, [field]: data.url }))
    } catch { alert('Background remove nahi hua') }
    setCardUploading(false)
  }

  const handleCardSave = async () => {
    if (!cardForm.name || !cardForm.imgDefault) return
    const method = editingCard ? 'PUT' : 'POST'
    const url = editingCard ? `http://localhost:5000/api/category-cards/${editingCard._id}` : 'http://localhost:5000/api/category-cards'
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(cardForm) })
    setCardForm({ name: '', imgDefault: '', imgHover: '', order: 0 }); setEditingCard(null)
    setCards(await fetch('http://localhost:5000/api/category-cards').then(r => r.json()))
  }

  const handleCardEdit = (c) => { setCardForm({ name: c.name, imgDefault: c.imgDefault, imgHover: c.imgHover || '', order: c.order }); setEditingCard(c) }
  const handleCardDelete = async (id) => { await fetch(`http://localhost:5000/api/category-cards/${id}`, { method: 'DELETE' }); setCards(await fetch('http://localhost:5000/api/category-cards').then(r => r.json())) }

  // ── Preview T-Shirt ──
  const handlePreviewUpload = async (e) => {
    const file = e.target.files[0]; if (!file) return
    setPreviewUploading(true)
    try {
      const localUrl = URL.createObjectURL(file)
      const cleanBlob = await removeBg(localUrl)
      URL.revokeObjectURL(localUrl)
      const fd = new FormData(); fd.append('image', cleanBlob, 'preview_clean.png')
      const res = await fetch('http://localhost:5000/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      await fetch('http://localhost:5000/api/preview-tshirt', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ image: data.url }) })
      setPreviewImg(data.url)
    } catch { alert('Upload fail hua') }
    setPreviewUploading(false)
  }

  // ── Collection Images ──
  const handleCollUpload = async (e) => {
    const file = e.target.files[0]; if (!file) return
    if (collImages.length >= 3) return alert('Max 3 images allowed')
    setCollUploading(true)
    const url = await upload(file)
    await fetch('http://localhost:5000/api/collection-images', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ image: url, order: collImages.length }) })
    setCollImages(await fetch('http://localhost:5000/api/collection-images').then(r => r.json()))
    setCollUploading(false)
  }

  const handleCollDelete = async (id) => {
    await fetch(`http://localhost:5000/api/collection-images/${id}`, { method: 'DELETE' })
    setCollImages(await fetch('http://localhost:5000/api/collection-images').then(r => r.json()))
  }

  // ── How It Works ──
  const handleHiwUpload = async (e) => {
    const file = e.target.files[0]; if (!file) return
    setHiwUploading(true)
    const url = await upload(file)
    await fetch('http://localhost:5000/api/how-it-works', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ image: url, order: hiwImages.length }) })
    setHiwImages(await fetch('http://localhost:5000/api/how-it-works').then(r => r.json()))
    setHiwUploading(false)
  }

  const handleHiwDelete = async (id) => {
    await fetch(`http://localhost:5000/api/how-it-works/${id}`, { method: 'DELETE' })
    setHiwImages(await fetch('http://localhost:5000/api/how-it-works').then(r => r.json()))
  }

  // ── User Products ──
  const handleUpSave = async () => {
    if (!upForm.name || !upForm.baseImage) return
    const method = editingUp ? 'PUT' : 'POST'
    const url = editingUp ? `http://localhost:5000/api/user-products/${editingUp._id}` : 'http://localhost:5000/api/user-products'
    const logos = upForm.logos.filter(l => l).map((l, i) => ({ image: l, pos: upForm.logoPos[i] || { top: 45, left: 50 }, size: upForm.logoSizes[i] || 30, rotation: 0 }))
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: upForm.name, baseImage: upForm.baseImage, logos }) })
    setUpForm({ name: '', baseImage: '', logos: ['', '', ''] }); setEditingUp(null)
    setUserProducts(await fetch('http://localhost:5000/api/user-products').then(r => r.json()))
  }

  const handleUpEdit = (p) => {
    setUpForm({ name: p.name, baseImage: p.baseImage, logos: p.logos?.map(l => l.image || '').concat(['', '', '']).slice(0, 3) || ['', '', ''], logoSizes: p.logos?.map(l => l.size || 30).concat([30, 30, 30]).slice(0, 3) || [30, 30, 30], logoPos: p.logos?.map(l => l.pos || {top:45,left:50}).concat([{top:45,left:50},{top:45,left:50},{top:45,left:50}]).slice(0, 3) || [{top:45,left:50},{top:45,left:50},{top:45,left:50}] })
    setEditingUp(p)
  }

  // ── New Drop ──
  const handleNdUpload = async (e, field) => {
    const file = e.target.files[0]; if (!file) return
    setNdUploading(true)
    const url = await upload(file)
    setNewDrop(p => ({ ...p, [field]: url }))
    setNdUploading(false)
  }

  const handleNdSave = async () => {
    if (!newDrop.topImage || !newDrop.bottomImage) return
    await fetch('http://localhost:5000/api/new-drop', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newDrop) })
    alert('✅ New Drop saved!')
  }

  const handleUpDelete = async (id) => {
    await fetch(`http://localhost:5000/api/user-products/${id}`, { method: 'DELETE' })
    setUserProducts(await fetch('http://localhost:5000/api/user-products').then(r => r.json()))
  }

  const removeUpBg = async (imageUrl, onDone) => {
    setUpLoading(true)
    try {
      const blob = await removeBg(imageUrl)
      const fd = new FormData(); fd.append('image', blob, 'clean.png')
      const res = await fetch('http://localhost:5000/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      onDone(data.url)
    } catch { alert('Background remove nahi hua') }
    setUpLoading(false)
  }

  return (
    <div className="admin-page">

      {/* SLIDER */}
      <div className="admin-carousel-section">
        <h2 className="admin-carousel-title">👤 User Home — Slider Images</h2>
        <p className="admin-carousel-sub">User homepage par dikhne wali sliding pictures yahan manage karo</p>
        <div className="admin-product-form">
          <h3>{editing ? 'Edit Slide' : 'Add New Slide'}</h3>
          <div className="admin-split-field">
            <label>Slide Image</label>
            <div className="admin-image-upload" onClick={() => document.getElementById('sliderImgInput').click()}>
              {form.img ? <img src={form.img} alt="slide" className="admin-image-preview" style={{ objectFit: 'cover', height: 160 }} /> : <div className="admin-image-placeholder"><span>🖼️</span><p>{uploading ? 'Uploading...' : 'Upload Image'}</p><small>Recommended: 1920×700px</small></div>}
              <input id="sliderImgInput" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
            </div>
          </div>
          <div className="admin-product-actions">
            {editing && <button className="admin-crop-cancel" onClick={() => { setEditing(null); setForm({ img: '', title: '', sub: '' }) }}>Cancel</button>}
            <button className="admin-carousel-btn" onClick={handleSave} disabled={uploading || !form.img}>{editing ? 'Update Slide' : 'Add Slide'}</button>
          </div>
        </div>
        <div className="admin-carousel-grid">
          {banners.length === 0 ? <div className="admin-carousel-empty"><span>🖼️</span><p>Koi slide nahi</p></div> : banners.map((b, i) => (
            <div key={b._id} className="admin-carousel-card">
              <div className="admin-carousel-badge">#{i + 1}</div>
              <img src={b.image} alt={b.title} className="admin-carousel-img" />
              <div className="admin-carousel-footer">
                <span className="admin-carousel-url">{b.title || 'No title'}</span>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button className="admin-product-edit" onClick={() => handleEdit(b)}>✏️ Edit</button>
                  <button className="admin-carousel-delete" onClick={() => handleDelete(b._id)}>🗑 Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CATEGORY CARDS */}
      <div className="admin-carousel-section">
        <h2 className="admin-carousel-title">🎨 Category Cards — Hover Effect</h2>
        <p className="admin-carousel-sub">Default image aur Hover image upload karo</p>
        <div className="admin-product-form">
          <h3>{editingCard ? 'Edit Card' : 'Add New Card'}</h3>
          <div className="admin-split-field">
            <label>Category Name</label>
            <input value={cardForm.name} onChange={e => setCardForm(p => ({ ...p, name: e.target.value }))} placeholder="T-Shirts, Hoodies..." />
          </div>
          <div className="admin-split-field">
            <label>Default Image</label>
            <div className="admin-image-upload" onClick={() => document.getElementById('cardDefaultImg').click()}>
              {cardForm.imgDefault ? <img src={cardForm.imgDefault} alt="default" className="admin-image-preview" /> : <div className="admin-image-placeholder"><span>👕</span><p>{cardUploading ? 'Uploading...' : 'Upload Image'}</p></div>}
              <input id="cardDefaultImg" type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleCardImgUpload(e, 'imgDefault')} />
            </div>
            {cardForm.imgDefault && (
              <div className="admin-rmbg-actions">
                <button className="admin-rmbg-btn" onClick={() => removeCardBg('imgDefault')} disabled={cardUploading}>✂️ {cardUploading ? 'Removing...' : 'Remove Background'}</button>
                {cardForm.imgDefault !== cardOriginals.imgDefault && cardOriginals.imgDefault && <button className="admin-rmbg-cancel" onClick={() => setCardForm(p => ({ ...p, imgDefault: cardOriginals.imgDefault }))}>↩️ Cancel</button>}
              </div>
            )}
          </div>
          <div className="admin-split-field">
            <label>Hover Image <small style={{ color: '#888' }}>(optional)</small></label>
            <div className="admin-image-upload" onClick={() => document.getElementById('cardHoverImg').click()}>
              {cardForm.imgHover ? <img src={cardForm.imgHover} alt="hover" className="admin-image-preview" /> : <div className="admin-image-placeholder"><span>🖤</span><p>{cardHoverUploading ? 'Uploading...' : 'Upload Hover Image'}</p></div>}
              <input id="cardHoverImg" type="file" accept="image/*" style={{ display: 'none' }} onChange={async (e) => {
                const file = e.target.files[0]; if (!file) return
                setCardHoverUploading(true)
                const url = await upload(file)
                setCardForm(p => ({ ...p, imgHover: url }))
                setCardOriginals(p => ({ ...p, imgHover: url }))
                setCardHoverUploading(false)
              }} />
            </div>
            {cardForm.imgHover && (
              <div className="admin-rmbg-actions">
                <button className="admin-rmbg-btn" onClick={() => removeCardBg('imgHover')} disabled={cardUploading || cardHoverUploading}>✂️ {cardUploading ? 'Removing...' : 'Remove Background'}</button>
                {cardForm.imgHover !== cardOriginals.imgHover && cardOriginals.imgHover && <button className="admin-rmbg-cancel" onClick={() => setCardForm(p => ({ ...p, imgHover: cardOriginals.imgHover }))}>↩️ Cancel</button>}
              </div>
            )}
          </div>
          <div className="admin-product-actions">
            {editingCard && <button className="admin-crop-cancel" onClick={() => { setEditingCard(null); setCardForm({ name: '', imgDefault: '', imgHover: '', order: 0 }) }}>Cancel</button>}
            <button className="admin-carousel-btn" onClick={handleCardSave} disabled={cardUploading || !cardForm.name || !cardForm.imgDefault}>{editingCard ? 'Update Card' : 'Add Card'}</button>
          </div>
        </div>
        <div className="admin-products-grid">
          {cards.length === 0 ? <div className="admin-carousel-empty"><span>🎨</span><p>Koi card nahi</p></div> : cards.map((c) => (
            <div key={c._id} className="admin-product-card">
              <div className="admin-product-images">
                <div className="admin-product-image-container"><img src={c.imgDefault} alt="default" className="admin-product-img" /><span className="admin-product-label">Default</span></div>
                <div className="admin-product-image-container"><img src={c.imgHover} alt="hover" className="admin-product-img" /><span className="admin-product-label">Hover</span></div>
              </div>
              <div className="admin-product-info"><h4>{c.name}</h4></div>
              <div className="admin-product-actions">
                <button className="admin-product-edit" onClick={() => handleCardEdit(c)}>✏️ Edit</button>
                <button className="admin-carousel-delete" onClick={() => handleCardDelete(c._id)}>🗑 Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PREVIEW T-SHIRT */}
      <div className="admin-carousel-section">
        <h2 className="admin-carousel-title">👕 Color Picker — Preview T-Shirt</h2>
        <p className="admin-carousel-sub">T-Shirt upload karo — background automatically remove hoga</p>
        <div className="admin-product-form">
          <div className="admin-split-field">
            <label>T-Shirt Image</label>
            <div className="admin-image-upload" onClick={() => !previewUploading && document.getElementById('previewTshirtInput').click()}>
              {previewImg
                ? <img src={previewImg} alt="preview" className="admin-image-preview" style={{ objectFit: 'contain', background: 'repeating-conic-gradient(#2a2a2a 0% 25%, #1a1a1a 0% 50%) 0 0 / 16px 16px' }} />
                : <div className="admin-image-placeholder"><span>👕</span><p>{previewUploading ? '⏳ Removing BG...' : 'Upload T-Shirt'}</p><small>Background auto remove hoga</small></div>
              }
              {previewUploading && (
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 12 }}>
                  <div style={{ width: 32, height: 32, border: '3px solid #f97316', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  <span style={{ color: '#fff', fontSize: 12, fontWeight: 700 }}>Removing Background...</span>
                </div>
              )}
              <input id="previewTshirtInput" type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePreviewUpload} />
            </div>
          </div>
          {previewImg && !previewUploading && <p style={{ fontSize: 12, color: '#22c55e', marginTop: 8 }}>✅ Saved — Frontend par show ho raha hai</p>}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div className="admin-carousel-section">
        <h2 className="admin-carousel-title">🖼️ How It Works — Scrolling Images</h2>
        <p className="admin-carousel-sub">User Home right side scrolling images</p>
        <div className="admin-product-form">
          <div className="admin-split-field">
            <label>Image Upload karo</label>
            <div className="admin-image-upload" onClick={() => !hiwUploading && document.getElementById('hiwImgInput').click()}>
              <div className="admin-image-placeholder"><span>🖼️</span><p>{hiwUploading ? 'Uploading...' : 'Upload Image'}</p><small>Har click pe ek nai image add hogi</small></div>
              <input id="hiwImgInput" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleHiwUpload} />
            </div>
          </div>
        </div>
        <div className="admin-carousel-grid">
          {hiwImages.length === 0 ? <div className="admin-carousel-empty"><span>🖼️</span><p>Koi image nahi</p></div> : hiwImages.map((img, i) => (
            <div key={img._id} className="admin-carousel-card">
              <div className="admin-carousel-badge">#{i + 1}</div>
              <img src={img.image} alt={`hiw-${i}`} className="admin-carousel-img" />
              <div className="admin-carousel-footer">
                <span className="admin-carousel-url">Image {i + 1}</span>
                <button className="admin-carousel-delete" onClick={() => handleHiwDelete(img._id)}>🗑 Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* COLLECTION IMAGES */}
      <div className="admin-carousel-section">
        <h2 className="admin-carousel-title">🖼️ Collection Section — 3 Images</h2>
        <p className="admin-carousel-sub">User Home "Why Choose Us" section ki left side 3 stacked images yahan upload karo (max 3)</p>
        <div className="admin-product-form">
          <div className="admin-split-field">
            <label>Image Upload karo {collImages.length}/3</label>
            <div className="admin-image-upload" onClick={() => collImages.length < 3 && !collUploading && document.getElementById('collImgInput').click()} style={{ opacity: collImages.length >= 3 ? 0.5 : 1, cursor: collImages.length >= 3 ? 'not-allowed' : 'pointer' }}>
              <div className="admin-image-placeholder">
                <span>🖼️</span>
                <p>{collUploading ? 'Uploading...' : collImages.length >= 3 ? 'Max 3 reached' : 'Upload Image'}</p>
                <small>Exactly 3 images chahiye</small>
              </div>
              <input id="collImgInput" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleCollUpload} />
            </div>
          </div>
        </div>
        <div className="admin-carousel-grid">
          {collImages.length === 0
            ? <div className="admin-carousel-empty"><span>🖼️</span><p>Koi image nahi — 3 images upload karo</p></div>
            : collImages.map((img, i) => (
              <div key={img._id} className="admin-carousel-card">
                <div className="admin-carousel-badge">#{i + 1}</div>
                <img src={img.image} alt={`coll-${i}`} className="admin-carousel-img" />
                <div className="admin-carousel-footer">
                  <span className="admin-carousel-url">Image {i + 1}</span>
                  <button className="admin-carousel-delete" onClick={() => handleCollDelete(img._id)}>🗑 Delete</button>
                </div>
              </div>
            ))
          }
        </div>
      </div>

      {/* NEW DROPS BOX */}
      <div className="admin-carousel-section">
        <h2 className="admin-carousel-title">⚡ New Drops — Split Box Images</h2>
        <p className="admin-carousel-sub">User Home ke "New Drops" box ki Top aur Bottom image yahan upload karo</p>
        <div className="admin-product-form">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>

            <div className="admin-split-field">
              <label>Top Image (e.g. Neon Cyber Tee)</label>
              <div className="admin-image-upload" onClick={() => !ndUploading && document.getElementById('ndTopImg').click()}>
                {newDrop.topImage
                  ? <img src={newDrop.topImage} alt="top" className="admin-image-preview" style={{ objectFit: 'cover' }} />
                  : <div className="admin-image-placeholder"><span>👕</span><p>{ndUploading ? 'Uploading...' : 'Upload Top Image'}</p></div>}
                <input id="ndTopImg" type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleNdUpload(e, 'topImage')} />
              </div>
              <input
                value={newDrop.topTitle}
                onChange={e => setNewDrop(p => ({ ...p, topTitle: e.target.value }))}
                placeholder="Top title (e.g. Neon Cyber Tee)"
                style={{ marginTop: 8, width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #333', background: '#1a1a1a', color: '#fff', fontSize: 13 }}
              />
            </div>

            <div className="admin-split-field">
              <label>Bottom Image (e.g. Minimalist Cloud Hoodie)</label>
              <div className="admin-image-upload" onClick={() => !ndUploading && document.getElementById('ndBotImg').click()}>
                {newDrop.bottomImage
                  ? <img src={newDrop.bottomImage} alt="bottom" className="admin-image-preview" style={{ objectFit: 'cover' }} />
                  : <div className="admin-image-placeholder"><span>👕</span><p>{ndUploading ? 'Uploading...' : 'Upload Bottom Image'}</p></div>}
                <input id="ndBotImg" type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleNdUpload(e, 'bottomImage')} />
              </div>
              <input
                value={newDrop.bottomTitle}
                onChange={e => setNewDrop(p => ({ ...p, bottomTitle: e.target.value }))}
                placeholder="Bottom title (e.g. Minimalist Cloud Hoodie)"
                style={{ marginTop: 8, width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #333', background: '#1a1a1a', color: '#fff', fontSize: 13 }}
              />
            </div>
          </div>

          <div className="admin-product-actions" style={{ marginTop: '1rem' }}>
            <button className="admin-carousel-btn" onClick={handleNdSave} disabled={ndUploading || !newDrop.topImage || !newDrop.bottomImage}>
              💾 Save New Drop
            </button>
          </div>
        </div>
      </div>

      {/* USER HOME PRODUCTS */}
      <div className="admin-carousel-section">
        <h2 className="admin-carousel-title">🛒 Our Collection — User Home Products</h2>
        <p className="admin-carousel-sub">T-Shirt + 3 logos upload karo — user mouse le jaye to logo T-shirt pe show hoga</p>
        <div className="admin-product-form">
          <h3>{editingUp ? 'Edit Product' : 'Add New Product'}</h3>

          <div className="admin-split-field">
            <label>Product Name</label>
            <input value={upForm.name} onChange={e => setUpForm(p => ({ ...p, name: e.target.value }))} placeholder="T-Shirt, Hoodie..." />
          </div>

          <div className="admin-split-field">
            <label>T-Shirt Image</label>
            <div className="admin-image-upload" onClick={() => document.getElementById('upBaseImg').click()}>
              {upForm.baseImage ? <img src={upForm.baseImage} alt="base" className="admin-image-preview" /> : <div className="admin-image-placeholder"><span>👕</span><p>{upLoading ? 'Uploading...' : 'Upload T-Shirt'}</p><small>White/Plain product image</small></div>}
              <input id="upBaseImg" type="file" accept="image/*" style={{ display: 'none' }} onChange={async (e) => {
                const file = e.target.files[0]; if (!file) return
                setUpLoading(true)
                const url = await upload(file)
                setUpForm(p => ({ ...p, baseImage: url }))
                setUpOriginals(p => ({ ...p, baseImage: url }))
                setUpLoading(false)
              }} />
            </div>
            {upForm.baseImage && (
              <div className="admin-rmbg-actions">
                <button className="admin-rmbg-btn" onClick={() => removeUpBg(upForm.baseImage, url => setUpForm(p => ({ ...p, baseImage: url })))} disabled={upLoading}>✂️ {upLoading ? 'Removing...' : 'Remove Background'}</button>
                {upForm.baseImage !== upOriginals.baseImage && upOriginals.baseImage && <button className="admin-rmbg-cancel" onClick={() => setUpForm(p => ({ ...p, baseImage: upOriginals.baseImage }))}>↩️ Cancel</button>}
              </div>
            )}
          </div>

          <div className="admin-split-field">
            <label>Logos (max 3) — mouse hover pe T-shirt pe show honge</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.75rem' }}>
              {[0, 1, 2].map(i => (
                <div key={i}>
                  <div className="admin-image-upload" onClick={() => document.getElementById(`upLogo${i}`).click()}>
                    {upForm.logos[i] ? <img src={upForm.logos[i]} alt={`logo-${i}`} className="admin-image-preview" style={{ objectFit: 'contain' }} /> : <div className="admin-image-placeholder"><span>🎨</span><p>{upLoading ? '...' : `Logo ${i + 1}`}</p></div>}
                    <input id={`upLogo${i}`} type="file" accept="image/*" style={{ display: 'none' }} onChange={async (e) => {
                      const file = e.target.files[0]; if (!file) return
                      setUpLoading(true)
                      const url = await upload(file)
                      setUpForm(p => { const logos = [...p.logos]; logos[i] = url; return { ...p, logos } })
                      setUpLoading(false)
                    }} />
                  </div>
                  {upForm.logos[i] && (
                    <div className="admin-rmbg-actions" style={{ marginTop: 4 }}>
                      <button className="admin-rmbg-btn" onClick={() => removeUpBg(upForm.logos[i], url => setUpForm(p => { const logos = [...p.logos]; logos[i] = url; return { ...p, logos } }))} disabled={upLoading}>✂️ {upLoading ? '...' : 'Remove BG'}</button>
                      <button className="admin-rmbg-cancel" onClick={() => setUpForm(p => { const logos = [...p.logos]; logos[i] = ''; return { ...p, logos } })}>✕</button>
                    </div>
                  )}
                  {upForm.logos[i] && upForm.baseImage && (
                    <div
                      style={{ position: 'relative', marginTop: 8, borderRadius: '0.75rem', overflow: 'hidden', border: `2px ${logosLocked[i] ? 'solid #22c55e' : 'dashed #f97316'}`, cursor: logosLocked[i] ? 'default' : 'crosshair', aspectRatio: '1', background: '#111' }}
                      onMouseMove={(e) => {
                        if (logosLocked[i]) return
                        const rect = e.currentTarget.getBoundingClientRect()
                        const left = Math.round(Math.min(Math.max(((e.clientX - rect.left) / rect.width) * 100, 5), 95))
                        const top  = Math.round(Math.min(Math.max(((e.clientY - rect.top)  / rect.height) * 100, 5), 95))
                        setUpForm(p => { const logoPos = [...p.logoPos]; logoPos[i] = { top, left }; return { ...p, logoPos } })
                      }}
                      onContextMenu={(e) => { e.preventDefault(); setLogosLocked(p => { const n = [...p]; n[i] = !n[i]; return n }) }}
                    >
                      <img src={upForm.baseImage} alt="base" style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
                      <img src={upForm.logos[i]} alt="logo" style={{ position: 'absolute', top: `${upForm.logoPos[i]?.top || 45}%`, left: `${upForm.logoPos[i]?.left || 50}%`, width: `${upForm.logoSizes[i]}%`, height: `${upForm.logoSizes[i]}%`, transform: 'translate(-50%,-50%)', objectFit: 'contain', pointerEvents: 'none' }} />
                      <div style={{ position: 'absolute', top: 4, right: 6, fontSize: 9, fontWeight: 700, background: logosLocked[i] ? '#22c55e' : '#f97316', color: '#fff', padding: '2px 6px', borderRadius: 999 }}>
                        {logosLocked[i] ? '🔒 Locked' : '🖱️ Move'}
                      </div>
                      <button
                        onClick={() => setLogosLocked(p => { const n = [...p]; n[i] = !n[i]; return n })}
                        style={{ position: 'absolute', bottom: 6, right: 6, fontSize: 9, fontWeight: 700, background: logosLocked[i] ? '#22c55e' : 'rgba(0,0,0,0.5)', color: '#fff', border: 'none', padding: '3px 8px', borderRadius: 999, cursor: 'pointer' }}
                      >
                        {logosLocked[i] ? 'Unlock' : 'Lock'}
                      </button>
                    </div>
                  )}
                  {upForm.logos[i] && (
                    <div className="admin-size-slider" style={{ marginTop: 6 }}>
                      <label style={{ fontSize: 11, color: '#aaa' }}>Size: {upForm.logoSizes[i]}%</label>
                      <input type="range" min="10" max="60" value={upForm.logoSizes[i]} onChange={e => setUpForm(p => { const logoSizes = [...p.logoSizes]; logoSizes[i] = Number(e.target.value); return { ...p, logoSizes } })} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="admin-product-actions">
            {editingUp && <button className="admin-crop-cancel" onClick={() => { setEditingUp(null); setUpForm({ name: '', baseImage: '', logos: ['', '', ''], logoSizes: [30, 30, 30], logoPos: [{top:45,left:50},{top:45,left:50},{top:45,left:50}] }) }}>Cancel</button>}
            <button className="admin-carousel-btn" onClick={handleUpSave} disabled={upLoading || !upForm.name || !upForm.baseImage}>{editingUp ? 'Update Product' : 'Add Product'}</button>
          </div>
        </div>

        <div className="admin-products-grid">
          {userProducts.length === 0 ? <div className="admin-carousel-empty"><span>🛒</span><p>Koi product nahi — upar se add karo</p></div> : userProducts.map((p) => (
            <div key={p._id} className="admin-product-card">
              <div className="admin-product-images">
                <div className="admin-product-image-container"><img src={p.baseImage} alt="base" className="admin-product-img" /><span className="admin-product-label">T-Shirt</span></div>
                {p.logos?.filter(l => l.image).map((l, li) => (
                  <div key={li} className="admin-product-image-container"><img src={l.image} alt={`logo-${li}`} className="admin-product-img" style={{ objectFit: 'contain' }} /><span className="admin-product-label">Logo {li + 1}</span></div>
                ))}
              </div>
              <div className="admin-product-info"><h4>{p.name}</h4></div>
              <div className="admin-product-actions">
                <button className="admin-product-edit" onClick={() => handleUpEdit(p)}>✏️ Edit</button>
                <button className="admin-carousel-delete" onClick={() => handleUpDelete(p._id)}>🗑 Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default UserHomeManager
