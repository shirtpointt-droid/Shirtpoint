import React, { useEffect, useState } from 'react'
import '../css/SplitManager.css'

function SplitManager() {
  const [form, setForm] = useState({
    eyebrow: '', heading: '', description: '', btn1: '', btn2: '', videoUrl: '',
    features: [
      { title: '', value: '' }, { title: '', value: '' },
      { title: '', value: '' }, { title: '', value: '' }
    ]
  })
  const [saved, setSaved] = useState(false)
  const [videoFile, setVideoFile] = useState(null)
  const [videoUploading, setVideoUploading] = useState(false)

  useEffect(() => {
    fetch('http://localhost:5000/api/split')
      .then(r => r.json())
      .then(data => setForm({
        eyebrow: data.eyebrow || '',
        heading: data.heading || '',
        description: data.description || '',
        btn1: data.btn1 || '',
        btn2: data.btn2 || '',
        videoUrl: data.videoUrl || '',
        features: data.features?.length ? data.features : [
          { title: '', value: '' }, { title: '', value: '' },
          { title: '', value: '' }, { title: '', value: '' }
        ]
      }))
  }, [])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleFeature = (i, key, val) => {
    const f = [...form.features]
    f[i] = { ...f[i], [key]: val }
    setForm({ ...form, features: f })
  }

  const handleVideoUpload = async (e) => {
    const f = e.target.files[0]
    if (!f) return
    setVideoFile(f)
    setVideoUploading(true)
    const formData = new FormData()
    formData.append('video', f)
    const res = await fetch('http://localhost:5000/api/split/video', { method: 'POST', body: formData })
    const data = await res.json()
    setForm(prev => ({ ...prev, videoUrl: data.url }))
    setVideoUploading(false)
  }

  const handleSave = async () => {
    await fetch('http://localhost:5000/api/split', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="sm-wrapper">
      <div className="sm-header">
        <div>
          <h1 className="sm-title">🎬 Split Section</h1>
          <p className="sm-sub">Homepage ka video section yahan se manage karo</p>
        </div>
        <button className="sm-save-btn" onClick={handleSave}>
          {saved ? '✅ Saved!' : 'Save Changes'}
        </button>
      </div>

      <div className="sm-grid">

        {/* Left Column */}
        <div className="sm-card">
          <p className="sm-card-title">Content</p>

          {/* Video Upload */}
          <div className="sm-video-upload" onClick={() => document.getElementById('videoInput').click()}>
            {form.videoUrl
              ? <video src={form.videoUrl} className="sm-video-preview" muted autoPlay loop />
              : <>
                  <span className="sm-video-icon">🎬</span>
                  <p className="sm-video-text">{videoUploading ? 'Uploading...' : 'Click karke video upload karo'}</p>
                  <p className="sm-video-hint">MP4, MOV, WEBM — max 100MB</p>
                </>
            }
            <input id="videoInput" type="file" accept="video/*" style={{ display: 'none' }} onChange={handleVideoUpload} />
          </div>

          <div className="sm-field">
            <label>Eyebrow Text</label>
            <input name="eyebrow" value={form.eyebrow} onChange={handleChange} placeholder="Premium Collection" />
          </div>

          <div className="sm-field">
            <label>Heading</label>
            <input name="heading" value={form.heading} onChange={handleChange} placeholder="3D CUSTOM T-SHIRT" />
          </div>

          <div className="sm-field">
            <label>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={4} placeholder="Description..." />
          </div>

          <div className="sm-row">
            <div className="sm-field">
              <label>Button 1</label>
              <input name="btn1" value={form.btn1} onChange={handleChange} placeholder="Customize Now" />
            </div>
            <div className="sm-field">
              <label>Button 2</label>
              <input name="btn2" value={form.btn2} onChange={handleChange} placeholder="View Details" />
            </div>
          </div>
        </div>

        {/* Right Column - Features */}
        <div className="sm-card">
          <p className="sm-card-title">Features Grid</p>
          {form.features.map((f, i) => (
            <div className="sm-row" key={i}>
              <div className="sm-field">
                <label>Title {i + 1}</label>
                <input value={f.title} onChange={e => handleFeature(i, 'title', e.target.value)} placeholder="Fabric" />
              </div>
              <div className="sm-field">
                <label>Value {i + 1}</label>
                <input value={f.value} onChange={e => handleFeature(i, 'value', e.target.value)} placeholder="100% Cotton" />
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Live Preview */}
      <div className="sm-preview">
        <p className="sm-card-title">Live Preview</p>
        <div className="sm-preview-box">
          <span className="sm-prev-eyebrow">{form.eyebrow || 'Premium Collection'}</span>
          <h2 className="sm-prev-heading">{form.heading || '3D CUSTOM T-SHIRT'}</h2>
          <div className="sm-prev-divider" />
          <p className="sm-prev-desc">{form.description || 'Description...'}</p>
          <div className="sm-prev-btns">
            <button className="sm-prev-btn1">{form.btn1 || 'Button 1'}</button>
            <button className="sm-prev-btn2">{form.btn2 || 'Button 2'}</button>
          </div>
          <div className="sm-prev-features">
            {form.features.map((f, i) => (
              <div key={i}>
                <h4>{f.title || `Title ${i+1}`}</h4>
                <p>{f.value || `Value ${i+1}`}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}

export default SplitManager
