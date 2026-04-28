const express = require('express')
const router = express.Router()
const TshirtType = require('../models/TshirtType')

router.get('/', async (req, res) => {
  const types = await TshirtType.find().sort({ order: 1, createdAt: 1 })
  res.json(types)
})
router.post('/', async (req, res) => {
  const type = await TshirtType.create(req.body)
  res.json(type)
})
router.put('/:id', async (req, res) => {
  const type = await TshirtType.findByIdAndUpdate(req.params.id, req.body, { new: true })
  res.json(type)
})
router.delete('/:id', async (req, res) => {
  await TshirtType.findByIdAndDelete(req.params.id)
  res.json({ success: true })
})

module.exports = router
