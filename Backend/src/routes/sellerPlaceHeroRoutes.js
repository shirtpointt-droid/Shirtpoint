const express = require('express')
const router = express.Router()
const SellerPlaceHero = require('../models/SellerPlaceHero')

router.get('/', async (req, res) => {
  try {
    let hero = await SellerPlaceHero.findOne()
    if (!hero) hero = await SellerPlaceHero.create({})
    res.json(hero)
  } catch (err) { res.status(500).json({ message: err.message }) }
})

router.post('/', async (req, res) => {
  try {
    await SellerPlaceHero.deleteMany({})
    const hero = await SellerPlaceHero.create(req.body)
    res.json(hero)
  } catch (err) { res.status(400).json({ message: err.message }) }
})

module.exports = router
