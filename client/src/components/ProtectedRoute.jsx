import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// ProtectedRoute component to restrict access
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.user);

  if (!isAuthenticated) {
    // If not authenticated, redirect to the login page
    return <Navigate to="/login" />;
  }

  // Render the protected content if authenticated
  return children;
};

export default ProtectedRoute;
