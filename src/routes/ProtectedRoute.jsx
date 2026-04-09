import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRole }) => {
  const { user } = useAuth();

  // 1. If no user is logged in, kick them to the login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 2. (Optional but recommended) If you pass a role requirement and they don't match, kick them out
  // Example: A normal user trying to access /admin/dashboard
  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to="/" replace />; // Kick them to the home page
  }

  // 3. If they pass the checks, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;