import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = ({ user, children }) => {
  const isAdmin = user?.role === 'ROLE_ADMIN' || user?.role === 'ADMIN';

  if (!user || !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children ? children : <Outlet />;
};

export default AdminRoute;