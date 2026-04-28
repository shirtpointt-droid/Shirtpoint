const mongoose = require('mongoose')
const CollectionImageSchema = new mongoose.Schema({
  image: { type: String, required: true },
  order: { type: Number, default: 0 },
}, { timestamps: true })
module.exports = mongoose.model('CollectionImage', CollectionImageSchema)
