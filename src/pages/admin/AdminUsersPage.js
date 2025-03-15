import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Badge } from 'react-bootstrap';
import { getAllUsers } from '../../api';
import AdminSidebar from '../../components/AdminSidebar';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { FaUsers } from 'react-icons/fa';
import moment from 'moment';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await getAllUsers();
      setUsers(data);
    } catch (error) {
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : 'Failed to fetch users'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid>
      <Row>
        <Col md={3} lg={2} className="d-none d-md-block">
          <AdminSidebar />
        </Col>
        <Col md={9} lg={10} className="admin-content">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>
              <FaUsers className="me-2" />
              Users
            </h2>
          </div>

          {loading ? (
            <Loader />
          ) : error ? (
            <Message variant="danger">{error}</Message>
          ) : (
            <div className="table-responsive">
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Joined On</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td>{user._id.substring(0, 8)}...</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.phone}</td>
                      <td>
                        {user.isAdmin ? (
                          <Badge bg="primary">Admin</Badge>
                        ) : (
                          <Badge bg="secondary">User</Badge>
                        )}
                      </td>
                      <td>{moment(user.createdAt).format('DD MMM YYYY')}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              
              {users.length === 0 && (
                <div className="text-center py-4">
                  <p>No users found</p>
                </div>
              )}
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default AdminUsersPage;