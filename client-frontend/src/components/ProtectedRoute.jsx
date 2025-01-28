// ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import useStore from '../store/store'; 

const ProtectedRoute = ({ element }) => {
  const token = useStore((state) => state.token);
  const isAuthenticated = !!token;

  return isAuthenticated ? element : <Navigate to="/" />;
};

export default ProtectedRoute;
