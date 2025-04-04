import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

export const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({
  children,
}) => {
  const isAdminAuthenticated =
    localStorage.getItem("isAdminAuthenticated") === "true";

  useEffect(() => {
    // Check if admin session is still valid
    if (!isAdminAuthenticated) {
      // Log to console for debugging
      console.log("Admin not authenticated, redirecting to admin login");
    }
  }, [isAdminAuthenticated]);

  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};
