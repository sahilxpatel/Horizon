'use client';

import React, { createContext, useContext, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const ToastContext = createContext(null)

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const addToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev, { id, message, type, duration }])

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }
  }, [removeToast])

  const showSuccess = useCallback((message, duration) => {
    addToast(message, 'success', duration)
  }, [addToast])

  const showError = useCallback((message, duration) => {
    addToast(message, 'error', duration)
  }, [addToast])

  const showInfo = useCallback((message, duration) => {
    addToast(message, 'info', duration)
  }, [addToast])

  const showWarning = useCallback((message, duration) => {
    addToast(message, 'warning', duration)
  }, [addToast])

  return (
    <ToastContext.Provider value={{ showSuccess, showError, showInfo, showWarning }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  )
}

const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="toast__container">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} removeToast={removeToast} />
        ))}
      </AnimatePresence>
    </div>
  )
}

const Toast = ({ toast, removeToast }) => {
  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return 'ri-checkbox-circle-fill'
      case 'error':
        return 'ri-error-warning-fill'
      case 'warning':
        return 'ri-alert-fill'
      case 'info':
      default:
        return 'ri-information-fill'
    }
  }

  return (
    <motion.div
      className={`toast toast--${toast.type}`}
      initial={{ opacity: 0, x: 300, scale: 0.3 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.3 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      layout
    >
      <div className="toast__icon">
        <i className={getIcon()}></i>
      </div>
      <div className="toast__content">
        <p className="toast__message">{toast.message}</p>
      </div>
      <motion.button
        className="toast__close"
        onClick={() => removeToast(toast.id)}
        whileHover={{ scale: 1.2, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
      >
        <i className="ri-close-line"></i>
      </motion.button>
    </motion.div>
  )
}

export default ToastProvider

