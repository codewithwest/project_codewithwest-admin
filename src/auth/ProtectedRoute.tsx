import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from './store';

export const ProtectedRoute = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
