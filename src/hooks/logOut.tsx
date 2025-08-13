import { useNavigate } from "react-router-dom";

const handleLogout = (navigate) => {
    localStorage.removeItem("access");
    navigate("/signin", { replace: true }); // replace avoids going back
};
