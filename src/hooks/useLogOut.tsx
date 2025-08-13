import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const useLogout = () => {
    const navigate = useNavigate();

    const logout = async () => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You will be logged out of your session.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#aaa",
            confirmButtonText: "Yes, Log Out",
            cancelButtonText: "Cancel",
        });

        if (result.isConfirmed) {
            // 🔑 Clear tokens
            localStorage.removeItem("authToken");
            localStorage.removeItem("access");
            localStorage.removeItem("refresh");

            // ✅ Show success toast before redirect
            Swal.fire({
                icon: "success",
                title: "Logged out",
                toast: true,
                timer: 1500,
                showConfirmButton: false,
                position: "top-end",
                background: "#f0f0f0",
            });

            // Delay redirect slightly so user sees toast
            setTimeout(() => {
                navigate("/signin", { replace: true });
                localStorage.clear();
            }, 100);
        }
    };

    return logout;
};

export default useLogout;
