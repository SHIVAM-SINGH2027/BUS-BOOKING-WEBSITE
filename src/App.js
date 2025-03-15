import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

// Layout Components
import Header from './components/Header';
import Footer from './components/Footer';

// Public Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import BusSearchPage from './pages/BusSearchPage';
import BusDetailsPage from './pages/BusDetailsPage';
import BookingPage from './pages/BookingPage';
import BookingConfirmationPage from './pages/BookingConfirmationPage';

// User Pages
import ProfilePage from './pages/ProfilePage';
import MyBookingsPage from './pages/MyBookingsPage';
import BookingDetailsPage from './pages/BookingDetailsPage';

// Admin Pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminBusesPage from './pages/admin/AdminBusesPage';
import AdminRoutesPage from './pages/admin/AdminRoutesPage';
import AdminBookingsPage from './pages/admin/AdminBookingsPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminBusFormPage from './pages/admin/AdminBusFormPage';
import AdminRouteFormPage from './pages/admin/AdminRouteFormPage';

function App() {
  return (
    <AuthProvider>
      <Header />
      <main className="main-container py-4">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/search" element={<BusSearchPage />} />
          <Route path="/bus/:id" element={<BusDetailsPage />} />
          
          {/* Protected Routes */}
          <Route path="/booking/:routeId" element={
            <PrivateRoute>
              <BookingPage />
            </PrivateRoute>
          } />
          <Route path="/booking-confirmation/:id" element={
            <PrivateRoute>
              <BookingConfirmationPage />
            </PrivateRoute>
          } />
          <Route path="/profile" element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          } />
          <Route path="/my-bookings" element={
            <PrivateRoute>
              <MyBookingsPage />
            </PrivateRoute>
          } />
          <Route path="/booking-details/:id" element={
            <PrivateRoute>
              <BookingDetailsPage />
            </PrivateRoute>
          } />
          
          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={
            <AdminRoute>
              <AdminDashboardPage />
            </AdminRoute>
          } />
          <Route path="/admin/buses" element={
            <AdminRoute>
              <AdminBusesPage />
            </AdminRoute>
          } />
          <Route path="/admin/routes" element={
            <AdminRoute>
              <AdminRoutesPage />
            </AdminRoute>
          } />
          <Route path="/admin/bookings" element={
            <AdminRoute>
              <AdminBookingsPage />
            </AdminRoute>
          } />
          <Route path="/admin/users" element={
            <AdminRoute>
              <AdminUsersPage />
            </AdminRoute>
          } />
          <Route path="/admin/bus/add" element={
            <AdminRoute>
              <AdminBusFormPage />
            </AdminRoute>
          } />
          <Route path="/admin/bus/edit/:id" element={
            <AdminRoute>
              <AdminBusFormPage />
            </AdminRoute>
          } />
          <Route path="/admin/route/add" element={
            <AdminRoute>
              <AdminRouteFormPage />
            </AdminRoute>
          } />
          <Route path="/admin/route/edit/:id" element={
            <AdminRoute>
              <AdminRouteFormPage />
            </AdminRoute>
          } />
        </Routes>
      </main>
      <Footer />
    </AuthProvider>
  );
}

export default App;