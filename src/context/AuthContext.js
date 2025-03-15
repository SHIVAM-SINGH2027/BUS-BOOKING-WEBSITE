import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        
        if (decoded.exp < currentTime) {
          // Token expired
          localStorage.removeItem('userToken');
          localStorage.removeItem('userInfo');
          setUserInfo(null);
        } else {
          // Valid token
          const userInfoFromStorage = JSON.parse(localStorage.getItem('userInfo'));
          setUserInfo(userInfoFromStorage);
          
          // Set auth header for all requests
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('Invalid token', error);
        localStorage.removeItem('userToken');
        localStorage.removeItem('userInfo');
      }
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('userInfo', JSON.stringify(userData));
    localStorage.setItem('userToken', token);
    setUserInfo(userData);
    
    // Set auth header for all requests
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };

  const logout = () => {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('userToken');
    setUserInfo(null);
    
    // Remove auth header
    delete axios.defaults.headers.common['Authorization'];
  };

  const updateUserProfile = (updatedUserData) => {
    const updatedInfo = { ...userInfo, ...updatedUserData };
    localStorage.setItem('userInfo', JSON.stringify(updatedInfo));
    setUserInfo(updatedInfo);
  };

  return (
    <AuthContext.Provider value={{ userInfo, loading, login, logout, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};