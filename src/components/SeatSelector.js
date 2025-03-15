import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Form } from 'react-bootstrap';
import { FaChair, FaUser, FaVenusMars } from 'react-icons/fa';

const SeatSelector = ({ totalSeats, bookedSeats = [], onSeatSelect }) => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [passengerDetails, setPassengerDetails] = useState({});

  // Generate seat numbers (A1, A2, ... B1, B2, etc.)
  const generateSeatNumbers = (total) => {
    const seats = [];
    const rows = Math.ceil(total / 4);
    const rowLabels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    
    for (let i = 0; i < rows; i++) {
      for (let j = 1; j <= 4; j++) {
        const seatNumber = `${rowLabels[i]}${j}`;
        if (seats.length < total) {
          seats.push(seatNumber);
        }
      }
    }
    
    return seats;
  };

  const allSeats = generateSeatNumbers(totalSeats);

  const handleSeatClick = (seatNumber) => {
    if (bookedSeats.includes(seatNumber)) {
      return; // Seat is already booked
    }

    setSelectedSeats((prevSelected) => {
      if (prevSelected.includes(seatNumber)) {
        // Remove seat and its passenger details
        const updatedDetails = { ...passengerDetails };
        delete updatedDetails[seatNumber];
        setPassengerDetails(updatedDetails);
        
        return prevSelected.filter((seat) => seat !== seatNumber);
      } else {
        // Add seat with default passenger details
        setPassengerDetails({
          ...passengerDetails,
          [seatNumber]: {
            name: '',
            age: '',
            gender: 'Male'
          }
        });
        
        return [...prevSelected, seatNumber];
      }
    });
  };

  const handlePassengerChange = (seatNumber, field, value) => {
    setPassengerDetails({
      ...passengerDetails,
      [seatNumber]: {
        ...passengerDetails[seatNumber],
        [field]: value
      }
    });
  };

  useEffect(() => {
    // Prepare seats data for parent component
    const seatsData = selectedSeats.map(seatNumber => ({
      seatNumber,
      isBooked: true,
      passenger: passengerDetails[seatNumber]
    }));
    
    onSeatSelect(seatsData);
  }, [selectedSeats, passengerDetails, onSeatSelect]);

  return (
    <div>
      <h4 className="mb-3">Select Seats</h4>
      
      <div className="mb-4">
        <div className="d-flex mb-3">
          <div className="me-4 d-flex align-items-center">
            <div className="seat available me-2" style={{ width: '20px', height: '20px' }}></div>
            <span>Available</span>
          </div>
          <div className="me-4 d-flex align-items-center">
            <div className="seat selected me-2" style={{ width: '20px', height: '20px' }}></div>
            <span>Selected</span>
          </div>
          <div className="d-flex align-items-center">
            <div className="seat booked me-2" style={{ width: '20px', height: '20px' }}></div>
            <span>Booked</span>
          </div>
        </div>
        
        <div className="seat-grid">
          {allSeats.map((seatNumber) => (
            <div
              key={seatNumber}
              className={`seat ${
                bookedSeats.includes(seatNumber)
                  ? 'booked'
                  : selectedSeats.includes(seatNumber)
                  ? 'selected'
                  : 'available'
              }`}
              onClick={() => handleSeatClick(seatNumber)}
            >
              <FaChair className="me-1" />
              {seatNumber}
            </div>
          ))}
        </div>
      </div>

      {selectedSeats.length > 0 && (
        <div>
          <h4 className="mb-3">Passenger Details</h4>
          {selectedSeats.map((seatNumber) => (
            <div key={seatNumber} className="mb-4 p-3 border rounded">
              <h5 className="mb-3">Seat {seatNumber}</h5>
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <FaUser className="me-1" /> Passenger Name
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter name"
                      value={passengerDetails[seatNumber]?.name || ''}
                      onChange={(e) => handlePassengerChange(seatNumber, 'name', e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Age</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Enter age"
                      min="1"
                      max="120"
                      value={passengerDetails[seatNumber]?.age || ''}
                      onChange={(e) => handlePassengerChange(seatNumber, 'age', e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <FaVenusMars className="me-1" /> Gender
                    </Form.Label>
                    <Form.Select
                      value={passengerDetails[seatNumber]?.gender || 'Male'}
                      onChange={(e) => handlePassengerChange(seatNumber, 'gender', e.target.value)}
                      required
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <Button 
                variant="outline-danger" 
                size="sm"
                onClick={() => handleSeatClick(seatNumber)}
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SeatSelector;