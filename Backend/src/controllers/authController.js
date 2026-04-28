const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const QRCode = require('qrcode')

const JWT_SECRET = process.env.JWT_SECRET || 'tshirtpoint_secret'

// ========== TOTP HELPERS (Node.js crypto, zero external deps) ==========
const BASE32_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'

function base32Encode(buffer) {
  let bits = ''
  for (const byte of buffer) bits += byte.toString(2).padStart(8, '0')
  let result = ''
  for (let i = 0; i < bits.length; i += 5) {
    const chunk = bits.substring(i, i + 5).padEnd(5, '0')
    result += BASE32_CHARS[parseInt(chunk, 2)]
  }
  return result
}

function base32Decode(str) {
  let bits = ''
  for (const c of str.toUpperCase()) {
    const idx = BASE32_CHARS.indexOf(c)
    if (idx === -1) continue
    bits += idx.toString(2).padStart(5, '0')
  }
  const bytes = []
  for (let i = 0; i + 8 <= bits.length; i += 8) {
    bytes.push(parseInt(bits.substring(i, i + 8), 2))
  }
  return Buffer.from(bytes)
}

function generateSecret() {
  return base32Encode(crypto.randomBytes(20))
}

function generateTOTP(secret, time) {
  const epoch = time || Math.floor(Date.now() / 1000)
  const counter = Math.floor(epoch / 30)
  const buf = Buffer.alloc(8)
  buf.writeUInt32BE(Math.floor(counter / 0x100000000), 0)
  buf.writeUInt32BE(counter & 0xFFFFFFFF, 4)
  const key = base32Decode(secret)
  const hmac = crypto.createHmac('sha1', key).update(buf).digest()
  const offset = hmac[hmac.length - 1] & 0xf
  const code = ((hmac[offset] & 0x7f) << 24 | hmac[offset + 1] << 16 | hmac[offset + 2] << 8 | hmac[offset + 3]) % 1000000
  return code.toString().padStart(6, '0')
}

function verifyTOTP(token, secret) {
  if (!token || !secret) return false
  const now = Math.floor(Date.now() / 1000)
  for (let i = -1; i <= 1; i++) {
    if (generateTOTP(secret, now + i * 30) === token) return true
  }
  return false
}

function buildOtpauthURI(email, secret) {
  return `otpauth://totp/Shirtpoint:${encodeURIComponent(email)}?secret=${secret}&issuer=Shirtpoint&algorithm=SHA1&digits=6&period=30`
}
// ========== END TOTP HELPERS ==========

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
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, phone: user.phone, city: user.city, photo: user.photo, credits: user.credits, isPro: user.isPro, activeOrders: user.activeOrders, savedDesigns: user.savedDesigns, totalSpent: user.totalSpent, isTwoFactorEnabled: user.isTwoFactorEnabled } })
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

    // Check 2FA
    if (user.isTwoFactorEnabled) {
      return res.json({ requires2FA: true, userId: user._id })
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' })
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, phone: user.phone, city: user.city, photo: user.photo, credits: user.credits, isPro: user.isPro, activeOrders: user.activeOrders, savedDesigns: user.savedDesigns, totalSpent: user.totalSpent, isTwoFactorEnabled: user.isTwoFactorEnabled } })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

// GET /api/auth/2fa-setup
const setup2FA = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
    if (!user) return res.status(404).json({ message: 'User not found' })

    const secret = generateSecret()
    const otpauth = buildOtpauthURI(user.email, secret)
    const qr = await QRCode.toDataURL(otpauth)

    user.twoFactorSecret = secret
    await user.save()
    res.json({ qr, secret })
  } catch (err) {
    console.error('2FA Setup Error:', err)
    res.status(500).json({ message: 'Setup error: ' + err.message })
  }
}

// POST /api/auth/2fa-enable
const enable2FA = async (req, res) => {
  try {
    const { code } = req.body
    const user = await User.findById(req.userId)
    if (!user) return res.status(404).json({ message: 'User not found' })

    const isValid = verifyTOTP(code, user.twoFactorSecret)
    if (!isValid) return res.status(400).json({ message: 'Invalid code' })

    user.isTwoFactorEnabled = true
    await user.save()
    res.json({ message: '2FA Enabled' })
  } catch (err) {
    res.status(500).json({ message: 'Enable error' })
  }
}

// POST /api/auth/verify-2fa
const verify2FA = async (req, res) => {
  try {
    const { userId, code } = req.body
    const user = await User.findById(userId)
    if (!user) return res.status(404).json({ message: 'User not found' })

    const isValid = verifyTOTP(code, user.twoFactorSecret)
    if (!isValid) return res.status(400).json({ message: 'Invalid 2FA code' })

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' })
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, phone: user.phone, city: user.city, photo: user.photo, credits: user.credits, isPro: user.isPro, activeOrders: user.activeOrders, savedDesigns: user.savedDesigns, totalSpent: user.totalSpent, isTwoFactorEnabled: user.isTwoFactorEnabled } })
  } catch (err) {
    res.status(500).json({ message: 'Verify error' })
  }
}

// POST /api/auth/forgot-password-2fa
const forgotPassword2FA = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body
    const user = await User.findOne({ email })
    if (!user || !user.isTwoFactorEnabled) {
      return res.status(400).json({ message: 'Account not found or 2FA not enabled' })
    }

    const isValid = verifyTOTP(code, user.twoFactorSecret)
    if (!isValid) return res.status(400).json({ message: 'Invalid 2FA code' })

    user.password = await bcrypt.hash(newPassword, 10)
    await user.save()
    res.json({ message: 'Password reset successful' })
  } catch (err) {
    res.status(500).json({ message: 'Reset error' })
  }
}

// POST /api/auth/2fa-disable
const disable2FA = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
    if (!user) return res.status(404).json({ message: 'User not found' })

    user.isTwoFactorEnabled = false
    user.twoFactorSecret = ''
    await user.save()
    res.json({ message: '2FA Disabled' })
  } catch (err) {
    res.status(500).json({ message: 'Disable error' })
  }
}

module.exports = { signup, login, setup2FA, enable2FA, verify2FA, forgotPassword2FA, disable2FA }
