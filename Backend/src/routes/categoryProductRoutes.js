const express = require('express')
const router = express.Router()
const CategoryProduct = require('../models/CategoryProduct')

router.get('/', async (req, res) => {
  const { category } = req.query
  const filter = category ? { categoryLabel: category } : {}
  const products = await CategoryProduct.find(filter).sort({ order: 1, createdAt: 1 })
  res.json(products)
})
router.post('/', async (req, res) => {
  const product = await CategoryProduct.create(req.body)
  res.json(product)
})
router.put('/:id', async (req, res) => {
  const product = await CategoryProduct.findByIdAndUpdate(req.params.id, req.body, { new: true })
  res.json(product)
})
router.delete('/:id', async (req, res) => {
  await CategoryProduct.findByIdAndDelete(req.params.id)
  res.json({ success: true })
})

module.exports = router
