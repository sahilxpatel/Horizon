'use client';

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import CommonSection from '../../shared/CommonSection'
import TourCard from '../../shared/Tourcard'
// import SearchBar from '../../shared/SearchBar'
import Newsletter from '../../shared/Newsletter'
import CategoryFilter from '../Common/CategoryFilter'
import AdvancedFilters from '../Common/AdvancedFilters'
import SkeletonLoader from '../Common/SkeletonLoader'
import { Container, Row, Col, Input, Button } from 'reactstrap'
import { motion, AnimatePresence } from 'framer-motion'
import useFetch from '../../hooks/useFetch'
import { BASE_URL } from '../../utils/config'

const Tours = () => {

  const [pageCount, setPageCount] = useState(0);
  const [page, setPage] = useState(0);
  const [items, setItems] = useState([]); // accumulated tours for infinite scroll
  const [hasMore, setHasMore] = useState(true);
  const [isAppending, setIsAppending] = useState(false);
  const sentinelRef = useRef(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
  const [durationFilter, setDurationFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // grid or list

  const baseFields = 'id,title,slug,price,city,photo,category,duration,maxGroupSize,featured';
  const [sort, setSort] = useState('createdAt');
  
  const durationParams = useMemo(() => {
    if (durationFilter === 'short') return '&minDuration=1&maxDuration=3';
    if (durationFilter === 'medium') return '&minDuration=4&maxDuration=7';
    if (durationFilter === 'long') return '&minDuration=8';
    return '';
  }, [durationFilter]);

  const categoryUrl = `${BASE_URL}/tours/search/advanced?page=${page}&limit=8&category=${selectedCategory}&minPrice=${priceRange.min}&maxPrice=${priceRange.max}${durationParams}&sortBy=${sort.replace(/^-/, '')}&order=${sort.startsWith('-') ? 'desc' : 'asc'}`;

  const { data: apiTours, loading, error, refetch, result } = useFetch(categoryUrl, { initialData: [] })

  // Retry function for failed API calls
  const handleRetry = () => {
    refetch();
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setPage(0); // Reset to first page when category changes
  };


  // Items are now already filtered by the API
  const filteredItems = items;

  // Accumulate tours for infinite scroll when apiTours updates or category/page changes
  useEffect(() => {
    if (loading) return; // Wait for fetch to complete

    if (Array.isArray(apiTours) && apiTours.length > 0) {
      setItems(prev => {
        // If page is 0, start fresh
        if (page === 0) return apiTours;
        // Merge without duplicates
        const existingIds = new Set(prev.map(t => t.id || t._id || t.title));
        const merged = [...prev];
        apiTours.forEach(t => {
          const key = t.id || t._id || t.title;
          if (!existingIds.has(key)) merged.push(t);
        });
        return merged;
      });
      // Determine hasMore: if received less than limit (8), no more pages
      if (apiTours.length < 8) setHasMore(false);
      else setHasMore(true);
    } else {
      // If we got no data on a page > 0, we reached the end
      if (page > 0) setHasMore(false);
    }
    
    setIsAppending(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiTours, loading, page, selectedCategory]);

  // Reset when filters change
  useEffect(() => {
    setItems([]);
    setPage(0);
    setHasMore(true);
  }, [selectedCategory, priceRange, durationFilter, sort]);

  const loadNextPage = useCallback(() => {
    if (!hasMore || isAppending || loading) return;
    setIsAppending(true);
    setPage(p => p + 1);
  }, [hasMore, isAppending, loading]);

  // IntersectionObserver for sentinel
  useEffect(() => {
    if (!sentinelRef.current) return;
    const el = sentinelRef.current;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          loadNextPage();
        }
      });
    }, { rootMargin: '250px' });
    observer.observe(el);
    return () => observer.unobserve(el);
  }, [loadNextPage]);

  useEffect(() => {
    const totalTours = result?.total ?? 0;
    const pages = Math.ceil(totalTours / 8);
    setPageCount(pages);
    if (page === 0 && items.length > 0) window.scrollTo(0,0);
  }, [page, result, items.length]);


  return (
    <>
      <CommonSection title={"All Tours"} />
      <section>
        <Container>
          <Row>
            {/* <SearchBar /> */}
          </Row>
          <Row className='align-items-center gy-3'>
            <Col lg="8">
              <CategoryFilter 
                selectedCategory={selectedCategory} 
                onCategoryChange={handleCategoryChange} 
              />
            </Col>
            <Col lg="4" className='text-lg-end'>
              <div className='d-inline-flex align-items-center gap-2 sort-control'>
                <label htmlFor='sort' className='small text-muted m-0'>Sort by</label>
                <Input
                  type='select'
                  id='sort'
                  value={sort}
                  onChange={(e) => { setPage(0); setItems([]); setSort(e.target.value); }}
                  style={{ maxWidth: '220px' }}
                >
                  <option value='createdAt'>Newest</option>
                  <option value='-price'>Price: High to Low</option>
                  <option value='price'>Price: Low to High</option>
                  <option value='duration'>Duration</option>
                  <option value='-duration'>Duration (Desc)</option>
                </Input>
              </div>
            </Col>
          </Row>
          
          {/* Advanced Filters */}
          <Row className='mt-3'>
            <Col>
              <AdvancedFilters
                priceRange={priceRange}
                onPriceChange={setPriceRange}
                durationFilter={durationFilter}
                onDurationChange={setDurationFilter}
                onClearFilters={() => {
                  setPriceRange({ min: 0, max: 100000 });
                  setDurationFilter('all');
                }}
              />
            </Col>
          </Row>
        </Container>
      </section>
      <section className="pt-0">
        <Container>
          {loading && (
            <Row>
              {Array.from({ length: 8 }).map((_, index) => (
                <Col lg="3" md="6" sm="6" className="mb-4" key={index}>
                  <SkeletonLoader type="card" count={1} />
                </Col>
              ))}
            </Row>
          )}
          {error && (
            <motion.div 
              className="text-center pt-5 pb-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <i className="ri-error-warning-line" style={{ fontSize: '4rem', color: '#ff6b6b' }}></i>
              </motion.div>
              <h4 className="text-danger mt-3">Oops! Something went wrong</h4>
              <p className="text-muted mb-4">{error}</p>
              <p className="text-muted small">Please check your connection or try again later.</p>
              <Button 
                color="primary" 
                className="mt-3"
                onClick={handleRetry}
              >
                <i className="ri-refresh-line me-2"></i>
                Try Again
              </Button>
              <div className="mt-4">
                <p className="text-muted small">or browse our available destinations</p>
                <Button 
                  color="link" 
                  onClick={() => setSelectedCategory('all')}
                >
                  View All Categories
                </Button>
              </div>
            </motion.div>
          )}
          {
            !loading && !error && (filteredItems.length > 0) ? (
              <>
                {/* View Mode Toggle */}
                <Row className="mb-3">
                  <Col className="d-flex justify-content-end align-items-center gap-2">
                    <span className="text-muted small">View:</span>
                    <Button
                      size="sm"
                      color={viewMode === 'grid' ? 'primary' : 'light'}
                      onClick={() => setViewMode('grid')}
                    >
                      <i className="ri-grid-line"></i>
                    </Button>
                    <Button
                      size="sm"
                      color={viewMode === 'list' ? 'primary' : 'light'}
                      onClick={() => setViewMode('list')}
                    >
                      <i className="ri-list-check"></i>
                    </Button>
                  </Col>
                </Row>
                <Row>
                  <AnimatePresence>
                    {filteredItems.map((tour, index) => (
                      <Col 
                        lg={viewMode === 'grid' ? "3" : "12"} 
                        md={viewMode === 'grid' ? "6" : "12"} 
                        sm="6" 
                        className="mb-4" 
                        key={tour.id || tour._id || tour.title}
                      >
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                          <TourCard tour={tour} compact={viewMode === 'list'} />
                        </motion.div>
                      </Col>
                    ))}
                  </AnimatePresence>
                </Row>
                {/* Sentinel */}
                {hasMore && (
                  <div ref={sentinelRef} className="infinite-sentinel d-flex justify-content-center py-3">
                    {isAppending && <motion.span initial={{opacity:0}} animate={{opacity:1}} className="text-muted small">Loading more...</motion.span>}
                  </div>
                )}
                {/* Fallback pagination (accessible, hidden when infinite scroll is active) */}
                <div className="pagination d-none align-items-center justify-content-center mt-4 gap-3">
                  {[...Array(pageCount).keys()].map(number => (
                    <motion.button
                      key={number}
                      onClick={() => setPage(number)}
                      className={`page-btn ${page === number ? 'active__page':''}`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {number + 1}
                    </motion.button>
                  ))}
                </div>
              </>
            ) : (!loading && !error) && (
              <motion.div 
                className="text-center pt-5 pb-5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <i className="ri-compass-3-line" style={{ fontSize: '5rem', color: '#667eea', opacity: 0.5 }}></i>
                </motion.div>
                <h4 className="mt-3">No tours found</h4>
                <p className="text-muted">We couldn't find any tours matching your filters.</p>
                <div className="mt-4">
                  <Button 
                    color="primary" 
                    outline
                    onClick={() => {
                      setPriceRange({ min: 0, max: 100000 });
                      setDurationFilter('all');
                      setSelectedCategory('all');
                    }}
                  >
                    <i className="ri-refresh-line me-2"></i>
                    Clear All Filters
                  </Button>
                </div>
                <p className="text-muted small mt-4">or try browsing different categories</p>
              </motion.div>
            )
          }
          
        </Container>

      </section>
      <Newsletter/>
    </>
  )
}

export default Tours
