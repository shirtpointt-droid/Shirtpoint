const express = require('express')
const router = express.Router()
const upload = require('../middleware/upload')
const { getAll, upsert, remove } = require('../controllers/garmentMockupController')

router.get('/', getAll)
router.post('/', upload.single('image'), upsert)
router.delete('/:baseId', remove)

module.exports = router
