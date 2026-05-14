'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Container, Row, Col, Spinner, Alert, Card, CardBody, Button } from 'reactstrap';
import apiClient from '../../services/apiClient';

const PaymentStatus = () => {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  const [state, setState] = useState({
    loading: true,
    booking: null,
    error: null,
  });

  useEffect(() => {
    const fetchStatus = async () => {
      if (!sessionId) {
        return setState({ loading: false, booking: null, error: 'Missing payment session' });
      }

      try {
        const { data } = await apiClient.get(`/payments/status/${sessionId}`);
        setState({ loading: false, booking: data.booking, error: null });
      } catch (error) {
        const message = error.response?.data?.message || error.message || 'Unable to retrieve payment status';
        setState({ loading: false, booking: null, error: message });
      }
    };

    fetchStatus();
  }, [sessionId]);

  const { loading, booking, error } = state;

  const formatAmount = (amount, currency = 'INR') => {
    try {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: currency.toUpperCase(),
      }).format(amount || 0);
    } catch (err) {
      return `${currency.toUpperCase()} ${amount}`;
    }
  };

  return (
    <section className="pt-5 pb-5">
      <Container>
        <Row className="justify-content-center">
          <Col lg="8">
            <Card className="shadow-sm">
              <CardBody className="text-center">
                {loading && (
                  <div className="py-5">
                    <Spinner color="primary" />
                    <p className="mt-3 mb-0">Validating your payment…</p>
                  </div>
                )}

                {!loading && error && (
                  <div className="py-5">
                    <Alert color="danger">{error}</Alert>
                    <Link href="/tours" className="btn btn-primary">
                      Explore tours
                    </Link>
                  </div>
                )}

                {!loading && booking && (
                  <div className="py-4">
                    <Alert color={booking.hasPaid ? 'success' : 'warning'}>
                      {booking.hasPaid ? 'Payment confirmed!' : 'Payment pending'}
                    </Alert>
                    <h3 className="mb-3">{booking.tourName}</h3>
                    <p className="mb-1"><strong>Guests:</strong> {booking.guestSize}</p>
                    <p className="mb-1"><strong>Date:</strong> {booking.bookAt ? new Date(booking.bookAt).toLocaleDateString() : 'Pending'}</p>
                    <p className="mb-1"><strong>Status:</strong> {booking.paymentStatus}</p>
                    <p className="mb-3"><strong>Total Paid:</strong> {formatAmount(booking.amount, booking.currency)}</p>
                    {booking.notes && (
                      <p className="mb-3"><strong>Notes:</strong> {booking.notes}</p>
                    )}
                    <div className="d-flex justify-content-center gap-3 flex-wrap">
                      <Link href="/" className="btn btn-primary">
                        Back to home
                      </Link>
                      <Link href="/tours" className="btn btn-secondary">
                        Discover more tours
                      </Link>
                      {booking.receiptUrl && (
                        <Button
                          tag="a"
                          href={booking.receiptUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          color="success"
                        >
                          View receipt
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default PaymentStatus;

