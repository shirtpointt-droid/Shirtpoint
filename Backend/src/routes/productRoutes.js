const express = require('express')
const router = express.Router()
const {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController')

// GET /api/products - Get all products
router.get('/', getProducts)

// POST /api/products - Create new product
router.post('/', createProduct)

// PUT /api/products/:id - Update product
router.put('/:id', updateProduct)

// DELETE /api/products/:id - Delete product
router.delete('/:id', deleteProduct)

module.exports = router