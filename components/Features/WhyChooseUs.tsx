'use client';

import React from 'react'
import { Container, Row, Col } from 'reactstrap'
import { motion } from 'framer-motion'

const features = [
  {
    icon: 'ri-shield-check-line',
    title: '100% Secure',
    description: 'Your data and payments are protected with bank-level security',
    color: '#4caf50',
    delay: 0.1
  },
  {
    icon: 'ri-customer-service-2-line',
    title: '24/7 Support',
    description: 'Round-the-clock customer service for all your travel needs',
    color: '#2196f3',
    delay: 0.2
  },
  {
    icon: 'ri-wallet-3-line',
    title: 'Best Prices',
    description: 'Competitive rates with no hidden charges or booking fees',
    color: '#ff9800',
    delay: 0.3
  },
  {
    icon: 'ri-map-pin-user-line',
    title: 'Expert Guides',
    description: 'Professional local guides with deep knowledge and experience',
    color: '#e91e63',
    delay: 0.4
  },
  {
    icon: 'ri-calendar-check-line',
    title: 'Flexible Plans',
    description: 'Customizable itineraries to match your preferences and schedule',
    color: '#9c27b0',
    delay: 0.5
  },
  {
    icon: 'ri-medal-line',
    title: 'Top Rated',
    description: 'Award-winning service with 5-star customer satisfaction',
    color: '#f44336',
    delay: 0.6
  }
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const
    }
  }
}

const WhyChooseUs = () => {
  return (
    <section className="why__choose__us">
      <Container>
        <Row>
          <Col lg="12" className="text-center mb-5">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h5 className="section__subtitle">Why Choose Us</h5>
              <h2 className="section__title">
                Experience Excellence in <span className="highlight">Every Journey</span>
              </h2>
              <p className="section__description">
                We&apos;re committed to making your travel dreams come true with unmatched service and care
              </p>
            </motion.div>
          </Col>
        </Row>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <Row>
            {features.map((feature, index) => (
              <Col lg="4" md="6" sm="12" key={index} className="mb-4">
                <motion.div
                  className="feature__card"
                  variants={itemVariants}
                  whileHover={{ 
                    y: -10,
                    boxShadow: `0 20px 60px -15px ${feature.color}40`
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="feature__icon__wrapper">
                    <motion.div
                      className="feature__icon"
                      style={{ 
                        background: `linear-gradient(135deg, ${feature.color}15 0%, ${feature.color}05 100%)`
                      }}
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    >
                      <i 
                        className={feature.icon} 
                        style={{ color: feature.color }}
                      ></i>
                    </motion.div>
                  </div>
                  
                  <div className="feature__content">
                    <h4>{feature.title}</h4>
                    <p>{feature.description}</p>
                  </div>

                  <motion.div 
                    className="feature__hover__effect"
                    style={{ 
                      background: `linear-gradient(135deg, ${feature.color}10 0%, transparent 100%)`
                    }}
                  />
                </motion.div>
              </Col>
            ))}
          </Row>
        </motion.div>

        {/* Stats Counter */}
        <motion.div
          className="stats__section"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Row>
            <Col lg="3" md="6" sm="6" className="mb-4">
              <div className="stat__item">
                <motion.h3
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <CountUp end={15000} duration={2.5} />+
                </motion.h3>
                <p>Happy Customers</p>
              </div>
            </Col>
            <Col lg="3" md="6" sm="6" className="mb-4">
              <div className="stat__item">
                <motion.h3
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <CountUp end={250} duration={2.5} />+
                </motion.h3>
                <p>Destinations</p>
              </div>
            </Col>
            <Col lg="3" md="6" sm="6" className="mb-4">
              <div className="stat__item">
                <motion.h3
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <CountUp end={98} duration={2.5} />%
                </motion.h3>
                <p>Satisfaction Rate</p>
              </div>
            </Col>
            <Col lg="3" md="6" sm="6" className="mb-4">
              <div className="stat__item">
                <motion.h3
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                >
                  <CountUp end={25} duration={2.5} />+
                </motion.h3>
                <p>Years Experience</p>
              </div>
            </Col>
          </Row>
        </motion.div>
      </Container>
    </section>
  )
}

// Simple CountUp component
const CountUp = ({ end, duration }) => {
  const [count, setCount] = React.useState(0)
  
  React.useEffect(() => {
    let startTime = null
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1)
      setCount(Math.floor(progress * end))
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    
    requestAnimationFrame(animate)
  }, [end, duration])
  
  return <>{count.toLocaleString()}</>
}

export default WhyChooseUs

