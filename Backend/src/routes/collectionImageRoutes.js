const express = require('express')
const router = express.Router()
const CollectionImage = require('../models/CollectionImage')

router.get('/', async (req, res) => {
  const images = await CollectionImage.find().sort({ order: 1, createdAt: 1 }).limit(3)
  res.json(images)
})
router.post('/', async (req, res) => {
  const img = await CollectionImage.create(req.body)
  res.json(img)
})
router.delete('/:id', async (req, res) => {
  await CollectionImage.findByIdAndDelete(req.params.id)
  res.json({ success: true })
})

module.exports = router
