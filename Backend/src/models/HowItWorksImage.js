const mongoose = require('mongoose')
const HowItWorksImageSchema = new mongoose.Schema({
  image: { type: String, required: true },
  order: { type: Number, default: 0 },
}, { timestamps: true })
module.exports = mongoose.model('HowItWorksImage', HowItWorksImageSchema)
