import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getAllBookings, updateBookingStatus } from '../../api';
import AdminSidebar from '../../components/AdminSidebar';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { toast } from 'react-toastify';
import { FaEye } from 'react-icons/fa';

import { FaTicketAlt, FaEdit, FaCheck, FaTimes } from 'react-icons/fa';
import moment from 'moment';

const AdminBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const { data } = await getAllBookings();
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

  const handleStatusUpdate = async (id, status) => {
    try {
      setUpdatingId(id);
      await updateBookingStatus(id, { bookingStatus: status });
      toast.success(`Booking ${status.toLowerCase()} successfully`);
      fetchBookings(); // Refresh bookings
    } catch (error) {
      toast.error(
        error.response && error.response.data.message
          ? error.response.data.message
          : 'Failed to update booking status'
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Confirmed':
        return <Badge bg="success">Confirmed</Badge>;
      case 'Cancelled':
        return <Badge bg="danger">Cancelled</Badge>;
      default:
        return <Badge bg="warning">Pending</Badge>;
    }
  };

  const getPaymentStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return <Badge bg="success">Completed</Badge>;
      case 'Refunded':
        return <Badge bg="info">Refunded</Badge>;
      case 'Failed':
        return <Badge bg="danger">Failed</Badge>;
      default:
        return <Badge bg="warning">Pending</Badge>;
    }
  };

  return (
    <Container fluid>
      <Row>
        <Col md={3} lg={2} className="d-none d-md-block">
          <AdminSidebar />
        </Col>
        <Col md={9} lg={10} className="admin-content">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>
              <FaTicketAlt className="me-2" />
              Bookings
            </h2>
          </div>

          {loading ? (
            <Loader />
          ) : error ? (
            <Message variant="danger">{error}</Message>
          ) : (
            <div className="table-responsive">
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>User</th>
                    <th>Route</th>
                    <th>Date</th>
                    <th>Seats</th>
                    <th>Amount</th>
                    <th>Payment</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking._id}>
                      <td>{booking._id.substring(0, 8)}...</td>
                      <td>{booking.user.name}</td>
                      <td>
                        {booking.route.source} to {booking.route.destination}
                      </td>
                      <td>
                        {moment(booking.route.departureTime).format('DD MMM YYYY')}
                      </td>
                      <td>{booking.seats.length}</td>
                      <td>₹{booking.totalAmount}</td>
                      <td>{getPaymentStatusBadge(booking.paymentStatus)}</td>
                      <td>{getStatusBadge(booking.bookingStatus)}</td>
                      <td>
                        <Link to={`/booking-details/${booking._id}`}>
                          <Button variant="outline-primary" size="sm" className="me-2">
                            <FaEye />
                          </Button>
                        </Link>
                        {booking.bookingStatus === 'Pending' && (
                          <>
                            <Button
                              variant="outline-success"
                              size="sm"
                              className="me-2"
                              onClick={() => handleStatusUpdate(booking._id, 'Confirmed')}
                              disabled={updatingId === booking._id}
                            >
                              <FaCheck />
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleStatusUpdate(booking._id, 'Cancelled')}
                              disabled={updatingId === booking._id}
                            >
                              <FaTimes />
                            </Button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              
              {bookings.length === 0 && (
                <div className="text-center py-4">
                  <p>No bookings found</p>
                </div>
              )}
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default AdminBookingsPage;