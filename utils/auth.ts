'use client';

const TOKEN_KEY = 'horizon_token';

const canUseStorage = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

export const getClientAuthToken = () => {
  if (!canUseStorage()) return null;
  return window.localStorage.getItem(TOKEN_KEY);
};

export const hasClientAuthToken = () => Boolean(getClientAuthToken());

export const buildAuthHeaders = (existingHeaders: Record<string, string> = {}) => {
  const token = getClientAuthToken();

  if (!token) {
    return existingHeaders;
  }

  return {
    ...existingHeaders,
    Authorization: `Bearer ${token}`,
  };
};