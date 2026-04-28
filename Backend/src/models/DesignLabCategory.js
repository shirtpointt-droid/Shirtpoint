const mongoose = require('mongoose')
const DesignLabCategorySchema = new mongoose.Schema({
  label:    { type: String, required: true },
  desc:     { type: String, default: '' },
  count:    { type: String, default: '10+' },
  img:      { type: String, default: '' },
  gradient: { type: String, default: 'linear-gradient(135deg, #f97316, #ea580c)' },
  order:    { type: Number, default: 0 },
}, { timestamps: true })
module.exports = mongoose.model('DesignLabCategory', DesignLabCategorySchema)
