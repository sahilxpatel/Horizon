'use client';

import axios from "axios";
import { BASE_URL } from "../utils/config";

const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const token =
    typeof window !== "undefined"
      ? window.localStorage.getItem("horizon_token")
      : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// New helper methods
export const ToursAPI = {
  getTopRated: (limit = 5) => apiClient.get(`/tours/top-rated/list`, { params: { limit } }),
  getRandom: (limit = 5) => apiClient.get(`/tours/random/list`, { params: { limit } }),
  getBySlug: (slug) => apiClient.get(`/tours/slug/${slug}`),
  textSearch: (q, page = 0, limit = 8) => apiClient.get(`/tours/search/text`, { params: { q, page, limit } }),
  recommend: (tourId, limit = 5) => apiClient.get(`/tours/recommended/list`, { params: { tourId, limit } }),
  list: (params = {}) => apiClient.get('/tours', { params }),
};

export default apiClient;

