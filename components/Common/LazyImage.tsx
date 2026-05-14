'use client';

import React, { useEffect, useRef, useState } from 'react';
import { getImageSrc } from '../../lib/image';

/*
  LazyImage: IntersectionObserver-based image loader with blur-up placeholder.
  Props: src, alt, className, style, height, width, onLoad, ratio (optional maintains aspect)
*/
type LazyImageProps = {
  src: unknown;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
  height?: React.CSSProperties['height'];
  width?: React.CSSProperties['width'];
  ratio?: number;
  onLoad?: React.ReactEventHandler<HTMLImageElement>;
};

const LazyImage = ({
  src,
  alt = '',
  className = '',
  style = {},
  height,
  width,
  ratio,
  onLoad,
}: LazyImageProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      });
    }, { rootMargin: '150px' });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const handleLoad: React.ReactEventHandler<HTMLImageElement> = (e) => {
    setLoaded(true);
    onLoad && onLoad(e);
  };

  const handleError = () => {
    setFailed(true);
  };

  const paddingStyle: React.CSSProperties = ratio ? { position: 'relative', width: '100%', paddingTop: `${(1/ratio)*100}%` } : {};
  const imgStyle: React.CSSProperties = ratio ? { position: 'absolute', top:0, left:0, height:'100%', width:'100%', objectFit:'cover' } : { height, width, objectFit:'cover' };

  return (
    <div ref={containerRef} className={`lazy-image-wrapper ${className}`} style={{ ...paddingStyle, ...style }}>
      {inView && !failed && (
        <img
          src={getImageSrc(src)}
          alt={alt}
          style={{ ...imgStyle, filter: loaded ? 'none' : 'blur(12px)', transition:'filter 0.5s ease' }}
          loading='lazy'
          onLoad={handleLoad}
          onError={handleError}
        />
      )}
      {!loaded && !failed && (
        <div className='lazy-skeleton' style={{
          position: ratio ? 'absolute' : 'static',
          top:0,left:0,right:0,bottom:0,
          background: 'linear-gradient(90deg,#ececec 25%,#f5f5f5 37%,#ececec 63%)',
          backgroundSize:'400% 100%',
          animation:'skeleton-loading 1.2s ease-in-out infinite',
          borderRadius:'8px'
        }} />
      )}
      {failed && (
        <div className='lazy-fallback d-flex align-items-center justify-content-center text-muted' style={{
          fontSize:'0.75rem', background:'#fafafa', border:'1px solid #eee', borderRadius:'8px', height: height || '100%'
        }}>
          image unavailable
        </div>
      )}
    </div>
  );
};

export default React.memo(LazyImage);

