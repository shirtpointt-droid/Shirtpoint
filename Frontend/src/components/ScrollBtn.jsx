import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiArrowUp, FiArrowDown } from 'react-icons/fi'
import '../css/ScrollBtn.css'

function ScrollBtn() {
  const [atBottom, setAtBottom] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      setVisible(scrollY > 200)
      setAtBottom(scrollY > docHeight - 100)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleClick = () => {
    if (atBottom) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' })
    }
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          className="scroll-btn"
          onClick={handleClick}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title={atBottom ? 'Back to Top' : 'Go to Bottom'}
        >
          <svg className="scroll-ring" viewBox="0 0 50 50">
            <circle className="scroll-ring-bg" cx="25" cy="25" r="22" />
            <circle className="scroll-ring-fill" cx="25" cy="25" r="22" />
          </svg>
          <span className="scroll-icon">
            {atBottom ? <FiArrowUp /> : <FiArrowDown />}
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  )
}

export default ScrollBtn
