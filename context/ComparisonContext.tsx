'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

interface ComparisonContextValue {
  items: any[];
  add: (tour: any) => void;
  remove: (id: any) => void;
  toggle: (tour: any) => void;
  clear: () => void;
  isSelected: (id: any) => boolean;
  max: number;
}

const ComparisonContext = createContext<ComparisonContextValue>({
  items: [],
  add: () => {},
  remove: () => {},
  toggle: () => {},
  clear: () => {},
  isSelected: () => false,
  max: 3
});

const MAX_COMPARE = 3;
const STORAGE_KEY = 'horizon_compare_v1';

const getTourId = (tour) => tour?.id || tour?._id || null;

const normalizeItem = (tour) => {
  const id = getTourId(tour);
  if (!id) return null;
  return {
    id,
    title: tour?.title || 'Tour',
    price: tour?.price ?? 0,
    city: tour?.city || '',
    category: tour?.category || '',
    duration: tour?.duration ?? null,
    maxGroupSize: tour?.maxGroupSize ?? null,
    featured: Boolean(tour?.featured),
    photo: tour?.photo || ''
  };
};

export const ComparisonProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return;
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        setItems(parsed.slice(0, MAX_COMPARE));
      }
    } catch (error) {
      console.warn('Failed to load comparison items', error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.warn('Failed to save comparison items', error);
    }
  }, [items]);

  const add = useCallback((tour) => {
    const item = normalizeItem(tour);
    if (!item) return;
    setItems((prev) => {
      if (prev.find((t) => getTourId(t) === item.id) || prev.length >= MAX_COMPARE) return prev;
      return [...prev, item];
    });
  }, []);

  const remove = useCallback((id) => {
    setItems((prev) => prev.filter((t) => getTourId(t) !== id));
  }, []);

  const toggle = useCallback((tour) => {
    const item = normalizeItem(tour);
    if (!item) return;
    setItems((prev) => {
      const exists = prev.find((t) => getTourId(t) === item.id);
      if (exists) return prev.filter((t) => getTourId(t) !== item.id);
      if (prev.length >= MAX_COMPARE) return prev;
      return [...prev, item];
    });
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const isSelected = useCallback((id) => items.some((t) => getTourId(t) === id), [items]);

  const value = useMemo(
    () => ({ items, add, remove, toggle, clear, isSelected, max: MAX_COMPARE }),
    [items, add, remove, toggle, clear, isSelected]
  );

  return <ComparisonContext.Provider value={value}>{children}</ComparisonContext.Provider>;
};

export const useComparison = () => useContext(ComparisonContext);

