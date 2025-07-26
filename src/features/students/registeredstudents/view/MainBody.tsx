import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import { Student } from "../StudentTable";

export default function StudentMainBody() {
    const token = localStorage.getItem("access");
    const [student, setStudent] = useState<Student | null>(null);
	const [loading, setLoading] = useState<boolean>(true);

	const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
		const fetchStudent = async () => {
			try {
				const response = await axios.get(`/api/students/${id}`,
					{
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
				);
				setStudent(response.data);
				setLoading(false);
			} catch (error) {
				console.error("Failed to fetch student form", error);
				setLoading(false);
                navigate(-1);
			}
		};
		
		fetchStudent();
	},[]);

	if (loading) {
		return <div className="p-4 text-sm text-gray-500">Loading students form...</div>;
	}

    return (
        <>
            <div className="px-6 py-4 gap-1 md:gap-1 sm:gap-1 shadow-lg rounded-lg dark:border dark:border-gray-800 border border-brand-300 border-blur">
                <div className="flex items-center gap-4">
                    <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
                        <img src={student?.passport} alt="user" />
                    </div>

                    <div className="order-3 xl:order-2">
                        <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                            {student?.fname} {student?.mname} {student?.sname} - {student?.regno}
                        </h4>

                        <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                ID: {student?.nat_id}
                            </p>
                            <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Phone: {student?.phone}
                            </p>
                            <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Email: {student?.email}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4 py-2">
                    <div className="grid grid-cols-4 gap-4 lg:grid-cols-4 lg:gap-7 2xl:gap-x-32">
                        <div>
                            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                GENDER
                            </p>
                            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                {student?.gender}
                            </p>
                        </div>

                        <div>
                            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                DATE OF BIRTH
                            </p>
                            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                {student?.dob.split("T")[0]}
                            </p>
                        </div>

                        <div>
                            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                STATE
                            </p>
                            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                {student?.state}
                            </p>
                        </div>

                        <div>
                            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                COURSE
                            </p>
                            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                {student?.course_name} - {student?.branch_name} Branch
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
};