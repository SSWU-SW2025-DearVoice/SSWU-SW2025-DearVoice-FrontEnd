import { Navigate, Outlet } from "react-router-dom";
import { authStorage } from "../utils/authStorage";

const ProtectedRoute = () => {
  const hasToken = authStorage.getAccessToken() || authStorage.getRefreshToken();
  
  return hasToken ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;