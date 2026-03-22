import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }: any) {
  const { user, loading } = useAuth();

  // 🟡 wait for auth to load
  if (loading) {
    return <div>Loading...</div>;
  }

  // 🔴 not logged in
  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
}