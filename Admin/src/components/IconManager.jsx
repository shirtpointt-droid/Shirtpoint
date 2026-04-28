import React, { useState } from 'react'
import '../css/IconManager.css'

const DEFAULT_ICONS = [
  { id: '1',  emoji: '🔥', name: 'Fire',    tier: 'free' },
  { id: '2',  emoji: '⚡', name: 'Lightning', tier: 'free' },
  { id: '3',  emoji: '💎', name: 'Diamond',  tier: 'paid' },
  { id: '4',  emoji: '🎯', name: 'Target',   tier: 'free' },
  { id: '5',  emoji: '🚀', name: 'Rocket',   tier: 'paid' },
  { id: '6',  emoji: '👑', name: 'Crown',    tier: 'paid' },
  { id: '7',  emoji: '🌊', name: 'Wave',     tier: 'free' },
  { id: '8',  emoji: '🎨', name: 'Palette',  tier: 'free' },
  { id: '9',  emoji: '🦁', name: 'Lion',     tier: 'paid' },
  { id: '10', emoji: '🐉', name: 'Dragon',   tier: 'paid' },
  { id: '11', emoji: '🌙', name: 'Moon',     tier: 'free' },
  { id: '12', emoji: '⭐', name: 'Star',     tier: 'free' },
]

export default function IconManager() {
  const [icons, setIcons] = useState(DEFAULT_ICONS)
  const [filter, setFilter] = useState('all') // 'all' | 'free' | 'paid'
  const [form, setForm] = useState({ emoji: '', name: '', tier: 'free' })
  const [editId, setEditId] = useState(null)
  const [toast, setToast] = useState('')

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500) }

  const save = () => {
    if (!form.emoji.trim() || !form.name.trim()) return
    if (editId) {
      setIcons(i => i.map(x => x.id === editId ? { ...x, ...form } : x))
      showToast('Icon updated!')
    } else {
      setIcons(i => [...i, { id: Date.now().toString(), ...form }])
      showToast('Icon added!')
    }
    setForm({ emoji: '', name: '', tier: 'free' })
    setEditId(null)
  }

  const del = (id) => { setIcons(i => i.filter(x => x.id !== id)); showToast('Icon deleted!') }

  const startEdit = (icon) => { setEditId(icon.id); setForm({ emoji: icon.emoji, name: icon.name, tier: icon.tier }) }

  const toggleTier = (id) => {
    setIcons(i => i.map(x => x.id === id ? { ...x, tier: x.tier === 'free' ? 'paid' : 'free' } : x))
  }

  const filtered = icons.filter(i => filter === 'all' || i.tier === filter)
  const freeCount = icons.filter(i => i.tier === 'free').length
  const paidCount = icons.filter(i => i.tier === 'paid').length

  return (
    <div className="im-wrapper">
      {toast && <div className="im-toast">{toast}</div>}

      {/* Header */}
      <div className="im-header">
        <div>
          <h1 className="im-title">🎭 Icon Manager</h1>
          <p className="im-sub">Manage design icons — Free & Paid</p>
        </div>
        <div className="im-stats">
          <div className="im-stat"><span>{icons.length}</span><p>Total</p></div>
          <div className="im-stat free"><span>{freeCount}</span><p>Free</p></div>
          <div className="im-stat paid"><span>{paidCount}</span><p>Paid</p></div>
        </div>
      </div>

      <div className="im-body">

        {/* Left: Add/Edit Form */}
        <div className="im-card">
          <h2 className="im-card-title">{editId ? 'Edit Icon' : 'Add New Icon'}</h2>

          <div className="im-field">
            <label>Emoji / Icon</label>
            <input className="im-input im-emoji-input" placeholder="e.g. 🔥" value={form.emoji}
              onChange={e => setForm(f => ({ ...f, emoji: e.target.value }))} />
          </div>

          <div className="im-field">
            <label>Icon Name</label>
            <input className="im-input" placeholder="e.g. Fire" value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              onKeyDown={e => e.key === 'Enter' && save()} />
          </div>

          <div className="im-field">
            <label>Tier</label>
            <div className="im-tier-toggle">
              <button className={`im-tier-btn ${form.tier === 'free' ? 'active-free' : ''}`}
                onClick={() => setForm(f => ({ ...f, tier: 'free' }))}>
                ✅ Free
              </button>
              <button className={`im-tier-btn ${form.tier === 'paid' ? 'active-paid' : ''}`}
                onClick={() => setForm(f => ({ ...f, tier: 'paid' }))}>
                💎 Paid
              </button>
            </div>
          </div>

          <div className="im-form-btns">
            <button className="im-btn-primary" onClick={save}>
              {editId ? '✓ Update' : '+ Add Icon'}
            </button>
            {editId && (
              <button className="im-btn-ghost" onClick={() => { setEditId(null); setForm({ emoji: '', name: '', tier: 'free' }) }}>
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* Right: Icons Grid */}
        <div className="im-card">
          {/* Filter Tabs */}
          <div className="im-filter-tabs">
            {['all', 'free', 'paid'].map(t => (
              <button key={t} className={`im-filter-tab ${filter === t ? 'active' : ''} ${t}`}
                onClick={() => setFilter(t)}>
                {t === 'all' ? `🗂 All (${icons.length})` : t === 'free' ? `✅ Free (${freeCount})` : `💎 Paid (${paidCount})`}
              </button>
            ))}
          </div>

          {/* Icons Grid */}
          <div className="im-grid">
            {filtered.map(icon => (
              <div key={icon.id} className={`im-icon-card ${icon.tier}`}>
                <div className="im-icon-emoji">{icon.emoji}</div>
                <div className="im-icon-name">{icon.name}</div>
                <button className={`im-tier-badge ${icon.tier}`} onClick={() => toggleTier(icon.id)}>
                  {icon.tier === 'free' ? '✅ Free' : '💎 Paid'}
                </button>
                <div className="im-icon-actions">
                  <button className="im-icon-btn edit" onClick={() => startEdit(icon)}>✏️</button>
                  <button className="im-icon-btn del" onClick={() => del(icon.id)}>🗑️</button>
                </div>
              </div>
            ))}
            {filtered.length === 0 && <p className="im-empty">No icons found</p>}
          </div>
        </div>

      </div>
    </div>
  )
}
