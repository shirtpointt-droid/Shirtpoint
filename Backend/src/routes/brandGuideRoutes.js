const express = require('express')
const router = express.Router()
const BrandGuide = require('../models/BrandGuide')

router.get('/', async (req, res) => {
  try {
    const items = await BrandGuide.find().sort({ order: 1, createdAt: -1 })
    res.json(items)
  } catch (e) { res.status(500).json({ message: e.message }) }
})

router.post('/', async (req, res) => {
  try {
    const last = await BrandGuide.findOne().sort({ order: -1 })
    const item = new BrandGuide({ ...req.body, order: last ? last.order + 1 : 0 })
    res.status(201).json(await item.save())
  } catch (e) { res.status(400).json({ message: e.message }) }
})

router.put('/:id', async (req, res) => {
  try {
    const item = await BrandGuide.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!item) return res.status(404).json({ message: 'Not found' })
    res.json(item)
  } catch (e) { res.status(400).json({ message: e.message }) }
})

router.delete('/:id', async (req, res) => {
  try {
    await BrandGuide.findByIdAndDelete(req.params.id)
    res.json({ message: 'Deleted' })
  } catch (e) { res.status(500).json({ message: e.message }) }
})

module.exports = router
