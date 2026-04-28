const mongoose = require('mongoose')
const UserProductSchema = new mongoose.Schema({
  name:       { type: String, required: true },
  baseImage:  { type: String, required: true },
  logos:      [{ image: String, pos: Object, size: Number, rotation: Number }],
  order:      { type: Number, default: 0 },
}, { timestamps: true })
module.exports = mongoose.model('UserProduct', UserProductSchema)
