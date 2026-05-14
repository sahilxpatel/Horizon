'use client';

import React from 'react'
import { Container } from 'reactstrap'
import { motion } from 'framer-motion'

const DealsBanner = () => {
  const deals = [
    {
      title: 'Summer Special',
      discount: '30% OFF',
      description: 'on all beach destinations',
      code: 'SUMMER30',
      icon: 'ri-sun-line',
      color: '#FF9800'
    },
    {
      title: 'Weekend Getaway',
      discount: '25% OFF',
      description: 'book 3 days, pay for 2',
      code: 'WEEKEND25',
      icon: 'ri-calendar-check-line',
      color: '#4CAF50'
    },
    {
      title: 'Group Booking',
      discount: '40% OFF',
      description: 'for groups of 6 or more',
      code: 'GROUP40',
      icon: 'ri-team-line',
      color: '#2196F3'
    }
  ]

  const [currentDeal, setCurrentDeal] = React.useState(0)

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDeal((prev) => (prev + 1) % deals.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [deals.length])

  const deal = deals[currentDeal]

  return (
    <section className="deals__banner">
      <Container>
        <motion.div
          className="deals__banner__wrapper"
          key={currentDeal}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <div className="deals__banner__content">
            <motion.div
              className="deals__icon"
              style={{ color: deal.color }}
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: 360 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <i className={deal.icon}></i>
            </motion.div>

            <div className="deals__text">
              <span className="deals__label">🔥 {deal.title}</span>
              <h3 className="deals__discount" style={{ color: deal.color }}>
                {deal.discount}
              </h3>
              <p className="deals__description">{deal.description}</p>
            </div>

            <div className="deals__code">
              <span className="code__label">Use Code:</span>
              <motion.div
                className="code__value"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  navigator.clipboard.writeText(deal.code)
                  alert(`Code "${deal.code}" copied to clipboard!`)
                }}
              >
                {deal.code}
                <i className="ri-file-copy-line"></i>
              </motion.div>
            </div>

            <motion.button
              className="deals__cta"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = '/tours'}
            >
              Book Now <i className="ri-arrow-right-line"></i>
            </motion.button>
          </div>

          {/* Progress Indicators */}
          <div className="deals__indicators">
            {deals.map((_, index) => (
              <motion.button
                key={index}
                className={`indicator ${index === currentDeal ? 'active' : ''}`}
                onClick={() => setCurrentDeal(index)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </div>
        </motion.div>
      </Container>
    </section>
  )
}

export default DealsBanner

