import React, { useContext } from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { AuthContext } from '../context/AuthContext';
import { FaBus, FaUser, FaSignInAlt, FaUserPlus, FaTicketAlt, FaSignOutAlt, FaTachometerAlt } from 'react-icons/fa';

const Header = () => {
  const { userInfo, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
  };

  return (
    <header>
      <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>
              <FaBus className="me-2" /> Bus Booking System
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <LinkContainer to="/search">
                <Nav.Link>
                  <FaBus className="me-1" /> Find Buses
                </Nav.Link>
              </LinkContainer>

              {userInfo ? (
                <>
                  <LinkContainer to="/my-bookings">
                    <Nav.Link>
                      <FaTicketAlt className="me-1" /> My Bookings
                    </Nav.Link>
                  </LinkContainer>
                  <NavDropdown title={<><FaUser className="me-1" /> {userInfo.name}</>} id="username">
                    <LinkContainer to="/profile">
                      <NavDropdown.Item>Profile</NavDropdown.Item>
                    </LinkContainer>
                    {userInfo.isAdmin && (
                      <LinkContainer to="/admin/dashboard">
                        <NavDropdown.Item>
                          <FaTachometerAlt className="me-1" /> Admin Dashboard
                        </NavDropdown.Item>
                      </LinkContainer>
                    )}
                    <NavDropdown.Item onClick={handleLogout}>
                      <FaSignOutAlt className="me-1" /> Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                </>
              ) : (
                <>
                  <LinkContainer to="/login">
                    <Nav.Link>
                      <FaSignInAlt className="me-1" /> Login
                    </Nav.Link>
                  </LinkContainer>
                  <LinkContainer to="/register">
                    <Nav.Link>
                      <FaUserPlus className="me-1" /> Register
                    </Nav.Link>
                  </LinkContainer>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;