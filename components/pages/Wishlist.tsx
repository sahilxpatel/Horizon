'use client';

import React, { useContext } from 'react';
import { Container, Row, Col } from 'reactstrap';
import { motion } from 'framer-motion';
import { useWishlist } from '../../hooks/useWishlist';
import TourCard from '../../shared/Tourcard';
import { AuthContext } from '../../context/AuthContext';

const Wishlist = () => {
  const { wishlist } = useWishlist();
  const { user } = useContext(AuthContext);

  return (
    <section className="wishlist__section">
      <Container>
        <Row>
          <Col lg="12" className="mb-5">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="wishlist__header"
            >
              <h1 className="wishlist__title">
                <i className="ri-heart-fill"></i> My Wishlist
              </h1>
              <p className="wishlist__subtitle">
                {wishlist.length === 0
                  ? "Start adding tours to your wishlist"
                  : `${wishlist.length} tour${wishlist.length > 1 ? 's' : ''} saved for later`}
              </p>
              {!user && (
                <div className="wishlist__notice">
                  You&apos;re in guest mode. Sign in to sync your wishlist across devices.
                </div>
              )}
            </motion.div>
          </Col>
        </Row>

        {wishlist.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="empty__wishlist"
          >
            <div className="empty__content">
              <i className="ri-heart-line empty__icon"></i>
              <h3>Your wishlist is empty</h3>
              <p>Explore our amazing tours and save your favorites here</p>
              <motion.a
                href="/tours"
                className="btn explore__btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <i className="ri-compass-3-line"></i> Explore Tours
              </motion.a>
            </div>
          </motion.div>
        ) : (
          <Row>
            {wishlist.map((tour, index) => (
              <Col lg="3" md="6" sm="6" className="mb-4" key={tour.id || tour._id}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <TourCard tour={tour} />
                </motion.div>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </section>
  );
};

export default Wishlist;

