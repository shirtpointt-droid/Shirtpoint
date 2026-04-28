const express = require('express')
const router = express.Router()
const { getSplitSection, updateSplitSection } = require('../controllers/splitController')
const upload = require('../middleware/upload')

router.get('/', getSplitSection)
router.put('/', updateSplitSection)
router.post('/video', upload.single('video'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' })
  const url = `http://localhost:5000/uploads/${req.file.filename}`
  res.json({ url })
})

module.exports = router
