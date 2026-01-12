import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ user, allowedRoles, children }) => {
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Normalize roles for comparison
  const normalizedUserRole = user.role?.startsWith('ROLE_') ? user.role : `ROLE_${user.role}`;
  const normalizedAllowedRoles = allowedRoles?.map(r => r.startsWith('ROLE_') ? r : `ROLE_${r}`);

  // Check for role-based access if allowedRoles is defined
  if (normalizedAllowedRoles && !normalizedAllowedRoles.includes(normalizedUserRole)) {
    // Redirect based on their actual role
    if (normalizedUserRole === 'ROLE_ADMIN') return <Navigate to="/admin" replace />;
    if (normalizedUserRole === 'ROLE_PICKUP_PERSON') return <Navigate to="/pickup-person" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;