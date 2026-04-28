const mongoose = require('mongoose')

const brandGuideSchema = new mongoose.Schema({
  image: { type: String, required: true },
  title: { type: String, required: true },
  desc:  { type: String, required: true },
  order: { type: Number, default: 0 }
}, { timestamps: true })

module.exports = mongoose.model('BrandGuide', brandGuideSchema)
