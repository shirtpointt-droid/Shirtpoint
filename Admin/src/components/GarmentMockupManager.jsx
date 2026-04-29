import React, { useEffect, useState } from 'react'

const BASE_IDS = [
  { baseId: 'tshirt',      label: 'Classic T-Shirt',       category: 'T-Shirts' },
  { baseId: 'halftee',     label: 'Half Sleeve T-Shirt',   category: 'T-Shirts' },
  { baseId: 'fulltee',     label: 'Full Sleeve T-Shirt',   category: 'T-Shirts' },
  { baseId: 'oversized',   label: 'Oversized T-Shirt',     category: 'T-Shirts' },
  { baseId: 'vneck',       label: 'V-Neck T-Shirt',        category: 'T-Shirts' },
  { baseId: 'henley',      label: 'Henley T-Shirt',        category: 'T-Shirts' },
  { baseId: 'raglan',      label: 'Raglan T-Shirt',        category: 'T-Shirts' },
  { baseId: 'croptee',     label: 'Crop T-Shirt',          category: 'T-Shirts' },
  { baseId: 'longline',    label: 'Longline T-Shirt',      category: 'T-Shirts' },
  { baseId: 'polo',        label: 'Polo Shirt',            category: 'Polos' },
  { baseId: 'polofull',    label: 'Full Sleeve Polo',      category: 'Polos' },
  { baseId: 'kurta',       label: 'Kurta',                 category: 'Kurtas' },
  { baseId: 'kurtashort',  label: 'Short Kurta',           category: 'Kurtas' },
  { baseId: 'pajamakurta', label: 'Kurta Pajama Set',      category: 'Kurtas' },
  { baseId: 'hoodie',      label: 'Hoodie',                category: 'Hoodies' },
  { baseId: 'sweatshirt',  label: 'Sweatshirt',            category: 'Hoodies' },
  { baseId: 'jacket',      label: 'Jacket',                category: 'Jackets' },
  { baseId: 'tank',        label: 'Tank / Sando',          category: 'T-Shirts' },
]

const API = 'http://localhost:5000/api/garment-mockups'

export default function GarmentMockupManager() {
  const [mockups, setMockups] = useState({})
  const [uploading, setUploading] = useState(null)
  const [success, setSuccess] = useState(null)

  const fetchMockups = async () => {
    const res = await fetch(API)
    const data = await res.json()
    const map = {}
    data.forEach(d => { map[d.baseId] = d })
    setMockups(map)
  }

  useEffect(() => { fetchMockups() }, [])

  const handleUpload = async (baseId, label, category, file) => {
    if (!file) return
    setUploading(baseId)
    const formData = new FormData()
    formData.append('image', file)
    formData.append('baseId', baseId)
    formData.append('label', label)
    formData.append('category', category)
    await fetch(API, { method: 'POST', body: formData })
    await fetchMockups()
    setUploading(null)
    setSuccess(baseId)
    setTimeout(() => setSuccess(null), 2000)
  }

  const handleDelete = async (baseId) => {
    await fetch(`${API}/${baseId}`, { method: 'DELETE' })
    await fetchMockups()
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ color: '#fff', marginBottom: '0.5rem' }}>👕 Garment Mockup Images</h2>
      <p style={{ color: '#888', marginBottom: '2rem', fontSize: '0.85rem' }}>
        Har garment type ke liye white/light PNG mockup upload karo — DesignLab mein live preview mein dikhega
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
        {BASE_IDS.map(({ baseId, label, category }) => {
          const existing = mockups[baseId]
          const isUploading = uploading === baseId
          const isDone = success === baseId
          return (
            <div key={baseId} style={{
              background: '#1a1a1a', border: '1px solid #2a2a2a',
              borderRadius: '1rem', padding: '1rem', display: 'flex',
              flexDirection: 'column', gap: '0.75rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <p style={{ color: '#f97316', fontSize: '0.7rem', fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase' }}>{label}</p>
                <span style={{ fontSize: '0.6rem', fontWeight: 700, background: 'rgba(99,102,241,0.15)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '999px', padding: '0.15rem 0.55rem', letterSpacing: 1 }}>{category}</span>
              </div>

              {/* Preview */}
              <div style={{
                height: 140, background: '#111', borderRadius: '0.65rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden', border: '1px solid #222'
              }}>
                {existing
                  ? <img src={existing.url} alt={label} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                  : <span style={{ color: '#444', fontSize: '2rem' }}>👕</span>
                }
              </div>

              {/* Upload */}
              <label style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: '0.4rem', padding: '0.55rem', borderRadius: '0.6rem',
                background: isDone ? 'rgba(34,197,94,0.15)' : 'rgba(249,115,22,0.1)',
                border: `1px solid ${isDone ? '#22c55e' : 'rgba(249,115,22,0.3)'}`,
                color: isDone ? '#22c55e' : '#f97316',
                fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer'
              }}>
                {isUploading ? '⏳ Uploading...' : isDone ? '✅ Uploaded!' : existing ? '🔄 Change' : '📁 Upload PNG'}
                <input type="file" accept="image/*" hidden
                  onChange={e => handleUpload(baseId, label, category, e.target.files[0])} />
              </label>

              {/* Delete */}
              {existing && (
                <button onClick={() => handleDelete(baseId)} style={{
                  padding: '0.4rem', borderRadius: '0.5rem',
                  background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)',
                  color: '#ef4444', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer'
                }}>🗑️ Remove</button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
