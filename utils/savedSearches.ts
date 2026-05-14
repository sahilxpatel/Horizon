'use client';

const STORAGE_KEY = 'horizon_saved_searches_v1';
const MAX_SAVED = 6;

const canUseStorage = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const sanitizeParams = (params) => {
  const cleaned = {};
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    cleaned[key] = String(value);
  });
  return cleaned;
};

export const buildSearchLabel = (params) => {
  const city = params.city ? `in ${params.city}` : '';
  const keyword = params.keyword ? params.keyword : 'Any experience';
  const featured = params.featured === 'true' ? 'Featured' : '';
  const minRating = params.minRating ? `${params.minRating}+ stars` : '';
  const pieces = [keyword, city, featured, minRating].filter(Boolean);
  return pieces.join(' · ') || 'Saved search';
};

export const getSavedSearches = () => {
  if (!canUseStorage()) return [];
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn('Failed to load saved searches', error);
    return [];
  }
};

export const saveSearch = (params, label) => {
  if (!canUseStorage()) return [];
  const cleaned = sanitizeParams(params);
  const existing = getSavedSearches();
  const nextLabel = label || buildSearchLabel(cleaned);
  const id = `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
  const next = [{ id, label: nextLabel, params: cleaned, createdAt: new Date().toISOString() }, ...existing]
    .slice(0, MAX_SAVED);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
};

export const removeSavedSearch = (id) => {
  if (!canUseStorage()) return [];
  const existing = getSavedSearches();
  const next = existing.filter((item) => item.id !== id);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
};

export const clearSavedSearches = () => {
  if (!canUseStorage()) return [];
  window.localStorage.removeItem(STORAGE_KEY);
  return [];
};
