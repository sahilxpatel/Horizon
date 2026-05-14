'use client';

import React from 'react';
import { Button, Col, Container, Row } from 'reactstrap';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useComparison } from '../../context/ComparisonContext';
import { getImageSrc } from '../../lib/image';

const CompareTours = () => {
  const { items, remove, clear } = useComparison();
  const hasItems = items.length > 0;
  const hasEnough = items.length >= 2;

  return (
    <section className="compare__section">
      <Container>
        <div className="compare__header">
          <div>
            <h1>Compare tours</h1>
            <p>See the differences side by side and pick the best fit.</p>
          </div>
          <div className="compare__actions">
            <Link href="/tours" className="btn btn-outline-secondary">
              Browse tours
            </Link>
            {hasItems && (
              <Button color="light" onClick={clear}>
                Clear all
              </Button>
            )}
          </div>
        </div>

        {!hasItems && (
          <div className="compare__empty">
            <i className="ri-scales-2-line"></i>
            <h3>No tours to compare yet</h3>
            <p>Add at least two tours to start comparing them here.</p>
            <Link href="/tours" className="btn primary__btn">
              Explore tours
            </Link>
          </div>
        )}

        {hasItems && (
          <>
            <Row className="compare__cards">
              {items.map((tour, index) => (
                <Col lg="4" md="6" className="mb-4" key={tour.id}>
                  <motion.div
                    className="compare__card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <div className="compare__card__image">
                      {tour.photo ? (
                        <img src={getImageSrc(tour.photo)} alt={tour.title} />
                      ) : (
                        <div className="compare__card__placeholder">
                          <i className="ri-image-line"></i>
                        </div>
                      )}
                    </div>
                    <div className="compare__card__body">
                      <h4>{tour.title}</h4>
                      <p>{tour.city || 'Destination'}</p>
                      <div className="compare__card__meta">
                        <span>₹{Number(tour.price || 0).toLocaleString('en-IN')}</span>
                        {tour.duration && <span>{tour.duration} days</span>}
                      </div>
                    </div>
                    <div className="compare__card__actions">
                      <Link href={`/tours/${tour.id}`} className="btn btn-sm primary__btn">
                        View tour
                      </Link>
                      <Button color="light" size="sm" onClick={() => remove(tour.id)}>
                        Remove
                      </Button>
                    </div>
                  </motion.div>
                </Col>
              ))}
            </Row>

            {!hasEnough && (
              <div className="compare__hint">
                Add at least one more tour to unlock the full comparison table.
              </div>
            )}

            {hasEnough && (
              <div className="compare__table-wrapper">
                <table className="table compare__table">
                  <thead>
                    <tr>
                      <th>Attribute</th>
                      {items.map((tour) => (
                        <th key={tour.id}>{tour.title}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Price</td>
                      {items.map((tour) => (
                        <td key={tour.id}>₹{Number(tour.price || 0).toLocaleString('en-IN')}</td>
                      ))}
                    </tr>
                    <tr>
                      <td>City</td>
                      {items.map((tour) => (
                        <td key={tour.id}>{tour.city || '-'}</td>
                      ))}
                    </tr>
                    <tr>
                      <td>Category</td>
                      {items.map((tour) => (
                        <td key={tour.id}>{tour.category || '-'}</td>
                      ))}
                    </tr>
                    <tr>
                      <td>Duration</td>
                      {items.map((tour) => (
                        <td key={tour.id}>{tour.duration ? `${tour.duration} days` : '-'}</td>
                      ))}
                    </tr>
                    <tr>
                      <td>Max group size</td>
                      {items.map((tour) => (
                        <td key={tour.id}>{tour.maxGroupSize || '-'}</td>
                      ))}
                    </tr>
                    <tr>
                      <td>Featured</td>
                      {items.map((tour) => (
                        <td key={tour.id}>{tour.featured ? 'Yes' : 'No'}</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </Container>
    </section>
  );
};

export default CompareTours;
