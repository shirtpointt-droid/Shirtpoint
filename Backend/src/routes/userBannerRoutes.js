const express = require('express')
const router = express.Router()
const UserBanner = require('../models/UserBanner')

router.get('/', async (req, res) => {
  const banners = await UserBanner.find().sort({ order: 1, createdAt: -1 })
  res.json(banners)
})

router.post('/', async (req, res) => {
  const banner = await UserBanner.create(req.body)
  res.json(banner)
})

router.put('/:id', async (req, res) => {
  const banner = await UserBanner.findByIdAndUpdate(req.params.id, req.body, { new: true })
  res.json(banner)
})

router.delete('/:id', async (req, res) => {
  await UserBanner.findByIdAndDelete(req.params.id)
  res.json({ success: true })
})

module.exports = router
