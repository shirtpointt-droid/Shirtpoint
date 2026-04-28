import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const ProductGrid = ({ navigate }) => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchProducts() }, [])

  const fetchProducts = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/products')
      const data = await res.json()
      setProducts(data)
    } catch {
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-3 gap-5">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="aspect-square rounded-2xl bg-gray-100 animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      {products.map((product, index) => {
        const pos      = product.designPos      || { top: 45, left: 50 }
        const size     = product.designSize     || 30
        const rotation = product.designRotation || 0

        return (
          <motion.div
            key={product._id || index}
            className="group cursor-pointer"
            whileHover={{ y: -5 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            onClick={() => navigate('/design-lab')}
          >
            <div className="relative rounded-2xl overflow-hidden group-hover:shadow-2xl transition-all duration-300" style={{ aspectRatio: '1/1' }}>

              {/* Base image */}
              {product.baseImage ? (
                <img
                  src={product.baseImage}
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-contain"
                />
              ) : (
                <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                  <span className="text-5xl">📦</span>
                </div>
              )}

              {/* Design overlay on hover */}
              {product.designImage && (
                <div
                  className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20"
                  style={{
                    top:       `${pos.top}%`,
                    left:      `${pos.left}%`,
                    width:     `${size}%`,
                    height:    `${size}%`,
                    transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
                  }}
                >
                  <img
                    src={product.designImage}
                    alt="design"
                    className="w-full h-full object-contain drop-shadow-lg"
                  />
                </div>
              )}

              {/* Hover border */}
              <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-orange-400 transition-all duration-300 pointer-events-none z-10" />

              {/* Name overlay */}
              <div className="absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-black/70 to-transparent pb-3 pt-8 px-3">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-4 bg-orange-500 rounded-full flex-shrink-0" />
                  <h3 className="font-bold text-white text-sm tracking-tight truncate">
                    {product.name}
                  </h3>
                </div>
              </div>

            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

export default ProductGrid
