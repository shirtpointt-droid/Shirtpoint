import React, { useEffect, useState, useRef } from 'react'
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import '../css/AdminHome.css'
import { removeBg } from '../utils/removeBg'

function AdminHome() {
  // Carousel states
  const [images, setImages] = useState([])
  const [srcImg, setSrcImg] = useState('')
  const [crop, setCrop] = useState()
  const [completedCrop, setCompletedCrop] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const imgRef = useRef(null)

  // Brand Guide states
  const [brandGuides, setBrandGuides] = useState([])
  const [brandForm, setBrandForm] = useState({ image: '', title: '', desc: '' })
  const [editingBrand, setEditingBrand] = useState(null)
  const [brandLoading, setBrandLoading] = useState(false)

  // Product Grid states
  const [products, setProducts] = useState([])
  const [productForm, setProductForm] = useState({
    name: '', baseImage: '', designImage: '', designPos: { top: 45, left: 50 }, designSize: 30, designRotation: 0
  })
  const [editingProduct, setEditingProduct] = useState(null)
  const [productLoading, setProductLoading] = useState(false)
  const [originalImages, setOriginalImages] = useState({ baseImage: '', designImage: '' })
  const [posLocked, setPosLocked] = useState(false)
  const previewRef = useRef(null)
  const isDragging = useRef(false)

  // User Banner states
  const [userBanners, setUserBanners] = useState([])
  const [bannerForm, setBannerForm] = useState({ image: '', title: '', subtitle: '', link: '', order: 0 })
  const [editingBanner, setEditingBanner] = useState(null)
  const [bannerLoading, setBannerLoading] = useState(false)

  // Reviews states
  const [reviews, setReviews] = useState([])
  const [reviewForm, setReviewForm] = useState({ name: '', city: '', rating: 5, text: '' })
  const [editingReview, setEditingReview] = useState(null)

  // Split states
  const [form, setForm] = useState({
    eyebrow: '', heading: '', description: '', btn1: '', btn2: '', videoUrl: '',
    features: [{ title: '', value: '' }, { title: '', value: '' }, { title: '', value: '' }, { title: '', value: '' }]
  })
  const [saved, setSaved] = useState(false)
  const [videoUploading, setVideoUploading] = useState(false)

  // Split2 states
  const [form2, setForm2] = useState({
    eyebrow: '', heading: '', description: '', btn1: '', btn2: '', videoUrl: '',
    features: [{ title: '', value: '' }, { title: '', value: '' }, { title: '', value: '' }, { title: '', value: '' }]
  })
  const [saved2, setSaved2] = useState(false)
  const [videoUploading2, setVideoUploading2] = useState(false)

  const fetchImages = async () => {
    const res = await fetch('http://localhost:5000/api/carousel')
    const data = await res.json()
    setImages(data)
  }

  const fetchProducts = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/products')
      const data = await res.json()
      setProducts(data)
    } catch (err) { console.error('Error fetching products:', err) }
  }

  const fetchBrandGuides = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/brand-guide')
      const data = await res.json()
      setBrandGuides(data)
    } catch (err) { console.error('Error fetching brand guides:', err) }
  }

  const fetchReviews = async () => {
    const res = await fetch('http://localhost:5000/api/reviews')
    const data = await res.json()
    setReviews(data)
  }

  const fetchUserBanners = async () => {
    const res = await fetch('http://localhost:5000/api/user-banners')
    const data = await res.json()
    setUserBanners(data)
  }

  useEffect(() => {
    fetchImages()
    fetchProducts()
    fetchBrandGuides()
    fetchReviews()
    fetchUserBanners()
    fetch('http://localhost:5000/api/split')
      .then(r => r.json())
      .then(data => setForm({
        eyebrow: data.eyebrow || '', heading: data.heading || '', description: data.description || '',
        btn1: data.btn1 || '', btn2: data.btn2 || '', videoUrl: data.videoUrl || '',
        features: data.features?.length ? data.features : [{ title: '', value: '' }, { title: '', value: '' }, { title: '', value: '' }, { title: '', value: '' }]
      }))
    fetch('http://localhost:5000/api/split2')
      .then(r => r.json())
      .then(data => setForm2({
        eyebrow: data.eyebrow || '', heading: data.heading || '', description: data.description || '',
        btn1: data.btn1 || '', btn2: data.btn2 || '', videoUrl: data.videoUrl || '',
        features: data.features?.length ? data.features : [{ title: '', value: '' }, { title: '', value: '' }, { title: '', value: '' }, { title: '', value: '' }]
      }))
  }, [])

  // Carousel handlers
  const handleFile = (e) => {
    const f = e.target.files[0]
    if (!f) return
    setSrcImg(URL.createObjectURL(f))
    setError('')
  }

  const onImageLoad = (e) => {
    const { width, height } = e.currentTarget
    const c = centerCrop(makeAspectCrop({ unit: '%', width: 80 }, 2 / 3, width, height), width, height)
    setCrop(c)
  }

  const getCroppedBlob = () => new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const img = imgRef.current
    const scaleX = img.naturalWidth / img.width
    const scaleY = img.naturalHeight / img.height
    canvas.width = completedCrop.width * scaleX
    canvas.height = completedCrop.height * scaleY
    const ctx = canvas.getContext('2d')
    ctx.drawImage(img,
      completedCrop.x * scaleX, completedCrop.y * scaleY,
      completedCrop.width * scaleX, completedCrop.height * scaleY,
      0, 0, canvas.width, canvas.height
    )
    canvas.toBlob(resolve, 'image/jpeg', 0.95)
  })

  const handleUpload = async () => {
    if (!completedCrop) return setError('Pehle image crop karo')
    setLoading(true)
    const blob = await getCroppedBlob()
    const formData = new FormData()
    formData.append('image', blob, 'cropped.jpg')
    formData.append('order', images.length)
    await fetch('http://localhost:5000/api/carousel', { method: 'POST', body: formData })
    setSrcImg('')
    setCrop(undefined)
    setCompletedCrop(null)
    setLoading(false)
    fetchImages()
  }

  const handleDelete = async (id) => {
    await fetch(`http://localhost:5000/api/carousel/${id}`, { method: 'DELETE' })
    fetchImages()
  }

  // Product Grid handlers
  const handleProductChange = (e) => {
    setProductForm({ ...productForm, [e.target.name]: e.target.value })
  }

  const handleProductImageUpload = async (e, type) => {
    const file = e.target.files[0]
    if (!file) return
    setProductLoading(true)
    const formData = new FormData()
    formData.append('image', file)
    try {
      const res = await fetch('http://localhost:5000/api/upload', { method: 'POST', body: formData })
      const data = await res.json()
      setProductForm(prev => ({ ...prev, [type]: data.url }))
      // Save original for undo
      setOriginalImages(prev => ({ ...prev, [type]: data.url }))
    } catch (err) {
      console.error('Upload error:', err)
    }
    setProductLoading(false)
  }

  const handleProductSave = async () => {
    try {
      const method = editingProduct ? 'PUT' : 'POST'
      const url = editingProduct 
        ? `http://localhost:5000/api/products/${editingProduct._id}`
        : 'http://localhost:5000/api/products'
      
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: productForm.name,
          baseImage: productForm.baseImage,
          designImage: productForm.designImage,
          designPos: productForm.designPos,
          designSize: productForm.designSize,
          designRotation: productForm.designRotation
        })
      })
      
      setProductForm({ name: '', baseImage: '', designImage: '', designPos: { top: 45, left: 50 }, designSize: 30, designRotation: 0 })
      setEditingProduct(null)
      fetchProducts()
    } catch (err) {
      console.error('Save error:', err)
    }
  }

  const handleProductEdit = (product) => {
    setProductForm({
      name: product.name,
      baseImage: product.baseImage || '',
      designImage: product.designImage || '',
      designPos: product.designPos || { top: 45, left: 50 },
      designSize: product.designSize || 30,
      designRotation: product.designRotation || 0
    })
    setEditingProduct(product)
  }

  // Mouse move handler — icon follows mouse, right-click to lock
  const handlePreviewClick = (e) => {
    if (!previewRef.current || !productForm.designImage || posLocked) return
    const rect = previewRef.current.getBoundingClientRect()
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    const left = Math.min(Math.max(((clientX - rect.left) / rect.width) * 100, 5), 95)
    const top  = Math.min(Math.max(((clientY - rect.top)  / rect.height) * 100, 5), 95)
    setProductForm(prev => ({ ...prev, designPos: { top: Math.round(top), left: Math.round(left) } }))
  }

  const handlePreviewRightClick = (e) => {
    e.preventDefault()
    setPosLocked(prev => !prev)
  }

  const handleProductDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/products/${id}`, { method: 'DELETE' })
      fetchProducts()
    } catch (err) { console.error('Delete error:', err) }
  }

  const handleReviewSave = async () => {
    const method = editingReview ? 'PUT' : 'POST'
    const url = editingReview ? `http://localhost:5000/api/reviews/${editingReview._id}` : 'http://localhost:5000/api/reviews'
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(reviewForm) })
    setReviewForm({ name: '', city: '', rating: 5, text: '' })
    setEditingReview(null)
    fetchReviews()
  }

  const handleReviewEdit = (r) => {
    setReviewForm({ name: r.name, city: r.city, rating: r.rating, text: r.text })
    setEditingReview(r)
  }

  const handleReviewDelete = async (id) => {
    await fetch(`http://localhost:5000/api/reviews/${id}`, { method: 'DELETE' })
    fetchReviews()
  }

  const handleBannerImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setBannerLoading(true)
    const formData = new FormData()
    formData.append('image', file)
    const res = await fetch('http://localhost:5000/api/upload', { method: 'POST', body: formData })
    const data = await res.json()
    setBannerForm(p => ({ ...p, image: data.url }))
    setBannerLoading(false)
  }

  const handleBannerSave = async () => {
    const method = editingBanner ? 'PUT' : 'POST'
    const url = editingBanner ? `http://localhost:5000/api/user-banners/${editingBanner._id}` : 'http://localhost:5000/api/user-banners'
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(bannerForm) })
    setBannerForm({ image: '', title: '', subtitle: '', link: '', order: 0 })
    setEditingBanner(null)
    fetchUserBanners()
  }

  const handleBannerEdit = (b) => {
    setBannerForm({ image: b.image, title: b.title, subtitle: b.subtitle, link: b.link, order: b.order })
    setEditingBanner(b)
  }

  const handleBannerDelete = async (id) => {
    await fetch(`http://localhost:5000/api/user-banners/${id}`, { method: 'DELETE' })
    fetchUserBanners()
  }

  // Brand Guide handlers
  const handleBrandImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setBrandLoading(true)
    const formData = new FormData()
    formData.append('image', file)
    try {
      const res = await fetch('http://localhost:5000/api/upload', { method: 'POST', body: formData })
      const data = await res.json()
      setBrandForm(prev => ({ ...prev, image: data.url }))
    } catch (err) { console.error(err) }
    setBrandLoading(false)
  }

  const handleBrandSave = async () => {
    try {
      const method = editingBrand ? 'PUT' : 'POST'
      const url = editingBrand
        ? `http://localhost:5000/api/brand-guide/${editingBrand._id}`
        : 'http://localhost:5000/api/brand-guide'
      await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(brandForm) })
      setBrandForm({ image: '', title: '', desc: '' })
      setEditingBrand(null)
      fetchBrandGuides()
    } catch (err) { console.error(err) }
  }

  const handleBrandEdit = (item) => {
    setBrandForm({ image: item.image, title: item.title, desc: item.desc })
    setEditingBrand(item)
  }

  const handleBrandDelete = async (id) => {
    await fetch(`http://localhost:5000/api/brand-guide/${id}`, { method: 'DELETE' })
    fetchBrandGuides()
  }

  // Split handlers
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleFeature = (i, key, val) => {
    const f = [...form.features]
    f[i] = { ...f[i], [key]: val }
    setForm({ ...form, features: f })
  }

  const handleVideoUpload = async (e) => {
    const f = e.target.files[0]
    if (!f) return
    setVideoUploading(true)
    const formData = new FormData()
    formData.append('video', f)
    const res = await fetch('http://localhost:5000/api/split/video', { method: 'POST', body: formData })
    const data = await res.json()
    const updatedForm = { ...form, videoUrl: data.url }
    setForm(updatedForm)
    await fetch('http://localhost:5000/api/split', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updatedForm) })
    setVideoUploading(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const handleSave = async () => {
    await fetch('http://localhost:5000/api/split', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const handleChange2 = (e) => setForm2({ ...form2, [e.target.name]: e.target.value })
  const handleFeature2 = (i, key, val) => {
    const f = [...form2.features]; f[i] = { ...f[i], [key]: val }; setForm2({ ...form2, features: f })
  }
  const handleVideoUpload2 = async (e) => {
    const f = e.target.files[0]
    if (!f) return
    setVideoUploading2(true)
    const formData = new FormData()
    formData.append('video', f)
    const res = await fetch('http://localhost:5000/api/split2/video', { method: 'POST', body: formData })
    const data = await res.json()
    const updatedForm = { ...form2, videoUrl: data.url }
    setForm2(updatedForm)
    await fetch('http://localhost:5000/api/split2', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updatedForm) })
    setVideoUploading2(false)
    setSaved2(true)
    setTimeout(() => setSaved2(false), 2500)
  }
  const handleSave2 = async () => {
    await fetch('http://localhost:5000/api/split2', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form2) })
    setSaved2(true)
    setTimeout(() => setSaved2(false), 2500)
  }

  return (
    <div className="admin-page">

      {/* ===== CAROUSEL SECTION ===== */}
      <div className="admin-carousel-section">
        <h2 className="admin-carousel-title">🖼️ Carousel Images</h2>
        <p className="admin-carousel-sub">Frontend homepage ki rotating images yahan se manage karo</p>

        {!srcImg && (
          <div className="admin-carousel-upload-area" onClick={() => document.getElementById('fileInput').click()}>
            <span className="admin-carousel-upload-icon">📁</span>
            <p className="admin-carousel-upload-text">Click karke image select karo</p>
            <p className="admin-carousel-upload-hint">JPG, PNG, WEBP supported</p>
            <input id="fileInput" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
          </div>
        )}

        {srcImg && (
          <div className="admin-crop-wrapper">
            <p className="admin-crop-label">✂️ Image crop karo — drag karke adjust karo</p>
            <ReactCrop crop={crop} onChange={c => setCrop(c)} onComplete={c => setCompletedCrop(c)} aspect={2 / 3}>
              <img ref={imgRef} src={srcImg} onLoad={onImageLoad} className="admin-crop-img" alt="crop" />
            </ReactCrop>
            <div className="admin-crop-actions">
              <button className="admin-crop-cancel" onClick={() => { setSrcImg(''); setCrop(undefined); setCompletedCrop(null) }}>Cancel</button>
              <button className="admin-carousel-btn" onClick={handleUpload} disabled={loading}>
                {loading ? 'Uploading...' : '✅ Upload Cropped Image'}
              </button>
            </div>
          </div>
        )}

        {error && <p className="admin-carousel-error">⚠️ {error}</p>}
        <p className="admin-carousel-count">{images.length} image{images.length !== 1 ? 's' : ''} added</p>

        <div className="admin-carousel-grid">
          {images.length === 0 && (
            <div className="admin-carousel-empty">
              <span>📭</span>
              <p>Koi image nahi hai — upar se upload karo</p>
            </div>
          )}
          {images.map((img, i) => (
            <div key={img._id} className="admin-carousel-card">
              <div className="admin-carousel-badge">#{i + 1}</div>
              <img src={img.url} alt={`carousel-${i}`} className="admin-carousel-img" />
              <div className="admin-carousel-footer">
                <span className="admin-carousel-url" title={img.url}>{img.url.slice(0, 30)}...</span>
                <button className="admin-carousel-delete" onClick={() => handleDelete(img._id)}>🗑 Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== PRODUCT GRID SECTION ===== */}
      <div className="admin-carousel-section">
        <h2 className="admin-carousel-title">🛍️ Product Categories</h2>
        <p className="admin-carousel-sub">T-shirt categories aur unke images yahan manage karo</p>

        {/* Add/Edit Product Form */}
        <div className="admin-product-form">
          <h3>{editingProduct ? 'Edit Category' : 'Add New Category'}</h3>
          
          <div className="admin-split-field">
            <label>Category Name</label>
            <input 
              name="name" 
              value={productForm.name} 
              onChange={handleProductChange}
              placeholder="T-Shirts, Hoodies, Mugs, etc."
            />
          </div>

          <div className="admin-split-row">
            <div className="admin-split-field">
              <label>Empty Product Image</label>
              <div className="admin-image-upload" onClick={() => document.getElementById('baseImageInput').click()}>
                {productForm.baseImage ? (
                  <img src={productForm.baseImage} alt="Empty Product" className="admin-image-preview" />
                ) : (
                  <div className="admin-image-placeholder">
                    <span>👕</span>
                    <p>Upload Empty Product</p>
                    <small>White/Plain product image</small>
                  </div>
                )}
                <input id="baseImageInput" type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleProductImageUpload(e, 'baseImage')} />
              </div>
              {productForm.baseImage && (
                <div className="admin-rmbg-actions">
                  <button
                    className="admin-rmbg-btn"
                    onClick={async () => {
                      setProductLoading(true)
                      try {
                        const blob = await removeBg(productForm.baseImage)
                        const fd = new FormData()
                        fd.append('image', blob, 'base_clean.png')
                        const res = await fetch('http://localhost:5000/api/upload', { method: 'POST', body: fd })
                        const data = await res.json()
                        setProductForm(prev => ({ ...prev, baseImage: data.url }))
                      } catch { alert('Background remove nahi hua') }
                      setProductLoading(false)
                    }}
                    disabled={productLoading}
                  >
                    ✂️ {productLoading ? 'Removing...' : 'Remove Background'}
                  </button>
                  {productForm.baseImage !== originalImages.baseImage && originalImages.baseImage && (
                    <button className="admin-rmbg-cancel" onClick={() => setProductForm(prev => ({ ...prev, baseImage: originalImages.baseImage }))}>
                      ↩️ Cancel
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="admin-split-field">
              <label>Design / Icon Image</label>
              <div className="admin-image-upload" onClick={() => document.getElementById('designImageInput').click()}>
                {productForm.designImage ? (
                  <img src={productForm.designImage} alt="Design" className="admin-image-preview" />
                ) : (
                  <div className="admin-image-placeholder">
                    <span>🎨</span>
                    <p>Upload Design Icon</p>
                    <small>White background auto remove hoga</small>
                  </div>
                )}
                <input id="designImageInput" type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleProductImageUpload(e, 'designImage')} />
              </div>
              {productForm.designImage && (
                <div className="admin-rmbg-actions">
                  <button
                    className="admin-rmbg-btn"
                    onClick={async () => {
                      setProductLoading(true)
                      try {
                        const blob = await removeBg(productForm.designImage)
                        const fd = new FormData()
                        fd.append('image', blob, 'design_clean.png')
                        const res = await fetch('http://localhost:5000/api/upload', { method: 'POST', body: fd })
                        const data = await res.json()
                        setProductForm(prev => ({ ...prev, designImage: data.url }))
                      } catch { alert('Background remove nahi hua') }
                      setProductLoading(false)
                    }}
                    disabled={productLoading}
                  >
                    ✂️ {productLoading ? 'Removing...' : 'Remove Background'}
                  </button>
                  {productForm.designImage !== originalImages.designImage && originalImages.designImage && (
                    <button className="admin-rmbg-cancel" onClick={() => setProductForm(prev => ({ ...prev, designImage: originalImages.designImage }))}>
                      ↩️ Cancel
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Live Preview */}
          {productForm.baseImage && productForm.designImage && (
            <div className="admin-split-field">
              <div
                ref={previewRef}
                className="admin-drag-preview"
                onMouseMove={handlePreviewClick}
                onContextMenu={handlePreviewRightClick}
                onTouchMove={handlePreviewClick}
                onTouchStart={handlePreviewClick}
                style={{ border: posLocked ? '2px solid #22c55e' : '2px dashed #f97316' }}
              >
                <img src={productForm.baseImage} alt="base" className="admin-drag-base" />
                <img
                  src={productForm.designImage}
                  alt="design"
                  className="admin-drag-design"
                  style={{
                    top: `${productForm.designPos.top}%`,
                    left: `${productForm.designPos.left}%`,
                    width: `${productForm.designSize}%`,
                    height: `${productForm.designSize}%`,
                    transform: `translate(-50%, -50%) rotate(${productForm.designRotation}deg)`
                  }}
                />
                <div style={{
                  position: 'absolute', top: 6, right: 8,
                  fontSize: 10, fontWeight: 700,
                  background: posLocked ? '#22c55e' : '#f97316',
                  color: 'white', padding: '2px 8px', borderRadius: 999
                }}>
                  {posLocked ? '🔒 Locked' : '🖱️ Move'}
                </div>
              </div>

              {/* Size Slider */}
              <div className="admin-size-slider">
                <label>Size: {productForm.designSize}%</label>
                <input
                  type="range" min="10" max="60" value={productForm.designSize}
                  onChange={(e) => setProductForm(prev => ({ ...prev, designSize: Number(e.target.value) }))}
                />
              </div>

              {/* Rotation Slider */}
              <div className="admin-size-slider">
                <label>Rotate: {productForm.designRotation}°</label>
                <input
                  type="range" min="0" max="360" value={productForm.designRotation}
                  onChange={(e) => setProductForm(prev => ({ ...prev, designRotation: Number(e.target.value) }))}
                />
              </div>
            </div>
          )}

          <div className="admin-product-actions">
            {editingProduct && (
              <button 
                className="admin-crop-cancel" 
                onClick={() => {
                  setEditingProduct(null)
                  setProductForm({ name: '', count: '', category: '', baseImage: '', designImage: '' })
                }}
              >
                Cancel
              </button>
            )}
            <button 
              className="admin-carousel-btn" 
              onClick={handleProductSave}
              disabled={productLoading || !productForm.name || !productForm.baseImage || !productForm.designImage}
            >
              {productLoading ? 'Saving...' : editingProduct ? 'Update Category' : 'Add Category'}
            </button>
          </div>
        </div>

        {/* Categories List */}
        <div className="admin-products-grid">
          {products.length === 0 ? (
            <div className="admin-carousel-empty">
              <span>📂</span>
              <p>Koi category nahi hai — upar se add karo</p>
            </div>
          ) : (
            products.map((product) => (
              <div key={product._id} className="admin-product-card">
                <div className="admin-product-images">
                  <div className="admin-product-image-container">
                    <img src={product.baseImage} alt="Empty" className="admin-product-img" />
                    <span className="admin-product-label">Empty</span>
                  </div>
                  <div className="admin-product-image-container">
                    <img src={product.designImage} alt="Design" className="admin-product-img" />
                    <span className="admin-product-label">Design</span>
                  </div>
                </div>
                
                <div className="admin-product-info">
                  <h4>{product.name}</h4>
                  <span className="admin-product-category">Category</span>
                </div>
                
                <div className="admin-product-actions">
                  <button 
                    className="admin-product-edit" 
                    onClick={() => handleProductEdit(product)}
                  >
                    ✏️ Edit
                  </button>
                  <button 
                    className="admin-carousel-delete" 
                    onClick={() => handleProductDelete(product._id)}
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ===== BRAND GUIDE SECTION ===== */}
      <div className="admin-carousel-section">
        <h2 className="admin-carousel-title">📚 Brand Guide Cards</h2>
        <p className="admin-carousel-sub">"Let's build your brand together" section ke cards yahan manage karo</p>

        <div className="admin-product-form">
          <h3>{editingBrand ? 'Edit Card' : 'Add New Card'}</h3>

          <div className="admin-split-field">
            <label>Card Image</label>
            <div className="admin-image-upload" onClick={() => document.getElementById('brandImageInput').click()}>
              {brandForm.image ? (
                <img src={brandForm.image} alt="card" className="admin-image-preview" />
              ) : (
                <div className="admin-image-placeholder">
                  <span>🖼️</span>
                  <p>Upload Card Image</p>
                </div>
              )}
              <input id="brandImageInput" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleBrandImageUpload} />
            </div>
          </div>

          <div className="admin-split-row">
            <div className="admin-split-field">
              <label>Title</label>
              <input value={brandForm.title} onChange={e => setBrandForm(p => ({ ...p, title: e.target.value }))} placeholder="Card title" />
            </div>
          </div>

          <div className="admin-split-field">
            <label>Description</label>
            <textarea rows={3} value={brandForm.desc} onChange={e => setBrandForm(p => ({ ...p, desc: e.target.value }))} placeholder="Card description" />
          </div>

          <div className="admin-product-actions">
            {editingBrand && (
              <button className="admin-crop-cancel" onClick={() => { setEditingBrand(null); setBrandForm({ image: '', tag: '', title: '', desc: '' }) }}>Cancel</button>
            )}
            <button className="admin-carousel-btn" onClick={handleBrandSave} disabled={brandLoading || !brandForm.image || !brandForm.title}>
              {brandLoading ? 'Saving...' : editingBrand ? 'Update Card' : 'Add Card'}
            </button>
          </div>
        </div>

        <div className="admin-products-grid">
          {brandGuides.map(item => (
            <div key={item._id} className="admin-product-card">
              <div className="admin-product-image-container">
                <img src={item.image} alt={item.title} className="admin-product-img" style={{ height: 100, objectFit: 'cover', width: '100%' }} />
              </div>
              <div className="admin-product-info">
                <span className="admin-product-category">{item.tag}</span>
                <h4>{item.title}</h4>
                <p style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>{item.desc}</p>
              </div>
              <div className="admin-product-actions">
                <button className="admin-product-edit" onClick={() => handleBrandEdit(item)}>✏️ Edit</button>
                <button className="admin-carousel-delete" onClick={() => handleBrandDelete(item._id)}>🗑 Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== SPLIT SECTION ===== */}
      <div className="admin-split-section">
        <div className="admin-split-header">
          <div>
            <h2 className="admin-carousel-title">🎬 Split Section</h2>
            <p className="admin-carousel-sub">Homepage ka video section yahan se manage karo</p>
          </div>
          <button className="admin-split-save" onClick={handleSave}>
            {saved ? '✅ Saved!' : 'Save Changes'}
          </button>
        </div>

        <div className="admin-split-grid">
          {/* Left */}
          <div className="admin-split-card">
            <p className="admin-split-label">Content</p>

            <div className="admin-split-video-upload" onClick={() => document.getElementById('videoInput').click()}>
              {form.videoUrl
                ? <video src={form.videoUrl} className="admin-split-video-preview" muted autoPlay loop />
                : <>
                    <span>🎬</span>
                    <p>{videoUploading ? 'Uploading...' : 'Click karke video upload karo'}</p>
                    <small>MP4, MOV, WEBM — max 100MB</small>
                  </>
              }
              <input id="videoInput" type="file" accept="video/*" style={{ display: 'none' }} onChange={handleVideoUpload} />
            </div>

            <div className="admin-split-field">
              <label>Eyebrow Text</label>
              <input name="eyebrow" value={form.eyebrow} onChange={handleChange} placeholder="Premium Collection" />
            </div>
            <div className="admin-split-field">
              <label>Heading</label>
              <input name="heading" value={form.heading} onChange={handleChange} placeholder="3D CUSTOM T-SHIRT" />
            </div>
            <div className="admin-split-field">
              <label>Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={3} />
            </div>
            <div className="admin-split-row">
              <div className="admin-split-field">
                <label>Button 1</label>
                <input name="btn1" value={form.btn1} onChange={handleChange} />
              </div>
              <div className="admin-split-field">
                <label>Button 2</label>
                <input name="btn2" value={form.btn2} onChange={handleChange} />
              </div>
            </div>
          </div>

          {/* Right - Features */}
          <div className="admin-split-card">
            <p className="admin-split-label">Features Grid</p>
            {form.features.map((f, i) => (
              <div className="admin-split-row" key={i}>
                <div className="admin-split-field">
                  <label>Title {i + 1}</label>
                  <input value={f.title} onChange={e => handleFeature(i, 'title', e.target.value)} />
                </div>
                <div className="admin-split-field">
                  <label>Value {i + 1}</label>
                  <input value={f.value} onChange={e => handleFeature(i, 'value', e.target.value)} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== SPLIT 2 SECTION ===== */}
      <div className="admin-split-section">
        <div className="admin-split-header">
          <div>
            <h2 className="admin-carousel-title">🎬 Split Section 2 (Reversed)</h2>
            <p className="admin-carousel-sub">Homepage ka second video section — text left, video right</p>
          </div>
          <button className="admin-split-save" onClick={handleSave2}>
            {saved2 ? '✅ Saved!' : 'Save Changes'}
          </button>
        </div>
        <div className="admin-split-grid">
          <div className="admin-split-card">
            <p className="admin-split-label">Content</p>
            <div className="admin-split-video-upload" onClick={() => document.getElementById('videoInput2').click()}>
              {form2.videoUrl
                ? <video src={form2.videoUrl} className="admin-split-video-preview" muted autoPlay loop />
                : <><span>🎬</span><p>{videoUploading2 ? 'Uploading...' : 'Click karke video upload karo'}</p><small>MP4, MOV, WEBM — max 100MB</small></>
              }
              <input id="videoInput2" type="file" accept="video/*" style={{ display: 'none' }} onChange={handleVideoUpload2} />
            </div>
            <div className="admin-split-field"><label>Eyebrow Text</label><input name="eyebrow" value={form2.eyebrow} onChange={handleChange2} /></div>
            <div className="admin-split-field"><label>Heading</label><input name="heading" value={form2.heading} onChange={handleChange2} /></div>
            <div className="admin-split-field"><label>Description</label><textarea name="description" value={form2.description} onChange={handleChange2} rows={3} /></div>
            <div className="admin-split-row">
              <div className="admin-split-field"><label>Button 1</label><input name="btn1" value={form2.btn1} onChange={handleChange2} /></div>
              <div className="admin-split-field"><label>Button 2</label><input name="btn2" value={form2.btn2} onChange={handleChange2} /></div>
            </div>
          </div>
          <div className="admin-split-card">
            <p className="admin-split-label">Features Grid</p>
            {form2.features.map((f, i) => (
              <div className="admin-split-row" key={i}>
                <div className="admin-split-field"><label>Title {i + 1}</label><input value={f.title} onChange={e => handleFeature2(i, 'title', e.target.value)} /></div>
                <div className="admin-split-field"><label>Value {i + 1}</label><input value={f.value} onChange={e => handleFeature2(i, 'value', e.target.value)} /></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== REVIEWS SECTION ===== */}
      <div className="admin-carousel-section">
        <h2 className="admin-carousel-title">⭐ Reviews Manager</h2>
        <p className="admin-carousel-sub">Homepage par scrolling reviews yahan se manage karo</p>

        <div className="admin-product-form">
          <h3>{editingReview ? 'Edit Review' : 'Add New Review'}</h3>
          <div className="admin-split-row">
            <div className="admin-split-field">
              <label>Name</label>
              <input value={reviewForm.name} onChange={e => setReviewForm(p => ({ ...p, name: e.target.value }))} placeholder="Ahmed Raza" />
            </div>
            <div className="admin-split-field">
              <label>City</label>
              <input value={reviewForm.city} onChange={e => setReviewForm(p => ({ ...p, city: e.target.value }))} placeholder="Karachi" />
            </div>
          </div>
          <div className="admin-split-field">
            <label>Rating (1–5)</label>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              {[1,2,3,4,5].map(n => (
                <button key={n} onClick={() => setReviewForm(p => ({ ...p, rating: n }))}
                  style={{ fontSize: '1.4rem', background: 'none', border: 'none', cursor: 'pointer', opacity: reviewForm.rating >= n ? 1 : 0.3 }}>
                  ★
                </button>
              ))}
              <span style={{ fontSize: 13, color: '#888' }}>{reviewForm.rating} / 5</span>
            </div>
          </div>
          <div className="admin-split-field">
            <label>Review Text</label>
            <textarea rows={3} value={reviewForm.text} onChange={e => setReviewForm(p => ({ ...p, text: e.target.value }))} placeholder="Customer ka review..." />
          </div>
          <div className="admin-product-actions">
            {editingReview && (
              <button className="admin-crop-cancel" onClick={() => { setEditingReview(null); setReviewForm({ name: '', city: '', rating: 5, text: '' }) }}>Cancel</button>
            )}
            <button className="admin-carousel-btn" onClick={handleReviewSave} disabled={!reviewForm.name || !reviewForm.text}>
              {editingReview ? 'Update Review' : 'Add Review'}
            </button>
          </div>
        </div>

        <div className="admin-products-grid">
          {reviews.length === 0 ? (
            <div className="admin-carousel-empty"><span>💬</span><p>Koi review nahi — upar se add karo</p></div>
          ) : reviews.map(r => (
            <div key={r._id} className="admin-product-card">
              <div className="admin-product-info">
                <h4>{r.name} <span style={{ color: '#888', fontWeight: 400, fontSize: 12 }}>— {r.city}</span></h4>
                <p style={{ color: '#f97316', fontSize: 14, margin: '4px 0' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</p>
                <p style={{ fontSize: 12, color: '#64748b' }}>{r.text}</p>
              </div>
              <div className="admin-product-actions">
                <button className="admin-product-edit" onClick={() => handleReviewEdit(r)}>✏️ Edit</button>
                <button className="admin-carousel-delete" onClick={() => handleReviewDelete(r._id)}>🗑 Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default AdminHome
