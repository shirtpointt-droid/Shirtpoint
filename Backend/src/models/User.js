const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  phone:    { type: String, default: '' },
  city:     { type: String, default: '' },
  photo:    { type: String, default: '' },
  credits:  { type: Number, default: 1250 },
  isPro:    { type: Boolean, default: false },
  activeOrders:  { type: Number, default: 0 },
  savedDesigns:  { type: Number, default: 0 },
  totalSpent:    { type: Number, default: 0 },
}, { timestamps: true })

module.exports = mongoose.model('User', userSchema)
