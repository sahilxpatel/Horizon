'use client';

import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Row, Col, Badge } from 'reactstrap';
import Link from 'next/link';
import { motion } from 'framer-motion';
import calculateAvgRating from '../../utils/avgRating';
import { getImageSrc } from '../../lib/image';

const QuickViewModal = ({ tour, isOpen, toggle }) => {
  if (!tour) return null;

  const { 
    id,
    _id,
    title, 
    city, 
    photo, 
    price, 
    featured, 
    reviews, 
    maxGroupSize, 
    category, 
    duration, 
    desc,
    distance,
    address 
  } = tour;
  
  const { totalRating, avgRating } = calculateAvgRating(reviews);
  const tourId = id || _id;

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg" className="quick-view-modal">
      <ModalHeader toggle={toggle} className="border-0">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="d-flex align-items-center gap-2"
        >
          <i className="ri-eye-line" style={{ color: 'var(--secondary-color)' }}></i>
          Quick View
        </motion.div>
      </ModalHeader>
      
      <ModalBody>
        <Row>
          {/* Tour Image */}
          <Col md="5">
            <motion.div 
              className="quick-view-image"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <img src={getImageSrc(photo)} alt={title} />
              {featured && (
                <Badge color="warning" className="featured-badge">
                  <i className="ri-star-fill me-1"></i>
                  Featured
                </Badge>
              )}
            </motion.div>
          </Col>

          {/* Tour Details */}
          <Col md="7">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <h3 className="tour-title">{title}</h3>
              
              {/* Rating */}
              <div className="d-flex align-items-center gap-2 mb-3">
                <div className="rating-badge">
                  <i className="ri-star-fill" style={{ color: '#ffa726' }}></i>
                  <span className="ms-1">{avgRating === 0 ? 'New' : avgRating}</span>
                </div>
                {totalRating > 0 && (
                  <span className="text-muted small">({reviews?.length} reviews)</span>
                )}
                <Badge color="info" pill className="ms-2">
                  {category || 'Adventure'}
                </Badge>
              </div>

              {/* Location */}
              <div className="info-item">
                <i className="ri-map-pin-line"></i>
                <span>{city}</span>
              </div>

              {/* Description */}
              <p className="tour-description">
                {desc?.substring(0, 200)}
                {desc?.length > 200 && '...'}
              </p>

              {/* Tour Info Grid */}
              <div className="tour-info-grid">
                <div className="info-card">
                  <i className="ri-time-line"></i>
                  <div>
                    <small className="text-muted">Duration</small>
                    <p className="mb-0 fw-semibold">{duration} days</p>
                  </div>
                </div>
                
                <div className="info-card">
                  <i className="ri-group-line"></i>
                  <div>
                    <small className="text-muted">Group Size</small>
                    <p className="mb-0 fw-semibold">{maxGroupSize} people</p>
                  </div>
                </div>

                {distance && (
                  <div className="info-card">
                    <i className="ri-road-map-line"></i>
                    <div>
                      <small className="text-muted">Distance</small>
                      <p className="mb-0 fw-semibold">{distance} km</p>
                    </div>
                  </div>
                )}

                {address && (
                  <div className="info-card">
                    <i className="ri-map-pin-user-line"></i>
                    <div>
                      <small className="text-muted">Location</small>
                      <p className="mb-0 fw-semibold">{address}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Price */}
              <div className="price-section mt-4">
                <span className="price-label">Starting from</span>
                <h2 className="tour-price">
                  ₹{price?.toLocaleString()}
                  <span className="price-per">/person</span>
                </h2>
              </div>
            </motion.div>
          </Col>
        </Row>
      </ModalBody>

      <ModalFooter className="border-0 justify-content-between">
        <Button color="light" onClick={toggle}>
          Close
        </Button>
        <Link href={`/tours/${tourId}`} className="btn btn-primary">
          View Full Details
          <i className="ri-arrow-right-line ms-2"></i>
        </Link>
      </ModalFooter>
    </Modal>
  );
};

export default QuickViewModal;
