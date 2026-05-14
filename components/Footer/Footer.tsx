'use client';

import React from 'react'
import { Container, Row , Col, ListGroup , ListGroupItem } from 'reactstrap'
import Link from 'next/link'
import { motion } from 'framer-motion'
// import logo from '../../assets/images/logo.png'
import logo from '../../assets/images/horizon.png'
import { getImageSrc } from '../../lib/image'


const quick__links = [
  {
    path: '/',
    display: 'Home',
  },
  {
    path: '/tours',
    display: 'Tours',
  },
];

const quick__links2 = [
  {
    path: '/tours',
    display: 'Tours',
  },
  {
    path: '/login',
    display: 'Login',
  },
  {
    path: '/register',
    display: 'Register',
  },
];

const socialLinks = [
  {
    href: 'https://www.youtube.com/',
    icon: 'ri-youtube-line',
    label: 'YouTube',
  },
  {
    href: 'https://github.com/',
    icon: 'ri-github-fill',
    label: 'GitHub',
  },
  {
    href: 'https://www.facebook.com/',
    icon: 'ri-facebook-circle-line',
    label: 'Facebook',
  },
  {
    href: 'https://www.instagram.com/',
    icon: 'ri-instagram-line',
    label: 'Instagram',
  },
]

const Footer = () => {

  const year=new Date().getFullYear()
  return (
    <motion.footer 
      className="footer"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
    >
      <Container>
        <Row>
          <Col lg="4" md="6">
            <motion.div 
              className='footer__brand'
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <motion.div whileHover={{ scale: 1.05 }}>
                <Link href='/' aria-label='Horizon home'>
                  <img src={getImageSrc(logo, '/logo192.png')} alt='Horizon logo' />
                </Link>
              </motion.div>
              <p>
                Life is a journey, enjoy the trip. Aim for the sky, but move slowly, enjoying every step along the way.
                It is all those little steps that make the journey complete.
              </p>
              <div className="social__links d-flex align-items-center gap-3">
                {socialLinks.map(({ href, icon, label }, index) => (
                  <motion.a 
                    key={icon} 
                    href={href} 
                    target='_blank' 
                    rel='noreferrer' 
                    aria-label={label}
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ 
                      scale: 1.2, 
                      rotate: 5,
                      transition: { duration: 0.2 }
                    }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <i className={icon}></i>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </Col>
          <Col lg='2' md='3' sm='6' className='mt-4 mt-lg-0'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h5 className="footer__link-title">Discover</h5>
              <ListGroup className="footer__quick-links">
                {quick__links.map((item,index) => (
                  <motion.div
                    key={index}
                    whileHover={{ x: 6 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ListGroupItem className="ps-0 border-0">
                      <Link href={item.path}>{item.display}</Link>
                    </ListGroupItem>
                  </motion.div>
                )) }
              </ListGroup>
            </motion.div>
          </Col>
          <Col lg='2' md='3' sm='6' className='mt-4 mt-lg-0'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h5 className="footer__link-title">Quick Links</h5>
              <ListGroup className="footer__quick-links">
                {quick__links2.map((item,index) => (
                  <motion.div
                    key={index}
                    whileHover={{ x: 6 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ListGroupItem className="ps-0 border-0">
                      <Link href={item.path}>{item.display}</Link>
                    </ListGroupItem>
                  </motion.div>
                )) }
              </ListGroup>
            </motion.div>
          </Col>
          <Col lg='4' md='12' className='mt-4 mt-lg-0'>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h5 className="footer__link-title">Contact</h5>
              <ListGroup className="footer__quick-links contact__list">
                <ListGroupItem className="ps-0 border-0 d-flex align-items-start gap-3">
                  <motion.div 
                    className='icon-wrap'
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <i className="ri-map-pin-line"></i>
                  </motion.div>
                  <div>
                    <h6>Address</h6>
                    <p className="mb-0">India</p>
                  </div>
                </ListGroupItem>
                <ListGroupItem className="ps-0 border-0 d-flex align-items-start gap-3">
                  <motion.div 
                    className='icon-wrap'
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <i className="ri-mail-line"></i>
                  </motion.div>
                  <div>
                    <h6>Email</h6>
                    <a href='mailto:sahilajani04@gmail.com'>sahilajani04@gmail.com</a>
                  </div>
                </ListGroupItem>
                <ListGroupItem className="ps-0 border-0 d-flex align-items-start gap-3">
                  <motion.div 
                    className='icon-wrap'
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <i className="ri-phone-fill"></i>
                  </motion.div>
                  <div>
                    <h6>Phone</h6>
                    <a href='tel:+917428623215'>+91 74286 23215</a>
                  </div>
                </ListGroupItem>
              </ListGroup>
            </motion.div>
          </Col>
          <Col lg='12' className='text-center pt-4 mt-4'>
            <motion.p 
              className='copyright'
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              © {year} Horizon Adventures. Designed with passion by Sahil Ajani. All rights reserved.
            </motion.p>
          </Col>
        </Row>
      </Container>
    </motion.footer>
  )
}

export default Footer
