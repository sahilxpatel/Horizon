'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardBody, Button, Input, Label, FormGroup, Badge } from 'reactstrap';

const AdvancedFilters = ({ 
  priceRange, 
  onPriceChange, 
  durationFilter, 
  onDurationChange,
  onClearFilters 
}: { 
  priceRange: { min: number; max: number }; 
  onPriceChange: (range: { min: number; max: number }) => void; 
  durationFilter: string; 
  onDurationChange: (duration: string) => void; 
  onClearFilters: () => void; 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localPriceRange, setLocalPriceRange] = useState(priceRange);

  const durationOptions = [
    { value: 'all', label: 'All Durations', icon: 'ri-time-line' },
    { value: 'short', label: '1-3 Days', icon: 'ri-run-line' },
    { value: 'medium', label: '4-7 Days', icon: 'ri-walk-line' },
    { value: 'long', label: '8+ Days', icon: 'ri-footprint-line' }
  ];

  const pricePresets = [
    { label: 'Budget', min: 0, max: 10000, color: '#4CAF50' },
    { label: 'Mid-Range', min: 10000, max: 30000, color: '#2196F3' },
    { label: 'Premium', min: 30000, max: 60000, color: '#9C27B0' },
    { label: 'Luxury', min: 60000, max: 100000, color: '#FF9800' }
  ];

  const handlePriceRangeChange = (field: string, value: string) => {
    const newRange = { ...localPriceRange, [field]: parseInt(value) };
    setLocalPriceRange(newRange);
  };

  const applyPriceFilter = () => {
    onPriceChange(localPriceRange);
  };

  const selectPricePreset = (preset: any) => {
    setLocalPriceRange({ min: preset.min, max: preset.max });
    onPriceChange({ min: preset.min, max: preset.max });
  };

  const activeFiltersCount = () => {
    let count = 0;
    if (priceRange.min > 0 || priceRange.max < 100000) count++;
    if (durationFilter !== 'all') count++;
    return count;
  };

  return (
    <div className="advanced-filters-wrapper">
      <motion.div
        className="filter-toggle"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button
          color="light"
          className="w-100 d-flex justify-content-between align-items-center"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <span>
            <i className="ri-filter-3-line me-2"></i>
            Advanced Filters
            {activeFiltersCount() > 0 && (
              <Badge color="primary" pill className="ms-2">
                {activeFiltersCount()}
              </Badge>
            )}
          </span>
          <i className={`ri-arrow-${isExpanded ? 'up' : 'down'}-s-line`}></i>
        </Button>
      </motion.div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="mt-3 filter-card">
              <CardBody>
                {/* Price Range Filter */}
                <div className="filter-section">
                  <h6 className="filter-section-title">
                    <i className="ri-money-dollar-circle-line me-2"></i>
                    Price Range
                  </h6>
                  
                  {/* Quick Presets */}
                  <div className="price-presets mb-3">
                    {pricePresets.map((preset, index) => (
                      <motion.button
                        key={index}
                        className={`preset-btn ${
                          localPriceRange.min === preset.min && 
                          localPriceRange.max === preset.max ? 'active' : ''
                        }`}
                        style={{ 
                          '--preset-color': preset.color,
                          borderColor: preset.color 
                        } as any}
                        onClick={() => selectPricePreset(preset)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {preset.label}
                      </motion.button>
                    ))}
                  </div>

                  {/* Custom Range Inputs */}
                  <div className="price-range-inputs">
                    <FormGroup>
                      <Label className="small text-muted">Min Price (₹)</Label>
                      <Input
                        type="number"
                        value={localPriceRange.min}
                        onChange={(e) => handlePriceRangeChange('min', e.target.value)}
                        min={0}
                        max={localPriceRange.max}
                        step={1000}
                      />
                    </FormGroup>
                    <span className="range-separator">—</span>
                    <FormGroup>
                      <Label className="small text-muted">Max Price (₹)</Label>
                      <Input
                        type="number"
                        value={localPriceRange.max}
                        onChange={(e) => handlePriceRangeChange('max', e.target.value)}
                        min={localPriceRange.min}
                        max={100000}
                        step={1000}
                      />
                    </FormGroup>
                  </div>

                  {/* Price Range Slider Display */}
                  <div className="price-display mt-2">
                    <span className="text-muted small">
                      Showing tours from ₹{localPriceRange.min.toLocaleString()} to ₹{localPriceRange.max.toLocaleString()}
                    </span>
                  </div>

                  <Button
                    color="primary"
                    size="sm"
                    className="mt-2 w-100"
                    onClick={applyPriceFilter}
                  >
                    Apply Price Filter
                  </Button>
                </div>

                {/* Duration Filter */}
                <div className="filter-section mt-4">
                  <h6 className="filter-section-title">
                    <i className="ri-calendar-line me-2"></i>
                    Trip Duration
                  </h6>
                  <div className="duration-options">
                    {durationOptions.map((option) => (
                      <motion.button
                        key={option.value}
                        className={`duration-btn ${durationFilter === option.value ? 'active' : ''}`}
                        onClick={() => onDurationChange(option.value)}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <i className={option.icon}></i>
                        <span>{option.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                {activeFiltersCount() > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4"
                  >
                    <Button
                      color="danger"
                      outline
                      size="sm"
                      className="w-100"
                      onClick={() => {
                        setLocalPriceRange({ min: 0, max: 100000 });
                        onClearFilters();
                      }}
                    >
                      <i className="ri-close-circle-line me-2"></i>
                      Clear All Filters
                    </Button>
                  </motion.div>
                )}
              </CardBody>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdvancedFilters;

