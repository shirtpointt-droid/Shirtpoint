const GarmentMockup = require('../models/GarmentMockup')

const getAll = async (req, res) => {
  try {
    const data = await GarmentMockup.find()
    res.json(data)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const upsert = async (req, res) => {
  try {
    const { baseId, label, category } = req.body
    const update = { baseId, label, category }
    if (req.file) {
      const baseUrl = process.env.BASE_URL || 'http://localhost:5000'
      update.url = `${baseUrl}/uploads/${req.file.filename}`
    }
    const doc = await GarmentMockup.findOneAndUpdate(
      { baseId },
      update,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    )
    res.json(doc)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const remove = async (req, res) => {
  try {
    await GarmentMockup.findOneAndDelete({ baseId: req.params.baseId })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = { getAll, upsert, remove }
