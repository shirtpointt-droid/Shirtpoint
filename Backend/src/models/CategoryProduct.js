const mongoose = require('mongoose')
const CategoryProductSchema = new mongoose.Schema({
  categoryLabel: { type: String, required: true },
  name:          { type: String, required: true },
  image:         { type: String, default: '' },
  modelUrl:      { type: String, default: '' },
  color:         { type: String, default: '#f97316' },
  order:         { type: Number, default: 0 },
}, { timestamps: true })
module.exports = mongoose.model('CategoryProduct', CategoryProductSchema)
