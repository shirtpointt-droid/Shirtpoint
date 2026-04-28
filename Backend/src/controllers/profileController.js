const User = require('../models/User')

const SAFE_FIELDS = 'name email phone city photo credits isPro activeOrders savedDesigns totalSpent'

// GET /api/profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select(SAFE_FIELDS)
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json(user)
  } catch {
    res.status(500).json({ message: 'Server error' })
  }
}

// PUT /api/profile
const updateProfile = async (req, res) => {
  try {
    const { name, email, phone, city, photo } = req.body
    const updated = await User.findByIdAndUpdate(
      req.userId,
      { name, email, phone, city, photo },
      { new: true, runValidators: true }
    ).select(SAFE_FIELDS)
    if (!updated) return res.status(404).json({ message: 'User not found' })
    res.json(updated)
  } catch {
    res.status(500).json({ message: 'Server error' })
  }
}

module.exports = { getProfile, updateProfile }
