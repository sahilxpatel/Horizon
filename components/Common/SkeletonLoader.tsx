'use client';

import React from 'react';
import { motion } from 'framer-motion';

const SkeletonLoader = ({ type = 'card', count = 1 }) => {
  const renderCardSkeleton = () => (
    <div className="skeleton-card">
      <div className="skeleton-image"></div>
      <div className="skeleton-content">
        <div className="skeleton-line skeleton-title"></div>
        <div className="skeleton-line skeleton-text"></div>
        <div className="skeleton-line skeleton-text short"></div>
        <div className="skeleton-footer">
          <div className="skeleton-line skeleton-price"></div>
          <div className="skeleton-button"></div>
        </div>
      </div>
    </div>
  );

  const renderListSkeleton = () => (
    <div className="skeleton-list">
      <div className="skeleton-list-image"></div>
      <div className="skeleton-list-content">
        <div className="skeleton-line skeleton-title"></div>
        <div className="skeleton-line skeleton-text"></div>
        <div className="skeleton-line skeleton-text"></div>
        <div className="skeleton-line skeleton-price"></div>
      </div>
    </div>
  );

  const renderDetailsSkeleton = () => (
    <div className="skeleton-details">
      <div className="skeleton-details-image"></div>
      <div className="skeleton-line skeleton-title large"></div>
      <div className="skeleton-line skeleton-text"></div>
      <div className="skeleton-line skeleton-text"></div>
      <div className="skeleton-line skeleton-text short"></div>
      <div className="skeleton-info-grid">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="skeleton-info-card">
            <div className="skeleton-circle"></div>
            <div className="skeleton-line skeleton-text"></div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSkeleton = () => {
    switch (type) {
      case 'list':
        return renderListSkeleton();
      case 'details':
        return renderDetailsSkeleton();
      case 'card':
      default:
        return renderCardSkeleton();
    }
  };

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="skeleton-wrapper"
        >
          {renderSkeleton()}
        </motion.div>
      ))}
    </>
  );
};

export default SkeletonLoader;

