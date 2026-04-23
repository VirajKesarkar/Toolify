import { Navigate } from "react-router-dom";
import { getStoredToken, getStoredUser } from "../utils/auth.js";

export default function ProtectedRoute({ children }) {
  const user = getStoredUser();
  const token = getStoredToken();

  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
