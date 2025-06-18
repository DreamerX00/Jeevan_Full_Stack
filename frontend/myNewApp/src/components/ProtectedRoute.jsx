import React from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../services/authService';

const ProtectedRoute = ({ children }) => {
  // Use authService to check if user is authenticated
  const isAuthenticated = authService.isLoggedIn();

  if (!isAuthenticated) {
    // Clear any remaining auth data
    authService.logout();
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  // Render children if authenticated
  return children;
};

export default ProtectedRoute; 