const express = require('express')
const router = express.Router()
const PreviewTshirt = require('../models/PreviewTshirt')

router.get('/', async (req, res) => {
  try {
    const item = await PreviewTshirt.findOne().sort({ createdAt: -1 })
    res.json(item || {})
  } catch (err) { res.status(500).json({ message: err.message }) }
})
router.post('/', async (req, res) => {
  try {
    await PreviewTshirt.deleteMany({})
    const item = await PreviewTshirt.create(req.body)
    res.json(item)
  } catch (err) { res.status(400).json({ message: err.message }) }
})

module.exports = router
