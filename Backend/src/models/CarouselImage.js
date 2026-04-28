const mongoose = require('mongoose')

const carouselImageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  order: { type: Number, default: 0 },
}, { timestamps: true })

module.exports = mongoose.model('CarouselImage', carouselImageSchema, 'homepageimages')
