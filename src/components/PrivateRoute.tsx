// components/PrivateRoute.jsx
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children, session, allowedRoles }) {
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  const userRole = session.user?.app_metadata?.role;
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
