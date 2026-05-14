'use client';

import React from 'react';

const SkeletonBox = ({ height = 140, width = '100%', className='' }) => {
  return (
    <div 
      className={`skeleton-box ${className}`}
      style={{
        width,
        height,
        background: 'linear-gradient(90deg, #ececec 25%, #f5f5f5 37%, #ececec 63%)',
        backgroundSize: '400% 100%',
        borderRadius: '8px',
        animation: 'skeleton-loading 1.2s ease-in-out infinite'
      }}
    />
  );
};

export default SkeletonBox;
