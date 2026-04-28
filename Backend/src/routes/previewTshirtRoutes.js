const express = require('express')
const router = express.Router()
const PreviewTshirt = require('../models/PreviewTshirt')

router.get('/', async (req, res) => {
  const item = await PreviewTshirt.findOne().sort({ createdAt: -1 })
  res.json(item || {})
})

router.post('/', async (req, res) => {
  await PreviewTshirt.deleteMany({})
  const item = await PreviewTshirt.create(req.body)
  res.json(item)
})

module.exports = router
