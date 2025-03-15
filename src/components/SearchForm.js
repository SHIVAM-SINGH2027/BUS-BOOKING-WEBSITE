import React, { useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { FaSearch, FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';

const SearchForm = ({ onSearch }) => {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  
  // Get tomorrow's date in YYYY-MM-DD format for min date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];
  
  // Get date 3 months from now for max date
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (source && destination && date) {
      onSearch({ source, destination, date });
    }
  };

  return (
    <div className="search-form">
      <h3 className="mb-4">Find Your Bus</h3>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={3} className="mb-3">
            <Form.Group controlId="source">
              <Form.Label>
                <FaMapMarkerAlt className="me-2" />
                From
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter city"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
          <Col md={3} className="mb-3">
            <Form.Group controlId="destination">
              <Form.Label>
                <FaMapMarkerAlt className="me-2" />
                To
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter city"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
          <Col md={3} className="mb-3">
            <Form.Group controlId="date">
              <Form.Label>
                <FaCalendarAlt className="me-2" />
                Date of Journey
              </Form.Label>
              <Form.Control
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={tomorrowStr}
                max={maxDateStr}
                required
              />
            </Form.Group>
          </Col>
          <Col md={3} className="mb-3 d-flex align-items-end">
            <Button type="submit" variant="primary" className="w-100">
              <FaSearch className="me-2" />
              Search Buses
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default SearchForm;