const express = require('express')
const router = express.Router()
const HowItWorksImage = require('../models/HowItWorksImage')

router.get('/', async (req, res) => {
  try {
    const images = await HowItWorksImage.find().sort({ order: 1, createdAt: 1 })
    res.json(images)
  } catch (err) { res.status(500).json({ message: err.message }) }
})
router.post('/', async (req, res) => {
  try {
    const img = await HowItWorksImage.create(req.body)
    res.json(img)
  } catch (err) { res.status(400).json({ message: err.message }) }
})
router.delete('/:id', async (req, res) => {
  try {
    await HowItWorksImage.findByIdAndDelete(req.params.id)
    res.json({ success: true })
  } catch (err) { res.status(500).json({ message: err.message }) }
})

module.exports = router
