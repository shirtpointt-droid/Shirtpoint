const mongoose = require('mongoose')

const split2Schema = new mongoose.Schema({
  eyebrow: { type: String, default: 'Exclusive Designs' },
  heading: { type: String, default: 'STYLE YOUR OWN WAY' },
  description: { type: String, default: 'Apni personality ko express karo. Har design unique hai, har piece ek statement.' },
  btn1: { type: String, default: 'Explore Now' },
  btn2: { type: String, default: 'Learn More' },
  videoUrl: { type: String, default: '' },
  features: [{
    title: { type: String },
    value: { type: String }
  }]
}, { timestamps: true })

module.exports = mongoose.model('Split2Section', split2Schema)
