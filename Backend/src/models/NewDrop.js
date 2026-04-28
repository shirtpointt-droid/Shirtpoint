const mongoose = require('mongoose')
const NewDropSchema = new mongoose.Schema({
  topTitle: { type: String, default: '' },
  topImage: { type: String, required: true },
  bottomTitle: { type: String, default: '' },
  bottomImage: { type: String, required: true },
  order: { type: Number, default: 0 },
}, { timestamps: true })
module.exports = mongoose.model('NewDrop', NewDropSchema)
