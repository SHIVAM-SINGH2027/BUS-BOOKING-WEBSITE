import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, ListGroup } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { getRouteById } from '../api';
import Loader from '../components/Loader';
import Message from '../components/Message';
import moment from 'moment';
import { FaClock, FaRupeeSign, FaRoute, FaBus, FaWifi, FaPlug, FaSnowflake, FaFilm, FaToilet } from 'react-icons/fa';

const BusDetailsPage = () => {
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { id } = useParams();

  useEffect(() => {
    const fetchRouteDetails = async () => {
      try {
        setLoading(true);
        const { data } = await getRouteById(id);
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
  }, [id]);

  // Function to render amenity icon
  const renderAmenityIcon = (amenity) => {
    switch (amenity.toLowerCase()) {
      case 'wifi':
        return <FaWifi />;
      case 'charging point':
        return <FaPlug />;
      case 'ac':
        return <FaSnowflake />;
      case 'movie':
        return <FaFilm />;
      case 'toilet':
        return <FaToilet />;
      default:
        return null;
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

  return (
    <Container>
      <h2 className="mb-4">Bus Details</h2>
      
      <Card className="mb-4">
        <Card.Header>
          <h3>{route.source} to {route.destination}</h3>
          <p className="text-muted mb-0">{date}</p>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={4}>
              <h5>Bus Information</h5>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <FaBus className="me-2" />
                  <strong>Bus Name:</strong> {route.bus.busName}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Bus Number:</strong> {route.bus.busNumber}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Bus Type:</strong>{' '}
                  <Badge bg={route.bus.busType === 'AC' ? 'primary' : route.bus.busType === 'Sleeper' ? 'success' : 'secondary'}>
                    {route.bus.busType}
                  </Badge>
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Total Seats:</strong> {route.bus.totalSeats}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Available Seats:</strong>{' '}
                  <Badge bg={route.availableSeats > 10 ? 'success' : route.availableSeats > 0 ? 'warning' : 'danger'}>
                    {route.availableSeats}
                  </Badge>
                </ListGroup.Item>
              </ListGroup>
            </Col>
            
            <Col md={4}>
              <h5>Journey Details</h5>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <strong>Departure:</strong> {departureTime}, {date}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Arrival:</strong> {arrivalTime}, {date}
                </ListGroup.Item>
                <ListGroup.Item>
                  <FaClock className="me-2" />
                  <strong>Duration:</strong> {durationHours}h {durationMinutes}m
                </ListGroup.Item>
                <ListGroup.Item>
                  <FaRoute className="me-2" />
                  <strong>Distance:</strong> {route.distance} km
                </ListGroup.Item>
                <ListGroup.Item>
                  <FaRupeeSign className="me-2" />
                  <strong>Fare:</strong> ₹{route.fare} per seat
                </ListGroup.Item>
              </ListGroup>
            </Col>
            
            <Col md={4}>
              <h5>Amenities</h5>
              {route.bus.amenities && route.bus.amenities.length > 0 ? (
                <div className="d-flex flex-wrap">
                  {route.bus.amenities.map((amenity, index) => (
                    <Badge 
                      key={index} 
                      bg="light" 
                      text="dark" 
                      className="me-2 mb-2 p-2"
                    >
                      {renderAmenityIcon(amenity)} {amenity}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p>No amenities listed</p>
              )}
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default BusDetailsPage;