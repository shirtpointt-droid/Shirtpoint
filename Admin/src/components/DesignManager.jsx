import React, { useState, useEffect } from 'react'
import '../css/DesignManager.css'

const DEFAULT_CATS = ['T-Shirt', 'Polo', 'Kurta', 'Shalwar', 'Hoodie', 'Jacket', 'Sando']

const DEFAULT_ITEMS = [
  { baseId: 'tshirt',      label: 'Classic T-Shirt',    category: 'T-Shirt' },
  { baseId: 'halftee',     label: 'Half Sleeve T-Shirt', category: 'T-Shirt' },
  { baseId: 'fulltee',     label: 'Full Sleeve T-Shirt', category: 'T-Shirt' },
  { baseId: 'oversized',   label: 'Oversized T-Shirt',  category: 'T-Shirt' },
  { baseId: 'vneck',       label: 'V-Neck T-Shirt',     category: 'T-Shirt' },
  { baseId: 'henley',      label: 'Henley T-Shirt',     category: 'T-Shirt' },
  { baseId: 'raglan',      label: 'Raglan T-Shirt',     category: 'T-Shirt' },
  { baseId: 'croptee',     label: 'Crop T-Shirt',       category: 'T-Shirt' },
  { baseId: 'longline',    label: 'Longline T-Shirt',   category: 'T-Shirt' },
  { baseId: 'polo',        label: 'Polo Shirt',         category: 'Polo' },
  { baseId: 'polofull',    label: 'Full Sleeve Polo',   category: 'Polo' },
  { baseId: 'kurta',       label: 'Kurta',              category: 'Kurta' },
  { baseId: 'kurtashort',  label: 'Short Kurta',        category: 'Kurta' },
  { baseId: 'pajamakurta', label: 'Kurta Pajama Set',   category: 'Shalwar' },
  { baseId: 'hoodie',      label: 'Hoodie',             category: 'Hoodie' },
  { baseId: 'sweatshirt',  label: 'Sweatshirt',         category: 'Hoodie' },
  { baseId: 'jacket',      label: 'Jacket',             category: 'Jacket' },
  { baseId: 'tank',        label: 'Tank / Sando',       category: 'Sando' },
]

const API = 'http://localhost:5000/api/garment-mockups'

export default function DesignManager() {
  const [mockups, setMockups] = useState({})
  const [editing, setEditing] = useState({}) // { baseId: { label, category } }
  const [uploading, setUploading] = useState(null)
  const [saving, setSaving] = useState(null)
  const [success, setSuccess] = useState(null)
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('dm_categories')
    return saved ? JSON.parse(saved) : DEFAULT_CATS
  })
  const [newCat, setNewCat] = useState('')

  const fetchMockups = async () => {
    const res = await fetch(API)
    const data = await res.json()
    const map = {}
    data.forEach(d => { map[d.baseId] = d })
    setMockups(map)
  }

  useEffect(() => { fetchMockups() }, [])

  // Init editing state from mockup or default
  const getEdit = (baseId) => {
    if (editing[baseId]) return editing[baseId]
    const def = DEFAULT_ITEMS.find(d => d.baseId === baseId)
    const saved = mockups[baseId]
    return {
      label: saved?.label || def?.label || '',
      category: saved?.category || def?.category || '',
    }
  }

  const setEdit = (baseId, key, val) => {
    setEditing(e => ({ ...e, [baseId]: { ...getEdit(baseId), [key]: val } }))
  }

  const handleSave = async (baseId, file = null) => {
    const { label, category } = getEdit(baseId)
    if (file) setUploading(baseId)
    else setSaving(baseId)

    const formData = new FormData()
    formData.append('baseId', baseId)
    formData.append('label', label)
    formData.append('category', category)
    if (file) formData.append('image', file)

    await fetch(API, { method: 'POST', body: formData })
    await fetchMockups()
    setUploading(null)
    setSaving(null)
    setSuccess(baseId)
    setTimeout(() => setSuccess(null), 2000)
  }

  const addCategory = () => {
    const trimmed = newCat.trim()
    if (!trimmed || categories.includes(trimmed)) return
    const updated = [...categories, trimmed]
    setCategories(updated)
    localStorage.setItem('dm_categories', JSON.stringify(updated))
    setNewCat('')
  }

  const removeCategory = (cat) => {
    const updated = categories.filter(c => c !== cat)
    setCategories(updated)
    localStorage.setItem('dm_categories', JSON.stringify(updated))
  }

  const handleDelete = async (baseId) => {
    await fetch(`${API}/${baseId}`, { method: 'DELETE' })
    await fetchMockups()
  }

  return (
    <div className="dm-wrapper">
      <div className="dm-header">
        <div>
          <h1 className="dm-title">👕 Garment Manager</h1>
          <p className="dm-sub">Har garment ka naam, category aur mockup image manage karo</p>
        </div>
      </div>

      <div className="dm-card" style={{ marginBottom: '1rem' }}>
        <h2 className="dm-card-title">📂 Categories</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
          {categories.map(cat => (
            <span key={cat} style={{
              display: 'flex', alignItems: 'center', gap: '0.35rem',
              padding: '0.35rem 0.75rem', background: 'rgba(249,115,22,0.08)',
              border: '1px solid rgba(249,115,22,0.3)', borderRadius: '999px',
              fontSize: '0.78rem', fontWeight: 700, color: '#f97316'
            }}>
              {cat}
              {!DEFAULT_CATS.includes(cat) && (
                <button onClick={() => removeCategory(cat)} style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#ef4444', fontSize: '0.75rem', padding: 0, lineHeight: 1
                }}>✕</button>
              )}
            </span>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            value={newCat}
            onChange={e => setNewCat(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addCategory()}
            placeholder="Nai category ka naam..."
            className="dm-input"
            style={{ maxWidth: 220 }}
          />
          <button onClick={addCategory} className="dm-btn-primary">+ Add</button>
        </div>
      </div>

      <div className="dm-card">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
          {DEFAULT_ITEMS.map(({ baseId }) => {
            const existing = mockups[baseId]
            const edit = getEdit(baseId)
            const isUploading = uploading === baseId
            const isSaving = saving === baseId
            const isDone = success === baseId

            return (
              <div key={baseId} style={{
                background: '#fafafa', border: `1.5px solid ${isDone ? '#22c55e' : '#e5e7eb'}`,
                borderRadius: '1rem', padding: '1rem',
                display: 'flex', flexDirection: 'column', gap: '0.6rem',
                transition: 'border-color 0.3s'
              }}>

                {/* Image Preview */}
                <div style={{
                  height: 120, background: '#fff', borderRadius: '0.65rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  overflow: 'hidden', border: '1px solid #e5e7eb', position: 'relative'
                }}>
                  {existing?.url
                    ? <img src={existing.url} alt={edit.label} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                    : <span style={{ color: '#ccc', fontSize: '2.5rem' }}>👕</span>
                  }
                </div>

                {/* Name Input */}
                <div>
                  <p style={{ fontSize: '0.6rem', fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: 1, marginBottom: '0.25rem' }}>Name</p>
                  <input
                    value={edit.label}
                    onChange={e => setEdit(baseId, 'label', e.target.value)}
                    style={{
                      width: '100%', padding: '0.45rem 0.7rem',
                      border: '1.5px solid #e5e7eb', borderRadius: '0.5rem',
                      fontSize: '0.8rem', outline: 'none', background: '#fff',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                {/* Category Select */}
                <div>
                  <p style={{ fontSize: '0.6rem', fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: 1, marginBottom: '0.25rem' }}>Category</p>
                  <select
                    value={edit.category}
                    onChange={e => setEdit(baseId, 'category', e.target.value)}
                    style={{
                      width: '100%', padding: '0.45rem 0.7rem',
                      border: '1.5px solid #e5e7eb', borderRadius: '0.5rem',
                      fontSize: '0.8rem', outline: 'none', background: '#fff',
                      boxSizing: 'border-box', cursor: 'pointer'
                    }}
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                {/* Save Name/Category */}
                <button
                  onClick={() => handleSave(baseId)}
                  style={{
                    padding: '0.45rem', borderRadius: '0.5rem',
                    background: isDone ? 'rgba(34,197,94,0.1)' : 'rgba(249,115,22,0.08)',
                    border: `1px solid ${isDone ? '#22c55e' : 'rgba(249,115,22,0.3)'}`,
                    color: isDone ? '#16a34a' : '#f97316',
                    fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer'
                  }}
                >
                  {isSaving ? '⏳ Saving...' : isDone ? '✅ Saved!' : '💾 Save Changes'}
                </button>

                {/* Upload Image */}
                <label style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: '0.35rem', padding: '0.45rem', borderRadius: '0.5rem',
                  background: '#f3f4f6', border: '1px solid #e5e7eb',
                  color: '#555', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer'
                }}>
                  {isUploading ? '⏳ Uploading...' : existing?.url ? '🔄 Change Image' : '📁 Upload Image'}
                  <input type="file" accept="image/*" hidden
                    onChange={e => handleSave(baseId, e.target.files[0])} />
                </label>

                {/* Remove Image */}
                {existing?.url && (
                  <button onClick={() => handleDelete(baseId)} style={{
                    padding: '0.38rem', borderRadius: '0.45rem',
                    background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)',
                    color: '#ef4444', fontSize: '0.68rem', fontWeight: 700, cursor: 'pointer'
                  }}>🗑️ Remove Image</button>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
