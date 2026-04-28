const express = require('express')
const router = express.Router()
const NewDrop = require('../models/NewDrop')

router.get('/', async (req, res) => {
  try {
    const drops = await NewDrop.find().sort({ createdAt: 1 })
    res.json(drops)
  } catch (err) { res.status(500).json({ message: err.message }) }
})

router.post('/', async (req, res) => {
  try {
    const drop = await NewDrop.create(req.body)
    res.json(drop)
  } catch (err) { res.status(400).json({ message: err.message }) }
})

router.put('/:id', async (req, res) => {
  try {
    const drop = await NewDrop.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(drop)
  } catch (err) { res.status(400).json({ message: err.message }) }
})

router.delete('/:id', async (req, res) => {
  try {
    await NewDrop.findByIdAndDelete(req.params.id)
    res.json({ success: true })
  } catch (err) { res.status(500).json({ message: err.message }) }
})

module.exports = router
