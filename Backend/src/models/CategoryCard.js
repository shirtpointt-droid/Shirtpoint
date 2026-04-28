const mongoose = require('mongoose')
const CategoryCardSchema = new mongoose.Schema({
  name:       { type: String, required: true },
  imgDefault: { type: String, required: true },
  imgHover:   { type: String, default: '' },
  order:      { type: Number, default: 0 },
}, { timestamps: true })
module.exports = mongoose.model('CategoryCard', CategoryCardSchema)
