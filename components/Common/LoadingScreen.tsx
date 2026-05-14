'use client';

import React from 'react'
import { motion } from 'framer-motion'

const LoadingScreen = () => {
  return (
    <div className="loading__screen">
      <div className="loading__content">
        {/* Animated Logo */}
        <motion.div
          className="loading__logo"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="logo__circle"
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <i className="ri-plane-line"></i>
          </motion.div>
        </motion.div>

        {/* Brand Name */}
        <motion.h1
          className="loading__title"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Horizon
        </motion.h1>

        {/* Loading Bar */}
        <div className="loading__bar__container">
          <motion.div
            className="loading__bar"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
        </div>

        {/* Loading Text */}
        <motion.p
          className="loading__text"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          Preparing your journey...
        </motion.p>

        {/* Animated Dots */}
        <div className="loading__dots">
          <motion.span
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
          />
          <motion.span
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
          />
          <motion.span
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
          />
        </div>
      </div>
    </div>
  )
}

export default LoadingScreen

