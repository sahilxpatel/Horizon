'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ToursAPI } from '../../services/apiClient';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const DEBOUNCE_MS = 400;

const GlobalTextSearch = () => {
  const [q, setQ] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(null);
  const timerRef = useRef(null);
  const boxRef = useRef(null);
  const router = useRouter();

  const runSearch = useCallback((term) => {
    if (!term || term.trim().length < 2) { setResults([]); return; }
    setLoading(true); setError(null);
    ToursAPI.textSearch(term, 0, 5)
      .then(res => setResults(res.data.data || []))
      .catch(e => setError(e.message || 'Search failed'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => runSearch(q), DEBOUNCE_MS);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [q, runSearch]);

  useEffect(() => {
    const onClick = (e) => { if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false); };
    window.addEventListener('click', onClick);
    return () => window.removeEventListener('click', onClick);
  }, []);

  const select = (tour) => {
    setOpen(false); setQ('');
    const id = tour.id || tour._id;
    router.push(`/tours/${id}`);
  };

  return (
    <div className='global-text-search' ref={boxRef}>
      <input
        type='search'
        placeholder='Search tours...'
        value={q}
        onChange={e => { setQ(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
      />
      <AnimatePresence>
        {open && (q.trim().length >= 2) && (
          <motion.div
            className='gts-dropdown'
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
          >
            {loading && <div className='gts-status'>Searching...</div>}
            {error && <div className='gts-status error'>{error}</div>}
            {!loading && !error && results.length === 0 && <div className='gts-status'>No matches</div>}
            <ul>
              {results.map(r => (
                <li key={r.id || r._id} onClick={() => select(r)}>
                  <span className='gts-title'>{r.title}</span>
                  {r.city && <span className='gts-meta'>{r.city}</span>}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GlobalTextSearch;
