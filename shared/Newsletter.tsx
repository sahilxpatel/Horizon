'use client';

import React from 'react'
import {Container, Row, Col} from 'reactstrap'
import maleTourist from '../assets/images/male-tourist.png'
import { getImageSrc } from '../lib/image'

const Newsletter = () => {
  return (
    <section className="newsletter">
        <Container>
            <Row>
                <Col lg='6'>
                  <div className='newsletter__content'>
                    <h2>Subscribe to get more useful Travelling Information.</h2>
                    <div className='newsletter__input'>
                    <input type="email" placeholder='Enter your Email' />
                    <button className='btn newsletter__btn'>Subscribe</button>                   
                  </div>
                  <p>Our most cherished family trip was undeniably our gulet adventure in Diverse 
                    India—a holiday of a lifetime.</p>
                  </div>
                </Col>
                <Col lg='6'>
                    <div className="newsletter__img">
                        <img src={getImageSrc(maleTourist)} alt="" />
                    </div>
                </Col>
            </Row>
        </Container>
    </section>
  )
}

export default Newsletter
