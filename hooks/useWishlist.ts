'use client';

import { useState, useEffect, useContext, useCallback, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';

import { BASE_URL } from '../utils/config';
import { buildAuthHeaders, hasClientAuthToken } from '../utils/auth';

type WishlistItem = {
  id?: string;
  _id?: string;
  title?: string;
  city?: string;
  price?: number;
  photo?: string;
  category?: string;
  duration?: number | null;
  maxGroupSize?: number | null;
  featured?: boolean;
  reviews?: Array<{ rating?: number }>;
};

const GUEST_WISHLIST_KEY = 'horizon_guest_wishlist_v1';
const MAX_GUEST_ITEMS = 50;

const canUseStorage = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const normalizeGuestTour = (tour?: WishlistItem | null, tourId?: string) => {
  const id = tourId || tour?.id || tour?._id;
  if (!id) return null;

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
    reviews: Array.isArray(tour?.reviews) ? tour.reviews : []
  };
};

const readGuestWishlist = (): WishlistItem[] => {
  if (!canUseStorage()) return [];
  try {
    const stored = window.localStorage.getItem(GUEST_WISHLIST_KEY);
    const parsed = stored ? JSON.parse(stored) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn('Failed to read guest wishlist', error);
    return [];
  }
};

const writeGuestWishlist = (items: WishlistItem[]) => {
  if (!canUseStorage()) return;
  try {
    window.localStorage.setItem(GUEST_WISHLIST_KEY, JSON.stringify(items));
  } catch (error) {
    console.warn('Failed to write guest wishlist', error);
  }
};

const clearGuestWishlist = () => {
  if (!canUseStorage()) return;
  window.localStorage.removeItem(GUEST_WISHLIST_KEY);
};

export const useWishlist = () => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());
  const { user, token, dispatch } = useContext(AuthContext);
  const syncRef = useRef(false);
  const hasServerAuth = hasClientAuthToken() && Boolean(token);

  const loadGuestWishlist = useCallback(() => {
    const items = readGuestWishlist();
    setWishlist(items);
    setWishlistIds(new Set(items.map((tour) => tour.id).filter(Boolean) as string[]));
  }, []);

  const handleServerAuthFailure = useCallback(() => {
    dispatch({ type: 'LOGOUT' });
    syncRef.current = false;
    loadGuestWishlist();
  }, [dispatch, loadGuestWishlist]);

  const fetchWishlist = useCallback(async () => {
    if (!hasServerAuth) {
      loadGuestWishlist();
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/wishlist`, {
        method: 'GET',
        headers: buildAuthHeaders(),
        credentials: 'include',
      });

      if (res.status === 401) {
        handleServerAuthFailure();
        return;
      }

      const result = await res.json();
      if (result.success) {
        const tours = result.data.tours || [];
        setWishlist(tours);
        setWishlistIds(new Set(tours.map((tour: WishlistItem) => tour.id || tour._id).filter(Boolean) as string[]));
      }
    } catch (err) {
      console.error('Error fetching wishlist:', err);
    }
  }, [handleServerAuthFailure, hasServerAuth, loadGuestWishlist, token]);

  const addToWishlistServer = useCallback(async (tourId: string) => {
    const res = await fetch(`${BASE_URL}/wishlist`, {
      method: 'POST',
      headers: {
        ...buildAuthHeaders({ 'Content-Type': 'application/json' }),
      },
      credentials: 'include',
      body: JSON.stringify({ tourId }),
    });

    if (res.status === 401) {
      handleServerAuthFailure();
      return { success: false, message: 'Authentication expired' };
    }

    return res.json();
  }, [handleServerAuthFailure, token]);

  const addToWishlist = async (tourId: string, tourData?: WishlistItem | null) => {
    if (!tourId) return false;

    if (!hasServerAuth) {
      const item = normalizeGuestTour(tourData || null, tourId);
      if (!item) return false;
      const existing = readGuestWishlist();
      const next = [item, ...existing.filter((tour) => tour.id !== item.id)].slice(0, MAX_GUEST_ITEMS);
      writeGuestWishlist(next);
      setWishlist(next);
      setWishlistIds(new Set(next.map((tour) => tour.id).filter(Boolean) as string[]));
      return true;
    }

    try {
      const result = await addToWishlistServer(tourId);
      if (result.success) {
        setWishlistIds((prev) => new Set([...prev, tourId]));
        await fetchWishlist();
        return true;
      }
      alert(result.message);
      return false;
    } catch (err) {
      console.error('Error adding to wishlist:', err);
      return false;
    }
  };

  const removeFromWishlist = async (tourId: string) => {
    if (!tourId) return false;

    if (!hasServerAuth) {
      const existing = readGuestWishlist();
      const next = existing.filter((tour) => tour.id !== tourId);
      writeGuestWishlist(next);
      setWishlist(next);
      setWishlistIds(new Set(next.map((tour) => tour.id).filter(Boolean) as string[]));
      return true;
    }

    try {
      const res = await fetch(`${BASE_URL}/wishlist/${tourId}`, {
        method: 'DELETE',
        headers: buildAuthHeaders(),
        credentials: 'include',
      });

      if (res.status === 401) {
        handleServerAuthFailure();
        return false;
      }

      const result = await res.json();
      if (result.success) {
        setWishlistIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(tourId);
          return newSet;
        });
        setWishlist((prev) => prev.filter((tour) => (tour.id || tour._id) !== tourId));
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error removing from wishlist:', err);
      return false;
    }
  };

  const toggleWishlist = async (tourId: string, tourData?: WishlistItem | null) => {
    if (!tourId) return false;
    if (wishlistIds.has(tourId)) {
      return await removeFromWishlist(tourId);
    }
    return await addToWishlist(tourId, tourData);
  };

  const isInWishlist = (tourId: string) => {
    return wishlistIds.has(tourId);
  };

  useEffect(() => {
    if (!user) {
      syncRef.current = false;
      loadGuestWishlist();
      return;
    }

    if (syncRef.current) {
      fetchWishlist();
      return;
    }

    syncRef.current = true;
    const guestItems = readGuestWishlist();

    if (!guestItems.length) {
      fetchWishlist();
      return;
    }

    const ids = guestItems.map((item) => item.id).filter(Boolean) as string[];
    Promise.allSettled(ids.map((id) => addToWishlistServer(id)))
      .finally(() => {
        clearGuestWishlist();
        fetchWishlist();
      });
  }, [addToWishlistServer, fetchWishlist, hasServerAuth, loadGuestWishlist]);

  return {
    wishlist,
    wishlistIds,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    fetchWishlist,
    isGuest: !user
  };
};

