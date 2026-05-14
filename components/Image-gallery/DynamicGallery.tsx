'use client';

import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import useFetch from "../../hooks/useFetch";
import { BASE_URL } from "../../utils/config";
import calculateAvgRating from "../../utils/avgRating";
import toursData from "../../assets/data/tours";
import { getImageSrc } from "../../lib/image";

const categories = [
  { id: "all", label: "All stories", predicate: () => true },
  { id: "adventure", label: "Adventure", predicate: (tour) => tour.distance >= 300 },
  { id: "family", label: "Family escapes", predicate: (tour) => tour.maxGroupSize >= 5 },
  { id: "luxury", label: "Luxury retreats", predicate: (tour) => tour.price >= 15000 },
  { id: "weekend", label: "Weekend getaways", predicate: (tour) => tour.distance < 200 },
];

const DynamicGallery = () => {
  const { data, loading, error } = useFetch(`${BASE_URL}/tours/search/advanced?limit=24&sortBy=avgRating&order=desc`);
  const [activeCategory, setActiveCategory] = useState("all");

  const tours = useMemo(() => {
    const sourceData = Array.isArray(data) && data.length > 0 ? data : toursData;

    if (!Array.isArray(sourceData)) {
      return [];
    }

    return sourceData.map((tour) => {
      if (typeof tour.avgRating === "number") {
        return tour;
      }

      const { avgRating } = calculateAvgRating(tour.reviews || []);
      return { ...tour, avgRating };
    });
  }, [data]);

  const filtered = useMemo(() => {
    const category = categories.find((item) => item.id === activeCategory) || categories[0];
    return tours.filter(category.predicate).slice(0, 9);
  }, [activeCategory, tours]);

  return (
    <motion.div
      className="dynamic-gallery"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="dynamic-gallery__header d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
        <motion.p
          className="text-muted mb-0"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Wander through recent adventures shared by our community.
        </motion.p>
        <motion.div
          className="dynamic-gallery__filters"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {categories.map((category, index) => (
            <motion.button
              type="button"
              key={category.id}
              className={`dynamic-gallery__filter ${category.id === activeCategory ? "active" : ""}`}
              onClick={() => setActiveCategory(category.id)}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.08 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category.label}
            </motion.button>
          ))}
        </motion.div>
      </div>

      {loading && !tours.length && <p className="text-center mt-4">Loading photo stories...</p>}

      {!loading && error && tours.length === 0 && (
        <p className="text-center text-danger mt-4" role="alert">
          We could not load new stories right now. Please try again later.
        </p>
      )}

      {!loading && filtered.length === 0 && (
        <p className="text-center mt-4">No stories found yet. Try another mood.</p>
      )}

      {!loading && filtered.length > 0 && (
        <div className="dynamic-gallery__grid mt-4">
          <AnimatePresence>
            {filtered.map((tour, index) => (
              <motion.figure
                className="dynamic-gallery__item"
                key={tour._id || tour.id}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{
                  duration: 0.35,
                  delay: index * 0.04,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                whileHover={{
                  y: -8,
                  boxShadow: "0 20px 40px -16px rgba(11, 39, 39, 0.35)",
                }}
              >
                <motion.img
                  src={getImageSrc(tour.photo)}
                  alt={tour.title}
                  whileHover={{ scale: 1.08 }}
                  transition={{ duration: 0.4 }}
                />
                <figcaption>
                  <div className="dynamic-gallery__meta">
                    <span className="dynamic-gallery__city">
                      <i className="ri-map-pin-line"></i>
                      {tour.city}
                    </span>
                    <span className="dynamic-gallery__rating">
                      <i className="ri-star-fill"></i>
                      {tour.avgRating || "New"}
                    </span>
                  </div>
                  <h5>{tour.title}</h5>
                  <p>Rs {tour.price?.toLocaleString()} · {tour.distance} km getaways</p>
                </figcaption>
              </motion.figure>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};

export default DynamicGallery;
