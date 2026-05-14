'use client';

const DEFAULT_API_URL =
	process.env.NODE_ENV === "production"
		? "https://horizonbackend.onrender.com/api/v1"
		: "/api/v1";

export const BASE_URL = process.env.REACT_APP_API_BASE_URL || DEFAULT_API_URL;
export const STRIPE_PUBLISHABLE_KEY =
	process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";
export const FRONTEND_URL =
	process.env.REACT_APP_FRONTEND_URL ||
	(typeof window !== "undefined" ? window.location.origin : "http://localhost:3000");

