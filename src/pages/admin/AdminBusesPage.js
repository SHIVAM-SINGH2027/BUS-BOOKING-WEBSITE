import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getAllBuses, deleteBus } from '../../api';
import AdminSidebar from '../../components/AdminSidebar';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { toast } from 'react-toastify';
import { FaBus, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const AdminBusesPage = () => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchBuses();
  }, []);

  const fetchBuses = async () => {
    try {
      setLoading(true);
      const { data } = await getAllBuses();
      setBuses(data);
    } catch (error) {
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : 'Failed to fetch buses'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this bus?')) {
      try {
        setDeletingId(id);
        await deleteBus(id);
        toast.success('Bus deleted successfully');
        fetchBuses(); // Refresh buses
      } catch (error) {
        toast.error(
          error.response && error.response.data.message
            ? error.response.data.message
            : 'Failed to delete bus'
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
              <FaBus className="me-2" />
              Buses
            </h2>
            <Link to="/admin/bus/add">
              <Button variant="primary">
                <FaPlus className="me-2" />
                Add New Bus
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
                    <th>Bus Number</th>
                    <th>Bus Name</th>
                    <th>Type</th>
                    <th>Total Seats</th>
                    <th>Amenities</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {buses.map((bus) => (
                    <tr key={bus._id}>
                      <td>{bus.busNumber}</td>
                      <td>{bus.busName}</td>
                      <td>
                        <Badge bg={
                          bus.busType === 'AC' ? 'primary' : 
                          bus.busType === 'Sleeper' ? 'success' : 
                          bus.busType === 'Luxury' ? 'info' : 'secondary'
                        }>
                          {bus.busType}
                        </Badge>
                      </td>
                      <td>{bus.totalSeats}</td>
                      <td>
                        {bus.amenities && bus.amenities.length > 0 ? (
                          bus.amenities.map((amenity, index) => (
                            <Badge key={index} bg="light" text="dark" className="me-1">
                              {amenity}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-muted">None</span>
                        )}
                      </td>
                      <td>
                        <Badge bg={bus.isActive ? 'success' : 'danger'}>
                          {bus.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td>
                        <Link to={`/admin/bus/edit/${bus._id}`}>
                          <Button variant="outline-primary" size="sm" className="me-2">
                            <FaEdit />
                          </Button>
                        </Link>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(bus._id)}
                          disabled={deletingId === bus._id}
                        >
                          <FaTrash />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              
              {buses.length === 0 && (
                <div className="text-center py-4">
                  <p>No buses found</p>
                  <Link to="/admin/bus/add">
                    <Button variant="primary">Add New Bus</Button>
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

export default AdminBusesPage;