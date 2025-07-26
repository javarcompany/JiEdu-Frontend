import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import StatusRibbon from "../../../../components/ui/badge/StatusRibbon";

// Define the TypeScript interface for the table rows
interface Applicant {
	id: string;
    regno: string;
	fname: string;
	mname: string;
	sname: string;
	nat_id: string;
	course: string;
	course_name: string;
    phone: string;
    email: string;
    gender: string;
    dob: string;
    religion: string;
    branch_name: string;
	year: string;
	year_name: string;
	intake: string;
	intake_name: string;
	category: string; 
	passport: string;
    sponsor: string;
    guardian_email: string;
    guardian_phone: string;
    guardian_fname: string;
    guardian_relationship: string;
    guardian_lname: string;
    sponsor_name: string;
	state: string;
}

export default function ApplicationMainBody() {
    const token = localStorage.getItem("access");
    const [application, setApplication] = useState<Applicant | null>(null);
	const [loading, setLoading] = useState<boolean>(true);

	const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
		const fetchApplication = async () => {
			try {
				const response = await axios.get(`/api/applications/${id}`,
					{
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
				);
                console.log(response)
				setApplication(response.data);
				setLoading(false);
			} catch (error) {
				console.error("Failed to fetch Application form", error);
				setLoading(false);
                navigate(-1);
			}
		};
		
		fetchApplication();
	},[]);

	if (loading) {
		return <div className="p-4 text-sm text-gray-500">Loading applications form...</div>;
	}

    console.log("Application State: ", application?.state)

    return (
        <>
            <div className="relative px-6 py-4 gap-1 md:gap-1 sm:gap-1 shadow-lg rounded-lg dark:border dark:border-gray-800 border border-brand-300 border-blur">
                {/* Ribbon */}
                <StatusRibbon state={application?.state as any} />

                <div className="flex items-center gap-4">
                    <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
                        <img src={application?.passport} alt="user" />
                    </div>

                    <div className="order-3 xl:order-2">
                        <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                            {application?.fname} {application?.mname} {application?.sname}    -    {application?.regno}
                        </h4>

                        <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                ID: {application?.nat_id}
                            </p>
                            <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Phone: {application?.phone}
                            </p>
                            <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Email: {application?.email}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-6 py-4 gap-1 md:gap-1 sm:gap-1 rounded-lg dark:border dark:border-gray-800 border border-brand-300 border-blur">
                <div className="flex items-center gap-4">
                    <div className="grid grid-cols-4 gap-4 lg:grid-cols-4 lg:gap-7 2xl:gap-x-32">
                        <div>
                            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                GENDER
                            </p>
                            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                {application?.gender}
                            </p>
                        </div>

                        <div>
                            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                DATE OF BIRTH
                            </p>
                            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                {application?.dob.split("T")[0]}
                            </p>
                        </div>

                        <div>
                            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                RELIGION
                            </p>
                            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                {application?.religion}
                            </p>
                        </div>

                        <div>
                            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                SPONSOR
                            </p>
                            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                {application?.sponsor_name}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="px-6 py-4 gap-1 md:gap-1 sm:gap-1 shadow-lg rounded-lg dark:border dark:border-gray-800 border border-brand-300 border-blur">
                <div className="flex items-center gap-2">
                    <div>
                        <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
                            {application?.guardian_relationship}
                        </h4>

                        <div className="grid grid-cols-2 gap-2 lg:grid-cols-4 lg:gap-2 2xl:gap-x-6">
                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    First Name
                                </p>
                                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                    {application?.guardian_fname}
                                </p>
                            </div>

                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    Last Name
                                </p>
                                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                    {application?.guardian_lname}
                                </p>
                            </div>

                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    Phone
                                </p>
                                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                    {application?.guardian_phone}
                                </p>
                            </div>

                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    Email address
                                </p>
                                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                    {application?.guardian_email}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="px-6 py-4 gap-1 md:gap-1 sm:gap-1 shadow-lg rounded-lg dark:border dark:border-gray-800 border border-brand-300 border-blur">
                <div className="flex items-center gap-2">
                    <div>
                        <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
                            Course: {application?.course_name}
                        </h4>
                        <div className="flex items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Branch: {application?.branch_name} Campus
                            </p>
                            <div className="h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Year: {application?.year_name}
                            </p>
                            <div className="h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Intake: {application?.intake_name}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
};