import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? (
    <>{children}
    </> // Render the protected component
  ) : (
    <Navigate to="/login" replace /> // Redirect to login if not authenticated
  );
};

export default ProtectedRoute;
