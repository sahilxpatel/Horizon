'use client';

import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Row } from 'reactstrap';
import { motion } from 'framer-motion';
import TourCard from '../../shared/Tourcard';
import { clearRecentlyViewed, getRecentlyViewed } from '../../utils/recentlyViewed';

const RecentlyViewed = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(getRecentlyViewed());
  }, []);

  const handleClear = () => {
    clearRecentlyViewed();
    setItems([]);
  };

  if (!items.length) return null;

  return (
    <section className="recently-viewed">
      <Container>
        <div className="recently-viewed__header d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
          <div>
            <h5 className="services__subtitle">Just for you</h5>
            <h2 className="featured__tour-title">Recently viewed tours</h2>
          </div>
          <Button color="light" className="recently-viewed__clear" onClick={handleClear}>
            Clear history
          </Button>
        </div>
        <Row className="mt-4">
          {items.map((tour, index) => (
            <Col lg="3" md="6" sm="6" className="mb-4" key={tour.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <TourCard tour={tour} />
              </motion.div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default RecentlyViewed;
