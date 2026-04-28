const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  baseImage: { type: String, required: true },
  designImage: { type: String, required: true },
  designPos: {
    top:  { type: Number, default: 45 },
    left: { type: Number, default: 50 }
  },
  designSize:     { type: Number, default: 30 },
  designRotation: { type: Number, default: 0 },
  order: { type: Number, default: 0 }
}, { timestamps: true })

module.exports = mongoose.model('Product', productSchema)
