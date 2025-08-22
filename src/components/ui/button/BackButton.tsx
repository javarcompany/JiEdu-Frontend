// components/BackButton.tsx
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";

export default function BackButton() {
	const navigate = useNavigate();
	const location = useLocation();
	const [hovered, setHovered] = useState(false);

	if (location.pathname === "/") return null; // Hide on dashboard
	if (location.pathname === "/home") return null; // Hide on dashboard
	if (location.pathname === "/signin") return null; // Hide on signin
	if (location.pathname === "/register-student") return null; // Hide on register student

	return (
		<div
			className="fixed top-25 right-6 z-50 flex items-center gap-[-2] group"
			onClick={() => navigate(-1)}
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
