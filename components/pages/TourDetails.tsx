'use client';

import React, { useEffect, useRef, useState, useContext } from 'react'
import Image from 'next/image'
import { Container, Row, Col, Form, ListGroup, Button } from 'reactstrap'
import { useParams } from 'next/navigation'

import calculateAvgRating from '../../utils/avgRating'
import avatar from '../../assets/images/avatar.jpg'
import Booking from '../Booking/Booking'
import Newsletter from '../../shared/Newsletter'
import TourItinerary from '../Common/TourItinerary'
import ShareButtons from '../Common/ShareButtons'
import ImageLightbox from '../Common/ImageLightbox'
import useFetch from '../../hooks/useFetch'
import { useWishlist } from '../../hooks/useWishlist'
import { motion } from 'framer-motion'
import { BASE_URL } from '../../utils/config'
import { AuthContext } from '../../context/AuthContext'
import { ToursAPI } from '../../services/apiClient';
import { addRecentlyViewed } from '../../utils/recentlyViewed';
import { getImageSrc } from '../../lib/image';


const TourDetails = () => {

  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const reviewMsgRef = useRef<HTMLInputElement | null>(null);
  const [tourRating, setTourRating] = useState(null);
  const { user } = useContext(AuthContext)
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState([]);
  const { isInWishlist, toggleWishlist } = useWishlist();

  const { data: tour, loading, error, refetch } = useFetch(`${BASE_URL}/tours/${id}`, { initialData: {} });

  const { photo, title, desc, price, address, reviews, city, distance, maxGroupSize, duration, itinerary, inclusions, exclusions, category, difficulty } = tour;

  const { totalRating, avgRating } = calculateAvgRating(reviews);

  const options: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" };

  // Prepare gallery images (for demo, using the same photo multiple times)
  const galleryImages = photo ? [getImageSrc(photo), getImageSrc(photo), getImageSrc(photo)] : [];

  const openLightbox = (images, index = 0) => {
    setLightboxImages(images);
    setLightboxOpen(true);
  };

  const handleRetry = () => {
    refetch();
  };

  const handleWishlistClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (tour?.id || tour?._id) {
      await toggleWishlist(tour?.id || tour?._id, tour);
    }
  };

  const submitHandler = async e => {
    e.preventDefault();
    const reviewText = reviewMsgRef.current?.value || '';

    try {
      if (!user || user === undefined || user === null) {
        alert('Please Sign In!');
        return;
      }

      if (!tourRating) {
        alert('Please select a rating');
        return;
      }

      const reviewObj = {
        username :user?.username,
        reviewText,
        rating:tourRating,
      }

      const res= await fetch(`${BASE_URL}/review/${id}`,{
        method:'post',
        headers:{
          'content-type':'application/json',
        },
        credentials:'include',
        body:JSON.stringify(reviewObj)
      });

      const result=await res.json()
      if(!res.ok) {
        return alert(result.message);
      }
      alert(result.message)
      if (reviewMsgRef.current) {
        reviewMsgRef.current.value = '';
      }
      setTourRating(null);
      refetch();
  
    } catch (err) {
        alert(err.message)
    }

  };

  const [recommendations, setRecommendations] = useState([]);
  const [recLoading, setRecLoading] = useState(false);
  const [recInit, setRecInit] = useState(false);

  useEffect(() => {
    const tourId = tour?.id || tour?._id;
    if (!tourId) return;
    addRecentlyViewed(tour);
    setRecLoading(true);
    ToursAPI.recommend(tourId, 4)
      .then(res => setRecommendations(res.data.data || []))
      .catch(()=>{})
      .finally(()=> { setRecLoading(false); setRecInit(true); });
  }, [tour]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [tour])

  return (
    <>
      <section>
        <Container>
          {
            loading && (
              <div className="text-center pt-5 pb-5">
                <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                  <span className="visually-hidden">Loading...</span>
                </div>
                <h4 className="mt-3">Loading tour details...</h4>
              </div>
            )
          }
          {
            error && (
              <div className="text-center pt-5 pb-5">
                <i className="ri-error-warning-line" style={{ fontSize: '4rem', color: '#ff6b6b' }}></i>
                <h4 className="text-danger mt-3">Failed to load tour details</h4>
                <p className="text-muted">{error}</p>
                <Button color="primary" className="mt-3" onClick={handleRetry}>
                  <i className="ri-refresh-line me-2"></i>
                  Try Again
                </Button>
              </div>
            )
          }
          {
            !loading && !error && <Row>
              <Col lg='8'>
                <div className="tour__content">
                  <div className="tour__image-wrapper" onClick={() => openLightbox(galleryImages, 0)}>
                    <Image src={getImageSrc(photo)} alt={title} width={800} height={500} className="tour__main-image" priority />
                    <div className="image__overlay">
                      <i className="ri-gallery-line"></i>
                      <span>View Gallery</span>
                    </div>
                  </div>
                  <div className="tour__info">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <h2 className="mb-0">{title}</h2>
                      <div className="d-flex align-items-center gap-3">
                        <motion.button
                          className="btn btn-outline-danger d-flex align-items-center justify-content-center rounded-circle"
                          style={{ width: '40px', height: '40px', background: isInWishlist(tour?.id || tour?._id) ? '#ff4757' : 'transparent', borderColor: '#ff4757' }}
                          onClick={handleWishlistClick}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          title={isInWishlist(tour?.id || tour?._id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                        >
                          <i className={isInWishlist(tour?.id || tour?._id) ? 'ri-heart-fill text-white' : 'ri-heart-line text-danger'} style={{ fontSize: '1.2rem' }}></i>
                        </motion.button>
                        <ShareButtons 
                          url={typeof window !== 'undefined' ? window.location.href : ''} 
                          title={title} 
                          description={desc?.substring(0, 150)}
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-5">
                      <span className="tour__rating d-flex align-items-center gap-1">
                        <i className="ri-star-fill" style={{ color: "var(--secondary-color)" }}>
                        </i>{avgRating === 0 ? null : avgRating}
                        {totalRating === 0 ? ('Not Rated') : (<span>({reviews?.length})</span>)}
                      </span>
                      <span>
                        <i className="ri-map-pin-user-fill"></i>{address}
                      </span>
                    </div>
                    <div className="tour__extra-details">
                      <span> <i className="ri-map-pin-2-line"></i>{city}</span>
                      <span> <i className="ri-money-dollar-circle-line"></i> ₹{price}/ per person </span>
                      <span> <i className="ri-map-pin-time-line"></i> {distance} / km </span>
                      <span> <i className="ri-group-line"></i>{maxGroupSize} people</span>
                      {category && <span> <i className="ri-compass-3-line"></i>{category}</span>}
                      {difficulty && <span> <i className="ri-equalizer-line"></i>{difficulty} level</span>}
                    </div>
                    <h5>Description</h5>
                    <p>{desc}</p>
                  </div>

                  {/* Tour Itinerary Section */}
                  {itinerary && itinerary.length > 0 && (
                    <TourItinerary 
                      itinerary={itinerary} 
                      duration={duration}
                      inclusions={inclusions}
                      exclusions={exclusions}
                    />
                  )}

                  {/*================tour reviews section==================== */}
                  <div className="tour__reviews mt-4">
                    <h4>Reviews ({reviews?.length} reviews)</h4>
                    <Form onSubmit={submitHandler}>
                      <div className="d-flex align-items-center gap-3 mb-4 rating__group">
                        1 <span onClick={() => setTourRating(1)}>
                          <i className="ri-star-s-fill"></i></span>
                        2 <span onClick={() => setTourRating(2)}>
                          <i className="ri-star-s-fill"></i></span>
                        3 <span onClick={() => setTourRating(3)}>
                          <i className="ri-star-s-fill"></i></span>
                        4 <span onClick={() => setTourRating(4)}>
                          <i className="ri-star-s-fill"></i></span>
                        5 <span onClick={() => setTourRating(5)}>
                          <i className="ri-star-s-fill"></i></span>
                      </div>
                      <div className="review__input">
                        <input type="text" ref={reviewMsgRef} placeholder="Share your Thoughts!" required />
                        <button className='btn primary__btn text-white' type='submit'>
                          Submit
                        </button>
                      </div>

                    </Form>
                    <ListGroup className="user__reviews">
                      {
                        reviews?.map((review, index) => (
                          <div className="review__item" key={review.id || review._id || index}>
                            <Image src={getImageSrc(avatar, '/logo192.png')} width={50} height={50} className="rounded-circle" alt="User avatar" />
                            <div className="w-100">
                              <div className="d-flex align-items-center justify-content-between">
                                <div>
                                  <h5>
                                 {review.username}
                                  </h5>
                                  <p>
                                    {new Date(review.createdAt).toLocaleDateString(
                                      "en-US", options
                                    )}
                                  </p>
                                </div>
                                <span className="d-flex align-items-center">
                                  {review.rating}
                                  <i className="ri-star-s-fill"></i>
                                </span>
                              </div>
                              <h6>{review.reviewText}</h6>
                            </div>
                          </div>
                        ))
                      }
                    </ListGroup>
                  </div>
                  {/*================tour reviews section end==================== */}

                  {recLoading && <div className='d-flex gap-3 mt-4'>
                    {Array.from({length:4}).map((_,i)=> <div key={i} style={{flex:'1 0 220px', maxWidth:'240px', height:'180px', borderRadius:'8px', background:'linear-gradient(90deg,#ececec 25%,#f5f5f5 37%,#ececec 63%)', backgroundSize:'400% 100%', animation:'skeleton-loading 1.2s ease-in-out infinite'}} />)}
                  </div>}
                  {!recLoading && recInit && recommendations.length === 0 && (
                    <p className='mt-4 small text-muted'>No similar tours found.</p>
                  )}
                  {!recLoading && recommendations.length > 0 && (
                    <div className='mt-5'>
                      <h4>Similar experiences</h4>
                      <div className='d-flex flex-wrap gap-3'>
                        {recommendations.map(r => (
                          <div style={{ flex: '1 0 220px', maxWidth: '240px' }} key={r.id || r._id}>
                            <Image src={getImageSrc(r.photo)} alt={r.title} width={240} height={140} style={{ borderRadius: '8px', objectFit: 'cover' }} />
                            <p className='mb-0 fw-semibold small mt-2'>{r.title}</p>
                            <span className='text-muted small'>{r.city}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Col>
              <Col lg='4'>
                <Booking tour={tour} avgRating={avgRating} />
              </Col>
            </Row>
          }
        </Container>
      </section>
      
      {/* Image Lightbox */}
      <ImageLightbox
        images={lightboxImages}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        initialIndex={0}
      />
      
      <Newsletter />
    </>
  )
}

export default TourDetails
