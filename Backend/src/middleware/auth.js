const jwt = require('jsonwebtoken')
const User = require('../models/User')
const JWT_SECRET = process.env.JWT_SECRET || 'tshirtpoint_secret'

module.exports = async (req, res, next) => {
  const auth = req.headers.authorization
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ message: 'No token' })
  try {
    const decoded = jwt.verify(auth.split(' ')[1], JWT_SECRET)
    req.userId = decoded.id
    next()
  } catch {
    res.status(401).json({ message: 'Invalid token' })
  }
}
