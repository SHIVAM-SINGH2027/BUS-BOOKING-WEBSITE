import React from 'react';
import { Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { FaTachometerAlt, FaBus, FaRoute, FaTicketAlt, FaUsers } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';

const AdminSidebar = () => {
  const location = useLocation();
  const { pathname } = location;

  return (
    <div className="admin-sidebar">
      <Nav className="flex-column">
        <LinkContainer to="/admin/dashboard">
          <Nav.Link className={pathname === '/admin/dashboard' ? 'active' : ''}>
            <FaTachometerAlt className="me-2" /> Dashboard
          </Nav.Link>
        </LinkContainer>
        <LinkContainer to="/admin/buses">
          <Nav.Link className={pathname.includes('/admin/bus') ? 'active' : ''}>
            <FaBus className="me-2" /> Buses
          </Nav.Link>
        </LinkContainer>
        <LinkContainer to="/admin/routes">
          <Nav.Link className={pathname.includes('/admin/route') ? 'active' : ''}>
            <FaRoute className="me-2" /> Routes
          </Nav.Link>
        </LinkContainer>
        <LinkContainer to="/admin/bookings">
          <Nav.Link className={pathname === '/admin/bookings' ? 'active' : ''}>
            <FaTicketAlt className="me-2" /> Bookings
          </Nav.Link>
        </LinkContainer>
        <LinkContainer to="/admin/users">
          <Nav.Link className={pathname === '/admin/users' ? 'active' : ''}>
            <FaUsers className="me-2" /> Users
          </Nav.Link>
        </LinkContainer>
      </Nav>
    </div>
  );
};

export default AdminSidebar;