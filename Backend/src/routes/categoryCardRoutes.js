const express = require('express')
const router = express.Router()
const CategoryCard = require('../models/CategoryCard')

router.get('/', async (req, res) => {
  try {
    const cards = await CategoryCard.find().sort({ order: 1, createdAt: 1 })
    res.json(cards)
  } catch (err) { res.status(500).json({ message: err.message }) }
})
router.post('/', async (req, res) => {
  try {
    const card = await CategoryCard.create(req.body)
    res.json(card)
  } catch (err) { res.status(400).json({ message: err.message }) }
})
router.put('/:id', async (req, res) => {
  try {
    const card = await CategoryCard.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!card) return res.status(404).json({ message: 'Card not found' })
    res.json(card)
  } catch (err) { res.status(400).json({ message: err.message }) }
})
router.delete('/:id', async (req, res) => {
  try {
    await CategoryCard.findByIdAndDelete(req.params.id)
    res.json({ success: true })
  } catch (err) { res.status(500).json({ message: err.message }) }
})

module.exports = router
