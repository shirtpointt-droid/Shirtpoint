const express = require('express')
const router = express.Router()
const DesignLabCategory = require('../models/DesignLabCategory')

router.get('/', async (req, res) => {
  const cats = await DesignLabCategory.find().sort({ order: 1, createdAt: 1 })
  res.json(cats)
})
router.post('/', async (req, res) => {
  const cat = await DesignLabCategory.create(req.body)
  res.json(cat)
})
router.put('/:id', async (req, res) => {
  const cat = await DesignLabCategory.findByIdAndUpdate(req.params.id, req.body, { new: true })
  res.json(cat)
})
router.delete('/:id', async (req, res) => {
  await DesignLabCategory.findByIdAndDelete(req.params.id)
  res.json({ success: true })
})

module.exports = router
