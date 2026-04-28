const NewDrop = require('../models/NewDrop')

exports.getAll = async (req, res) => {
  const drops = await NewDrop.find().sort({ order: 1 })
  res.json(drops)
}

exports.create = async (req, res) => {
  const drop = await NewDrop.create(req.body)
  res.json(drop)
}

exports.update = async (req, res) => {
  const drop = await NewDrop.findByIdAndUpdate(req.params.id, req.body, { new: true })
  res.json(drop)
}

exports.remove = async (req, res) => {
  await NewDrop.findByIdAndDelete(req.params.id)
  res.json({ success: true })
}
