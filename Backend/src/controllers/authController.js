const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET || 'tshirtpoint_secret'

// POST /api/auth/signup
const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password) return res.status(400).json({ message: 'All fields required' })

    const exists = await User.findOne({ email })
    if (exists) return res.status(400).json({ message: 'Email already registered' })

    const hashed = await bcrypt.hash(password, 10)
    const user = await User.create({ name, email, password: hashed })

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' })
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, phone: user.phone, city: user.city, photo: user.photo, credits: user.credits, isPro: user.isPro, activeOrders: user.activeOrders, savedDesigns: user.savedDesigns, totalSpent: user.totalSpent } })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ message: 'All fields required' })

    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ message: 'Invalid email or password' })

    const match = await bcrypt.compare(password, user.password)
    if (!match) return res.status(400).json({ message: 'Invalid email or password' })

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' })
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, phone: user.phone, city: user.city, photo: user.photo, credits: user.credits, isPro: user.isPro, activeOrders: user.activeOrders, savedDesigns: user.savedDesigns, totalSpent: user.totalSpent } })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

module.exports = { signup, login }
