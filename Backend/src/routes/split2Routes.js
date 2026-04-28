const express = require('express')
const router = express.Router()
const { getSplit2, updateSplit2 } = require('../controllers/split2Controller')
const upload = require('../middleware/upload')

router.get('/', getSplit2)
router.put('/', updateSplit2)
router.post('/video', upload.single('video'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' })
  res.json({ url: `http://localhost:5000/uploads/${req.file.filename}` })
})

module.exports = router
