const express = require('express')
const router = express.Router()
const SellerDesign = require('../models/SellerDesign')

// GET all approved (for frontend)
router.get('/', async (req, res) => {
  try {
    const designs = await SellerDesign.find({ status: 'approved' }).sort({ createdAt: -1 })
    res.json(designs)
  } catch (err) { res.status(500).json({ message: err.message }) }
})

// GET all (for admin)
router.get('/admin', async (req, res) => {
  try {
    const designs = await SellerDesign.find().sort({ createdAt: -1 })
    res.json(designs)
  } catch (err) { res.status(500).json({ message: err.message }) }
})

// POST create
router.post('/', async (req, res) => {
  try {
    const design = await SellerDesign.create(req.body)
    res.json(design)
  } catch (err) { res.status(400).json({ message: err.message }) }
})

// PUT approve/reject/update
router.put('/:id', async (req, res) => {
  try {
    const design = await SellerDesign.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(design)
  } catch (err) { res.status(400).json({ message: err.message }) }
})

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    await SellerDesign.findByIdAndDelete(req.params.id)
    res.json({ success: true })
  } catch (err) { res.status(500).json({ message: err.message }) }
})

module.exports = router
