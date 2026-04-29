const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../../uploads')),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
})

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|mp4|mov|webm/
    if (allowed.test(path.extname(file.originalname).toLowerCase())) cb(null, true)
    else cb(new Error('Only images and videos allowed'))
  },
  limits: { fileSize: 100 * 1024 * 1024 }
})

module.exports = upload
