const express = require('express')
const router = express.Router()
const Review = require('../models/Review')

router.get('/', async (req, res) => {
  const reviews = await Review.find().sort({ createdAt: -1 })
  res.json(reviews)
})

router.post('/', async (req, res) => {
  const review = await Review.create(req.body)
  res.json(review)
})

router.put('/:id', async (req, res) => {
  const review = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true })
  res.json(review)
})

router.delete('/:id', async (req, res) => {
  await Review.findByIdAndDelete(req.params.id)
  res.json({ success: true })
})

module.exports = router
