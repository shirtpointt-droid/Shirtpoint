const express = require('express')
const router = express.Router()
const NewDrop = require('../models/NewDrop')

router.get('/', async (req, res) => {
  try {
    const drop = await NewDrop.findOne().sort({ createdAt: -1 })
    res.json(drop || {})
  } catch (err) { res.status(500).json({ message: err.message }) }
})

router.post('/', async (req, res) => {
  try {
    await NewDrop.deleteMany({})
    const drop = await NewDrop.create(req.body)
    res.json(drop)
  } catch (err) { res.status(400).json({ message: err.message }) }
})

module.exports = router
