// src/components/PrivateRoute.tsx
import { Navigate, Outlet } from "react-router-dom";

export default function PrivateRoute() {
    const token = localStorage.getItem("access");
    return token ? <Outlet /> : <Navigate to="/signin" replace />;
}