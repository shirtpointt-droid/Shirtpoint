import React, { useEffect, useState } from 'react'

const BASE_IDS = [
  { baseId: 'tshirt',      label: 'Classic T-Shirt' },
  { baseId: 'halftee',     label: 'Half Sleeve T-Shirt' },
  { baseId: 'fulltee',     label: 'Full Sleeve T-Shirt' },
  { baseId: 'oversized',   label: 'Oversized T-Shirt' },
  { baseId: 'vneck',       label: 'V-Neck T-Shirt' },
  { baseId: 'henley',      label: 'Henley T-Shirt' },
  { baseId: 'raglan',      label: 'Raglan T-Shirt' },
  { baseId: 'croptee',     label: 'Crop T-Shirt' },
  { baseId: 'longline',    label: 'Longline T-Shirt' },
  { baseId: 'polo',        label: 'Polo Shirt' },
  { baseId: 'polofull',    label: 'Full Sleeve Polo' },
  { baseId: 'kurta',       label: 'Kurta' },
  { baseId: 'kurtashort',  label: 'Short Kurta' },
  { baseId: 'pajamakurta', label: 'Kurta Pajama Set' },
  { baseId: 'hoodie',      label: 'Hoodie' },
  { baseId: 'sweatshirt',  label: 'Sweatshirt' },
  { baseId: 'jacket',      label: 'Jacket' },
  { baseId: 'tank',        label: 'Tank / Sando' },
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

  const handleUpload = async (baseId, label, file) => {
    if (!file) return
    setUploading(baseId)
    const formData = new FormData()
    formData.append('image', file)
    formData.append('baseId', baseId)
    formData.append('label', label)
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
        {BASE_IDS.map(({ baseId, label }) => {
          const existing = mockups[baseId]
          const isUploading = uploading === baseId
          const isDone = success === baseId
          return (
            <div key={baseId} style={{
              background: '#1a1a1a', border: '1px solid #2a2a2a',
              borderRadius: '1rem', padding: '1rem', display: 'flex',
              flexDirection: 'column', gap: '0.75rem'
            }}>
              <p style={{ color: '#f97316', fontSize: '0.7rem', fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase' }}>{label}</p>

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
                  onChange={e => handleUpload(baseId, label, e.target.files[0])} />
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
