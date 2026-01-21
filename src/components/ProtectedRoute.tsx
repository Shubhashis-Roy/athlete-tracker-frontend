import React from "react";
import { Navigate, useLocation } from "react-router-dom";
// If useAuth is a default export:
import { useAuth } from "@/context/AuthContext";

const ProtectedRoute = ({ children, requireCoach = false }) => {
  const { isAuthenticated, isCoach, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireCoach && !isCoach) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
