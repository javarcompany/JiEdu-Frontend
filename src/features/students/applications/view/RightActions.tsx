import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

// Define the TypeScript interface for the table rows
interface Applicant {
    id: string;
    prev_schoolname: string;
    examtype: string;
    examyear: string;
    examgrade: string;
    previousexams: string;
    category: string;
    state: string;
}

export default function ApplicationRightActions() {

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

    return (
        <div className="px-6 py-4 gap-1 md:gap-1 sm:gap-1 shadow-lg rounded-lg dark:border dark:border-gray-800 border border-brand-300 border-blur">
            <div className="flex items-center gap-4">
                <div className="order-3 xl:order-2">
                    <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                        Previous Exams
                    </h4>

                    <div className="">
                        <div>
                            <p className="mb-1 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                SCHOOL
                            </p>
                            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                {application?.prev_schoolname}
                            </p>
                        </div>
                    </div>

                    <div className="grid py-4 grid-cols-3 gap-4 lg:grid-cols-3 lg:gap-7 2xl:gap-x-32">
                        <div>
                            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                TYPE
                            </p>
                            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                {application?.examtype}
                            </p>
                        </div>

                        <div>
                            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                YEAR
                            </p>
                            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                {application?.examyear}
                            </p>
                        </div>

                        <div>
                            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                GRADE
                            </p>
                            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                {application?.examgrade}
                            </p>
                        </div>
                    </div>

                    <div className="rounded-lg overflow-hidden">
                        <img src={application?.previousexams} alt="user" />
                    </div>
                </div>
            </div>
        </div>
    )
};