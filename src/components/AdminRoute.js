import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Loader from './Loader';

const AdminRoute = ({ children }) => {
  const { userInfo, loading } = useContext(AuthContext);

  if (loading) {
    return <Loader />;
  }

  return userInfo && userInfo.isAdmin ? children : <Navigate to="/login" />;
};

export default AdminRoute;