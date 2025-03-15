import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { getRouteById, createBooking } from '../api';
import { AuthContext } from '../context/AuthContext';
import Loader from '../components/Loader';
import Message from '../components/Message';
import SeatSelector from '../components/SeatSelector';
import { toast } from 'react-toastify';
import moment from 'moment';
import { FaRupeeSign, FaArrowRight, FaClock, FaRoute, FaBus } from 'react-icons/fa';

const BookingPage = () => {
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [transactionId, setTransactionId] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);

  const { routeId } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useContext(AuthContext);

  useEffect(() => {
    const fetchRouteDetails = async () => {
      try {
        setLoading(true);
        const { data } = await getRouteById(routeId);
        setRoute(data);
      } catch (error) {
        setError(
          error.response && error.response.data.message
            ? error.response.data.message
            : 'Failed to fetch route details'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRouteDetails();
  }, [routeId]);

  const handleSeatSelect = (seats) => {
    setSelectedSeats(seats);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (selectedSeats.length === 0) {
      toast.error('Please select at least one seat');
      return;
    }

    // Validate passenger details
    const isValid = selectedSeats.every(
      (seat) => 
        seat.passenger.name.trim() !== '' && 
        seat.passenger.age.toString().trim() !== '' &&
        seat.passenger.gender.trim() !== ''
    );

    if (!isValid) {
      toast.error('Please fill in all passenger details');
      return;
    }

    try {
      setBookingLoading(true);
      
      const bookingData = {
        routeId,
        seats: selectedSeats,
        paymentMethod,
        transactionId: transactionId.trim() !== '' ? transactionId : undefined,
      };

      const { data } = await createBooking(bookingData);
      toast.success('Booking created successfully!');
      navigate(`/booking-confirmation/${data._id}`);
    } catch (error) {
      toast.error(
        error.response && error.response.data.message
          ? error.response.data.message
          : 'Failed to create booking'
      );
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <Loader />;
  if (error) return <Message variant="danger">{error}</Message>;
  if (!route) return null;

  // Format times
  const departureTime = moment(route.departureTime).format('hh:mm A');
  const arrivalTime = moment(route.arrivalTime).format('hh:mm A');
  const date = moment(route.departureTime).format('DD MMM YYYY');
  
  // Calculate duration in hours and minutes
  const durationHours = Math.floor(route.duration / 60);
  const durationMinutes = route.duration % 60;

  // Calculate total fare
  const totalFare = route.fare * selectedSeats.length;

  return (
    <Container>
      <h2 className="mb-4">Book Your Ticket</h2>
      
      <Row>
        <Col md={8}>
          <Card className="mb-4">
            <Card.Header>
              <h4>Journey Details</h4>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={4}>
                  <div className="text-center mb-3">
                    <div className="text-muted small">FROM</div>
                    <h5>{route.source}</h5>
                    <div>{departureTime}</div>
                    <div className="small">{date}</div>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="text-center mb-3">
                    <div className="d-flex align-items-center justify-content-center mb-2">
                      <FaClock className="me-1" />
                      <span>{durationHours}h {durationMinutes}m</span>
                    </div>
                    <div className="d-flex align-items-center justify-content-center">
                      <div className="border-top border-2 w-100"></div>
                      <FaArrowRight className="mx-2" />
                      <div className="border-top border-2 w-100"></div>
                    </div>
                    <div className="mt-2">
                      <FaRoute className="me-1" />
                      <span>{route.distance} km</span>
                    </div>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="text-center mb-3">
                    <div className="text-muted small">TO</div>
                    <h5>{route.destination}</h5>
                    <div>{arrivalTime}</div>
                    <div className="small">{date}</div>
                  </div>
                </Col>
              </Row>
              <hr />
              <div>
                <h5>
                  <FaBus className="me-2" />
                  {route.bus.busName} ({route.bus.busType})
                </h5>
                <div className="small text-muted">Bus No: {route.bus.busNumber}</div>
              </div>
            </Card.Body>
          </Card>

          <Card className="mb-4">
            <Card.Header>
              <h4>Select Seats</h4>
            </Card.Header>
            <Card.Body>
              <SeatSelector 
                totalSeats={route.bus.totalSeats} 
                bookedSeats={[]} // In a real app, you'd fetch booked seats
                onSeatSelect={handleSeatSelect}
              />
            </Card.Body>
          </Card>

          {selectedSeats.length > 0 && (
            <Card className="mb-4">
              <Card.Header>
                <h4>Payment Details</h4>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Payment Method</Form.Label>
                    <Form.Select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                      <option value="Credit Card">Credit Card</option>
                      <option value="Debit Card">Debit Card</option>
                      <option value="UPI">UPI</option>
                      <option value="Net Banking">Net Banking</option>
                      <option value="Cash">Cash</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Transaction ID (Optional)</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter transaction ID"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                    />
                    <Form.Text className="text-muted">
                      If you've already made the payment, enter the transaction ID here.
                    </Form.Text>
                  </Form.Group>

                  <Button
                    type="submit"
                    variant="primary"
                    className="w-100"
                    disabled={bookingLoading}
                  >
                    {bookingLoading ? 'Processing...' : 'Confirm Booking'}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          )}
        </Col>

        <Col md={4}>
          <Card className="booking-summary">
            <Card.Header>
              <h4>Booking Summary</h4>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <h5>Passenger Details</h5>
                <p>Name: {userInfo.name}</p>
                <p>Email: {userInfo.email}</p>
                <p>Phone: {userInfo.phone}</p>
              </div>

              <hr />

              <div className="mb-3">
                <h5>Fare Details</h5>
                <div className="d-flex justify-content-between mb-2">
                  <span>Base Fare ({selectedSeats.length} seats)</span>
                  <span><FaRupeeSign size={12} /> {totalFare}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Service Fee</span>
                  <span><FaRupeeSign size={12} /> 0</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between fw-bold">
                  <span>Total Amount</span>
                  <span><FaRupeeSign size={12} /> {totalFare}</span>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default BookingPage;