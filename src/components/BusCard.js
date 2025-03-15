import React from 'react';
import { Card, Row, Col, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaClock, FaRupeeSign, FaArrowRight } from 'react-icons/fa';
import moment from 'moment';

const BusCard = ({ route }) => {
  // Format time
  const departureTime = moment(route.departureTime).format('hh:mm A');
  const arrivalTime = moment(route.arrivalTime).format('hh:mm A');
  const date = moment(route.departureTime).format('DD MMM YYYY');
  
  // Calculate duration in hours and minutes
  const durationHours = Math.floor(route.duration / 60);
  const durationMinutes = route.duration % 60;

  return (
    <Card className="bus-card">
      <Card.Body>
        <Row>
          <Col md={3}>
            <div className="mb-3">
              <h5 className="mb-1">{route.bus.busName}</h5>
              <Badge bg={route.bus.busType === 'AC' ? 'primary' : route.bus.busType === 'Sleeper' ? 'success' : 'secondary'}>
                {route.bus.busType}
              </Badge>
              <div className="mt-2 small text-muted">Bus No: {route.bus.busNumber}</div>
            </div>
          </Col>
          <Col md={3}>
            <div className="text-center mb-3">
              <div className="text-muted small">DEPARTURE</div>
              <h5 className="mb-0">{departureTime}</h5>
              <div className="small">{date}</div>
              <div className="mt-1">{route.source}</div>
            </div>
          </Col>
          <Col md={3}>
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
                <div className="text-muted small">ARRIVAL</div>
                <h5 className="mb-0">{arrivalTime}</h5>
                <div className="small">{route.destination}</div>
              </div>
            </div>
          </Col>
          <Col md={3}>
            <div className="text-end mb-3">
              <div className="mb-2">
                <h5 className="mb-0 d-flex align-items-center justify-content-end">
                  <FaRupeeSign size={16} /> {route.fare}
                </h5>
                <div className="small text-muted">per seat</div>
              </div>
              <div className="mb-2">
                <Badge bg={route.availableSeats > 10 ? 'success' : route.availableSeats > 0 ? 'warning' : 'danger'}>
                  {route.availableSeats} Seats Available
                </Badge>
              </div>
              <Link to={`/booking/${route._id}`}>
                <Button variant="primary" disabled={route.availableSeats === 0}>
                  {route.availableSeats === 0 ? 'Sold Out' : 'Book Now'}
                </Button>
              </Link>
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default BusCard;