const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const path = require('path')
const axios = require('axios')
const FormData = require('form-data')
const fs = require('fs')
const upload = require('./middleware/upload')
const connectDB = require('./config/db')
const carouselRoutes = require('./routes/carouselRoutes')
const splitRoutes = require('./routes/splitRoutes')
const split2Routes = require('./routes/split2Routes')
const authRoutes = require('./routes/authRoutes')
const profileRoutes = require('./routes/profileRoutes')
const garmentMockupRoutes = require('./routes/garmentMockupRoutes')
const productRoutes = require('./routes/productRoutes')
const brandGuideRoutes = require('./routes/brandGuideRoutes')
const reviewRoutes = require('./routes/reviewRoutes')
const userBannerRoutes = require('./routes/userBannerRoutes')
const categoryCardRoutes = require('./routes/categoryCardRoutes')
const previewTshirtRoutes = require('./routes/previewTshirtRoutes')
const howItWorksRoutes = require('./routes/howItWorksRoutes')
const userProductRoutes = require('./routes/userProductRoutes')
const collectionImageRoutes = require('./routes/collectionImageRoutes')
const designLabCategoryRoutes = require('./routes/designLabCategoryRoutes')
const tshirtTypeRoutes = require('./routes/tshirtTypeRoutes')
const categoryProductRoutes = require('./routes/categoryProductRoutes')
const newDropRoutes = require('./routes/newDropRoutes')
const sellerDesignRoutes = require('./routes/sellerDesignRoutes')
const sellerPlaceHeroRoutes = require('./routes/sellerPlaceHeroRoutes')

dotenv.config()

const app = express()
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}))
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

// Normal image upload
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' })
  const baseUrl = process.env.BASE_URL || 'http://localhost:5000'
  res.json({ url: `${baseUrl}/uploads/${req.file.filename}` })
})

// Design image upload with background removal via remove.bg
app.post('/api/upload/remove-bg', upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' })

  try {
    const formData = new FormData()
    formData.append('image_file', fs.createReadStream(req.file.path))
    formData.append('size', 'auto')

    const response = await axios.post('https://api.remove.bg/v1.0/removebg', formData, {
      headers: {
        ...formData.getHeaders(),
        'X-Api-Key': process.env.REMOVE_BG_API_KEY
      },
      responseType: 'arraybuffer'
    })

    const outputFilename = `rmbg_${Date.now()}.png`
    const outputPath = path.join(__dirname, '../uploads', outputFilename)
    fs.writeFileSync(outputPath, response.data)
    fs.unlinkSync(req.file.path)

    const baseUrl = process.env.BASE_URL || 'http://localhost:5000'
    res.json({ url: `${baseUrl}/uploads/${outputFilename}` })
  } catch (err) {
    console.error('Remove.bg error:', err.message)
    const baseUrl = process.env.BASE_URL || 'http://localhost:5000'
    res.json({ url: `${baseUrl}/uploads/${req.file.filename}` })
  }
})

app.use('/api/carousel', carouselRoutes)
app.use('/api/split', splitRoutes)
app.use('/api/split2', split2Routes)
app.use('/api/auth', authRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/garment-mockups', garmentMockupRoutes)
app.use('/api/products', productRoutes)
app.use('/api/brand-guide', brandGuideRoutes)
app.use('/api/reviews', reviewRoutes)
app.use('/api/user-banners', userBannerRoutes)
app.use('/api/category-cards', categoryCardRoutes)
app.use('/api/preview-tshirt', previewTshirtRoutes)
app.use('/api/how-it-works', howItWorksRoutes)
app.use('/api/user-products', userProductRoutes)
app.use('/api/collection-images', collectionImageRoutes)
app.use('/api/design-lab-categories', designLabCategoryRoutes)
app.use('/api/tshirt-types', tshirtTypeRoutes)
app.use('/api/category-products', categoryProductRoutes)
app.use('/api/new-drop', newDropRoutes)
app.use('/api/seller-designs', sellerDesignRoutes)
app.use('/api/seller-place-hero', sellerPlaceHeroRoutes)

app.get('/', (req, res) => res.send('T-Shirt Point API Running'))

const PORT = process.env.PORT || 5000
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})