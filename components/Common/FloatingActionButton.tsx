'use client';

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const FloatingActionButton = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.pageYOffset > 400)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  const actions = [
    {
      icon: 'ri-whatsapp-line',
      label: 'WhatsApp',
      color: '#25D366',
      action: () => window.open('https://wa.me/1234567890?text=Hi, I need help with booking', '_blank')
    },
    {
      icon: 'ri-phone-line',
      label: 'Call Us',
      color: '#4CAF50',
      action: () => window.location.href = 'tel:+1234567890'
    },
    {
      icon: 'ri-mail-line',
      label: 'Email',
      color: '#2196F3',
      action: () => window.location.href = 'mailto:support@horizon.com'
    },
    {
      icon: 'ri-customer-service-2-line',
      label: 'Live Chat',
      color: '#FF9800',
      action: () => alert('Live chat feature coming soon!')
    }
  ]

  const fabVariants = {
    open: {
      rotate: 45,
      transition: { duration: 0.3 }
    },
    closed: {
      rotate: 0,
      transition: { duration: 0.3 }
    }
  }

  const menuVariants = {
    open: {
      opacity: 1,
      scale: 1,
      transition: {
        staggerChildren: 0.07,
        delayChildren: 0.1
      }
    },
    closed: {
      opacity: 0,
      scale: 0.3,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    }
  }

  const itemVariants = {
    open: {
      y: 0,
      opacity: 1,
      transition: {
        y: { stiffness: 1000, velocity: -100 }
      }
    },
    closed: {
      y: 20,
      opacity: 0,
      transition: {
        y: { stiffness: 1000 }
      }
    }
  }

  return (
    <>
      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            className="scroll__to__top"
            onClick={scrollToTop}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            whileHover={{ scale: 1.1, y: -5 }}
            whileTap={{ scale: 0.9 }}
          >
            <i className="ri-arrow-up-line"></i>
          </motion.button>
        )}
      </AnimatePresence>

      {/* FAB Container */}
      <div className="fab__container">
        {/* Action Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="fab__menu"
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              {actions.map((action, index) => (
                <motion.div
                  key={index}
                  className="fab__action"
                  variants={itemVariants}
                  whileHover={{ scale: 1.1, x: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    action.action()
                    setIsOpen(false)
                  }}
                >
                  <span className="fab__action__label">{action.label}</span>
                  <motion.button
                    className="fab__action__btn"
                    style={{ backgroundColor: action.color }}
                    whileHover={{
                      boxShadow: `0 8px 25px ${action.color}60`
                    }}
                  >
                    <i className={action.icon}></i>
                  </motion.button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main FAB Button */}
        <motion.button
          className="fab__main"
          onClick={() => setIsOpen(!isOpen)}
          variants={fabVariants}
          animate={isOpen ? 'open' : 'closed'}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <i className="ri-customer-service-2-fill"></i>
        </motion.button>

        {/* Backdrop */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="fab__backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  )
}

export default FloatingActionButton

