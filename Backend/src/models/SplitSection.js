const mongoose = require('mongoose')

const splitSectionSchema = new mongoose.Schema({
  eyebrow: { type: String, default: 'Premium Collection' },
  heading: { type: String, default: '3D CUSTOM T-SHIRT' },
  description: { type: String, default: 'Aapka design, hamari quality.' },
  btn1: { type: String, default: 'Customize Now' },
  btn2: { type: String, default: 'View Details' },
  videoUrl: { type: String, default: '' },
  features: [{
    title: { type: String },
    value: { type: String }
  }]
}, { timestamps: true })

module.exports = mongoose.model('SplitSection', splitSectionSchema)
