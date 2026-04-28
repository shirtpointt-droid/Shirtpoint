const GarmentMockup = require('../models/GarmentMockup')

const getAll = async (req, res) => {
  const data = await GarmentMockup.find()
  res.json(data)
}

const upsert = async (req, res) => {
  const { baseId, label, category } = req.body
  const update = { baseId, label, category }
  if (req.file) update.url = `http://localhost:5000/uploads/${req.file.filename}`
  const doc = await GarmentMockup.findOneAndUpdate(
    { baseId },
    update,
    { upsert: true, new: true, setDefaultsOnInsert: true }
  )
  res.json(doc)
}

const remove = async (req, res) => {
  await GarmentMockup.findOneAndDelete({ baseId: req.params.baseId })
  res.json({ success: true })
}

module.exports = { getAll, upsert, remove }
