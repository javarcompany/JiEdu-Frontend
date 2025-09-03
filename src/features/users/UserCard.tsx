import { Calendar, MapPin, Building2, Phone, Mail, MailOpen, BuildingIcon } from "lucide-react";
import { useUser } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";

type UserOption = {
    picture: string;
    regno: string;
    name: string;
    dob: string;
    department: string;
    branch: string;
    location: string;
    phone: string;
    email: string;
};

export default function UserCard() {
    const { user } = useUser();
    const [ currentUser, setCurrentUser ] = useState<UserOption | null>(null);
    const token = localStorage.getItem("access");
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
		const fetchUser = async () => {
			try {
				const res = await axios.get("/api/fetch-user/", {
					headers: { Authorization: `Bearer ${token}` },
					params: { user_regno: user?.regno, user_type: user?.user_type },
				});
				setCurrentUser(res.data);
			} catch (err) {
				console.error("Failed to fetch user", err);
			}
		};
			fetchUser();
	}, [user?.user_type, token]);

    return (
        <>
            {/* User Card */}
            <div className="mx-4 shadow-lg dark:border dark:border-brand-700 rounded-2xl p-6 text-center">
                {/* Profile Photo */}
                <div className="w-32 h-32 mx-auto rounded-lg overflow-hidden mb-6 mt-6">
                    <img
                        src={currentUser?.picture || "/default-avatar.png"}
                        alt={currentUser?.regno}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Name + Username */}
                <h2 className="mt-4 text-xl font-bold text-gray-800 dark:text-yellow-400">{currentUser?.name}</h2>
                <p className="text-gray-500">@{currentUser?.regno}</p>

                <hr className="my-4 mb-8 dark:bg-brand-700" />

                {/* Info Section */}
                <div className="space-y-6 text-left">
                    <div className="flex items-center gap-4">
                        <Calendar className="w-5 h-5 text-gray-600" />
                        <span>{currentUser?.dob || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Building2 className="w-5 h-5 text-gray-600" />
                        <span>{currentUser?.branch || "N/A"} Campus</span>
                    </div>
                    { user?.user_type === "student" && (
                        <div className="flex items-center gap-4">
                            <MapPin className="w-5 h-5 text-gray-600" />
                            <span>{currentUser?.location || "N/A"}</span>
                        </div>
                    )}
                    { user?.user_type === "staff" && (
                        <div className="flex items-center gap-4">
                            <BuildingIcon className="w-5 h-5 text-gray-600" />
                            <span>{currentUser?.department || "N/A"}</span>
                        </div>
                    )}
                </div>

                <hr className="my-4 mb-8 mt-8 dark:bg-brand-700" />

                {/* Contact Row */}
                <div className="flex justify-around mb-4">
                    {/* Phone Button */}
                    <motion.button
                        whileHover={{
                            rotate: [0, -15, 15, -15, 0], // ringing wiggle
                            transition: { duration: 0.6, repeat: Infinity, repeatDelay: 0.2 },
                        }}
                        onClick={() => {
                        if (currentUser?.phone) {
                            window.location.href = `tel:${currentUser.phone}`;
                        }
                        }}
                        className="flex flex-col items-center gap-2 p-3 rounded-md bg-brand-500 text-white hover:bg-red-600 dark:bg-gray-700 dark:hover:bg-gray-900 transition"
                    >
                        <Phone className="w-6 h-6" />
                        <span className="text-xs">Call</span>
                    </motion.button>

                    {/* Email Button */}
                    <motion.button
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        onClick={() => {
                        if (currentUser?.email) {
                            window.location.href = `mailto:${currentUser.email}`;
                        }
                        }}
                        className="flex flex-col items-center gap-2 p-3 rounded-md bg-brand-500 text-white hover:bg-red-600 dark:bg-gray-700 dark:hover:bg-gray-900 transition"
                    >
                        <AnimatePresence mode="wait" initial={false}>
                            {isHovered ? (
                                <>
                                    <MailOpen className="w-6 h-6" />
                                    <span className="text-xs">Send Emails</span>
                                </>
                            ) : (
                                <>
                                    <Mail className="w-6 h-6" />
                                    <span className="text-xs">Emails</span>
                                </>
                            )}
                        </AnimatePresence>
                    </motion.button>
                </div>

                <hr className="my-4 mb-8 mt-8 dark:bg-brand-700" />

            </div>
        </>
    );
}
