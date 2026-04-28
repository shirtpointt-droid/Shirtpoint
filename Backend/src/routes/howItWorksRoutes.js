const express = require('express')
const router = express.Router()
const HowItWorksImage = require('../models/HowItWorksImage')

router.get('/', async (req, res) => {
  const images = await HowItWorksImage.find().sort({ order: 1, createdAt: 1 })
  res.json(images)
})
router.post('/', async (req, res) => {
  const img = await HowItWorksImage.create(req.body)
  res.json(img)
})
router.delete('/:id', async (req, res) => {
  await HowItWorksImage.findByIdAndDelete(req.params.id)
  res.json({ success: true })
})

module.exports = router
