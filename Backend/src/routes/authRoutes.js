const express = require('express')
const router = express.Router()
const { signup, login, verify2FA, setup2FA, enable2FA, forgotPassword2FA, disable2FA } = require('../controllers/authController')
const auth = require('../middleware/auth')

router.post('/signup', signup)
router.post('/login', login)
router.post('/verify-2fa', verify2FA)
router.get('/2fa-setup', auth, setup2FA)
router.post('/2fa-enable', auth, enable2FA)
router.post('/2fa-disable', auth, disable2FA)
router.post('/forgot-password-2fa', forgotPassword2FA)

module.exports = router
