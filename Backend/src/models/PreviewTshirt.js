const mongoose = require('mongoose')
const PreviewTshirtSchema = new mongoose.Schema({
  image: { type: String, required: true },
}, { timestamps: true })
module.exports = mongoose.model('PreviewTshirt', PreviewTshirtSchema)
