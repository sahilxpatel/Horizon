'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useComparison } from '../../context/ComparisonContext';
import { motion, AnimatePresence } from 'framer-motion';

const ComparisonBar = () => {
  const { items, remove, clear, max } = useComparison();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  if (items.length === 0) return null;

  return (
    <>
      <AnimatePresence>
        <motion.div
          className={`comparison-bar ${open ? 'is-open':''}`}
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 24 }}
        >
          <button className='comparison-bar__toggle' onClick={() => setOpen(o=>!o)} aria-expanded={open}>
            <i className='ri-scales-2-line'></i> Compare ({items.length}/{max})
            <i className={`ri-arrow-${open ? 'down':'up'}-s-line ms-2`}></i>
          </button>
          {open && (
            <div className='comparison-bar__content'>
              <div className='comparison-bar__items'>
                {items.map(t => {
                  const itemId = t.id || t._id;
                  return (
                    <motion.div key={itemId} className='comparison-chip' layout>
                      <span className='comparison-chip__title'>{t.title}</span>
                      <button className='comparison-chip__remove' onClick={() => remove(itemId)} aria-label={`Remove ${t.title} from comparison`}>&times;</button>
                    </motion.div>
                  );
                })}
              </div>
              <div className='comparison-bar__actions'>
                <button className='btn btn-sm btn-outline-secondary' onClick={clear}>Clear</button>
                <button
                  className='btn btn-sm primary__btn'
                  disabled={items.length < 2}
                  onClick={() => router.push('/compare')}
                >
                  View Comparison
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default ComparisonBar;
