'use client';

import React, { useState } from 'react';
import { Container, Row, Col, Form, FormGroup, Input } from 'reactstrap';
import { motion } from 'framer-motion';
import { BASE_URL } from '../../utils/config';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (result.success) {
        alert(result.message);
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
        });
      } else {
        alert(result.message || 'Failed to send message');
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="contact__section">
      <Container>
        <Row>
          <Col lg="12" className="mb-5">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="contact__header"
            >
              <h1 className="contact__title">
                <i className="ri-mail-send-line"></i> Get In Touch
              </h1>
              <p className="contact__subtitle">
                Have a question or want to book a tour? We&apos;d love to hear from you!
              </p>
            </motion.div>
          </Col>
        </Row>

        <Row>
          <Col lg="8" className="mb-4">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="contact__form__wrapper"
            >
              <h3>Send Us a Message</h3>
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md="6">
                    <FormGroup>
                      <label>Full Name *</label>
                      <Input
                        type="text"
                        name="name"
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label>Email Address *</label>
                      <Input
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label>Phone Number</label>
                      <Input
                        type="tel"
                        name="phone"
                        placeholder="Enter your phone"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label>Subject *</label>
                      <Input
                        type="text"
                        name="subject"
                        placeholder="What's this about?"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                      />
                    </FormGroup>
                  </Col>
                  <Col md="12">
                    <FormGroup>
                      <label>Message *</label>
                      <Input
                        type="textarea"
                        name="message"
                        rows="6"
                        placeholder="Tell us more..."
                        value={formData.message}
                        onChange={handleChange}
                        required
                      />
                    </FormGroup>
                  </Col>
                  <Col md="12">
                    <motion.button
                      type="submit"
                      className="btn contact__submit__btn"
                      disabled={loading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {loading ? (
                        <>
                          <i className="ri-loader-4-line rotating"></i> Sending...
                        </>
                      ) : (
                        <>
                          <i className="ri-send-plane-fill"></i> Send Message
                        </>
                      )}
                    </motion.button>
                  </Col>
                </Row>
              </Form>
            </motion.div>
          </Col>

          <Col lg="4">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="contact__info__wrapper"
            >
              <h3>Contact Information</h3>

              <div className="contact__info__item">
                <div className="info__icon">
                  <i className="ri-map-pin-line"></i>
                </div>
                <div>
                  <h5>Address</h5>
                  <p>123 Travel Street, Adventure City, AC 12345</p>
                </div>
              </div>

              <div className="contact__info__item">
                <div className="info__icon">
                  <i className="ri-phone-line"></i>
                </div>
                <div>
                  <h5>Phone</h5>
                  <p>+1 (555) 123-4567</p>
                  <p>+1 (555) 765-4321</p>
                </div>
              </div>

              <div className="contact__info__item">
                <div className="info__icon">
                  <i className="ri-mail-line"></i>
                </div>
                <div>
                  <h5>Email</h5>
                  <p>info@horizon.com</p>
                  <p>support@horizon.com</p>
                </div>
              </div>

              <div className="contact__info__item">
                <div className="info__icon">
                  <i className="ri-time-line"></i>
                </div>
                <div>
                  <h5>Working Hours</h5>
                  <p>Mon - Fri: 9:00 AM - 6:00 PM</p>
                  <p>Sat: 10:00 AM - 4:00 PM</p>
                  <p>Sun: Closed</p>
                </div>
              </div>

              <div className="contact__social">
                <h5>Follow Us</h5>
                <div className="social__links">
                  <a href="https://www.facebook.com/horizontravel" target="_blank" rel="noopener noreferrer">
                    <i className="ri-facebook-fill"></i>
                  </a>
                  <a href="https://www.instagram.com/horizontravel" target="_blank" rel="noopener noreferrer">
                    <i className="ri-instagram-line"></i>
                  </a>
                  <a href="https://twitter.com/horizontravel" target="_blank" rel="noopener noreferrer">
                    <i className="ri-twitter-x-fill"></i>
                  </a>
                  <a href="https://www.linkedin.com/company/horizontravel" target="_blank" rel="noopener noreferrer">
                    <i className="ri-linkedin-fill"></i>
                  </a>
                </div>
              </div>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Contact;

