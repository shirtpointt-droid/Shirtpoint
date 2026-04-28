const mongoose = require('mongoose')
const ReviewSchema = new mongoose.Schema({
  name:   { type: String, required: true },
  city:   { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  text:   { type: String, required: true },
}, { timestamps: true })
module.exports = mongoose.model('Review', ReviewSchema)
