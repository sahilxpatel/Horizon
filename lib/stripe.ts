import Stripe from "stripe";

const STRIPE_KEY = process.env.STRIPE_SECRET_KEY || "sk_test_placeholder_key_for_development";

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn("STRIPE_SECRET_KEY not set. Payment features will not work.");
}

export const stripeClient = new Stripe(STRIPE_KEY, {
  apiVersion: "2023-10-16"
});

export const getFrontendBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  return process.env.NODE_ENV === "production"
    ? "https://your-frontend-url.com"
    : "http://localhost:3000";
};
