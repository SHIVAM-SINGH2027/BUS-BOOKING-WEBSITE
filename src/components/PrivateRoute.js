import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Loader from './Loader';

const PrivateRoute = ({ children }) => {
  const { userInfo, loading } = useContext(AuthContext);

  if (loading) {
    return <Loader />;
  }

  return userInfo ? children : <Navigate to="/login" />;
};

export default PrivateRoute;