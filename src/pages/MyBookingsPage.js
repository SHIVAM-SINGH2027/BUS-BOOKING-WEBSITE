
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getMyBookings, cancelBooking } from '../api';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { toast } from 'react-toastify';
import moment from 'moment';
import { FaTicketAlt, FaBus, FaMapMarkerAlt, FaClock, FaRupeeSign, FaEye, FaTimes } from 'react-icons/fa';

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const { data } = await getMyBookings();
      setBookings(data);
    } catch (error) {
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : 'Failed to fetch bookings'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (id) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        setCancellingId(id);
        await cancelBooking(id);
        toast.success('Booking cancelled successfully');
        fetchBookings();
      } catch (error) {
        toast.error(
          error.response && error.response.data.message
            ? error.response.data.message
            : 'Failed to cancel booking'
        );
      } finally {
        setCancellingId(null);
      }
    }
  };

  if (loading) return <Loader />;
  if (error) return <Message variant="danger">{error}</Message>;

  return (
    <Container>
      <h2 className="mb-4">My Bookings</h2>
      {bookings.length === 0 ? (
        <Message variant="info">
          You have no bookings yet. <Link to="/search">Book a ticket now</Link>
        </Message>
      ) : (
        <Row>
          {bookings.map((booking) => {
            const departureTime = moment(booking.route.departureTime).format('hh:mm A');
            const arrivalTime = moment(booking.route.arrivalTime).format('hh:mm A');
            const date = moment(booking.route.departureTime).format('DD MMM YYYY');
            const bookingDate = moment(booking.createdAt).format('DD MMM YYYY');
            const isPastJourney = moment(booking.route.departureTime).isBefore(moment());
            const canCancel =
              booking.bookingStatus !== 'Cancelled' &&
              !isPastJourney &&
              moment(booking.route.departureTime).diff(moment(), 'hours') > 2;

            return (
              <Col md={6} key={booking._id} className="mb-4">
                <Card className="booking-card h-100">
                  <Card.Header className="booking-header d-flex justify-content-between align-items-center">
                    <div>
                      <h5 className="mb-0">
                        <FaTicketAlt className="me-2" />
                        {booking.route.source} to {booking.route.destination}
                      </h5>
                      <small className="text-muted">Booked on: {bookingDate}</small>
                    </div>
                    <Badge bg={booking.bookingStatus === 'Confirmed' ? 'success' : booking.bookingStatus === 'Cancelled' ? 'danger' : 'warning'}>
                      {booking.bookingStatus}
                    </Badge>
                  </Card.Header>

                  <Card.Body className="booking-body">
                    <div className="mb-3">
                      <div className="d-flex justify-content-between mb-2">
                        <div>
                          <FaBus className="me-1" /> {booking.route.bus.busName}
                        </div>
                        <div>{booking.route.bus.busType}</div>
                      </div>

                      <div className="d-flex justify-content-between mb-2">
                        <div>
                          <FaMapMarkerAlt className="me-1" /> {booking.route.source}
                        </div>
                        <div>
                          <FaMapMarkerAlt className="me-1" /> {booking.route.destination}
                        </div>
                      </div>

                      <div className="d-flex justify-content-between mb-2">
                        <div>
                          <FaClock className="me-1" /> {departureTime}
                        </div>
                        <div>
                          <FaClock className="me-1" /> {arrivalTime}
                        </div>
                      </div>

                      <div className="text-center">
                        <small className="text-muted">{date}</small>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="d-flex justify-content-between">
                        <span>Seats: {booking.seats.map((seat) => seat.seatNumber).join(', ')}</span>
                        <span>
                          <FaRupeeSign size={12} /> {booking.totalAmount}
                        </span>
                      </div>
                    </div>
                  </Card.Body>

                  <Card.Footer className="booking-footer d-flex justify-content-between">
                    <Link to={`/booking-details/${booking._id}`}>
                      <Button variant="outline-primary" size="sm">
                        <FaEye className="me-1" /> View Details
                      </Button>
                    </Link>

                    {canCancel && (
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleCancelBooking(booking._id)}
                        disabled={cancellingId === booking._id}
                      >
                        <FaTimes className="me-1" />
                        {cancellingId === booking._id ? 'Cancelling...' : 'Cancel Booking'}
                      </Button>
                    )}
                  </Card.Footer>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}
    </Container>
  );
};

export default MyBookingsPage;
