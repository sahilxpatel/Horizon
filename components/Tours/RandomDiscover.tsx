'use client';

import React, { useState } from 'react';
import { ToursAPI } from '../../services/apiClient';
import { Button, Spinner } from 'reactstrap';
import TourCard from '../../shared/Tourcard';

const RandomDiscover = ({ limit=3 }) => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRandom = () => {
    setLoading(true); setError(null);
    ToursAPI.getRandom(limit)
      .then(res => setTours(res.data.data || []))
      .catch(e => setError(e.message || 'Failed'))
      .finally(() => setLoading(false));
  };

  return (
    <div className='random-discover-box'>
      <div className='d-flex justify-content-between align-items-center mb-2'>
        <h6 className='mb-0'>Discover Random</h6>
        <Button size='sm' color='primary' onClick={fetchRandom} disabled={loading}>
          {loading ? <Spinner size='sm' /> : 'Shuffle'}
        </Button>
      </div>
      {error && <p className='text-danger small'>{error}</p>}
      {!tours.length && !loading && <p className='small text-muted'>Click shuffle to explore.</p>}
      <div className='d-flex flex-column gap-2'>
        {tours.map(t => <TourCard key={t.id || t._id} tour={t} compact />)}
      </div>
    </div>
  );
};

export default RandomDiscover;
