'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TourItinerary = ({ itinerary, duration, inclusions, exclusions }) => {
  const [expandedDay, setExpandedDay] = useState(null);

  const toggleDay = (day) => {
    setExpandedDay(expandedDay === day ? null : day);
  };

  if (!itinerary || itinerary.length === 0) {
    return null;
  }

  return (
    <div className="tour__itinerary__section mt-4">
      <div className="itinerary__header">
        <h4>
          <i className="ri-map-line"></i> Tour Itinerary
        </h4>
        {duration && (
          <span className="duration__badge">
            <i className="ri-calendar-line"></i> {duration} {duration === 1 ? 'Day' : 'Days'}
          </span>
        )}
      </div>

      <div className="itinerary__timeline">
        {itinerary.map((day, index) => (
          <motion.div
            key={day.day}
            className={`itinerary__day ${expandedDay === day.day ? 'expanded' : ''}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="day__header" onClick={() => toggleDay(day.day)}>
              <div className="day__number">
                <span>Day {day.day}</span>
              </div>
              <div className="day__title__wrapper">
                <h5 className="day__title">{day.title}</h5>
                {day.meals && day.meals.length > 0 && (
                  <div className="day__meals">
                    {day.meals.map((meal, i) => (
                      <span key={i} className="meal__badge">
                        <i className="ri-restaurant-line"></i> {meal}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <motion.i
                className={`ri-arrow-${expandedDay === day.day ? 'up' : 'down'}-s-line expand__icon`}
                animate={{ rotate: expandedDay === day.day ? 180 : 0 }}
              ></motion.i>
            </div>

            <AnimatePresence>
              {expandedDay === day.day && (
                <motion.div
                  className="day__content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="day__description">{day.description}</p>

                  {day.activities && day.activities.length > 0 && (
                    <div className="day__activities">
                      <h6><i className="ri-check-double-line"></i> Activities</h6>
                      <ul>
                        {day.activities.map((activity, i) => (
                          <li key={i}>{activity}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {day.accommodation && (
                    <div className="day__accommodation">
                      <i className="ri-hotel-bed-line"></i>
                      <span>Accommodation: {day.accommodation}</span>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Inclusions & Exclusions */}
      {(inclusions?.length > 0 || exclusions?.length > 0) && (
        <div className="inclusions__section mt-4">
          <div className="row">
            {inclusions?.length > 0 && (
              <div className="col-md-6">
                <div className="inclusions__box">
                  <h5>
                    <i className="ri-checkbox-circle-line"></i> Inclusions
                  </h5>
                  <ul>
                    {inclusions.map((item, i) => (
                      <li key={i}>
                        <i className="ri-check-line"></i> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {exclusions?.length > 0 && (
              <div className="col-md-6">
                <div className="exclusions__box">
                  <h5>
                    <i className="ri-close-circle-line"></i> Exclusions
                  </h5>
                  <ul>
                    {exclusions.map((item, i) => (
                      <li key={i}>
                        <i className="ri-close-line"></i> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TourItinerary;

