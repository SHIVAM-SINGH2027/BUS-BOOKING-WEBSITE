import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { getBusById, createBus, updateBus } from '../../api';
import AdminSidebar from '../../components/AdminSidebar';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { toast } from 'react-toastify';
import { FaBus, FaSave, FaTimes } from 'react-icons/fa';

const AdminBusFormPage = () => {
  const [busNumber, setBusNumber] = useState('');
  const [busName, setBusName] = useState('');
  const [busType, setBusType] = useState('AC');
  const [totalSeats, setTotalSeats] = useState(40);
  const [amenities, setAmenities] = useState([]);
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fetchLoading, setFetchLoading] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  // Available amenities
  const availableAmenities = [
    'WiFi',
    'Charging Point',
    'AC',
    'Blanket',
    'Water Bottle',
    'Snacks',
    'Movie',
    'Reading Light',
    'Toilet',
  ];

  useEffect(() => {
    if (isEditMode) {
      fetchBusDetails();
    }
  }, [id]);

  const fetchBusDetails = async () => {
    try {
      setFetchLoading(true);
      const { data } = await getBusById(id);
      setBusNumber(data.busNumber);
      setBusName(data.busName);
      setBusType(data.busType);
      setTotalSeats(data.totalSeats);
      setAmenities(data.amenities || []);
      setIsActive(data.isActive);
    } catch (error) {
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : 'Failed to fetch bus details'
      );
    } finally {
      setFetchLoading(false);
    }
  };

  const handleAmenityChange = (amenity) => {
    if (amenities.includes(amenity)) {
      setAmenities(amenities.filter((a) => a !== amenity));
    } else {
      setAmenities([...amenities, amenity]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');
      
      const busData = {
        busNumber,
        busName,
        busType,
        totalSeats,
        amenities,
        isActive,
      };

      if (isEditMode) {
        await updateBus(id, busData);
        toast.success('Bus updated successfully');
      } else {
        await createBus(busData);
        toast.success('Bus created successfully');
      }
      
      navigate('/admin/buses');
    } catch (error) {
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : isEditMode ? 'Failed to update bus' : 'Failed to create bus'
      );
      toast.error(error.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) return <Loader />;

  return (
    <Container fluid>
      <Row>
        <Col md={3} lg={2} className="d-none d-md-block">
          <AdminSidebar />
        </Col>
        <Col md={9} lg={10} className="admin-content">
          <Card>
            <Card.Header>
              <h2>
                <FaBus className="me-2" />
                {isEditMode ? 'Edit Bus' : 'Add New Bus'}
              </h2>
            </Card.Header>
            <Card.Body>
              {error && <Message variant="danger">{error}</Message>}
              
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="busNumber">
                      <Form.Label>Bus Number</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter bus number"
                        value={busNumber}
                        onChange={(e) => setBusNumber(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="busName">
                      <Form.Label>Bus Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter bus name"
                        value={busName}
                        onChange={(e) => setBusName(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="busType">
                      <Form.Label>Bus Type</Form.Label>
                      <Form.Select
                        value={busType}
                        onChange={(e) => setBusType(e.target.value)}
                        required
                      >
                        <option value="AC">AC</option>
                        <option value="Non-AC">Non-AC</option>
                        <option value="Sleeper">Sleeper</option>
                        <option value="Semi-Sleeper">Semi-Sleeper</option>
                        <option value="Luxury">Luxury</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="totalSeats">
                      <Form.Label>Total Seats</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Enter total seats"
                        value={totalSeats}
                        onChange={(e) => setTotalSeats(Number(e.target.value))}
                        min="1"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3" controlId="amenities">
                  <Form.Label>Amenities</Form.Label>
                  <div className="d-flex flex-wrap">
                    {availableAmenities.map((amenity) => (
                      <Form.Check
                        key={amenity}
                        type="checkbox"
                        id={`amenity-${amenity}`}
                        label={amenity}
                        className="me-3 mb-2"
                        checked={amenities.includes(amenity)}
                        onChange={() => handleAmenityChange(amenity)}
                      />
                    ))}
                  </div>
                </Form.Group>

                <Form.Group className="mb-3" controlId="isActive">
                  <Form.Check
                    type="switch"
                    label="Active"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                  />
                </Form.Group>

                <div className="d-flex justify-content-end">
                  <Button
                    variant="secondary"
                    className="me-2"
                    onClick={() => navigate('/admin/buses')}
                  >
                    <FaTimes className="me-1" />
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" disabled={loading}>
                    <FaSave className="me-1" />
                    {loading ? 'Saving...' : 'Save Bus'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminBusFormPage;