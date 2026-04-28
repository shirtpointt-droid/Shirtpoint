const mongoose = require('mongoose')
const UserBannerSchema = new mongoose.Schema({
  image:    { type: String, required: true },
  title:    { type: String, default: '' },
  subtitle: { type: String, default: '' },
  link:     { type: String, default: '' },
  order:    { type: Number, default: 0 },
}, { timestamps: true })
module.exports = mongoose.model('UserBanner', UserBannerSchema)
