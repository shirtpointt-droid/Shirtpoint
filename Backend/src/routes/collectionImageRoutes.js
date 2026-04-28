const express = require('express')
const router = express.Router()
const CollectionImage = require('../models/CollectionImage')

router.get('/', async (req, res) => {
  try {
    const images = await CollectionImage.find().sort({ order: 1, createdAt: 1 }).limit(3)
    res.json(images)
  } catch (err) { res.status(500).json({ message: err.message }) }
})
router.post('/', async (req, res) => {
  try {
    const img = await CollectionImage.create(req.body)
    res.json(img)
  } catch (err) { res.status(400).json({ message: err.message }) }
})
router.delete('/:id', async (req, res) => {
  try {
    await CollectionImage.findByIdAndDelete(req.params.id)
    res.json({ success: true })
  } catch (err) { res.status(500).json({ message: err.message }) }
})

module.exports = router
