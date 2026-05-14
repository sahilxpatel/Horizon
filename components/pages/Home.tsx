'use client';

import React, { useEffect } from 'react'
import {Container, Row, Col} from 'reactstrap'
import { motion } from 'framer-motion'
import heroImg from "../../assets/images/hero-img01.jpg"
import heroImg02 from '../../assets/images/hero-img02.jpg'
const heroVideo = '/hero-video.mp4';
import experienceImg from '../../assets/images/trip.png'
import ServiceList from '../../services/ServiceList'
import FeaturedTourList from '../Featured-tours/FeaturedTourList'
import Testimonials from '../Testimonial/Testimonials'
import Newsletter from '../../shared/Newsletter'
import AdvancedSearchBar from '../Search/AdvancedSearchBar'
import DynamicGallery from '../Image-gallery/DynamicGallery'
import WhyChooseUs from '../Features/WhyChooseUs'
import DealsBanner from '../Common/DealsBanner'
import TopRatedTours from '../Tours/TopRatedTours'
import RandomDiscover from '../Tours/RandomDiscover'
import RecentlyViewed from '../Tours/RecentlyViewed'
import { ToursAPI } from '../../services/apiClient'
import { getImageSrc } from '../../lib/image'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
}

const imageVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
}

const Home = () => {
  // Prefetch top-rated and a small recommendation batch to warm API cache after initial paint
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      Promise.all([
        ToursAPI.getTopRated(6).catch(()=>null),
        ToursAPI.getRandom(3).catch(()=>null)
      ]).then(results => {
        if (cancelled) return;
        // store lightly in window for potential hydration (optional read by components)
        if (results[0]?.data?.data) window.__PREFETCH_TOP_RATED__ = results[0].data.data;
        if (results[1]?.data?.data) window.__PREFETCH_RANDOM__ = results[1].data.data;
      });
    }, 1400); // delay to avoid competing with critical hero content
    return () => { cancelled = true; clearTimeout(timer); };
  }, []);
  return  <>
      {/*==================hero section start====================*/}
    <section className="hero-section">
      <Container>
        <Row className="align-items-center gy-5">
          <Col lg='6'>
            <motion.div 
              className="hero__content"
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
               <motion.span className="hero__badge" variants={itemVariants}>
                 Curated escapes crafted for you
               </motion.span>
               <motion.h1 variants={itemVariants}>
                 Design your next <span className="highlight">unforgettable journey</span>
               </motion.h1>
               <motion.p variants={itemVariants}>
                 Life is a journey—make every mile memorable. Discover handpicked destinations, tailor-made itineraries, and concierge-level support for explorers, storytellers, and daydreamers alike.
               </motion.p>
               <motion.div className="hero__cta" variants={itemVariants}>
                 <motion.a 
                   className="btn primary__btn" 
                   href="#featured"
                   whileHover={{ scale: 1.05, y: -2 }}
                   whileTap={{ scale: 0.98 }}
                 >
                   Explore tours
                 </motion.a>
                 <motion.a 
                   className="btn hero__watch" 
                   href={heroVideo} 
                   target="_blank" 
                   rel="noreferrer"
                   whileHover={{ scale: 1.05 }}
                   whileTap={{ scale: 0.98 }}
                 >
                   <i className="ri-play-circle-line"></i> Watch teaser
                 </motion.a>
               </motion.div>
               <motion.div className="hero__metrics" variants={itemVariants}>
                 <motion.div 
                   className="hero__metric"
                   whileHover={{ y: -4, boxShadow: "0 20px 40px -16px rgba(53, 204, 250, 0.45)" }}
                 >
                   <span>12k+</span>
                   <p>Travellers hosted</p>
                 </motion.div>
                 <motion.div 
                   className="hero__metric"
                   whileHover={{ y: -4, boxShadow: "0 20px 40px -16px rgba(53, 204, 250, 0.45)" }}
                 >
                   <span>2k+</span>
                   <p>Trusted reviews</p>
                 </motion.div>
                 <motion.div 
                   className="hero__metric"
                   whileHover={{ y: -4, boxShadow: "0 20px 40px -16px rgba(53, 204, 250, 0.45)" }}
                 >
                   <span>48</span>
                   <p>Curated cities</p>
                 </motion.div>
               </motion.div>
            </motion.div>
          </Col>
            <Col lg='6'>
              <motion.div 
                className='hero__visual'
                initial="hidden"
                animate="visible"
                variants={containerVariants}
              >
                <motion.div 
                  className='hero__visual-main'
                  variants={imageVariants}
                  whileHover={{ scale: 1.02 }}
                >
                  <img src={getImageSrc(heroImg)} alt="Sunset mountain" />
                </motion.div>
                <motion.div 
                  className='hero__visual-card'
                  variants={imageVariants}
                  transition={{ delay: 0.2 }}
                  whileHover={{ scale: 1.05, rotate: 2 }}
                >
                  <img src={getImageSrc(heroImg02)} alt="Campfire" />
                </motion.div>
                <motion.div 
                  className='hero__visual-video'
                  variants={imageVariants}
                  transition={{ delay: 0.4 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <video src={heroVideo} autoPlay loop muted playsInline />
                </motion.div>
              </motion.div>
            </Col>
        </Row>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <AdvancedSearchBar />
        </motion.div>
      </Container>
    </section>
         {/*==================hero section end=================*/}
         <motion.section
           initial={{ opacity: 0 }}
           whileInView={{ opacity: 1 }}
           viewport={{ once: true, margin: "-100px" }}
           transition={{ duration: 0.6 }}
         >
          <Container>
            <Row>
              <Col lg="3">
                <motion.h5 
                  className="services__subtitle"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  What we Serve
                </motion.h5>
                <motion.h2 
                  className="services__title"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  We offer Best Services
                </motion.h2>
              </Col>
              <ServiceList />
            </Row>
          </Container>
         </motion.section>

          {/*==================featured tour section start======================*/}
            <motion.section
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <Container>
                <Row>
                <Col lg='12' className='mb-5' id='featured'>
                  <motion.h5 
                    className="services__subtitle"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                  >
                    Explore
                  </motion.h5>
                  <motion.h2 
                    className="featured__tour-title"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    Our Featured Tours.
                  </motion.h2>
                </Col>
                <FeaturedTourList />
                </Row>
                
              </Container>
            </motion.section>

          {/*==================featured tour section end======================*/}
          <RecentlyViewed />
          {/*==================top rated & random discovery section start======================*/}
          <section>
             <Container>
               <Row className='align-items-start gy-4'>
                 <Col lg='9'>
                   <h5 className='services__subtitle'>Community Favorites</h5>
                   <h2 className='featured__tour-title'>Top Rated Picks</h2>
                   <TopRatedTours limit={8} />
                 </Col>
                 <Col lg='3'>
                   <RandomDiscover />
                 </Col>
               </Row>
             </Container>
           </section>
          {/*==================top rated & random discovery section end======================*/}
           {/*==================experience section start=========================*/}

          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <Container>
              <Row>
                <Col lg='6'>
                  <motion.div 
                    className="experience__content"
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                  >
                    {/* <Subtitle subtitle={'Experience'} /> */}
                    <h5 className="services__subtitle">
                    Experience
                </h5>
                    <h2>
                      With our all experience <br/> we will serve you.
                    </h2>
                    <p>
                    Traveling , it leaves you speechless, then turns you into a storyteller.
                    <br/>
                    We travel, some of us forever, to seek other states, other lives, other souls.
                    </p>
                  </motion.div>
                  <motion.div 
                    className="counter__wrapper d-flex align-items-center gap-5"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <motion.div 
                      className="counter__box"
                      whileHover={{ scale: 1.05, y: -4 }}
                    >
                      <span>12k+</span>
                      <h6>Successful Trips!</h6>
                    </motion.div>
                    <motion.div 
                      className="counter__box"
                      whileHover={{ scale: 1.05, y: -4 }}
                    >
                      <span>2k+</span>
                      <h6>Regular Clients</h6>
                    </motion.div>
                    <motion.div 
                      className="counter__box"
                      whileHover={{ scale: 1.05, y: -4 }}
                    >
                      <span>10</span>
                      <h6>Years of Experience!</h6>
                    </motion.div>
                  </motion.div>
                </Col>
                <Col lg="6">
                  <motion.div 
                    className="experience__img"
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <img src={getImageSrc(experienceImg)} alt="" />
                  </motion.div>
                </Col>
              </Row>
            </Container>
          </motion.section>
           {/*==================experience section end=========================*/}
           {/*==================gallery section start==========================*/}
           <motion.section
             initial={{ opacity: 0 }}
             whileInView={{ opacity: 1 }}
             viewport={{ once: true, margin: "-100px" }}
             transition={{ duration: 0.6 }}
           >
            <Container>
              <Row>
                <Col lg='12'>
                  {/* <Subtitle subtitle={'Gallery'} />*/}
                  <motion.h5 
                    className="services__subtitle"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                  >
                    Gallery
                  </motion.h5>
                  <motion.h2 
                    className="gallery__title"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    Visit our customers Tour Gallery!
                  </motion.h2>
                </Col>
                <Col lg='12'>
                 <DynamicGallery />
                </Col>
              </Row>
            </Container>
           </motion.section>
           {/*==================gallery section end============================*/}

           {/*==================deals banner section start======================*/}
           <DealsBanner />
           {/*==================deals banner section end========================*/}

           {/*==================why choose us section start=====================*/}
           <WhyChooseUs />
           {/*==================why choose us section end=======================*/}

           {/*==================testimonial section start============================*/}
           <motion.section
             initial={{ opacity: 0 }}
             whileInView={{ opacity: 1 }}
             viewport={{ once: true, margin: "-100px" }}
             transition={{ duration: 0.6 }}
           >
            <Container>
              <Row>
                <Col lg='12'>
                  {/* <Subtitle subtitle={'Fans Love'} /> */}
                  <motion.h5 
                    className="services__subtitle"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                  >
                    Customer's Love
                  </motion.h5>
                  <motion.h2 
                    className="testimonial__title"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    What our Customer's say about us?
                  </motion.h2>
                </Col>
                <Col lg='12'>
                  <Testimonials />
                </Col>
              </Row>
            </Container>
           </motion.section>
            {/*==================testimonial section end============================*/}
          <Newsletter />



  </>
}

export default Home
