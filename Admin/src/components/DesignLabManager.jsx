import React, { useState, useEffect } from 'react'

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

  const fetchCats = async () => {
    const res = await fetch('http://localhost:5000/api/design-lab-categories')
    setCats(await res.json())
  }

  useEffect(() => { fetchCats() }, [])

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
    </div>
  )
}
