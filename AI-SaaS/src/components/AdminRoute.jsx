import { Navigate } from "react-router-dom";
import { getStoredToken, getStoredUser, isAdminUser } from "../utils/auth.js";

export default function AdminRoute({ children }) {
  const user = getStoredUser();
  const token = getStoredToken();

  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdminUser(user)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
