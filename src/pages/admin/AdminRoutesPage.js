import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getAllRoutes, deleteRoute } from '../../api';
import AdminSidebar from '../../components/AdminSidebar';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { toast } from 'react-toastify';
import { FaRoute, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import moment from 'moment';

const AdminRoutesPage = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      setLoading(true);
      const { data } = await getAllRoutes();
      setRoutes(data);
    } catch (error) {
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : 'Failed to fetch routes'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this route?')) {
      try {
        setDeletingId(id);
        await deleteRoute(id);
        toast.success('Route deleted successfully');
        fetchRoutes(); // Refresh routes
      } catch (error) {
        toast.error(
          error.response && error.response.data.message
            ? error.response.data.message
            : 'Failed to delete route'
        );
      } finally {
        setDeletingId(null);
      }
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
              <FaRoute className="me-2" />
              Routes
            </h2>
            <Link to="/admin/route/add">
              <Button variant="primary">
                <FaPlus className="me-2" />
                Add New Route
              </Button>
            </Link>
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
                    <th>Source</th>
                    <th>Destination</th>
                    <th>Bus</th>
                    <th>Departure</th>
                    <th>Arrival</th>
                    <th>Fare (₹)</th>
                    <th>Available Seats</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {routes.map((route) => (
                    <tr key={route._id}>
                      <td>{route.source}</td>
                      <td>{route.destination}</td>
                      <td>
                        {route.bus.busName} ({route.bus.busNumber})
                      </td>
                      <td>
                        {moment(route.departureTime).format('DD MMM YYYY, hh:mm A')}
                      </td>
                      <td>
                        {moment(route.arrivalTime).format('DD MMM YYYY, hh:mm A')}
                      </td>
                      <td>{route.fare}</td>
                      <td>
                        <Badge bg={
                          route.availableSeats > 10 ? 'success' : 
                          route.availableSeats > 0 ? 'warning' : 'danger'
                        }>
                          {route.availableSeats}
                        </Badge>
                      </td>
                      <td>
                        <Badge bg={route.isActive ? 'success' : 'danger'}>
                          {route.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td>
                        <Link to={`/admin/route/edit/${route._id}`}>
                          <Button variant="outline-primary" size="sm" className="me-2">
                            <FaEdit />
                          </Button>
                        </Link>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(route._id)}
                          disabled={deletingId === route._id}
                        >
                          <FaTrash />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              
              {routes.length === 0 && (
                <div className="text-center py-4">
                  <p>No routes found</p>
                  <Link to="/admin/route/add">
                    <Button variant="primary">Add New Route</Button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default AdminRoutesPage;