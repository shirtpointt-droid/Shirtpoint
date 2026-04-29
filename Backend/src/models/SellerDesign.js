const mongoose = require('mongoose')
const SellerDesignSchema = new mongoose.Schema({
  title: { type: String, required: true },
  designerName: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, default: 'General' },
  price: { type: Number, default: 100 },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  verified: { type: Boolean, default: false },
  sales: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
}, { timestamps: true })
module.exports = mongoose.model('SellerDesign', SellerDesignSchema)
