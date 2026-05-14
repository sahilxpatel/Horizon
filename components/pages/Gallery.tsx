'use client';

import React, { useState, useMemo } from 'react';
import { Container, Row, Col } from 'reactstrap';
import { motion, AnimatePresence } from 'framer-motion';
import CommonSection from '../../shared/CommonSection';
import Newsletter from '../../shared/Newsletter';
import useFetch from '../../hooks/useFetch';
import { BASE_URL } from '../../utils/config';
import calculateAvgRating from '../../utils/avgRating';
import toursData from '../../assets/data/tours';
import { getImageSrc } from '../../lib/image';
import LazyImage from '../Common/LazyImage';
import { useEffect } from 'react';

const categories = [
  { 
    id: "all", 
    label: "All Destinations", 
    icon: "ri-global-line",
    predicate: () => true 
  },
  { 
    id: "adventure", 
    label: "Adventure", 
    icon: "ri-mountain-line",
    predicate: (tour) => tour.category === 'Adventure'
  },
  { 
    id: "family", 
    label: "Family Tours", 
    icon: "ri-team-line",
    predicate: (tour) => tour.category === 'Family'
  },
  { 
    id: "luxury", 
    label: "Luxury", 
    icon: "ri-vip-crown-line",
    predicate: (tour) => tour.category === 'Luxury'
  },
  { 
    id: "weekend", 
    label: "Weekend Getaways", 
    icon: "ri-suitcase-line",
    predicate: (tour) => tour.category === 'Weekend'
  },
  { 
    id: "popular", 
    label: "Popular", 
    icon: "ri-star-line",
    predicate: (tour) => (tour.avgRating || 0) >= 4.7 
  },
];

