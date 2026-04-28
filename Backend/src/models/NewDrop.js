const mongoose = require('mongoose')
const NewDropSchema = new mongoose.Schema({
  topImage: { type: String, required: true },
  topTitle: { type: String, default: 'New Drop' },
  bottomImage: { type: String, required: true },
  bottomTitle: { type: String, default: 'New Drop' },
}, { timestamps: true })
module.exports = mongoose.model('NewDrop', NewDropSchema)
