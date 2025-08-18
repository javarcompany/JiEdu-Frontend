import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export interface Staff {
	id: number;
    regno: string;
    fname: string;
    mname: string;
    sname: string;
    gender: string;
    dob: string;
    nat_id: string;
    phone: string;
    email: string;
    branch: string;
    department: string;
    branch_name: string;
    department_name: string;
    designation: string;
    designation_name: string;
    used_hours: string;
    weekly_hours: string;
    passport: string;
	state: string;
}

export default function StaffMainBody() {
    const token = localStorage.getItem("access");
    const [staff, setStaff] = useState<Staff | null>(null);
	const [loading, setLoading] = useState<boolean>(true);

	const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
		const fetchStaff = async () => {
			try {
				const response = await axios.get(`/api/staffs/${id}`,
					{
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
				);
				setStaff(response.data);
				setLoading(false);
			} catch (error) {
				console.error("Failed to fetch Staff form", error);
				setLoading(false);
                navigate(-1);
			}
		};
		
		fetchStaff();
	},[]);

	if (loading) {
		return <div className="p-4 text-sm text-gray-500">Loading staffs form...</div>;
	}

    return (
        <>
            <div className="px-6 py-4 gap-1 md:gap-1 sm:gap-1 shadow-lg rounded-lg dark:border dark:border-gray-800 border border-brand-300 border-blur">
                <div className="flex items-center gap-4">
                    <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
                        <img src={staff?.passport} alt="user" />
                    </div>

                    <div className="order-3 xl:order-2">
                        <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                            {staff?.fname} {staff?.mname} {staff?.sname}
                        </h4>

                        <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                ID: {staff?.nat_id}
                            </p>
                            <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Phone: {staff?.phone}
                            </p>
                            <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Email: {staff?.email}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-6 py-4 gap-1 md:gap-1 sm:gap-1 rounded-lg dark:border dark:border-gray-800 border border-brand-300 border-blur">
                <div className="flex items-center gap-4">
                    <div className="grid grid-cols-5 justify-between gap-4 lg:grid-cols-5 lg:gap-7 2xl:gap-x-32">
                        <div>
                            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                GENDER
                            </p>
                            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                {staff?.gender}
                            </p>
                        </div>

                        <div>
                            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                DATE OF BIRTH
                            </p>
                            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                {staff?.dob.split("T")[0]}
                            </p>
                        </div>

                        <div>
                            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                STATE
                            </p>
                            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                {staff?.state}
                            </p>
                        </div>

                        <div>
                            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                WEEKLY HOURS
                            </p>
                            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                {staff?.used_hours} / {staff?.weekly_hours} Hours
                            </p>
                        </div>

                        <div>
                            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                BRANCH
                            </p>
                            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                {staff?.branch_name} Campus
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
};