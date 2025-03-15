

import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { getRouteById, createRoute, updateRoute, getAllBuses } from "../../api";
import AdminSidebar from "../../components/AdminSidebar";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { toast } from "react-toastify";
import { FaRoute, FaSave, FaTimes } from "react-icons/fa";
import moment from "moment";

const AdminRouteFormPage = () => {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const [busId, setBusId] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");
  const [fare, setFare] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fetchLoading, setFetchLoading] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  useEffect(() => {
    fetchBuses();
    if (isEditMode) {
      fetchRouteDetails();
    }
  }, [id]);

  const fetchBuses = async () => {
    try {
      const { data } = await getAllBuses();
      setBuses(data);
    } catch (error) {
      toast.error("Failed to fetch buses");
    }
  };

  const fetchRouteDetails = async () => {
    try {
      setFetchLoading(true);
      const { data } = await getRouteById(id);
      setSource(data.source);
      setDestination(data.destination);
      setDistance(data.distance);
      setDuration(data.duration);
      setBusId(data.bus._id);
      setDepartureTime(moment(data.departureTime).format("YYYY-MM-DDTHH:mm"));
      setArrivalTime(moment(data.arrivalTime).format("YYYY-MM-DDTHH:mm"));
      setFare(data.fare);
      setIsActive(data.isActive);
    } catch (error) {
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : "Failed to fetch route details"
      );
    } finally {
      setFetchLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const routeData = {
        source,
        destination,
        distance: Number(distance),
        duration: Number(duration),
        busId,
        departureTime,
        arrivalTime,
        fare: Number(fare),
        isActive,
      };

      if (isEditMode) {
        await updateRoute(id, routeData);
        toast.success("Route updated successfully");
      } else {
        await createRoute(routeData);
        toast.success("Route created successfully");
      }

      navigate("/admin/routes");
    } catch (error) {
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : isEditMode
          ? "Failed to update route"
          : "Failed to create route"
      );
      toast.error(error.response?.data?.message || "An error occurred");
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
                <FaRoute className="me-2" />
                {isEditMode ? "Edit Route" : "Add New Route"}
              </h2>
            </Card.Header>
            <Card.Body>
              {error && <Message variant="danger">{error}</Message>}
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="source">
                      <Form.Label>Source</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter source city"
                        value={source}
                        onChange={(e) => setSource(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="destination">
                      <Form.Label>Destination</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter destination city"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="distance">
                      <Form.Label>Distance (km)</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Enter distance in kilometers"
                        value={distance}
                        onChange={(e) => setDistance(e.target.value)}
                        min="1"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="duration">
                      <Form.Label>Duration (minutes)</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Enter duration in minutes"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        min="1"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="busId">
                      <Form.Label>Bus</Form.Label>
                      <Form.Select
                        value={busId}
                        onChange={(e) => setBusId(e.target.value)}
                        required
                      >
                        <option value="">Select Bus</option>
                        {buses.map((bus) => (
                          <option key={bus._id} value={bus._id}>
                            {bus.busName} ({bus.busNumber}) - {bus.busType}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="fare">
                      <Form.Label>Fare (₹)</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Enter fare amount"
                        value={fare}
                        onChange={(e) => setFare(e.target.value)}
                        min="1"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="departureTime">
                      <Form.Label>Departure Time</Form.Label>
                      <Form.Control
                        type="datetime-local"
                        value={departureTime}
                        onChange={(e) => setDepartureTime(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="arrivalTime">
                      <Form.Label>Arrival Time</Form.Label>
                      <Form.Control
                        type="datetime-local"
                        value={arrivalTime}
                        onChange={(e) => setArrivalTime(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

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
                    onClick={() => navigate("/admin/routes")}
                  >
                    <FaTimes className="me-1" />
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" disabled={loading}>
                    <FaSave className="me-1" />
                    {loading ? "Saving..." : "Save Route"}
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

export default AdminRouteFormPage;






