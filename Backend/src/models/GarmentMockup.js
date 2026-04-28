const mongoose = require('mongoose')

const garmentMockupSchema = new mongoose.Schema({
  baseId: { type: String, required: true, unique: true },
  label: { type: String, required: true },
  category: { type: String, default: '' },
  url: { type: String, default: '' },
}, { timestamps: true })

module.exports = mongoose.model('GarmentMockup', garmentMockupSchema)
