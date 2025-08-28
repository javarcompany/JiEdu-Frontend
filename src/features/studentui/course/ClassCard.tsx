import axios from "axios";
import { useEffect, useState } from "react";
import { useUser } from "../../../context/AuthContext";

type ClassDetails = {
    classname: string,
    module: string,
    level: string,
}

export default function ClassDetails() {
    const token = localStorage.getItem("access");
    const { user } = useUser();
    const [details, setDetails] = useState<ClassDetails | null>(null);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await axios.get(`/api/students-class-details/`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                        params: { student_regno: user?.regno },
                    },
                );
                setDetails(response.data);

            } catch (error) {
                console.error("Failed to fetch student:", error);
            }
        };

        fetchDetails();
    }, [user?.regno]);

    return (
        <div className="p-4 dark:bg-blue-600 rounded-xl shadow-md">
            {/* Small devices - stacked table */}
            <div className="p-2 text-sm">
                <div className="grid grid-cols-3 gap-2 text-center font-semibold border-b border-gray-200 dark:border-gray-700 pb-1">
                    <span>Class</span>
                    <span>Module</span>
                    <span>Level</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center pt-1">
                    <span className="text-gray-700 dark:text-gray-300">{details?.classname}</span>
                    <span className="text-gray-700 dark:text-gray-300">{details?.module}</span>
                    <span className="text-gray-700 dark:text-gray-300">{details?.level}</span>
                </div>
            </div>
        </div>
    );
}
