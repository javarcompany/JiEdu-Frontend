import { Navigate, Outlet } from "react-router-dom";

const PublicRoute: React.FC = () => {
    const token = localStorage.getItem("access");
    const role = localStorage.getItem("role")?.toLowerCase(); // normalize to lowercase

    if (token) {
        const roleRoutes: Record<string, string> = {
            admin: "/",
            students: "/home",
            lecturer: "/lecturer",
            "class-tutor": "/class-tutor",
            hod: "/hod",
            principle: "/principle",
            user: "/", // fallback for generic user
        };

        // if role not found → default to dashboard "/"
        const redirectPath = roleRoutes[role ?? ""] || "/";
        return <Navigate to={redirectPath} replace />;
    }

    return <Outlet />;
};

export default PublicRoute;
