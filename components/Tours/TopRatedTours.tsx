'use client';

import React, { useEffect, useState } from 'react';
import { ToursAPI } from '../../services/apiClient';
import { Row, Col } from 'reactstrap';
import TourCard from '../../shared/Tourcard';
import SkeletonBox from '../Common/SkeletonBox';

const TopRatedTours = ({ limit = 5 }) => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    ToursAPI.getTopRated(limit)
      .then(res => { if(isMounted) setTours(res.data.data || []); })
      .catch(e => { if(isMounted) setError(e.message || 'Failed to load'); })
      .finally(() => isMounted && setLoading(false));
    return () => { isMounted = false; }
  }, [limit]);

  if (loading) return (
    <Row className='g-4'>
      {Array.from({ length: limit }).map((_, i) => (
        <Col key={i} lg="3" md="4" sm="6" xs="12">
          <SkeletonBox height={200} />
          <div className='mt-2'><SkeletonBox height={16} /></div>
        </Col>
      ))}
    </Row>
  );
  if (error) return <p className='text-danger small'>{error}</p>;
  if (!tours.length) return <p className='small text-muted'>No rated tours yet.</p>;

  return (
    <Row className='g-4'>
      {tours.map(t => (
        <Col key={t.id || t._id} lg="3" md="4" sm="6" xs="12">
          <TourCard tour={t} />
        </Col>
      ))}
    </Row>
  );
};

export default TopRatedTours;

