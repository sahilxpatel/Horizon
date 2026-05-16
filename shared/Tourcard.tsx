'use client';

import React, { useState } from 'react'
import { Card, CardBody } from 'reactstrap'
import Link from 'next/link'
import { motion } from 'framer-motion'
import calculateAvgRating from '../utils/avgRating'
import { useWishlist } from '../hooks/useWishlist'
import LazyImage from '../components/Common/LazyImage'
import { useComparison } from '../context/ComparisonContext'
import QuickViewModal from '../components/Common/QuickViewModal'

interface TourCardProps {
  tour: any;
  compact?: boolean;
}

const TourCard: React.FC<TourCardProps> = ({ tour, compact = false }) => {
  const { id, _id, title, city, photo, price, featured, reviews, maxGroupSize, category, duration } = tour;
  const tourId = id || _id;
  const { totalRating, avgRating } = calculateAvgRating(reviews);
  const resolvedAvgRating = typeof tour?.avgRating === 'number' ? tour.avgRating : avgRating;
  const reviewCount = Array.isArray(reviews)
    ? reviews.length
    : (typeof tour?.reviewCount === 'number' ? tour.reviewCount : 0);
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { toggle: toggleCompare, isSelected, max, items } = useComparison();
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  const handleWishlistClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleWishlist(tourId, tour);
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewOpen(true);
  };

  // Determine badge based on rating and reviews
  const getBadge = () => {
    if (featured) return { text: 'Featured', color: '#d4af37', icon: 'ri-star-fill' };
    if (avgRating >= 4.5 && reviews?.length >= 10) return { text: 'Popular', color: '#ff9800', icon: 'ri-fire-fill' };
    if (reviews?.length >= 15) return { text: 'Best Seller', color: '#4caf50', icon: 'ri-trophy-fill' };
    if (price < 10000) return { text: 'Budget Friendly', color: '#2196f3', icon: 'ri-price-tag-3-fill' };
    return null;
  };

  const badge = getBadge();

  return (
    <motion.div 
      className={`tour__card ${compact ? 'tour__card--compact':''}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
    >
      <Card>
        <motion.div 
          className='tour__img'
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          {/* Replaced img with LazyImage */}
          <LazyImage src={photo} alt={title} ratio={0.66} />
          
          {/* Enhanced Badge System */}
          {badge && (
            <motion.div
              className="tour__badge"
              style={{ backgroundColor: badge.color }}
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 20 }}
            >
              <i className={badge.icon}></i>
              <span>{badge.text}</span>
            </motion.div>
          )}

          {/* Wishlist Heart Button */}
          <motion.button
            className="wishlist__btn"
            onClick={handleWishlistClick}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <i className={`${isInWishlist(tourId) ? 'ri-heart-fill' : 'ri-heart-line'}`}></i>
          </motion.button>

          {/* Compare Toggle */}
          <motion.button
            type='button'
            className={`compare__btn ${isSelected(tourId) ? 'is-selected' : ''}`}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleCompare(tour); }}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            title={isSelected(tourId) ? 'Remove from comparison' : (items.length >= max ? 'Maximum items reached' : 'Add to comparison')}
            disabled={!isSelected(tourId) && items.length >= max}
          >
            <i className={isSelected(tourId) ? 'ri-checkbox-circle-fill' : 'ri-checkbox-blank-line'}></i>
          </motion.button>

          {/* Hover Overlay */}
          <motion.div 
            className="tour__overlay"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
          >
            <div className="overlay__content">
              <motion.button
                className="quick-view-btn"
                onClick={handleQuickView}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <i className="ri-eye-line"></i>
              </motion.button>
              <p>Quick View</p>
            </div>
          </motion.div>
        </motion.div>
        
        <CardBody>
          <div className="card__top d-flex align-items-center justify-content-between">
            <span className="tour__location d-flex align-items-center gap-1">
              <i className="ri-map-pin-line"></i>{city}
            </span>
            <span className="tour__rating d-flex align-items-center gap-1">
              <i className="ri-star-fill"></i>{resolvedAvgRating === 0 ? null : resolvedAvgRating}
              {reviewCount === 0 ? ('Not Rated') : (<span>({reviewCount})</span>)}
            </span>
          </div>
          
          <h5 className="tour__title">
            <Link href={`/tours/${tourId}`}>{title}</Link>
          </h5>

          {/* Additional Info */}
          {maxGroupSize && (
            <div className="tour__info">
              <span><i className="ri-group-line"></i> Max {maxGroupSize} people</span>
            </div>
          )}
          
          <div className="card__bottom d-flex flex-column gap-2 mt-3">
            <div className='d-flex align-items-center justify-content-between w-100'>
              <h5 className='mb-0'>₹{price?.toLocaleString('en-IN') || price} <span> /person</span></h5>
              <motion.button 
                className="btn booking__btn"
                whileHover={{ scale: 1.05, boxShadow: "0 8px 25px rgba(102, 126, 234, 0.4)" }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href={`/tours/${tourId}`}>Book</Link>
              </motion.button>
            </div>
            <div className='tour__meta small d-flex flex-wrap gap-2 text-muted'>
              {category && <span><i className='ri-price-tag-3-line'></i> {category}</span>}
              {duration && <span><i className='ri-time-line'></i> {duration}d</span>}
              {maxGroupSize && <span><i className='ri-group-line'></i> {maxGroupSize} ppl</span>}
            </div>
          </div>
        </CardBody>
      </Card>
      
      {/* Quick View Modal */}
      <QuickViewModal 
        tour={tour} 
        isOpen={quickViewOpen} 
        toggle={() => setQuickViewOpen(false)} 
      />
    </motion.div>
  )
}

export default React.memo(TourCard)

