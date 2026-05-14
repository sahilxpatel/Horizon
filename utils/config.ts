'use client';

const DEFAULT_API_URL = "/api/v1";

export const BASE_URL = process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL;
export const STRIPE_PUBLISHABLE_KEY =
	process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";
export const FRONTEND_URL =
	process.env.REACT_APP_FRONTEND_URL ||
	(typeof window !== "undefined" ? window.location.origin : "http://localhost:3000");

