const express = require('express')
const router = express.Router()
const UserProduct = require('../models/UserProduct')

router.get('/', async (req, res) => {
  const products = await UserProduct.find().sort({ order: 1, createdAt: 1 })
  res.json(products)
})
router.post('/', async (req, res) => {
  const product = await UserProduct.create(req.body)
  res.json(product)
})
router.put('/:id', async (req, res) => {
  const product = await UserProduct.findByIdAndUpdate(req.params.id, req.body, { new: true })
  res.json(product)
})
router.delete('/:id', async (req, res) => {
  await UserProduct.findByIdAndDelete(req.params.id)
  res.json({ success: true })
})

module.exports = router
