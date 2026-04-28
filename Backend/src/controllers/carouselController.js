const CarouselImage = require('../models/CarouselImage')

const getCarouselImages = async (req, res) => {
  const images = await CarouselImage.find().sort({ order: 1 })
  res.json(images)
}

const addCarouselImage = async (req, res) => {
  try {
    const url = `http://localhost:5000/uploads/${req.file.filename}`
    const image = await CarouselImage.create({ url, order: req.body.order || 0 })
    res.status(201).json(image)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

const deleteCarouselImage = async (req, res) => {
  await CarouselImage.findByIdAndDelete(req.params.id)
  res.json({ message: 'Deleted' })
}

module.exports = { getCarouselImages, addCarouselImage, deleteCarouselImage }
