const express = require('express')
const router = express.Router()
const UserProduct = require('../models/UserProduct')

router.get('/', async (req, res) => {
  try {
    const products = await UserProduct.find().sort({ order: 1, createdAt: 1 })
    res.json(products)
  } catch (err) { res.status(500).json({ message: err.message }) }
})
router.post('/', async (req, res) => {
  try {
    const product = await UserProduct.create(req.body)
    res.json(product)
  } catch (err) { res.status(400).json({ message: err.message }) }
})
router.put('/:id', async (req, res) => {
  try {
    const product = await UserProduct.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!product) return res.status(404).json({ message: 'Product not found' })
    res.json(product)
  } catch (err) { res.status(400).json({ message: err.message }) }
})
router.delete('/:id', async (req, res) => {
  try {
    await UserProduct.findByIdAndDelete(req.params.id)
    res.json({ success: true })
  } catch (err) { res.status(500).json({ message: err.message }) }
})

module.exports = router
