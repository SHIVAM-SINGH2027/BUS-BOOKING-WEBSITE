import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { getBookingById } from '../api';
import Loader from '../components/Loader';
import Message from '../components/Message';
import moment from 'moment';
import { FaTicketAlt, FaCheckCircle, FaBus, FaMapMarkerAlt, FaClock, FaUser, FaRupeeSign, FaPrint } from 'react-icons/fa';

const BookingConfirmationPage = () => {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { id } = useParams();

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        setLoading(true);
        const { data } = await getBookingById(id);
        setBooking(data);
      } catch (error) {
        setError(
          error.response && error.response.data.message
            ? error.response.data.message
            : 'Failed to fetch booking details'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <Loader />;
  if (error) return <Message variant="danger">{error}</Message>;
  if (!booking) return null;

  // Format times
  const departureTime = moment(booking.route.departureTime).format('hh:mm A');
  const arrivalTime = moment(booking.route.arrivalTime).format('hh:mm A');
  const date = moment(booking.route.departureTime).format('DD MMM YYYY');
  const bookingDate = moment(booking.createdAt).format('DD MMM YYYY, hh:mm A');

  return (
    <Container>
      <Row className="justify-content-center my-5">
        <Col md={8}>
          <Card className="booking-card">
            <Card.Header className="bg-success text-white text-center py-3">
              <FaCheckCircle size={30} className="mb-2" />
              <h3>Booking Confirmed!</h3>
              <p className="mb-0">Your booking has been successfully confirmed.</p>
            </Card.Header>
            
            <Card.Body>
              <div className="text-center mb-4">
                <h4>
                  <FaTicketAlt className="me-2" />
                  Booking ID: {booking._id}
                </h4>
                <p className="text-muted">Booked on: {bookingDate}</p>
                <Badge bg={booking.bookingStatus === 'Confirmed' ? 'success' : booking.bookingStatus === 'Cancelled' ? 'danger' : 'warning'}>
                  {booking.bookingStatus}
                </Badge>
                <Badge bg={booking.paymentStatus === 'Completed' ? 'success' : booking.paymentStatus === 'Refunded' ? 'info' : booking.paymentStatus === 'Failed' ? 'danger' : 'warning'} className="ms-2">
                  Payment: {booking.paymentStatus}
                </Badge>
              </div>

              <Row className="mb-4">
                <Col md={6}>
                  <h5>
                    <FaBus className="me-2" />
                    Bus Details
                  </h5>
                  <p>Bus Name: {booking.route.bus.busName}</p>
                  <p>Bus Number: {booking.route.bus.busNumber}</p>
                  <p>Bus Type: {booking.route.bus.busType}</p>
                </Col>
                <Col md={6}>
                  <h5>
                    <FaMapMarkerAlt className="me-2" />
                    Journey Details
                  </h5>
                  <p>From: {booking.route.source}</p>
                  <p>To: {booking.route.destination}</p>
                  <p>
                    <FaClock className="me-2" />
                    {departureTime} - {arrivalTime}, {date}
                  </p>
                </Col>
              </Row>

              <h5>
                <FaUser className="me-2" />
                Passenger Details
              </h5>
              <div className="table-responsive mb-4">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Seat No.</th>
                      <th>Passenger Name</th>
                      <th>Age</th>
                      <th>Gender</th>
                    </tr>
                  </thead>
                  <tbody>
                    {booking.seats.map((seat, index) => (
                      <tr key={index}>
                        <td>{seat.seatNumber}</td>
                        <td>{seat.passenger.name}</td>
                        <td>{seat.passenger.age}</td>
                        <td>{seat.passenger.gender}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mb-4">
                <h5>Payment Details</h5>
                <p>Payment Method: {booking.paymentMethod}</p>
                {booking.transactionId && <p>Transaction ID: {booking.transactionId}</p>}
                <p className="fw-bold">
                  Total Amount: <FaRupeeSign size={14} /> {booking.totalAmount}
                </p>
              </div>

              <div className="d-flex justify-content-between">
                <Button variant="outline-primary" onClick={handlePrint}>
                  <FaPrint className="me-2" />
                  Print Ticket
                </Button>
                <Link to="/my-bookings">
                  <Button variant="primary">View All Bookings</Button>
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default BookingConfirmationPage;