const Gallery = () => {
  const { data, loading } = useFetch(`${BASE_URL}/tours/search/advanced?limit=100&sortBy=avgRating&order=desc`);
  const [activeCategory, setActiveCategory] = useState("all");
  const [viewMode, setViewMode] = useState("grid"); 
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const tours = useMemo(() => {
    const sourceData = (Array.isArray(data) && data.length > 0) ? data : toursData;
    
    if (!Array.isArray(sourceData)) {
      return [];
    }
    return sourceData.map((tour) => {
      if (typeof tour.avgRating === "number") {
        return tour;
      }
      const { avgRating } = calculateAvgRating(tour.reviews || []);
      return { ...tour, avgRating };
    });
  }, [data]);

  const filtered = useMemo(() => {
    const category = categories.find((item) => item.id === activeCategory) || categories[0];
    return tours.filter(category.predicate);
  }, [activeCategory, tours]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  return (
    <>
      <CommonSection title="Travel Gallery" />
      
      <section className="gallery__section">
        <Container>
          {/* Gallery Header */}
          <motion.div 
            className="gallery__header"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="gallery__header__content">
              <h2>Explore Our Destinations</h2>
              <p>Discover breathtaking places and create unforgettable memories</p>
            </div>
            
            <div className="gallery__view__toggle">
              <motion.button
                className={`view__btn ${viewMode === 'masonry' ? 'active' : ''}`}
                onClick={() => setViewMode('masonry')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <i className="ri-layout-masonry-line"></i>
              </motion.button>
              <motion.button
                className={`view__btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <i className="ri-grid-line"></i>
              </motion.button>
            </div>
          </motion.div>

          {/* Category Filters */}
          <motion.div 
            className="gallery__filters"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="filters__container">
              {categories.map((category, index) => (
                <motion.button
                  key={category.id}
                  className={`filter__btn ${category.id === activeCategory ? 'active' : ''}`}
                  onClick={() => setActiveCategory(category.id)}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <i className={category.icon}></i>
                  <span>{category.label}</span>
                  <span className="count">{tours.filter(category.predicate).length}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Gallery Grid */}
          <motion.div 
            className="gallery__content"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {!isMounted ? (
              <div className="gallery__loading">
                <p>Initializing gallery...</p>
              </div>
            ) : loading && tours.length === 0 ? (
              <div className="gallery__loading">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p>Loading gallery...</p>
              </div>
            ) : filtered.length === 0 ? (
              <motion.div 
                className="gallery__empty"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <i className="ri-image-line"></i>
                <h4>No tours found</h4>
                <p>Try selecting a different category</p>
              </motion.div>
            ) : (
              <div className={`gallery__grid ${viewMode}`}>
                {viewMode === 'masonry' ? (
                  <div className="masonry-columns">
                    <AnimatePresence>
                      {filtered.map((tour, index) => (
                        <motion.div
                          key={tour._id || tour.id}
                          className="gallery__item"
                          variants={itemVariants}
                          initial="hidden"
                          animate="visible"
                          exit={{ opacity: 0, scale: 0.8 }}
                          whileHover={{ y: -10 }}
                        >
                          <div className="gallery__item__inner">
                            <div className="gallery__image">
                              <LazyImage 
                                src={tour.photo} 
                                alt={tour.title}
                                ratio={index % 3 === 0 ? 0.7 : index % 2 === 0 ? 1.2 : 0.9}
                                className="w-100 h-100"
                              />
                              <div className="gallery__overlay">
                                <div className="overlay__content">
                                  <h5>{tour.title}</h5>
                                  <div className="tour__meta">
                                    <span className="location">
                                      <i className="ri-map-pin-line"></i>
                                      {tour.city}
                                    </span>
                                    <span className="rating">
                                      <i className="ri-star-fill"></i>
                                      {tour.avgRating || "New"}
                                    </span>
                                  </div>
                                  <div className="tour__details">
                                    <span className="price">₹{tour.price?.toLocaleString()}</span>
                                    <span className="distance">{tour.distance} km</span>
                                  </div>
                                  <motion.button 
                                    className="view__tour__btn"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => window.location.href = `/tours/${tour._id || tour.id}`}
                                  >
                                    View Details
                                    <i className="ri-arrow-right-line"></i>
                                  </motion.button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Row>
                    <AnimatePresence>
                      {filtered.map((tour, index) => (
                        <Col lg="3" md="4" sm="6" key={tour._id || tour.id}>
                          <motion.div
                            className="gallery__item"
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                            exit={{ opacity: 0, scale: 0.8 }}
                            whileHover={{ y: -10 }}
                          >
                            <div className="gallery__item__inner">
                              <div className="gallery__image">
                                <LazyImage 
                                  src={tour.photo} 
                                  alt={tour.title}
                                  ratio={0.75}
                                  className="w-100 h-100"
                                />
                                <div className="gallery__overlay">
                                  <div className="overlay__content">
                                    <h5>{tour.title}</h5>
                                    <div className="tour__meta">
                                      <span className="location">
                                        <i className="ri-map-pin-line"></i>
                                        {tour.city}
                                      </span>
                                      <span className="rating">
                                        <i className="ri-star-fill"></i>
                                        {tour.avgRating || "New"}
                                      </span>
                                    </div>
                                    <div className="tour__details">
                                      <span className="price">₹{tour.price?.toLocaleString()}</span>
                                      <span className="distance">{tour.distance} km</span>
                                    </div>
                                    <motion.button 
                                      className="view__tour__btn"
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                      onClick={() => window.location.href = `/tours/${tour._id || tour.id}`}
                                    >
                                      View Details
                                      <i className="ri-arrow-right-line"></i>
                                    </motion.button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        </Col>
                      ))}
                    </AnimatePresence>
                  </Row>
                )}
              </div>
            )}
          </motion.div>

          {/* Gallery Stats */}
          {filtered.length > 0 && (
            <motion.div 
              className="gallery__stats"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="stat__item">
                <i className="ri-image-line"></i>
                <div>
                  <h4>{filtered.length}</h4>
                  <p>Destinations</p>
                </div>
              </div>
              <div className="stat__item">
                <i className="ri-map-pin-line"></i>
                <div>
                  <h4>{[...new Set(filtered.map(t => t.city))].length}</h4>
                  <p>Cities</p>
                </div>
              </div>
              <div className="stat__item">
                <i className="ri-star-fill"></i>
                <div>
                  <h4>{(filtered.reduce((sum, t) => sum + (t.avgRating || 0), 0) / filtered.length).toFixed(1)}</h4>
                  <p>Avg Rating</p>
                </div>
              </div>
              <div className="stat__item">
                <i className="ri-money-rupee-circle-line"></i>
                <div>
                  <h4>₹{Math.min(...filtered.map(t => t.price)).toLocaleString()}</h4>
                  <p>Starting From</p>
                </div>
              </div>
            </motion.div>
          )}
        </Container>
      </section>

      <Newsletter />
    </>
  );
};

export default Gallery;
