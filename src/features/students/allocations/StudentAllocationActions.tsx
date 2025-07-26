import { ClickableStatCard } from "../../../components/dashboard/StartCard";
import { BoxIcon } from "../../../icons";
import { SearchButton } from "../../../components/dashboard/SearchButton";
import { formatCount } from "../applications/StudentEnrollmentCount";
import { useEffect, useState } from "react";
import axios from "axios";

import { calculatePercentageChange } from "../dashboard/StudentActions";

export default function StudentAllocationActions({ onSearch }: { onSearch: (value: string) => void }) {
    
    const [pending_allocation, setPendingAllocation] = useState(0);
    const token = localStorage.getItem("access");
	const [enrollment, setEnrollment] = useState({ current: 0, previous: 0 });

    useEffect(() => {
        const fetchPendingAllocation = async () => {
            try {
                const response = await axios.get("/api/student_count/pending_allocation",
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setPendingAllocation(response.data.count);
            } catch (error) {
                console.error("Failed to fetch student count:", error);
            }
        };

        const fetchEnrollmentComparison = async () => {
			try {
				const response = await axios.get("/api/student-allocation-count-pending", {
					headers: { Authorization: `Bearer ${token}` },
				});
				setEnrollment({
					current: response.data.current,
					previous: response.data.previous,
				});
			} catch (error) {
				console.error("Failed to fetch enrollment data:", error);
			}
		};
        
        fetchPendingAllocation();
        fetchEnrollmentComparison();
    }, []);

    const enrollmentRate = calculatePercentageChange(enrollment.current, enrollment.previous);
    
    return (
        <div className="grid grid-cols-12 gap-4 md:col-span-12">
            <div className="col-span-12 md:col-span-12">
                <SearchButton onSearch={onSearch} />
            </div>

            <div className="col-span-12">
                <ClickableStatCard
                    title="Pending Student Allocation"
                    value={formatCount(pending_allocation)}
                    percentageChange={enrollmentRate}
                    contextText="vs last intake"
                    classvalue={
                        enrollmentRate.includes("+")
                            ? "bg-green-800 dark:text-white text-white"
                            : enrollmentRate.includes("-")
                            ? "bg-red-600 dark:text-white text-white"
                            : "bg-gray-700 dark:text-white text-white"
                    }
                    icon={<BoxIcon className="w-5 h-5" />}
                    href="/allocate"
                />
            </div>

        </div>
    )
}