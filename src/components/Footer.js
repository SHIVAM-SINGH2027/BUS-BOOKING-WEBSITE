import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaBus, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <Container>
        <Row>
          <Col md={4} className="mb-4 mb-md-0">
            <h5 className="d-flex align-items-center">
              <FaBus className="me-2" /> Bus Booking System
            </h5>
            <p className="mt-3">
              Your trusted partner for comfortable and reliable bus travel. Book your tickets online with ease.
            </p>
          </Col>
          <Col md={4} className="mb-4 mb-md-0">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><a href="/" className="text-white">Home</a></li>
              <li className="mb-2"><a href="/search" className="text-white">Find Buses</a></li>
              <li className="mb-2"><a href="/login" className="text-white">Login</a></li>
              <li className="mb-2"><a href="/register" className="text-white">Register</a></li>
            </ul>
          </Col>
          <Col md={4}>
            <h5>Contact Us</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <FaMapMarkerAlt className="me-2" /> 123 Bus Terminal, Transport City
              </li>
              <li className="mb-2">
                <FaPhone className="me-2" /> +1 234 567 8900
              </li>
              <li className="mb-2">
                <FaEnvelope className="me-2" /> info@busbooking.com
              </li>
            </ul>
          </Col>
        </Row>
        <hr className="my-4 bg-light" />
        <Row>
          <Col className="text-center">
            <p className="mb-0">
              &copy; {new Date().getFullYear()} Bus Booking System. All rights reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;