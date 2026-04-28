const express = require('express')
const router = express.Router()
const CategoryCard = require('../models/CategoryCard')

router.get('/', async (req, res) => {
  const cards = await CategoryCard.find().sort({ order: 1, createdAt: 1 })
  res.json(cards)
})
router.post('/', async (req, res) => {
  const card = await CategoryCard.create(req.body)
  res.json(card)
})
router.put('/:id', async (req, res) => {
  const card = await CategoryCard.findByIdAndUpdate(req.params.id, req.body, { new: true })
  res.json(card)
})
router.delete('/:id', async (req, res) => {
  await CategoryCard.findByIdAndDelete(req.params.id)
  res.json({ success: true })
})

module.exports = router
