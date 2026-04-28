const Product = require('../models/Product')

const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ order: 1, createdAt: -1 })
    res.json(products)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const createProduct = async (req, res) => {
  try {
    const { name, baseImage, designImage, designPos, designSize, designRotation } = req.body
    const lastProduct = await Product.findOne().sort({ order: -1 })
    const order = lastProduct ? lastProduct.order + 1 : 0
    const product = new Product({ name, baseImage, designImage, designPos, designSize, designRotation, order })
    const saved = await product.save()
    res.status(201).json(saved)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

const updateProduct = async (req, res) => {
  try {
    const { name, baseImage, designImage, designPos, designSize, designRotation } = req.body
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, baseImage, designImage, designPos, designSize, designRotation },
      { new: true, runValidators: true }
    )
    if (!product) return res.status(404).json({ message: 'Product not found' })
    res.json(product)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id)
    if (!product) return res.status(404).json({ message: 'Product not found' })
    res.json({ message: 'Product deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { getProducts, createProduct, updateProduct, deleteProduct }
