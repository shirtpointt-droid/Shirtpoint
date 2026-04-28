const express = require('express')
const router = express.Router()
const { getCarouselImages, addCarouselImage, deleteCarouselImage } = require('../controllers/carouselController')
const upload = require('../middleware/upload')

router.get('/', getCarouselImages)
router.post('/', upload.single('image'), addCarouselImage)
router.delete('/:id', deleteCarouselImage)

module.exports = router
