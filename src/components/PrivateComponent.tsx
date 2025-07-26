// src/components/PrivateRoute.tsx
import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ children }: { children: JSX.Element }) {
    const token = localStorage.getItem("authToken");
    return token ? children : <Navigate to="/signin" />;
}