import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const isAuthenticated=true;
  return (
    <div>
      {isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />}
    </div>
  )
}

export default ProtectedRoute
