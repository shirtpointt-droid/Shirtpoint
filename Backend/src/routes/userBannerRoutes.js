const express = require('express')
const router = express.Router()
const UserBanner = require('../models/UserBanner')

router.get('/', async (req, res) => {
  try {
    const banners = await UserBanner.find().sort({ order: 1, createdAt: -1 })
    res.json(banners)
  } catch (err) { res.status(500).json({ message: err.message }) }
})
router.post('/', async (req, res) => {
  try {
    const banner = await UserBanner.create(req.body)
    res.json(banner)
  } catch (err) { res.status(400).json({ message: err.message }) }
})
router.put('/:id', async (req, res) => {
  try {
    const banner = await UserBanner.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!banner) return res.status(404).json({ message: 'Banner not found' })
    res.json(banner)
  } catch (err) { res.status(400).json({ message: err.message }) }
})
router.delete('/:id', async (req, res) => {
  try {
    await UserBanner.findByIdAndDelete(req.params.id)
    res.json({ success: true })
  } catch (err) { res.status(500).json({ message: err.message }) }
})

module.exports = router
