import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PublicRoute({ children }: any) {
  const { user } = useAuth();

  if (user) {
    if (user.role === "farmer") return <Navigate to="/farmer/dashboard" />;
    if (user.role === "owner") return <Navigate to="/owner/dashboard" />;
    if (user.role === "admin") return <Navigate to="/admin/dashboard" />;
    return <Navigate to="/admin/dashboard" />;
  }

  return children;
}