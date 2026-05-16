'use client';

import React from 'react'
import {Container, Row, Col , Button} from 'reactstrap'
import Link from 'next/link'

const ThankYou = () => {
  return (
    <section>
        <Container>
            <Row>
                <Col lg='12' className='pt-5 text-center'>
                   <div className="thank__you">
                    <span><i className="ri-checkbox-circle-line"></i></span>
                    <h1 className="mb-3 fw-semibold">Thank You!</h1>
                    <h3 className="mb-4">Your tour is Booked!</h3>
                    <Link href="/home" className="btn primary__btn w-25">
                      Back to Home!
                    </Link>
                   </div>
                </Col>
            </Row>
        </Container>
    </section>
  )
}

export default ThankYou

