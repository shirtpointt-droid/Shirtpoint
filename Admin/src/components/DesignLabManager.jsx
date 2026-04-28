import React, { useState, useEffect } from 'react'
import { removeBg } from '../utils/removeBg'

const DEFAULT_GRADIENT = 'linear-gradient(135deg, #f97316, #ea580c)'

const GRADIENT_PRESETS = [
  'linear-gradient(135deg, #f97316, #ea580c)',
  'linear-gradient(135deg, #3b82f6, #1d4ed8)',
  'linear-gradient(135deg, #8b5cf6, #6d28d9)',
  'linear-gradient(135deg, #10b981, #059669)',
  'linear-gradient(135deg, #ef4444, #dc2626)',
  'linear-gradient(135deg, #f59e0b, #d97706)',
  'linear-gradient(135deg, #ec4899, #be185d)',
  'linear-gradient(135deg, #64748b, #334155)',
]

export default function DesignLabManager() {
  const [cats, setCats] = useState([])
  const [form, setForm] = useState({ label: '', desc: '', count: '10+', img: '', gradient: DEFAULT_GRADIENT, order: 0 })
  const [editing, setEditing] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [color1, setColor1] = useState('#f97316')
  const [color2, setColor2] = useState('#ea580c')

  const [catProducts, setCatProducts] = useState([])
  const [cpForm, setCpForm] = useState({ categoryLabel: '', name: '', image: '', order: 0 })
  const [editingCp, setEditingCp] = useState(null)
  const [cpUploading, setCpUploading] = useState(false)
  const [cpOriginalImg, setCpOriginalImg] = useState('')
  const [cpImgFit, setCpImgFit] = useState('cover')
  const [selectedCatFilter, setSelectedCatFilter] = useState('')

  const DEFAULT_CATS = ['T-Shirts','Hoodies','Switers','Trousers','Caps','Hats','Snokes','Mobile Covers','Laptop Sleeves','Mouse Pads','Earbud Cases','Notebooks','Books & Covers','Pens','Mugs','Stickers','Tote Bags','Backpacks','Duffle Bags','Wallets','Cushions','Water Bottles','Wall Arts']

  const fetchCats = async () => {
    const res = await fetch('http://localhost:5000/api/design-lab-categories')
    setCats(await res.json())
  }

  const fetchCp = async (cat) => setCatProducts(await fetch(`http://localhost:5000/api/category-products${cat ? `?category=${encodeURIComponent(cat)}` : ''}`).then(r => r.json()))

  useEffect(() => { fetchCats(); fetchCp('') }, [])

  const handleImgUpload = async (e) => {
    const file = e.target.files[0]; if (!file) return
    setUploading(true)
    const fd = new FormData(); fd.append('image', file)
    const res = await fetch('http://localhost:5000/api/upload', { method: 'POST', body: fd })
    const data = await res.json()
    setForm(p => ({ ...p, img: data.url }))
    setUploading(false)
  }

  const handleSave = async () => {
    if (!form.label) return
    const method = editing ? 'PUT' : 'POST'
    const url = editing ? `http://localhost:5000/api/design-lab-categories/${editing._id}` : 'http://localhost:5000/api/design-lab-categories'
    try {
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const data = await res.json()
      console.log('Saved:', data)
      setForm({ label: '', desc: '', count: '10+', img: '', gradient: DEFAULT_GRADIENT, order: 0 })
      setColor1('#f97316'); setColor2('#ea580c')
      setEditing(null)
      fetchCats()
    } catch(err) {
      console.error('Save error:', err)
      alert('Save nahi hua — backend check karo')
    }
  }

  const handleEdit = (c) => {
    setForm({ label: c.label, desc: c.desc, count: c.count, img: c.img, gradient: c.gradient, order: c.order })
    setEditing(c)
    const match = c.gradient.match(/#[0-9a-fA-F]{6}/g)
    if (match) { setColor1(match[0]); setColor2(match[1] || match[0]) }
  }

  const handleDelete = async (id) => {
    await fetch(`http://localhost:5000/api/design-lab-categories/${id}`, { method: 'DELETE' })
    fetchCats()
  }

  const handleCpSave = async () => {
    if (!cpForm.categoryLabel || cpForm.categoryLabel === '__custom__' || !cpForm.name) return
    const method = editingCp ? 'PUT' : 'POST'
    const url = editingCp ? `http://localhost:5000/api/category-products/${editingCp._id}` : 'http://localhost:5000/api/category-products'
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(cpForm) })
    setCpForm({ categoryLabel: '', name: '', image: '', order: 0 }); setEditingCp(null)
    fetchCp(selectedCatFilter)
  }
  const handleCpEdit = (p) => { setCpForm({ categoryLabel: p.categoryLabel, name: p.name, image: p.image, order: p.order }); setEditingCp(p) }
  const handleCpDelete = async (id) => { await fetch(`http://localhost:5000/api/category-products/${id}`, { method: 'DELETE' }); fetchCp(selectedCatFilter) }

  return (
    <div className="admin-page">
      <div className="admin-carousel-section">
        <h2 className="admin-carousel-title">🎨 Design Lab — Categories</h2>
        <p className="admin-carousel-sub">Design Lab Step 1 ki categories yahan manage karo — add, edit, delete</p>

        {/* Form */}
        <div className="admin-product-form">
          <h3>{editing ? 'Edit Category' : 'Add New Category'}</h3>

          <div className="admin-split-row">
            <div className="admin-split-field">
              <label>Category Name *</label>
              <input value={form.label} onChange={e => setForm(p => ({ ...p, label: e.target.value }))} placeholder="T-Shirts, Mobile Covers..." />
            </div>
            <div className="admin-split-field">
              <label>Count Badge</label>
              <input value={form.count} onChange={e => setForm(p => ({ ...p, count: e.target.value }))} placeholder="50+" />
            </div>
          </div>

          <div className="admin-split-field">
            <label>Description</label>
            <input value={form.desc} onChange={e => setForm(p => ({ ...p, desc: e.target.value }))} placeholder="Classic, Oversized, V-Neck & more" />
          </div>

          <div className="admin-split-field">
            <label>Category Image</label>
            <div className="admin-image-upload" onClick={() => document.getElementById('dlCatImg').click()}>
              {form.img
                ? <img src={form.img} alt="cat" className="admin-image-preview" style={{ objectFit: 'cover' }} />
                : <div className="admin-image-placeholder"><span>🖼️</span><p>{uploading ? 'Uploading...' : 'Upload Image'}</p></div>
              }
              <input id="dlCatImg" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImgUpload} />
            </div>
          </div>

          <div className="admin-split-field">
            <label>Gradient Color</label>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <label style={{ fontSize: 11, color: '#aaa' }}>Color 1</label>
                <input type="color" value={color1} onChange={e => { setColor1(e.target.value); setForm(p => ({ ...p, gradient: `linear-gradient(135deg, ${e.target.value}, ${color2})` })) }}
                  style={{ width: 52, height: 44, border: 'none', borderRadius: 8, cursor: 'pointer', background: 'none' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <label style={{ fontSize: 11, color: '#aaa' }}>Color 2</label>
                <input type="color" value={color2} onChange={e => { setColor2(e.target.value); setForm(p => ({ ...p, gradient: `linear-gradient(135deg, ${color1}, ${e.target.value})` })) }}
                  style={{ width: 52, height: 44, border: 'none', borderRadius: 8, cursor: 'pointer', background: 'none' }} />
              </div>
              <div style={{ flex: 1, minWidth: 120 }}>
                <label style={{ fontSize: 11, color: '#aaa', display: 'block', marginBottom: 4 }}>Preview</label>
                <div style={{ height: 44, borderRadius: 8, background: form.gradient, border: '1px solid rgba(255,255,255,0.1)' }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: 8 }}>
              {GRADIENT_PRESETS.map((g, i) => (
                <button key={i} onClick={() => { setForm(p => ({ ...p, gradient: g })); const m = g.match(/#[0-9a-fA-F]{6}/g); if(m){ setColor1(m[0]); setColor2(m[1]||m[0]) } }}
                  style={{ width: 28, height: 28, borderRadius: '50%', background: g, border: form.gradient === g ? '3px solid #fff' : '2px solid transparent', cursor: 'pointer', boxShadow: form.gradient === g ? '0 0 0 2px #f97316' : 'none' }} />
              ))}
            </div>
          </div>

          <div className="admin-product-actions">
            {editing && <button className="admin-crop-cancel" onClick={() => { setEditing(null); setForm({ label: '', desc: '', count: '10+', img: '', gradient: DEFAULT_GRADIENT, order: 0 }) }}>Cancel</button>}
            <button className="admin-carousel-btn" onClick={handleSave} disabled={uploading || !form.label}>
              {editing ? 'Update Category' : 'Add Category'}
            </button>
          </div>
        </div>

        {/* List */}
        <div className="admin-products-grid">
          {cats.length === 0
            ? <div className="admin-carousel-empty"><span>🎨</span><p>Koi category nahi — upar se add karo</p></div>
            : cats.map((c) => (
              <div key={c._id} className="admin-product-card">
                <div className="admin-product-image-container" style={{ height: 100, overflow: 'hidden', borderRadius: '0.5rem', position: 'relative' }}>
                  {c.img
                    ? <img src={c.img} alt={c.label} className="admin-product-img" style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
                    : <div style={{ width: '100%', height: '100%', background: c.gradient, borderRadius: '0.5rem' }} />
                  }
                  <span style={{ position: 'absolute', top: 6, right: 6, fontSize: '0.6rem', fontWeight: 900, background: c.gradient, color: '#fff', padding: '2px 8px', borderRadius: 999 }}>{c.count}</span>
                </div>
                <div className="admin-product-info">
                  <h4>{c.label}</h4>
                  <p style={{ fontSize: 11, color: '#888', marginTop: 2 }}>{c.desc}</p>
                  <div style={{ height: 4, borderRadius: 999, background: c.gradient, marginTop: 6 }} />
                </div>
                <div className="admin-product-actions">
                  <button className="admin-product-edit" onClick={() => handleEdit(c)}>✏️ Edit</button>
                  <button className="admin-carousel-delete" onClick={() => handleDelete(c._id)}>🗑 Delete</button>
                </div>
              </div>
            ))
          }
        </div>
      </div>

      {/* CATEGORY PRODUCTS */}
      <div className="admin-carousel-section">
        <h2 className="admin-carousel-title">📦 Category Products — Step 2</h2>
        <p className="admin-carousel-sub">Har category ke products yahan add karo — Design Lab Step 2 mein show honge</p>
        <div className="admin-product-form">
          <h3>{editingCp ? 'Edit Product' : 'Add New Product'}</h3>
          <div className="admin-split-field">
            <label>Category *</label>
            <select value={cpForm.categoryLabel} onChange={e => setCpForm(p => ({ ...p, categoryLabel: e.target.value }))} style={{ width: '100%', padding: '0.6rem', borderRadius: 8, background: '#1a1a1a', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}>
              <option value="">-- Category Select Karo --</option>
              {(cats.length > 0 ? cats.map(c => c.label) : DEFAULT_CATS).map((label, i) => <option key={i} value={label}>{label}</option>)}
              <option value="__custom__">+ Custom (khud likho)</option>
            </select>
            {cpForm.categoryLabel === '__custom__' && (
              <input style={{ marginTop: 8, width: '100%', padding: '0.6rem', borderRadius: 8, background: '#1a1a1a', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}
                placeholder="Category name likho..."
                onChange={e => setCpForm(p => ({ ...p, categoryLabel: e.target.value === '' ? '__custom__' : e.target.value }))}
              />
            )}
          </div>
          <div className="admin-split-field">
            <label>Product Name *</label>
            <input value={cpForm.name} onChange={e => setCpForm(p => ({ ...p, name: e.target.value }))} placeholder="Classic T-Shirt, iPhone 16 Pro..." />
          </div>
          <div className="admin-split-field">
            <label>Image <small style={{ color: '#888' }}>(optional)</small></label>
            <div className="admin-image-upload" onClick={() => !cpUploading && document.getElementById('cpImgInput').click()}>
              {cpForm.image
                ? <img src={cpForm.image} alt="product" className="admin-image-preview" style={{ objectFit: cpImgFit }} />
                : <div className="admin-image-placeholder"><span>📦</span><p>{cpUploading ? 'Uploading...' : 'Upload Image'}</p></div>
              }
              <input id="cpImgInput" type="file" accept="image/*" style={{ display: 'none' }} onChange={async (e) => {
                const file = e.target.files[0]; if (!file) return
                setCpUploading(true)
                const fd = new FormData(); fd.append('image', file)
                const res = await fetch('http://localhost:5000/api/upload', { method: 'POST', body: fd })
                const data = await res.json()
                setCpForm(p => ({ ...p, image: data.url }))
                setCpOriginalImg(data.url)
                setCpUploading(false)
              }} />
            </div>
            {cpForm.image && (
              <div style={{ display: 'flex', gap: '0.4rem', marginTop: 6, flexWrap: 'wrap' }}>
                {['cover','contain','fill'].map(fit => (
                  <button key={fit} onClick={() => setCpImgFit(fit)} style={{ padding: '0.25rem 0.75rem', borderRadius: 999, border: '1px solid rgba(255,255,255,0.15)', background: cpImgFit === fit ? '#f97316' : '#111', color: '#fff', cursor: 'pointer', fontSize: '0.68rem', fontWeight: 700 }}>{fit}</button>
                ))}
              </div>
            )}
            {cpForm.image && (
              <div className="admin-rmbg-actions">
                <button className="admin-rmbg-btn" onClick={async () => {
                  setCpUploading(true)
                  try {
                    const blob = await removeBg(cpForm.image)
                    const fd = new FormData(); fd.append('image', blob, 'clean.png')
                    const res = await fetch('http://localhost:5000/api/upload', { method: 'POST', body: fd })
                    const data = await res.json()
                    setCpForm(p => ({ ...p, image: data.url }))
                  } catch { alert('Background remove nahi hua') }
                  setCpUploading(false)
                }} disabled={cpUploading}>✂️ {cpUploading ? 'Removing...' : 'Remove Background'}</button>
                {cpOriginalImg && cpForm.image !== cpOriginalImg && (
                  <button className="admin-rmbg-cancel" onClick={() => setCpForm(p => ({ ...p, image: cpOriginalImg }))}>↩️ Cancel</button>
                )}
              </div>
            )}
          </div>
          <div className="admin-product-actions">
            {editingCp && <button className="admin-crop-cancel" onClick={() => { setEditingCp(null); setCpForm({ categoryLabel: '', name: '', image: '', order: 0 }) }}>Cancel</button>}
            <button className="admin-carousel-btn" onClick={handleCpSave} disabled={cpUploading || !cpForm.categoryLabel || !cpForm.name}>{editingCp ? 'Update Product' : 'Add Product'}</button>
          </div>
        </div>

        {/* Filter by category */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          <button onClick={() => { setSelectedCatFilter(''); fetchCp('') }} style={{ padding: '0.35rem 0.85rem', borderRadius: 999, border: '1px solid rgba(255,255,255,0.15)', background: selectedCatFilter === '' ? '#f97316' : '#111', color: '#fff', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 700 }}>All</button>
          {(cats.length > 0 ? cats.map(c => c.label) : DEFAULT_CATS).map((label, i) => (
            <button key={i} onClick={() => { setSelectedCatFilter(label); fetchCp(label) }} style={{ padding: '0.35rem 0.85rem', borderRadius: 999, border: '1px solid rgba(255,255,255,0.15)', background: selectedCatFilter === label ? '#f97316' : '#111', color: '#fff', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 700 }}>{label}</button>
          ))}
        </div>

        <div className="admin-carousel-grid">
          {catProducts.length === 0
            ? <div className="admin-carousel-empty"><span>📦</span><p>Koi product nahi — upar se add karo</p></div>
            : catProducts.map((p, i) => (
              <div key={p._id} className="admin-carousel-card">
                <div className="admin-carousel-badge">#{i + 1}</div>
                {p.image
                  ? <img src={p.image} alt={p.name} className="admin-carousel-img" />
                  : <div className="admin-carousel-img" style={{ background: 'rgba(249,115,22,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>📦</div>
                }
                <div className="admin-carousel-footer">
                  <div>
                    <span className="admin-carousel-url">{p.name}</span>
                    <span style={{ display: 'block', fontSize: 10, color: '#f97316', marginTop: 2 }}>{p.categoryLabel}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="admin-product-edit" onClick={() => handleCpEdit(p)}>✏️</button>
                    <button className="admin-carousel-delete" onClick={() => handleCpDelete(p._id)}>🗑</button>
                  </div>
                </div>
              </div>
            ))
          }
        </div>
      </div>

    </div>
  )
}
