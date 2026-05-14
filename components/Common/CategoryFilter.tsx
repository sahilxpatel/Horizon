'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const categories = [
  { name: 'All',       value: 'all',        icon: 'ri-global-line',           color: '#667eea' },
  { name: 'Adventure', value: 'Adventure',  icon: 'ri-compass-3-line',         color: '#ff6348' },
  { name: 'Beach',     value: 'Beach',      icon: 'ri-ship-line',              color: '#00d2d3' },
  { name: 'City',      value: 'City',       icon: 'ri-building-line',          color: '#5f27cd' },
  { name: 'Cultural',  value: 'Cultural',   icon: 'ri-ancient-gate-line',      color: '#ff9f43' },
  { name: 'Family',    value: 'Family',     icon: 'ri-team-line',              color: '#ee5a6f' },
  { name: 'Hiking',    value: 'Hiking',     icon: 'ri-walk-line',              color: '#10ac84' },
  { name: 'Luxury',    value: 'Luxury',     icon: 'ri-vip-crown-line',         color: '#feca57' },
  { name: 'Nature',    value: 'Nature',     icon: 'ri-leaf-line',              color: '#1dd1a1' },
  { name: 'Religious', value: 'Religious',  icon: 'ri-ancient-pavilion-line',  color: '#ff6b81' },
  { name: 'Safari',    value: 'Safari',     icon: 'ri-camera-lens-line',       color: '#f0932b' },
  { name: 'Wildlife',  value: 'Wildlife',   icon: 'ri-bear-smile-line',        color: '#6ab04c' },
  { name: 'Weekend',   value: 'Weekend',    icon: 'ri-calendar-2-line',        color: '#4834d4' },
];

const CategoryFilter = ({ selectedCategory, onCategoryChange }: { selectedCategory: string; onCategoryChange: (category: string) => void }) => {
  const [isScrollable, setIsScrollable] = useState(false);

  useEffect(() => {
    const checkScrollable = () => {
      const container = document.querySelector('.category__filter__container');
      if (container) {
        setIsScrollable(container.scrollWidth > container.clientWidth);
      }
    };
    checkScrollable();
    window.addEventListener('resize', checkScrollable);
    return () => window.removeEventListener('resize', checkScrollable);
  }, []);

  return (
    <div className="category__filter__wrapper">
      <div className={`category__filter__container ${isScrollable ? 'scrollable' : ''}`}>
        {categories.map((category, index) => (
          <motion.button
            key={category.value}
            className={`category__btn ${selectedCategory === category.value ? 'active' : ''}`}
            onClick={() => onCategoryChange(category.value)}
            style={{ '--category-color': category.color } as React.CSSProperties}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <i className={category.icon}></i>
            <span>{category.name}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
