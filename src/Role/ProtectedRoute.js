import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const token = localStorage.getItem("jwtToken");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Allow all roles for /admin (Admin, Manager, Donor)
  if (allowedRoles.length === 0) {
    return children;
  }

  const storedRole = localStorage.getItem("role") || "donor";

  const hasPermission = allowedRoles.some(role => 
    String(role).toLowerCase().includes(storedRole) ||
    (storedRole === "donor" && (String(role) === "1" || String(role).includes("user")))
  );

  if (!hasPermission) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;