'use client';

import calculateAvgRating from './avgRating';

const STORAGE_KEY = 'horizon_recently_viewed_v1';
const MAX_ITEMS = 6;

const canUseStorage = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const normalizeTour = (tour) => {
  const id = tour?.id || tour?._id;
  if (!id) return null;

  const { avgRating } = calculateAvgRating(tour?.reviews || []);
  const reviewCount = Array.isArray(tour?.reviews) ? tour.reviews.length : 0;

  return {
    id,
    title: tour?.title || 'Tour',
    city: tour?.city || '',
    price: tour?.price ?? 0,
    photo: tour?.photo || '',
    category: tour?.category || '',
    duration: tour?.duration ?? null,
    maxGroupSize: tour?.maxGroupSize ?? null,
    featured: Boolean(tour?.featured),
    avgRating,
    reviewCount
  };
};

export const getRecentlyViewed = () => {
  if (!canUseStorage()) return [];
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn('Failed to load recently viewed tours', error);
    return [];
  }
};

export const setRecentlyViewed = (items) => {
  if (!canUseStorage()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.warn('Failed to save recently viewed tours', error);
  }
};

export const addRecentlyViewed = (tour) => {
  const item = normalizeTour(tour);
  if (!item || !canUseStorage()) return [];

  const existing = getRecentlyViewed();
  const filtered = existing.filter((t) => t.id !== item.id);
  const next = [item, ...filtered].slice(0, MAX_ITEMS);
  setRecentlyViewed(next);
  return next;
};

export const clearRecentlyViewed = () => {
  if (!canUseStorage()) return;
  window.localStorage.removeItem(STORAGE_KEY);
};
