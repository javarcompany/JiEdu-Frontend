import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ( { allowedRoles, children }) => {
    const { roles } = useAuth();

    console.log("User roles: ", roles)

    const hasAccess = roles.some(role => allowedRoles.includes(role));

    return hasAccess ? children : <Navigate to="/unauthorized" />;
}

export default ProtectedRoute;