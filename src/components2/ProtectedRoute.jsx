import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/authContext";

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
    </div>;
  }

  const isAuthenticated = !!user;

  return (
    <div>
      {isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />}
    </div>
  );
}

export default ProtectedRoute
