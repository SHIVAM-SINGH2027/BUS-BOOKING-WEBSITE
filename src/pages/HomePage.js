import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaBus, FaTicketAlt, FaUserClock, FaMapMarkedAlt } from 'react-icons/fa';
import SearchForm from '../components/SearchForm';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  const handleSearch = (searchData) => {
    navigate('/search', { state: { searchData } });
  };

  return (
    <Container>
      <div className="text-center my-5">
        <h1>Welcome to Bus Booking System</h1>
        <p className="lead">Book your bus tickets online with ease and comfort</p>
      </div>

      <SearchForm onSearch={handleSearch} />

      <Row className="my-5">
        <Col md={3} className="mb-4">
          <Card className="h-100 text-center dashboard-card">
            <Card.Body>
              <div className="mb-3">
                <FaBus size={40} className="text-primary" />
              </div>
              <Card.Title>Wide Selection</Card.Title>
              <Card.Text>
                Choose from a wide range of buses including AC, Non-AC, Sleeper, and Luxury options.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-4">
          <Card className="h-100 text-center dashboard-card">
            <Card.Body>
              <div className="mb-3">
                <FaTicketAlt size={40} className="text-success" />
              </div>
              <Card.Title>Easy Booking</Card.Title>
              <Card.Text>
                Book your tickets in just a few clicks. Simple and hassle-free booking process.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-4">
          <Card className="h-100 text-center dashboard-card">
            <Card.Body>
              <div className="mb-3">
                <FaUserClock size={40} className="text-danger" />
              </div>
              <Card.Title>24/7 Support</Card.Title>
              <Card.Text>
                Our customer support team is available 24/7 to assist you with any queries.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-4">
          <Card className="h-100 text-center dashboard-card">
            <Card.Body>
              <div className="mb-3">
                <FaMapMarkedAlt size={40} className="text-info" />
              </div>
              <Card.Title>Nationwide Coverage</Card.Title>
              <Card.Text>
                We cover all major cities and routes across the country for your convenience.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <div className="bg-light p-5 rounded-3 mb-5">
        <Row>
          <Col md={6}>
            <h2>Why Choose Us?</h2>
            <ul className="mt-4">
              <li className="mb-2">Secure and reliable booking platform</li>
              <li className="mb-2">Transparent pricing with no hidden charges</li>
              <li className="mb-2">Easy cancellation and refund process</li>
              <li className="mb-2">Regular discounts and offers</li>
              <li className="mb-2">Real-time bus tracking</li>
              <li className="mb-2">Verified bus operators for safety</li>
            </ul>
            <Link to="/search">
              <Button variant="primary" size="lg" className="mt-3">
                Book Now
              </Button>
            </Link>
          </Col>
          <Col md={6}>
            <img 
              src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80" 
              alt="Bus Travel" 
              className="img-fluid rounded"
              style={{ height: '300px', width: '100%', objectFit: 'cover' }}
            />
          </Col>
        </Row>
      </div>

      <div className="text-center mb-5">
        <h2>Popular Routes</h2>
        <Row className="mt-4">
          <Col md={4} className="mb-4">
            <Card className="h-100 dashboard-card">
              <Card.Body className="text-center">
                <h5>Delhi to Jaipur</h5>
                <p>Starting from ₹800</p>
                <Link to="/search">
                  <Button variant="outline-primary">Check Availability</Button>
                </Link>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-4">
            <Card className="h-100 dashboard-card">
              <Card.Body className="text-center">
                <h5>Mumbai to Pune</h5>
                <p>Starting from ₹500</p>
                <Link to="/search">
                  <Button variant="outline-primary">Check Availability</Button>
                </Link>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-4">
            <Card className="h-100 dashboard-card">
              <Card.Body className="text-center">
                <h5>Bangalore to Chennai</h5>
                <p>Starting from ₹700</p>
                <Link to="/search">
                  <Button variant="outline-primary">Check Availability</Button>
                </Link>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </Container>
  );
};

export default HomePage;