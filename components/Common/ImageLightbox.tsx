'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type ImageLightboxProps = {
  images?: string | string[];
  isOpen: boolean;
  onClose: () => void;
  initialIndex?: number;
};

const ImageLightbox = ({
  images = [],
  isOpen,
  onClose,
  initialIndex = 0,
}: ImageLightboxProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const normalizedImages = useMemo(() => {
    if (Array.isArray(images)) {
      return images.filter(Boolean);
    }

    return images ? [images] : [];
  }, [images]);

  const hasImages = normalizedImages.length > 0;
  const imageCount = normalizedImages.length;
  const safeIndex = hasImages
    ? Math.min(Math.max(currentIndex, 0), imageCount - 1)
    : 0;
  const currentImage = hasImages ? normalizedImages[safeIndex] : null;

  const handlePrevious = useCallback((e: React.MouseEvent | KeyboardEvent) => {
    e.stopPropagation();
    if (!hasImages) return;
    setCurrentIndex((prev) => (prev === 0 ? imageCount - 1 : prev - 1));
  }, [hasImages, imageCount]);

  const handleNext = useCallback((e: React.MouseEvent | KeyboardEvent) => {
    e.stopPropagation();
    if (!hasImages) return;
    setCurrentIndex((prev) => (prev === imageCount - 1 ? 0 : prev + 1));
  }, [hasImages, imageCount]);

  useEffect(() => {
    if (!hasImages) {
      setCurrentIndex(0);
      return;
    }

    setCurrentIndex((prev) => {
      const clampedInitial = Math.min(
        Math.max(initialIndex, 0),
        normalizedImages.length - 1
      );

      if (!isOpen) {
        return prev >= normalizedImages.length
          ? normalizedImages.length - 1
          : prev;
      }

      if (prev >= normalizedImages.length) {
        return normalizedImages.length - 1;
      }

      return clampedInitial;
    });
  }, [hasImages, initialIndex, isOpen, normalizedImages]);

  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = 'unset';
      return undefined;
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrevious(e);
      if (e.key === 'ArrowRight') handleNext(e);
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [handleNext, handlePrevious, isOpen, onClose]);

  if (!isOpen || !hasImages || !currentImage) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="image-lightbox"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          {/* Close Button */}
          <motion.button
            className="lightbox-close"
            onClick={onClose}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
          >
            <i className="ri-close-line"></i>
          </motion.button>

          {/* Image Counter */}
          <div className="lightbox-counter">
            {safeIndex + 1} / {normalizedImages.length}
          </div>

          {/* Navigation Buttons */}
          {normalizedImages.length > 1 && (
            <>
              <motion.button
                className="lightbox-nav lightbox-prev"
                onClick={handlePrevious}
                whileHover={{ scale: 1.1, x: -5 }}
                whileTap={{ scale: 0.9 }}
              >
                <i className="ri-arrow-left-s-line"></i>
              </motion.button>

              <motion.button
                className="lightbox-nav lightbox-next"
                onClick={handleNext}
                whileHover={{ scale: 1.1, x: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                <i className="ri-arrow-right-s-line"></i>
              </motion.button>
            </>
          )}

          {/* Main Image */}
          <motion.div
            className="lightbox-content"
            onClick={(e) => e.stopPropagation()}
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <img
              src={currentImage}
              alt={`Gallery ${safeIndex + 1}`}
              className="lightbox-image"
            />
          </motion.div>

          {/* Thumbnail Strip */}
          {normalizedImages.length > 1 && (
            <div className="lightbox-thumbnails">
              {normalizedImages.map((img, index) => (
                <motion.div
                  key={index}
                  className={`thumbnail ${index === safeIndex ? 'active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex(index);
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img src={img} alt={`Thumbnail ${index + 1}`} />
                </motion.div>
              ))}
            </div>
          )}

          {/* Download Button */}
          <motion.a
            href={currentImage}
            download
            className="lightbox-download"
            onClick={(e) => e.stopPropagation()}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <i className="ri-download-line"></i>
          </motion.a>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ImageLightbox;
