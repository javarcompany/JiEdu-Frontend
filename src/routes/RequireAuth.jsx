import { Navigate, Outlet } from "react-router-dom";

const RequireAuth = () => {
  const token = localStorage.getItem("access");
  return token ? <Outlet /> : <Navigate to="/signin" replace />;
};

export default RequireAuth;
