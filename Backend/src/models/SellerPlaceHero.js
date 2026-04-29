const mongoose = require('mongoose')
const SellerPlaceHeroSchema = new mongoose.Schema({
  eyebrow: { type: String, default: '🛍️ Community Designs' },
  title: { type: String, default: 'SELLER PLACE' },
  desc: { type: String, default: 'Pakistani designers ke unique designs — apni T-shirt pe laga ke order karo.' },
  stat1Label: { type: String, default: 'Designs' },
  stat2Value: { type: String, default: '100+' },
  stat2Label: { type: String, default: 'Designers' },
  stat3Value: { type: String, default: 'PKR' },
  stat3Label: { type: String, default: 'Credits' },
  card1Image: { type: String, default: '' },
  card2Image: { type: String, default: '' },
  card3Image: { type: String, default: '' },
}, { timestamps: true })
module.exports = mongoose.model('SellerPlaceHero', SellerPlaceHeroSchema)
