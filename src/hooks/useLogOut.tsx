import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useUser } from "../context/AuthContext";

const useLogout = () => {
    const navigate = useNavigate();
    const { user, clearUser } = useUser();

    const logout = async () => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: user
                ? `${user.first_name || ""} ${user.last_name || ""}, you will be logged out of your session.`
                : "You will be logged out of your session.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#FF0000",
            cancelButtonColor: "#aaa",
            confirmButtonText: "Yes, Log Out",
            cancelButtonText: "Cancel",
        });

        if (result.isConfirmed) {
            // 🔑 Clear tokens and context
            localStorage.removeItem("authToken");
            localStorage.removeItem("access");
            localStorage.removeItem("refresh");
            clearUser();

            // ✅ Show success toast
            Swal.fire({
                icon: "success",
                title: "Logged out",
                toast: true,
                timer: 1500,
                showConfirmButton: false,
                position: "top-end",
                background: "#f0f0f0",
            });

            // ⏳ Wait for toast to finish before redirect
            // setTimeout(() => {
            //     navigate("/signin", { replace: true });
            // }, 100);
            navigate("/signin", { replace: true });
        }
    };

    return logout;
};

export default useLogout;
