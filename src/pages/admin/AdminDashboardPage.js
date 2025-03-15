import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getDashboardStats, getRevenueStats } from '../../api';
import AdminSidebar from '../../components/AdminSidebar';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { FaUsers, FaBus, FaRoute, FaTicketAlt, FaRupeeSign, FaChartLine } from 'react-icons/fa';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [revenueStats, setRevenueStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [statsResponse, revenueResponse] = await Promise.all([
          getDashboardStats(),
          getRevenueStats()
        ]);
        setStats(statsResponse.data);
        setRevenueStats(revenueResponse.data);
      } catch (error) {
        setError(
          error.response && error.response.data.message
            ? error.response.data.message
            : 'Failed to fetch dashboard data'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <Loader />;
  if (error) return <Message variant="danger">{error}</Message>;
  if (!stats) return null;

  return (
    <Container fluid>
      <Row>
        <Col md={3} lg={2} className="d-none d-md-block">
          <AdminSidebar />
        </Col>
        <Col md={9} lg={10} className="admin-content">
          <h2 className="mb-4">Admin Dashboard</h2>
          
          <Row>
            <Col md={3} className="mb-4">
              <Card className="dashboard-card bg-primary text-white">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-0">Total Users</h6>
                      <h2 className="mt-2 mb-0">{stats.totalUsers}</h2>
                    </div>
                    <FaUsers size={40} opacity={0.7} />
                  </div>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={3} className="mb-4">
              <Card className="dashboard-card bg-success text-white">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-0">Total Buses</h6>
                      <h2 className="mt-2 mb-0">{stats.totalBuses}</h2>
                    </div>
                    <FaBus size={40} opacity={0.7} />
                  </div>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={3} className="mb-4">
              <Card className="dashboard-card bg-info text-white">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-0">Total Routes</h6>
                      <h2 className="mt-2 mb-0">{stats.totalRoutes}</h2>
                    </div>
                    <FaRoute size={40} opacity={0.7} />
                  </div>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={3} className="mb-4">
              <Card className="dashboard-card bg-warning text-white">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-0">Total Bookings</h6>
                      <h2 className="mt-2 mb-0">{stats.totalBookings}</h2>
                    </div>
                    <FaTicketAlt size={40} opacity={0.7} />
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          
          <Row className="mb-4">
            <Col md={6}>
              <Card className="dashboard-card h-100">
                <Card.Header>
                  <h5 className="mb-0">
                    <FaRupeeSign className="me-2" />
                    Revenue Overview
                  </h5>
                </Card.Header>
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h3 className="mb-0">₹{stats.totalRevenue.toLocaleString()}</h3>
                    <span className="text-success">
                      <FaChartLine className="me-1" />
                      Total Revenue
                    </span>
                  </div>
                  
                  <div className="table-responsive">
                    <table className="table table-sm">
                      <thead>
                        <tr>
                          <th>Month</th>
                          <th>Revenue</th>
                          <th>Bookings</th>
                        </tr>
                      </thead>
                      <tbody>
                        {revenueStats.slice(0, 6).map((month, index) => (
                          <tr key={index}>
                            <td>{month.month}</td>
                            <td>₹{month.revenue.toLocaleString()}</td>
                            <td>{month.bookings}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={6}>
              <Card className="dashboard-card h-100">
                <Card.Header>
                  <h5 className="mb-0">
                    <FaRoute className="me-2" />
                    Popular Routes
                  </h5>
                </Card.Header>
                <Card.Body>
                  {stats.popularRoutes.length > 0 ? (
                    <div className="table-responsive">
                      <table className="table table-sm">
                        <thead>
                          <tr>
                            <th>Route</th>
                            <th>Bookings</th>
                          </tr>
                        </thead>
                        <tbody>
                          {stats.popularRoutes.map((route, index) => (
                            <tr key={index}>
                              <td>
                                {route._id ? `${route._id.source} to ${route._id.destination}` : 'Unknown Route'}
                              </td>
                              <td>{route.count}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-center mt-4">No route data available</p>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
          
          <Card className="dashboard-card">
            <Card.Header>
              <h5 className="mb-0">
                <FaTicketAlt className="me-2" />
                Recent Bookings
              </h5>
            </Card.Header>
            <Card.Body>
              {stats.recentBookings.length > 0 ? (
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Booking ID</th>
                        <th>User</th>
                        <th>Route</th>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentBookings.map((booking) => (
                        <tr key={booking._id}>
                          <td>
                            <Link to={`/admin/bookings/${booking._id}`}>
                              {booking._id.substring(0, 8)}...
                            </Link>
                          </td>
                          <td>{booking.user.name}</td>
                          <td>
                            {booking.route.source} to {booking.route.destination}
                          </td>
                          <td>
                            {new Date(booking.route.departureTime).toLocaleDateString()}
                          </td>
                          <td>₹{booking.totalAmount}</td>
                          <td>
                            <span className={`badge bg-${
                              booking.bookingStatus === 'Confirmed'
                                ? 'success'
                                : booking.bookingStatus === 'Cancelled'
                                ? 'danger'
                                : 'warning'
                            }`}>
                              {booking.bookingStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center mt-4">No recent bookings</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboardPage;