'use client';

import React, { useState, useContext } from 'react'
import { Form, FormGroup, ListGroup, ListGroupItem, Button, Alert } from 'reactstrap'
import { useRouter } from 'next/navigation'
import { AuthContext } from '../../context/AuthContext'
import apiClient from '../../services/apiClient'
import { STRIPE_PUBLISHABLE_KEY } from '../../utils/config'
import { loadStripe } from '@stripe/stripe-js'

let stripePromise: any;

const getStripe = () => {
  if (!stripePromise && STRIPE_PUBLISHABLE_KEY) {
    stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
};

const Booking = ({ tour, avgRating }: { tour: any; avgRating: number }) => {
  const { price, reviews, id, _id } = tour;
  const tourId = id || _id;
  const minDate = new Date().toISOString().split('T')[0];

  const router = useRouter();

  const { user } = useContext(AuthContext);

  const [booking, setBooking] = useState({
    fullName: '',
    phone: '',
    guestSize: 1,
    bookAt: '',
    notes: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    const { id, value } = e.target;
    if (id === 'guestSize') {
      const sanitized = Math.max(1, Number(value));
      return setBooking(prev => ({ ...prev, [id]: sanitized }));
    }
    setBooking(prev => ({ ...prev, [id]: value }));
  };

  const handleCheckout = async (e: any) => {
    e.preventDefault();
    setError(null);

    if (!user) {
      return router.push('/login');
    }

    if (!STRIPE_PUBLISHABLE_KEY) {
      return setError('Stripe is not configured. Contact support.');
    }

    try {
      setLoading(true);
      const stripe = await getStripe();

      if (!stripe) {
        throw new Error('Unable to initialize Stripe');
      }

      const payload = {
        tourId,
        guestSize: Number(booking.guestSize),
        bookAt: booking.bookAt,
        fullName: booking.fullName,
        phone: booking.phone,
        notes: booking.notes,
      };

      const { data } = await apiClient.post('/payments/checkout-session', payload);

      if (data?.url) {
        window.location.href = data.url;
        return;
      }

      if (!data?.sessionId) {
        throw new Error(data?.message || 'Unable to start checkout');
      }

      const { error: stripeError } = await stripe.redirectToCheckout({ sessionId: data.sessionId });

      if (stripeError) {
        setError(stripeError.message || 'Unable to redirect to checkout');
      }
    } catch (err) {
      setError((err as Error).message || 'Unable to process booking');
    } finally {
      setLoading(false);
    }
  };

  const serviceFee = 200;

  const totalAmount = Number(price) * Number(booking.guestSize || 1) + Number(serviceFee);
  return (
    <div className="booking">
      <div className="booking__top d-flex align-items-center justify-content-between">
        <h3>₹{price} <span>/per person</span></h3>

        <span className="tour__rating d-flex align-items-center">
          <i className="ri-star-s-fill"></i>
          {avgRating === 0 ? null : avgRating} ({reviews?.length})
        </span>
      </div>
      {/*===================booking form start=======================*/}
      <div className="booking__form">
        <h5>Information</h5>
        {error && (
          <Alert color="danger" className="mt-2">
            {error}
          </Alert>
        )}
        <Form className="booking__info-form" onSubmit={handleCheckout}>
          <FormGroup>
            <input type="text" placeholder="Full Name" id="fullName"
              required value={booking.fullName} onChange={handleChange} />
          </FormGroup>
          <FormGroup>
            <input type="tel" placeholder="Phone" id="phone"
              required value={booking.phone} onChange={handleChange} />
          </FormGroup>
          <FormGroup className="d-flex align-items-center gap-3">
            <input type="date" placeholder="" id="bookAt"
              min={minDate} required value={booking.bookAt} onChange={handleChange} />
            <input type="number" min="1" placeholder="Guest" id="guestSize"
              required value={booking.guestSize} onChange={handleChange} />
          </FormGroup>
          <FormGroup>
            <textarea
              placeholder="Notes (optional)"
              id="notes"
              rows={3}
              value={booking.notes}
              onChange={handleChange}
            />
          </FormGroup>
          <Button className="btn primary__btn w-100 mt-4" type="submit" disabled={loading}>
            {loading ? 'Processing…' : 'Proceed to Payment'}
          </Button>
        </Form>
      </div>
      {/*====================booking form end========================*/}

      {/*====================booking end========================*/}
      <div className="booking__bottom">
        <ListGroup>
          <ListGroupItem className="border-0 px-0">
            <h5 className="d-flex align-items-center gap-1">
            ₹{price} <i className="ri-close-line"></i>{booking.guestSize} {booking.guestSize > 1 ? 'people' : 'person'}</h5>
            <span>₹{Number(price) * Number(booking.guestSize || 1)}</span>
          </ListGroupItem>
          <ListGroupItem className="border-0 px-0">
            <h5>Service charge</h5>
            <span>₹{serviceFee}</span>
          </ListGroupItem>
          <ListGroupItem className="border-0 px-0 total">
            <h5>Total</h5>
            <span>₹{totalAmount}</span>
          </ListGroupItem>
        </ListGroup>
      </div>

    </div>
  )
}

export default Booking

