import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { selectToken } from "../redux/modules/auth/authSlice";

export default function ProtectedRoute() {
  const token = useSelector(selectToken);
  return token ? <Outlet /> : <Navigate to="/login" replace />;
}
