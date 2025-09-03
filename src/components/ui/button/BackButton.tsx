// components/BackButton.tsx
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useUser } from "../../../context/AuthContext";

export default function BackButton() {
	const navigate = useNavigate();
	const location = useLocation();
	const { user } = useUser();
	const [hovered, setHovered] = useState(false);

	if (location.pathname === "/") return null; // Hide on dashboard
	if (location.pathname === "/dashboard") return null; // Hide on dashboard
	if (location.pathname === "/home") return null; // Hide on dashboard
	if (location.pathname === "/signin") return null; // Hide on signin
	if (location.pathname === "/register-student") return null; // Hide on register student

	function handleGoBack() {
		if (window.history.length > 2) {
			navigate(-1); // Go back
		} else {
			if (user?.user_type === 'staff') {
				navigate('/dashboard'); // Go to staff dashboard
				return;
			}else if (user?.user_type === 'student') {
				navigate('/home'); // Go to student homepage
				return;
			}else {
				navigate('/'); // Go home if no history
			}
		}
	}

	return (
		<div
			className="fixed top-25 right-6 z-50 flex items-center gap-[-2] group"
			onClick={handleGoBack}
			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => setHovered(false)}
			role="button"
			aria-label="Go Back"
		>
			<div
				className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-xl transition duration-300 cursor-pointer"
				title="Go Back"
			>
				<ArrowLeft size={20} />
			</div>
			{/* Optional label */}
			{hovered && (
				<span className="bg-blue-600 text-white px-3 py-1 rounded shadow-lg text-sm transition-opacity duration-300">
					Back
				</span>
			)}
		</div>
	);
}
